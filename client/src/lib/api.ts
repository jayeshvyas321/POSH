// Logs API
export const logsApi = {
  downloadLogs: async (): Promise<Blob> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('No auth token found. Please login again.');
    const response = await fetch("/logs/download", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to download logs");
    return response.blob();
  },
};
import { apiRequest } from "@/lib/queryClient";
import type { AuthUser, DashboardStats } from "@/types";
import type { LoginData, InsertUser } from "@shared/schema";

// Authentication API
export const authApi = {
  login: async (data: LoginData): Promise<{ user: AuthUser }> => {
    const response = await apiRequest("POST", "/api/auth/login", data);
    return response.json();
  },

  signup: async (data: InsertUser): Promise<{ user: AuthUser }> => {
    const response = await apiRequest("POST", "/api/auth/signup", data);
    return response.json();
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Failed to reset password");
    }
    return response.json();
  },
};

// User API
export const userApi = {
  getUsers: async (): Promise<AuthUser[]> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('No auth token found. Please login again.');
    const apiUrl = window.location.origin + "/api/users";
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      credentials: "include"
    });
    if (!response.ok) {
      const text = (await response.text()) || response.statusText;
      throw new Error(`${response.status}: ${text}`);
    }
    const data = await response.json();
    console.log("[DEBUG] /api/users response:", data);
    return data;
  },

  getUser: async (id: number): Promise<AuthUser> => {
    const response = await apiRequest("GET", `/api/users/${id}`);
    return response.json();
  },

  createUser: async (data: InsertUser): Promise<AuthUser> => {
    // Use the register endpoint for both admin add user and self-signup
    const response = await apiRequest("POST", "/api/auth/register", data);
    return response.json();
  },

  updateUser: async (id: number, data: Partial<InsertUser>): Promise<AuthUser> => {
    const response = await apiRequest("PUT", `/api/users/${id}`, data);
    return response.json();
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/users/${id}`);
  },
};

// Roles & Permissions API (for user management modal)
export const rolesApi = {
  fetchRoles: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch("/api/auth/getAllRoles", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error("Failed to fetch roles");
    return response.json();
  },
  addRoles: async (userName: string, roles: { name: string }[]) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch("/api/auth/addRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ action: "ADD", userName, roles })
    });
    if (!response.ok) throw new Error("Failed to add role");
    return response.json();
  },
};

export const permissionsApi = {
  fetchPermissions: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch("/api/auth/getAllPermissions", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error("Failed to fetch permissions");
    return response.json();
  },
  addPermissions: async (userName: string, permissions: { name: string }[]) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch("/api/auth/addPermission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ action: "ADD", userName, permissions })
    });
    if (!response.ok) throw new Error("Failed to add permission");
    return response.json();
  },
};

// Notification API
export const notificationApi = {
  getUserNotifications: async (userId: number) => {
    const response = await apiRequest("GET", `/api/users/${userId}/notifications`);
    return response.json();
  },

  createNotification: async (data: any) => {
    const response = await apiRequest("POST", "/api/notifications", data);
    return response.json();
  },

  markAsRead: async (id: number) => {
    const response = await apiRequest("PUT", `/api/notifications/${id}/read`);
    return response.json();
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest("GET", "/api/dashboard/stats");
    return response.json();
  },
};

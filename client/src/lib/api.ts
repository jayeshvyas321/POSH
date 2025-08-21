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

// Roles API
export const rolesApi = {
  getRoles: async () => {
    const response = await apiRequest("GET", "/api/roles");
    return response.json();
  },

  createRole: async (data: any) => {
    const response = await apiRequest("POST", "/api/roles", data);
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

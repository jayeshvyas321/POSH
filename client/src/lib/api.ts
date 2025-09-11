import { apiRequest } from "@/lib/queryClient";
import { buildApiUrl, API_CONFIG } from "@/lib/apiConfig";
import type { AuthUser, DashboardStats } from "@/types";
import type { LoginData, InsertUser } from "@shared/schema";

// Logs API
export const logsApi = {
  downloadLogs: async (): Promise<Blob> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('No auth token found. Please login again.');
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGS.DOWNLOAD), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to download logs");
    return response.blob();
  },
};

// Authentication API
export const authApi = {
  login: async (data: LoginData): Promise<{ user: AuthUser }> => {
    const response = await apiRequest("POST", buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), data);
    return response.json();
  },

  signup: async (data: InsertUser): Promise<{ user: AuthUser }> => {
    const response = await apiRequest("POST", buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), data);
    return response.json();
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD), {
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
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USERS.LIST), {
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
    const response = await apiRequest("GET", buildApiUrl(API_CONFIG.ENDPOINTS.USERS.GET(id)));
    return response.json();
  },

  createUser: async (data: InsertUser): Promise<AuthUser> => {
    const baseUrl = API_CONFIG.BASE_URL;
    const isJavaBackend = baseUrl.includes('8081'); // Check if calling Java backend
    
    let transformedData;
    if (isJavaBackend) {
      // Transform field names to match Java backend
      transformedData = {
        userName: data.username, // Convert username to userName for Java backend
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        emailVerified: false, // Default value for Java backend
      };
    } else {
      // Use original format for Node.js backend
      transformedData = data;
    }
    
    // Use the register endpoint for both admin add user and self-signup
    const response = await apiRequest("POST", buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), transformedData);
    return response.json();
  },

  updateUser: async (id: number, data: Partial<InsertUser>): Promise<AuthUser> => {
    const response = await apiRequest("PUT", buildApiUrl(API_CONFIG.ENDPOINTS.USERS.UPDATE(id)), data);
    return response.json();
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiRequest("DELETE", buildApiUrl(API_CONFIG.ENDPOINTS.USERS.DELETE(id)));
  },
};

// Roles & Permissions API (for user management modal)
export const rolesApi = {
  fetchRoles: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.GET_ALL_ROLES), {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error("Failed to fetch roles");
    return response.json();
  },
  addRoles: async (userName: string, roles: { name: string }[]) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.ADD_ROLE), {
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
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.GET_ALL_PERMISSIONS), {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error("Failed to fetch permissions");
    return response.json();
  },
  addPermissions: async (userName: string, permissions: { name: string }[]) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.ADD_PERMISSION), {
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
    const response = await apiRequest("GET", buildApiUrl(API_CONFIG.ENDPOINTS.USERS.NOTIFICATIONS(userId)));
    return response.json();
  },

  createNotification: async (data: any) => {
    const response = await apiRequest("POST", buildApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.CREATE), data);
    return response.json();
  },

  markAsRead: async (id: number) => {
    const response = await apiRequest("PUT", buildApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(id)));
    return response.json();
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest("GET", buildApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD.STATS));
    return response.json();
  },
};

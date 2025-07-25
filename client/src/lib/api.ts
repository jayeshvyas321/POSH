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
    const response = await apiRequest("GET", "/api/users");
    return response.json();
  },

  getUser: async (id: number): Promise<AuthUser> => {
    const response = await apiRequest("GET", `/api/users/${id}`);
    return response.json();
  },

  createUser: async (data: InsertUser): Promise<AuthUser> => {
    const response = await apiRequest("POST", "/api/users", data);
    return response.json();
  },

  updateUser: async (id: number, data: Partial<InsertUser>): Promise<AuthUser> => {
    const response = await apiRequest("PUT", `/api/users/${id}`, data);
    return response.json();
  },
};

// Training API
export const trainingApi = {
  getTrainings: async () => {
    const response = await apiRequest("GET", "/api/trainings");
    return response.json();
  },

  getUserTrainings: async (userId: number) => {
    const response = await apiRequest("GET", `/api/users/${userId}/trainings`);
    return response.json();
  },

  createTraining: async (data: any) => {
    const response = await apiRequest("POST", "/api/trainings", data);
    return response.json();
  },

  assignTraining: async (data: any) => {
    const response = await apiRequest("POST", "/api/user-trainings", data);
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

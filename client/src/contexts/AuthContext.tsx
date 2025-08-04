import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthUser } from "@/types";
import { mockUser } from "@/lib/mockData";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Utility function to decode JWT token (simple base64 decode for payload)
  const decodeJWT = (token: string) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("auth_user");
    const savedToken = localStorage.getItem("auth_token");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (savedToken) {
      // Try to decode token and extract user info
      const decodedToken = decodeJWT(savedToken);
      if (decodedToken) {
        setUser({
          id: decodedToken.user_id,
          username: decodedToken.username || '',
          email: decodedToken.email || '',
          role: decodedToken.role,
          permissions: decodedToken.permissions || [],
          firstName: decodedToken.firstName || '',
          lastName: decodedToken.lastName || '',
          isActive: true,
          createdAt: new Date()
        });
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Handle JWT token response
      if (data.token) {
        const decodedToken = decodeJWT(data.token);
        if (decodedToken) {
          const userWithAuthType = {
            id: decodedToken.user_id,
            username: decodedToken.username || data.user?.username || '',
            email: decodedToken.email || data.user?.email || '',
            role: decodedToken.role,
            permissions: decodedToken.permissions || [],
            firstName: decodedToken.firstName || data.user?.firstName || '',
            lastName: decodedToken.lastName || data.user?.lastName || '',
            isActive: true,
            createdAt: new Date(data.user?.createdAt || Date.now())
          };
          setUser(userWithAuthType);
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem("auth_user", JSON.stringify(userWithAuthType));
        }
      } else {
        // Fallback for existing API format
        const userWithAuthType = {
          ...data.user,
          permissions: data.user.permissions || [],
          createdAt: new Date(data.user.createdAt),
          updatedAt: data.user.updatedAt ? new Date(data.user.updatedAt) : undefined,
        };
        setUser(userWithAuthType);
        localStorage.setItem("auth_user", JSON.stringify(userWithAuthType));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      
      // Handle JWT token response
      if (data.token) {
        const decodedToken = decodeJWT(data.token);
        if (decodedToken) {
          const userWithAuthType = {
            id: decodedToken.user_id,
            username: decodedToken.username || data.user?.username || '',
            email: decodedToken.email || data.user?.email || '',
            role: decodedToken.role,
            permissions: decodedToken.permissions || [],
            firstName: decodedToken.firstName || data.user?.firstName || '',
            lastName: decodedToken.lastName || data.user?.lastName || '',
            isActive: true,
            createdAt: new Date(data.user?.createdAt || Date.now())
          };
          setUser(userWithAuthType);
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem("auth_user", JSON.stringify(userWithAuthType));
        }
      } else {
        // Fallback for existing API format
        const userWithAuthType = {
          ...data.user,
          permissions: data.user.permissions || [],
          createdAt: new Date(data.user.createdAt),
          updatedAt: data.user.updatedAt ? new Date(data.user.updatedAt) : undefined,
        };
        setUser(userWithAuthType);
        localStorage.setItem("auth_user", JSON.stringify(userWithAuthType));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    // Redirect to login page after logout
    window.location.href = "/login";
  };

  // Utility functions for permission checking
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin' || user?.username === 'zucitech';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, hasPermission, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

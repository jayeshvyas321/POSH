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
  hasRole: (roleName: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          roles: decodedToken.roles || [{ id: 0, name: decodedToken.role || 'ROLE_EMPLOYEE' }],
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

  const login = async (userNameOrEmail: string, password: string) => {
    setIsLoading(true);
    try {
      // Get API base URL from environment
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://98.130.134.68:8081';
      const url = `${baseUrl}/api/auth/login`;
      console.log('Calling URL:', url);
      
      // Send data in format Java backend expects
      const loginData = {
        userNameOrEmail: userNameOrEmail, // Java backend expects this field name
        password: password
      };
      
      console.log('Login data for Java backend:', loginData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('Login response status:', response.status);
      console.log('Login response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.log('Login error response:', error);
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login success response:', data);

      if (data.accessToken) {
        // Normalize permissions: if array of objects, map to array of names
        let permissions: string[] = [];
        if (Array.isArray(data.permissions) && data.permissions.length > 0) {
          if (typeof data.permissions[0] === "object" && data.permissions[0].name) {
            permissions = data.permissions.map((p: any) => p.name);
          } else {
            permissions = data.permissions;
          }
        }
        const userWithAuthType = {
          id: data.id,
          username: data.userName || data.username, // Handle both userName (Java) and username (frontend)
          email: data.email,
          roles: data.roles || [{ id: 0, name: 'ROLE_EMPLOYEE' }],
          permissions,
          firstName: data.firstName,
          lastName: data.lastName,
          isActive: data.active !== undefined ? data.active : data.isActive || true,
          createdAt: new Date()
        };
        setUser(userWithAuthType);
        localStorage.setItem("auth_token", data.accessToken);
        localStorage.setItem("auth_user", JSON.stringify(userWithAuthType));
      } else {
        throw new Error('Invalid response format');
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
      console.log('Signup data being sent:', userData);
      
      // Always transform field names to match Java backend entity:
      // Frontend: username -> Backend: userName
      // Frontend: isActive -> Backend: emailVerified (default false)
      const transformedData = {
        userName: userData.username, // Convert username to userName for Java backend
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailVerified: false, // Default value for Java backend
      };
      
      console.log('Transformed data for Java backend:', transformedData);
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://98.130.134.68:8081';
      const url = `${baseUrl}/api/auth/register`;
      console.log('Calling URL:', url);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'accept': '*/*',
        },
        body: JSON.stringify(transformedData),
      });

      console.log('Signup response status:', response.status);
      console.log('Signup response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.log('Signup error response:', error);
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      console.log('Signup success response:', data);
      
      // Handle JWT token response
      if (data.statusCode === 201) {
        console.log('Signup completed successfully:', data.statusMsg);
        window.location.href = "/dashboard";
        return;
      } else {
        // Fallback for existing API format
        // Normalize permissions for signup as well
        let permissions: string[] = [];
        if (data.user && Array.isArray(data.user.permissions) && data.user.permissions.length > 0) {
          if (typeof data.user.permissions[0] === "object" && data.user.permissions[0].name) {
            permissions = data.user.permissions.map((p: any) => p.name);
          } else {
            permissions = data.user.permissions;
          }
        }
        const userWithAuthType = {
          ...data.user,
          permissions,
          createdAt: new Date(data.user.createdAt),
          updatedAt: data.user.updatedAt ? new Date(data.user.updatedAt) : undefined,
        };
        setUser(userWithAuthType);
        localStorage.setItem("auth_user", JSON.stringify(userWithAuthType));
        window.location.href = "/dashboard";
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

  // Utility functions for permission and role checking
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const hasRole = (roleName: string): boolean => {
    return user?.roles?.some((role: any) => role.name === roleName) ?? false;
  };

  const isAdmin = (): boolean => {
    return hasRole('ROLE_ADMIN') || user?.username === 'zucitech';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, hasPermission, isAdmin, hasRole }}>
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

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthUser } from "@/types";
import { mockUser } from "@/lib/mockData";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Backend expects: { userNameOrEmail, password }
      body: JSON.stringify({
        userNameOrEmail: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const userWithAuthType = {
      ...data.user,
      createdAt: new Date(data.user.createdAt),
      updatedAt: data.user.updatedAt ? new Date(data.user.updatedAt) : undefined,
    };

    setUser(userWithAuthType);
    localStorage.setItem("auth_user", JSON.stringify(userWithAuthType));
  } catch (error: any) {
    console.error("Login error:", error.message);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', { //for signup API
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
      const userWithAuthType = {
        ...data.user,
        createdAt: new Date(data.user.createdAt),
        updatedAt: data.user.updatedAt ? new Date(data.user.updatedAt) : undefined,
      };
      
      setUser(userWithAuthType);
      localStorage.setItem("auth_user", JSON.stringify(userWithAuthType));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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

import { useState } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render login form if user is authenticated (redirect will happen)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

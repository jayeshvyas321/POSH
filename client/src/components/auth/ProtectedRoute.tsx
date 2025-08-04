import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  adminOnly?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  permission, 
  adminOnly = false,
  fallbackPath = "/dashboard" 
}: ProtectedRouteProps) {
  const { user, hasPermission, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      // Check admin access
      if (adminOnly && !isAdmin()) {
        setLocation(fallbackPath);
        return;
      }

      // Check permission access
      if (permission && !hasPermission(permission)) {
        setLocation(fallbackPath);
        return;
      }
    }
  }, [user, isLoading, permission, adminOnly, hasPermission, isAdmin, setLocation, fallbackPath]);

  // Show loading while checking permissions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if user doesn't have required permissions
  if (adminOnly && !isAdmin()) {
    return null;
  }

  if (permission && !hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
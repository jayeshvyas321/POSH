import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import UserManagement from "@/pages/UserManagement";
import RolesManagement from "@/pages/RolesManagement";

import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => 
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" component={() => 
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/users" component={() => 
        <ProtectedRoute permission="user_view">
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/roles" component={() => 
        <ProtectedRoute adminOnly={true}>
          <RolesManagement />
        </ProtectedRoute>
      } />

      <Route path="/reports" component={() => 
        <ProtectedRoute permission="reports_view">
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/settings" component={() => 
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <Toaster />
            <Router />
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

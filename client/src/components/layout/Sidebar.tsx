import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Shield,
} from "lucide-react";
import type { NavItem } from "@/types";

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
  },
  {
    id: "users",
    label: "User Management",
    icon: "Users",
    path: "/users",
    permission: "user_view",
  },
  {
    id: "roles",
    label: "Roles Management",
    icon: "Shield",
    path: "/roles",
    roles: ["ROLE_ADMIN"], // Admin only
  },
  {
    id: "reports",
    label: "Reports",
    icon: "BarChart3",
    path: "/reports",
    permission: "reports_view",
  },

];

const iconMap = {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Shield,
} as const;

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, logout, hasPermission, isAdmin, hasRole } = useAuth();
  const [location] = useLocation();

  const filteredNavItems = navigationItems.filter(item => {
    // If admin, show all items except those with explicit role restrictions not matching admin
    if (isAdmin()) {
      if (item.roles && !item.roles.some(role => hasRole(role))) {
        return false;
      }
      return true;
    }
    // If manager, allow all except admin-only tabs
    if (hasRole('ROLE_MANAGER')) {
      if (item.roles && !item.roles.some(role => hasRole(role))) {
        return false;
      }
      // Hide admin-only tabs
      if (item.roles && item.roles.includes('ROLE_ADMIN')) {
        return false;
      }
      return true;
    }
    // For other users, check role and permission as usual
    if (item.roles && (!user || !item.roles.some(role => hasRole(role)))) {
      return false;
    }
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Zucitech</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-slate-600">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-slate-500 capitalize">
                  {user.roles?.map(r => r.name.replace('ROLE_', '').toLowerCase()).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = location === item.path;

              return (
                <li key={item.id}>
                  <Link href={item.path}>
                    <Button
                      variant="ghost"
                      className={`
                        w-full justify-start space-x-3 h-11
                        ${isActive 
                          ? "bg-primary/10 text-primary border-r-2 border-primary" 
                          : "text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

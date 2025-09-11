export interface AuthUser {
  id: string | number; // Java uses UUID string, frontend may use number
  username: string;
  email: string;
  roles: { id: number; name: string; permissions?: string[] }[];
  permissions: string[] | { id: number; name: string }[]; // Handle both formats
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
  description?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  managerUsers: number;
  employeeUsers: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
    fill?: boolean;
  }[];
}

export interface Activity {
  id: number;
  description: string;
  timestamp: string;
  type: "user" | "training" | "system";
  icon: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles?: string[];
  permission?: string;
}

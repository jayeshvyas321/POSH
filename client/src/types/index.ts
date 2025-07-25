export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "manager" | "employee";
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  activeTrainings: number;
  completionRate: number;
  pendingTasks: number;
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
}

import type { AuthUser, DashboardStats, ChartData, Activity } from "@/types";

export const mockUser: AuthUser = {
  id: 1,
  username: "admin",
  email: "admin@example.com",
  role: "admin",
  firstName: "John",
  lastName: "Doe",
  isActive: true,
  createdAt: new Date(),
};

export const mockDashboardStats: DashboardStats = {
  totalUsers: 1234,
  activeTrainings: 45,
  completionRate: 89,
  pendingTasks: 23,
};

export const mockCompletionChartData: ChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Completions",
      data: [12, 19, 15, 25, 22, 18, 24],
      borderColor: "hsl(207, 90%, 54%)",
      backgroundColor: "hsla(207, 90%, 54%, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

export const mockRoleChartData: ChartData = {
  labels: ["Employees", "Managers", "Admins"],
  datasets: [
    {
      label: "User Distribution",
      data: [65, 25, 10],
      backgroundColor: [
        "hsl(207, 90%, 54%)",
        "hsl(142, 76%, 36%)",
        "hsl(38, 92%, 50%)",
      ],
    },
  ],
};

export const mockRecentActivities: Activity[] = [
  {
    id: 1,
    description: "Sarah Johnson completed \"POSH Training Module 1\"",
    timestamp: "2 hours ago",
    type: "user",
    icon: "user-check",
  },
  {
    id: 2,
    description: "New user Michael Brown was added to the system",
    timestamp: "4 hours ago",
    type: "user",
    icon: "user-plus",
  },
  {
    id: 3,
    description: "Training report generated for Q3 2024",
    timestamp: "1 day ago",
    type: "system",
    icon: "file-text",
  },
];

export const mockNotifications = [
  {
    id: 1,
    title: "New Training Assigned: POSH Compliance",
    message: "You have been assigned a new training module",
    time: "2 hours ago",
    type: "info",
    isRead: false,
  },
  {
    id: 2,
    title: "Training Completion Reminder",
    message: "Please complete your pending training modules",
    time: "1 day ago",
    type: "warning",
    isRead: false,
  },
  {
    id: 3,
    title: "System Maintenance Scheduled",
    message: "System will be down for maintenance on Sunday",
    time: "3 days ago",
    type: "info",
    isRead: false,
  },
];

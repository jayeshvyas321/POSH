import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { PieChart } from "@/components/dashboard/PieChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useAuth } from "@/contexts/AuthContext";
import { Users, BookOpen, TrendingUp, Clock, Target, CheckCircle } from "lucide-react";
import { mockDashboardStats, mockRecentActivities } from "@/lib/mockData";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Mock data for different roles
  const completionData = [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 19 },
    { name: "Wed", value: 15 },
    { name: "Thu", value: 25 },
    { name: "Fri", value: 22 },
    { name: "Sat", value: 18 },
    { name: "Sun", value: 24 },
  ];

  const trainingAttendanceData = [
    { name: "Completed", value: 75, color: "hsl(142, 76%, 36%)" },
    { name: "In Progress", value: 15, color: "hsl(38, 92%, 50%)" },
    { name: "Not Started", value: 10, color: "hsl(0, 84%, 60%)" },
  ];

  // Employee-specific mock data
  const employeeTrainingData = [
    { name: "POSH Training", value: 100, color: "hsl(142, 76%, 36%)" },
    { name: "Security Training", value: 60, color: "hsl(38, 92%, 50%)" },
    { name: "Leadership", value: 0, color: "hsl(0, 84%, 60%)" },
  ];

  const isAdminOrManager = user && (user.role === "admin" || user.role === "manager");

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Role-based Stats Cards */}
        {isAdminOrManager ? (
          // Admin/Manager View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Training Attendees"
              value="324"
              change="+18 this week"
              changeType="increase"
              icon={Users}
              iconColor="text-primary"
            />
            <StatsCard
              title="Active Trainings"
              value="12"
              change="+2 new this month"
              changeType="increase"
              icon={BookOpen}
              iconColor="text-green-600"
            />
            <StatsCard
              title="Completion Rate"
              value="89%"
              change="+5% from last month"
              changeType="increase"
              icon={TrendingUp}
              iconColor="text-blue-600"
            />
            <StatsCard
              title="Pending Reviews"
              value="23"
              change="-4 from yesterday"
              changeType="decrease"
              icon={Clock}
              iconColor="text-orange-600"
            />
          </div>
        ) : (
          // Employee View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Assigned Trainings"
              value="3"
              change="1 new this week"
              changeType="increase"
              icon={Target}
              iconColor="text-primary"
            />
            <StatsCard
              title="Completed Trainings"
              value="2"
              change="1 completed this week"
              changeType="increase"
              icon={CheckCircle}
              iconColor="text-green-600"
            />
            <StatsCard
              title="Progress Rate"
              value="67%"
              change="+33% this month"
              changeType="increase"
              icon={TrendingUp}
              iconColor="text-blue-600"
            />
          </div>
        )}

        {/* Role-based Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isAdminOrManager ? (
            <>
              <AnalyticsChart
                title="Training Completion Trends"
                data={completionData}
              />
              <PieChart
                title="Training Attendance Overview"
                data={trainingAttendanceData}
              />
            </>
          ) : (
            <>
              <AnalyticsChart
                title="My Learning Progress"
                data={completionData}
              />
              <PieChart
                title="My Training Status"
                data={employeeTrainingData}
              />
            </>
          )}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity activities={mockRecentActivities} />
          </div>
          <QuickActions />
        </div>
      </div>
    </Layout>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus, Download, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function QuickActions() {
  const { user } = useAuth();

  const handleNavigateToAddUser = () => {
    // TODO: Navigate to add user page
    console.log("Navigate to add user");
  };

  const handleNavigateToCreateTraining = () => {
    // TODO: Navigate to create training page
    console.log("Navigate to create training");
  };

  const handleNavigateToReports = () => {
    // TODO: Navigate to reports page
    console.log("Navigate to reports");
  };

  const handleNavigateToSettings = () => {
    // TODO: Navigate to settings page
    console.log("Navigate to settings");
  };

  // Only show admin/manager actions to authorized users
  const canManageUsers = user && (user.role === "admin" || user.role === "manager");

  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {canManageUsers && (
            <>
              <Button
                onClick={handleNavigateToAddUser}
                className="w-full justify-center space-x-2 bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New User</span>
              </Button>

              <Button
                onClick={handleNavigateToCreateTraining}
                className="w-full justify-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create Training</span>
              </Button>

              <Button
                onClick={handleNavigateToReports}
                className="w-full justify-center space-x-2 bg-orange-600 hover:bg-orange-700"
              >
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </Button>
            </>
          )}

          <Button
            onClick={handleNavigateToSettings}
            variant="outline"
            className="w-full justify-center space-x-2 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  const handleSaveProfile = () => {
    // TODO: Implement profile save
    console.log("Save profile");
  };

  const handleSaveNotifications = () => {
    // TODO: Implement notification settings save
    console.log("Save notification settings");
  };

  return (
    <Layout title="Settings">
      <div className="space-y-6 max-w-4xl">


        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="training-reminders">Training Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming training deadlines
                </p>
              </div>
              <Switch id="training-reminders" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-updates">System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about system maintenance
                </p>
              </div>
              <Switch id="system-updates" defaultChecked />
            </div>

            <Button onClick={handleSaveNotifications}>
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>

            <Button>
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

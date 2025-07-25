import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus, FileText } from "lucide-react";
import type { Activity } from "@/types";

const iconMap = {
  "user-check": UserCheck,
  "user-plus": UserPlus,
  "file-text": FileText,
};

const colorMap = {
  user: "bg-primary-50 text-primary-600",
  training: "bg-green-50 text-green-600",
  system: "bg-blue-50 text-blue-600",
};

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.icon as keyof typeof iconMap] || UserCheck;
            const colorClass = colorMap[activity.type] || colorMap.system;

            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-200">
          <Button variant="link" className="w-full text-center text-sm text-primary hover:text-primary/80">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

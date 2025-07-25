import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  iconColor = "text-primary" 
}: StatsCardProps) {
  const changeColorMap = {
    increase: "text-green-600",
    decrease: "text-red-600",
    neutral: "text-slate-500",
  };

  return (
    <Card className="stats-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${changeColorMap[changeType]}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

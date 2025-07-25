import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Play, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Training {
  id: number;
  title: string;
  category: string;
  duration: number;
  status: "assigned" | "in_progress" | "completed";
  progress: number;
  dueDate: string;
}

// Mock data - replace with actual API call
const mockTrainings: Training[] = [
  {
    id: 1,
    title: "POSH Compliance Training",
    category: "Compliance",
    duration: 120,
    status: "assigned",
    progress: 0,
    dueDate: "2024-02-15",
  },
  {
    id: 2,
    title: "Data Security Fundamentals",
    category: "Security",
    duration: 90,
    status: "in_progress",
    progress: 60,
    dueDate: "2024-02-20",
  },
  {
    id: 3,
    title: "Leadership Essentials",
    category: "Management",
    duration: 180,
    status: "completed",
    progress: 100,
    dueDate: "2024-01-30",
  },
];

export function TrainingManagement() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>(mockTrainings);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTrainings = trainings.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartTraining = (trainingId: number) => {
    // TODO: Start training
    console.log("Start training:", trainingId);
  };

  const handleCreateTraining = () => {
    // TODO: Open create training modal/form
    console.log("Create training");
  };

  const getStatusIcon = (status: Training["status"]) => {
    switch (status) {
      case "assigned":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Training["status"]) => {
    switch (status) {
      case "assigned":
        return "secondary";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
    }
  };

  const canCreateTraining = user && (user.role === "admin" || user.role === "manager");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Training Management</CardTitle>
            {canCreateTraining && (
              <Button onClick={handleCreateTraining} className="space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Training</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search trainings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Trainings Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell className="font-medium">{training.title}</TableCell>
                  <TableCell>{training.category}</TableCell>
                  <TableCell>{training.duration} min</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(training.status)} className="space-x-1">
                      {getStatusIcon(training.status)}
                      <span className="capitalize">{training.status.replace("_", " ")}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={training.progress} className="flex-1" />
                      <span className="text-sm text-slate-500">{training.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{training.dueDate}</TableCell>
                  <TableCell>
                    {training.status === "assigned" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartTraining(training.id)}
                      >
                        Start
                      </Button>
                    )}
                    {training.status === "in_progress" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartTraining(training.id)}
                      >
                        Continue
                      </Button>
                    )}
                    {training.status === "completed" && (
                      <Button variant="outline" size="sm" disabled>
                        Completed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTrainings.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No trainings found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

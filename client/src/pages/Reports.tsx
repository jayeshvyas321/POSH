import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Download, FileText, BarChart3 } from "lucide-react";

export default function Reports() {
  const handleGenerateReport = (type: string) => {
    // TODO: Implement report generation
    console.log("Generate report:", type);
  };

  return (
    <ProtectedRoute permission="report_view">
      <Layout title="Reports">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">User Report</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate comprehensive user activity and enrollment reports
                    </p>
                    <Button 
                      onClick={() => handleGenerateReport("user")}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Training Report</h3>
                    <p className="text-muted-foreground mb-4">
                      Analyze training completion rates and progress metrics
                    </p>
                    <Button 
                      onClick={() => handleGenerateReport("training")}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Compliance Report</h3>
                    <p className="text-muted-foreground mb-4">
                      Monitor compliance status and certification tracking
                    </p>
                    <Button 
                      onClick={() => handleGenerateReport("compliance")}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No reports generated yet. Generate your first report above.
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

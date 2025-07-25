import { Layout } from "@/components/layout/Layout";
import { UserManagement } from "@/components/users/UserManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function UserManagementPage() {
  return (
    <ProtectedRoute roles={["admin", "manager"]}>
      <Layout title="User Management">
        <UserManagement />
      </Layout>
    </ProtectedRoute>
  );
}

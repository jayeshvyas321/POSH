import { Layout } from "@/components/layout/Layout";
import { UserManagement } from "@/components/users/UserManagement";

export default function UserManagementPage() {
  return (
    <Layout title="User Management">
      <UserManagement />
    </Layout>
  );
}

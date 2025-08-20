import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoleForm } from "@/components/roles/CreateRoleForm";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Shield } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

export default function RolesManagement() {
  const { hasPermission, user } = useAuth();
  const canCreateRole = hasPermission("role_create");
  const canDeleteRole = hasPermission("role_create");
  const canViewRole = hasPermission("role_view");

  interface Permission {
    id: number;
    name: string;
  }

  interface SimpleRole {
    id: number;
    name: string;
  }

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<SimpleRole[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPermissionsAndRoles() {
      setLoading(true);
      setError(null);
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem("auth_token");
        // Fetch permissions with Authorization header
        const permRes = await fetch('http://localhost:8080/api/auth/getAllPermissions', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!permRes.ok) throw new Error('Failed to fetch permissions');
        const permData = await permRes.json();
        setPermissions(permData);

        // Fetch roles from new API with Authorization header
        const rolesRes = await fetch('http://localhost:8080/api/auth/getAllRoles', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!rolesRes.ok) throw new Error('Failed to fetch roles');
        const rolesData = await rolesRes.json();
        setRoles(rolesData);
      } catch (e: any) {
        setError('Could not load permissions or roles from server.');
      } finally {
        setLoading(false);
      }
    }
    fetchPermissionsAndRoles();
  }, []);

  const getPermissionName = (permissionId: string) => {
    const found = permissions.find(p => p.name === permissionId);
    return found ? found.name : permissionId;
  };

  return (
    <Layout title="Roles Management">
      <div className="space-y-6">
        {loading && <div className="text-center text-gray-500">Loading roles...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Roles Management</h1>
            <p className="text-gray-600 mt-2">Create and manage user roles and permissions</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="flex items-center gap-2" 
            disabled={!canCreateRole}
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
        </div>

        {/* Available Permissions Info (from API) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Available Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {permissions.length > 0 ? (
                permissions.map((permission) => (
                  <div key={permission.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{permission.name.toUpperCase()}</div>
                    <div className="text-xs text-gray-600 mt-1">Permission ID: {permission.id}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 col-span-3">No permissions found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Roles List (from API) */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Available Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.length > 0 ? (
                roles.map((role) => (
                  <div key={role.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{role.name.toUpperCase()}</div>
                    <div className="text-xs text-gray-600 mt-1">Role ID: {role.id}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 col-span-3">No roles found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Role Form */}
        <CreateRoleForm 
          isOpen={showCreateForm} 
          onClose={() => setShowCreateForm(false)} 
        />
      </div>
    </Layout>
  );
}
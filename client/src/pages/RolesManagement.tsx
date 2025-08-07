import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { CreateRoleForm } from "@/components/roles/CreateRoleForm";
import type { Role } from "@/types";

// Simplified permissions - no training specific permissions
const AVAILABLE_PERMISSIONS = [
  { id: 'user_view', name: 'View Users', description: 'Can view user management page' },
  { id: 'user_edit', name: 'Edit Users', description: 'Can edit user details and roles' },
  { id: 'user_create', name: 'Create Users', description: 'Can create new users' },
  { id: 'user_delete', name: 'Delete Users', description: 'Can delete users' },
  { id: 'reports_view', name: 'View Reports', description: 'Can view reports and analytics' },
  { id: 'settings_manage', name: 'Manage Settings', description: 'Can manage system settings' },
];


const mockRoles: Role[] = [
  {
    id: 1,
    name: 'admin',
    permissions: AVAILABLE_PERMISSIONS.map(p => p.id),
    description: 'Full system access',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'manager',
    permissions: ['user_view', 'user_edit', 'reports_view'],
    description: 'Can manage users and view reports',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 3,
    name: 'employee',
    permissions: [],
    description: 'Basic user access',
    createdAt: new Date('2024-01-01')
  }
];


export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/roles');
        if (!res.ok) throw new Error('Failed to fetch roles');
        const data = await res.json();
        // Convert createdAt to Date object if needed
        setRoles(data.map((role: any) => ({
          ...role,
          createdAt: role.createdAt ? new Date(role.createdAt) : new Date()
        })));
      } catch (e: any) {
        setError('Could not load roles from server. Showing mock data.');
        setRoles(mockRoles);
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  const getPermissionName = (permissionId: string) => {
    return AVAILABLE_PERMISSIONS.find(p => p.id === permissionId)?.name || permissionId;
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
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
        </div>

        {/* Available Permissions Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Available Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div key={permission.id} className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">{permission.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{permission.description}</div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {permission.id}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{role.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {role.name !== 'admin' && (
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {role.description && (
                  <p className="text-sm text-gray-600">{role.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Permissions ({role.permissions.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {getPermissionName(permission)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Created: {role.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Role Form */}
        <CreateRoleForm 
          isOpen={showCreateForm} 
          onClose={() => setShowCreateForm(false)} 
        />
      </div>
    </Layout>
  );
}
import { useState } from "react";
// Map permission names to unique Tailwind color classes
const permissionColorMap: Record<string, string> = {
  user_view: "bg-blue-100 text-blue-800 border-blue-200",
  user_edit: "bg-yellow-100 text-yellow-800 border-yellow-200",
  user_delete: "bg-red-100 text-red-800 border-red-200",
  user_create: "bg-green-100 text-green-800 border-green-200",
  DEFAULT_PERMISSION: "bg-gray-100 text-gray-800 border-gray-200",
  // Add more mappings as needed
};
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/lib/api";
import { EditUserForm } from "./EditUserForm";
import { AddUserForm } from "./AddUserForm";
import { DeleteUserDialog } from "./DeleteUserDialog";
import type { AuthUser } from "@/types";

export function UserManagement() {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AuthUser | null>(null);
  // Sorting state
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role'>("name");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");

  const { 
    data: users = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["/api/users"],
    queryFn: userApi.getUsers,
  });

  // Filter users by search
  const filteredUsers = users.filter(u => {
    const fullName = ((u.firstName || "") + " " + (u.lastName || "")).toLowerCase();
    const email = (u.email || "").toLowerCase();
    const username = (u.username || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      email.includes(search) ||
      username.includes(search)
    );
  });

  // Sort users by selected column and order
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = "";
    let bValue = "";
    if (sortBy === "name") {
      aValue = ((a.firstName || "") + " " + (a.lastName || "")).toLowerCase();
      bValue = ((b.firstName || "") + " " + (b.lastName || "")).toLowerCase();
    } else if (sortBy === "email") {
      aValue = (a.email || "").toLowerCase();
      bValue = (b.email || "").toLowerCase();
    } else if (sortBy === "role") {
      aValue = (a.roles && a.roles.length > 0 ? a.roles[0].name : "").toLowerCase();
      bValue = (b.roles && b.roles.length > 0 ? b.roles[0].name : "").toLowerCase();
    }
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Sorting handler
  const handleSort = (column: 'name' | 'email' | 'role') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleAddUser = () => {
    setShowAddForm(true);
  };

  const handleEditUser = (user: AuthUser) => {
    setEditingUser(user);
  };

  const handleDeleteUser = (user: AuthUser) => {
    setDeletingUser(user);
  };

  const { isAdmin, hasRole } = useAuth();
  const canCreateUsers = hasPermission("user_create") || isAdmin() || (hasRole && hasRole('ROLE_MANAGER'));
  const canEditUsers = hasPermission("user_edit");
  const canDeleteUsers = hasPermission("user_delete");

  if (!hasPermission("user_view")) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">No Access</h2>
        <p className="text-muted-foreground">You do not have permission to view users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Always show Add User button and modal */}
      {canCreateUsers && (
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddUser} className="space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </Button>
        </div>
      )}
      <AddUserForm 
        isOpen={showAddForm} 
        onClose={() => setShowAddForm(false)} 
      />

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error message if user list fails */}
          {error && (
            <div className="text-center text-red-600 mb-4">
              Failed to load users. Please try again.
            </div>
          )}
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !error ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </TableHead>
                  {/* Username column removed */}
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('email')}
                  >
                    Email
                    {sortBy === 'email' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('role')}
                  >
                    Role
                    {sortBy === 'role' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </TableHead>
                  <TableHead>Permissions</TableHead>
                  {(canEditUsers || canDeleteUsers) && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No users found matching your search." : "No users found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedUsers.map((u, idx) => (
                    <TableRow key={u.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <TableCell className="font-medium">
                        {u.firstName} {u.lastName}
                      </TableCell>
                      {/* Username column removed */}
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        {u.roles && u.roles.length > 0 ? (
                          u.roles.map((role, idx) => (
                            <Badge key={role.name} variant={role.name === "ROLE_ADMIN" ? "default" : "secondary"} className={idx > 0 ? "ml-1" : ""}>
                              {role.name.replace('ROLE_', '').toLowerCase()}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">employee</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {u.permissions && u.permissions.length > 0 ? (
                          u.permissions.map((perm: any, idx: number) => {
                            const permName = perm.name || perm;
                            const colorClass = permissionColorMap[permName] || "bg-purple-100 text-purple-800 border-purple-200";
                            return (
                              <Badge
                                key={perm.id || permName}
                                className={(idx > 0 ? "ml-1 " : "") + colorClass + " border"}
                              >
                                <span>{permName}</span>
                              </Badge>
                            );
                          })
                        ) : (
                          <Badge variant="secondary">No permissions</Badge>
                        )}
                      </TableCell>
                      {(canEditUsers || canDeleteUsers) && (
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {canEditUsers && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(u)}
                                title="Edit user"
                                className="border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-200"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            {canDeleteUsers && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(u)}
                                title="Delete user"
                                className="border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>

      {/* Forms and Dialogs */}
      {editingUser && (
        <EditUserForm 
          user={editingUser}
          isOpen={!!editingUser} 
          onClose={() => setEditingUser(null)} 
        />
      )}
      <DeleteUserDialog 
        user={deletingUser}
        isOpen={!!deletingUser} 
        onClose={() => setDeletingUser(null)} 
      />
    </div>
  );
}
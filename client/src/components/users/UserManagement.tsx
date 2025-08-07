import { useState } from "react";
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

  const { 
    data: users = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["/api/users"],
    queryFn: userApi.getUsers,
  });

  const filteredUsers = users.filter(u =>
    (u.firstName + " " + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setShowAddForm(true);
  };

  const handleEditUser = (user: AuthUser) => {
    setEditingUser(user);
  };

  const handleDeleteUser = (user: AuthUser) => {
    setDeletingUser(user);
  };

  const canCreateUsers = hasPermission("user_create");
  const canEditUsers = hasPermission("user_edit");
  const canDeleteUsers = hasPermission("user_delete");

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
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  {(canEditUsers || canDeleteUsers) && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No users found matching your search." : "No users found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.isActive ? "default" : "secondary"}>
                          {u.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      {(canEditUsers || canDeleteUsers) && (
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {canEditUsers && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(u)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            {canDeleteUsers && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(u)}
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
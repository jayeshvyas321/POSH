import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { rolesApi, permissionsApi } from "@/lib/api";
import type { AuthUser } from "@/types";

const editUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.string(),
  permissions: z.array(z.string()),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
}

export function EditUserForm({ user, isOpen, onClose }: EditUserFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [roles, setRoles] = useState<{ name: string }[]>([]);
  const [permissions, setPermissions] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.roles && user.roles.length > 0 ? user.roles[0].name : "ROLE_EMPLOYEE",
      permissions: user.permissions ? user.permissions.map((p: any) => p.name) : [],
    },
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [rolesData, permissionsData] = await Promise.all([
          rolesApi.fetchRoles(),
          permissionsApi.fetchPermissions()
        ]);
        setRoles(rolesData);
        setPermissions(permissionsData);
      } catch (e) {
        toast({ title: "Error", description: "Failed to load roles or permissions.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) fetchData();
  }, [isOpen, toast]);

  const onSubmit = async (data: EditUserFormData) => {
    setSaving(true);
    console.log('[DEBUG] Form submitted with data:', data);
    console.log('[DEBUG] Original user:', user);
    console.log('[DEBUG] Current environment API base:', import.meta.env.VITE_API_BASE_URL);
    
    try {
      // Only call APIs if changes are made
      const roleChanged = !(user.roles && user.roles[0] && user.roles[0].name === data.role);
      const currentPermissions = (user.permissions || []).map((p: any) => p.name).sort();
      const newPermissions = data.permissions.slice().sort();
      const permissionsChanged = JSON.stringify(currentPermissions) !== JSON.stringify(newPermissions);
      
      // Use user.username (which is the transformed userName from Java backend)
      const userName = user.username || user.email || "";
      if (!userName) throw new Error("Username is required to update roles/permissions");
      
      console.log('[DEBUG] Updating user:', {
        userName,
        roleChanged,
        permissionsChanged,
        currentPermissions,
        newPermissions,
        originalUser: user,
        formData: data
      });
      
      if (roleChanged) {
        console.log('[DEBUG] Adding role:', data.role);
        await rolesApi.addRoles(userName, [{ name: data.role }]);
      }
      
      if (permissionsChanged) {
        console.log('[DEBUG] Adding permissions:', data.permissions);
        await permissionsApi.addPermissions(userName, data.permissions.map(name => ({ name })));
      }
      
      if (!roleChanged && !permissionsChanged) {
        console.log('[DEBUG] No changes detected - user will see success message but no API calls made');
        toast({ title: "Info", description: "No changes detected", variant: "default" });
        onClose();
        return;
      }
      
      toast({ title: "Success", description: "User updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      onClose();
    } catch (e: any) {
      console.error('[ERROR] Failed to update user:', e);
      toast({ title: "Error", description: e.message || "Failed to update user", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading roles and permissions...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.name} value={role.name}>{role.name.replace("ROLE_", "")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map(perm => (
                        <label key={perm.name} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={perm.name}
                            checked={field.value.includes(perm.name)}
                            onChange={e => {
                              if (e.target.checked) {
                                field.onChange([...field.value, perm.name]);
                              } else {
                                field.onChange(field.value.filter((v: string) => v !== perm.name));
                              }
                            }}
                          />
                          <span>{perm.name}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
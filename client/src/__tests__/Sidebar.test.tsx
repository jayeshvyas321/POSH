
import React from "react";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthContext } from "@/contexts/AuthContext";
import { vi } from "vitest";

const mockOnToggle = vi.fn();

describe("Sidebar role/permission logic", () => {
  it("shows all tabs for admin", () => {
    const adminUser = {
      id: 1,
      username: "zucitech",
      email: "admin@zucitech.com",
      role: { id: 1, name: "ROLE_ADMIN", permissions: ["user_management", "edit_user"] },
      roles: [{ id: 1, name: "ROLE_ADMIN", permissions: ["user_management", "edit_user"] }],
      permissions: ["user_management", "edit_user"],
      firstName: "Admin",
      lastName: "User",
      isActive: true,
      createdAt: new Date(),
    };
    render(
      <AuthContext.Provider value={{ user: adminUser, isAdmin: () => true, hasRole: () => true, hasPermission: () => true, logout: vi.fn(), login: vi.fn(), signup: vi.fn(), isLoading: false }}>
        <Sidebar isOpen={true} onToggle={mockOnToggle} />
      </AuthContext.Provider>
    );
    expect(screen.getByText("Roles Management")).toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
  });

  it("shows only allowed tabs for manager", () => {
    const managerUser = {
      id: 2,
      username: "manager",
      email: "manager@zucitech.com",
      role: { id: 2, name: "ROLE_MANAGER", permissions: ["user_management"] },
      roles: [{ id: 2, name: "ROLE_MANAGER", permissions: ["user_management"] }],
      permissions: ["user_management"],
      firstName: "Manager",
      lastName: "User",
      isActive: true,
      createdAt: new Date(),
    };
    render(
      <AuthContext.Provider value={{ user: managerUser, isAdmin: () => false, hasRole: (r) => r === "ROLE_MANAGER", hasPermission: (p) => p === "user_management", logout: vi.fn(), login: vi.fn(), signup: vi.fn(), isLoading: false }}>
        <Sidebar isOpen={true} onToggle={mockOnToggle} />
      </AuthContext.Provider>
    );
    expect(screen.queryByText("Roles Management")).not.toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
  });

  it("hides user management for employee without permission", () => {
    const employeeUser = {
      id: 3,
      username: "employee",
      email: "employee@zucitech.com",
      role: { id: 3, name: "ROLE_EMPLOYEE", permissions: [] },
      roles: [{ id: 3, name: "ROLE_EMPLOYEE", permissions: [] }],
      permissions: [],
      firstName: "Employee",
      lastName: "User",
      isActive: true,
      createdAt: new Date(),
    };
    render(
      <AuthContext.Provider value={{ user: employeeUser, isAdmin: () => false, hasRole: (r) => r === "ROLE_EMPLOYEE", hasPermission: () => false, logout: vi.fn(), login: vi.fn(), signup: vi.fn(), isLoading: false }}>
        <Sidebar isOpen={true} onToggle={mockOnToggle} />
      </AuthContext.Provider>
    );
    expect(screen.queryByText("User Management")).not.toBeInTheDocument();
  });
});

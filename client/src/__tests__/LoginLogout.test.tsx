import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthContext } from "@/contexts/AuthContext";
import { vi } from "vitest";

// Mock useLocation from wouter
vi.mock("wouter", () => ({
  useLocation: () => ["/login", vi.fn()],
}));

// Shared toast mock
const toast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast }),
}));

import { LoginForm } from "@/components/auth/LoginForm";

describe("LoginForm", () => {
  it("calls login and redirects on success", async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    render(
      <AuthContext.Provider value={{ user: null, login, signup: vi.fn(), logout: vi.fn(), isLoading: false, hasPermission: vi.fn(), isAdmin: vi.fn(), hasRole: vi.fn() }}>
        <LoginForm onSwitchToSignup={vi.fn()} />
      </AuthContext.Provider>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("shows error on login failure", async () => {
    toast.mockClear();
    const login = vi.fn().mockRejectedValue(new Error("Invalid credentials"));
    render(
      <AuthContext.Provider value={{ user: null, login, signup: vi.fn(), logout: vi.fn(), isLoading: false, hasPermission: vi.fn(), isAdmin: vi.fn(), hasRole: vi.fn() }}>
        <LoginForm onSwitchToSignup={vi.fn()} />
      </AuthContext.Provider>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "fail@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/login failed/i),
        })
      );
    });
  });
});

describe("Logout", () => {
  it("calls logout and clears user", () => {
    const logout = vi.fn();
    render(
      <AuthContext.Provider value={{ user: { username: "test", roles: [], permissions: [], firstName: "T", lastName: "E", isActive: true, createdAt: new Date(), id: 1, email: "t@e.com" }, login: vi.fn(), signup: vi.fn(), logout, isLoading: false, hasPermission: vi.fn(), isAdmin: vi.fn(), hasRole: vi.fn() }}>
        <button onClick={logout}>Logout</button>
      </AuthContext.Provider>
    );
    fireEvent.click(screen.getByText("Logout"));
    expect(logout).toHaveBeenCalled();
  });
});

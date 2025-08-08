import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthContext } from "@/contexts/AuthContext";
import { vi } from "vitest";

// Mock useToast
const toast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

import { SignupForm } from "@/components/auth/SignupForm";

describe("SignupForm", () => {
  it("calls signup and shows success toast on success", async () => {
    toast.mockClear();
    const signup = vi.fn().mockResolvedValue(undefined);
    render(
      <AuthContext.Provider value={{ user: null, login: vi.fn(), signup, logout: vi.fn(), isLoading: false, hasPermission: vi.fn(), isAdmin: vi.fn(), hasRole: vi.fn() }}>
        <SignupForm onSwitchToLogin={vi.fn()} />
      </AuthContext.Provider>
    );
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/account created/i),
        })
      );
    });
  });

  it("shows error toast on signup failure", async () => {
    toast.mockClear();
    const signup = vi.fn().mockRejectedValue(new Error("Signup failed"));
    render(
      <AuthContext.Provider value={{ user: null, login: vi.fn(), signup, logout: vi.fn(), isLoading: false, hasPermission: vi.fn(), isAdmin: vi.fn(), hasRole: vi.fn() }}>
        <SignupForm onSwitchToLogin={vi.fn()} />
      </AuthContext.Provider>
    );
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Smith" } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "janesmith" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password456" } });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/signup failed/i),
        })
      );
    });
  });
});

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";

export function ResetPasswordForm() {
  const [step, setStep] = useState<'email' | 'otp' | 'password' | 'done'>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulate sending OTP (replace with real API if needed)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      // Call the reset-password API with only email to trigger OTP send
      await authApi.resetPassword({ email });
      setStep("otp");
    } catch (e: any) {
      setError(e.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP (just validate locally, don't call API yet)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    setLoading(true);
    try {
      // Just move to password step - we'll validate OTP when resetting password
      setStep("password");
    } catch (e: any) {
      setError(e.message || "Failed to verify OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit new password
  function isPasswordComplex(pw: string) {
    return pw.length >= 5 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  }
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newPassword || !isPasswordComplex(newPassword)) {
      setError("Password must be at least 5 characters long, contain upper and lower case letters, a digit, and a special character.");
      return;
    }
    setLoading(true);
    try {
      // Call the reset-password API with all fields
  await authApi.resetPassword({ email, otp, newPassword });
      setStep("done");
    } catch (e: any) {
      setError(e.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (step === "email") {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4 p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2 text-center">Reset Password</h2>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
      </form>
    );
  }
  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4 p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2 text-center">Enter OTP</h2>
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">OTP</label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP received on email"
            required
            disabled={loading}
          />
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>Verify OTP</Button>
      </form>
    );
  }
  if (step === "password") {
    return (
      <form onSubmit={handleResetPassword} className="space-y-4 p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2 text-center">Set New Password</h2>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            disabled={loading}
          />
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Reset Password"}</Button>
      </form>
    );
  }
  if (step === "done") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Password Reset Successful</h2>
        <p className="text-slate-600">Your password has been reset. You can now log in with your new password.</p>
      </div>
    );
  }
  return null;
}

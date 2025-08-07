import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm({ onSubmit }: { onSubmit?: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    onSubmit?.(email);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Check your email</h2>
        <p className="text-slate-600">If an account exists for <span className="font-medium">{email}</span>, you will receive a password reset link shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 w-full max-w-sm mx-auto">
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
        />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </div>
      <Button type="submit" className="w-full">Send Reset OTP</Button>
    </form>
  );
}

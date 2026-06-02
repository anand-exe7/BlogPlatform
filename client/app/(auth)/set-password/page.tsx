"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValid = !!token && password.length >= 8 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      await api.post("/users/set-password", { token, password });
      router.replace("/login?passwordSet=true");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🔐</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Set Your Password</h2>
        <p className="text-gray-600">
          Your account has been approved! Create a secure password to continue.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            placeholder="Enter your password"
            required
            disabled={submitting}
            minLength={8}
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 8 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            placeholder="Confirm your password"
            required
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-200 mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? "Setting Password..." : "Set Password"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Password Requirements:</strong>
        </p>
        <ul className="text-xs text-gray-600 mt-2 space-y-1">
          <li>• At least 8 characters long</li>
          <li>• Must match confirmation</li>
          <li>• Token must be valid and not expired</li>
        </ul>
      </div>

      <p className="text-center text-gray-600 mt-6 text-sm">
        Already set your password?{" "}
        <Link href="/login" className="text-teal-600 font-semibold hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}

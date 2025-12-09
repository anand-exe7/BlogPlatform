"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("No token found in URL");
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/users/set-password", {
        token: token,
        password: formData.password,
      });

      toast.success("Password set successfully!");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to set password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Set Your Password</h2>
          <p className="text-gray-600">Your account has been approved! Create a secure password to continue.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Enter your password"
              required
              disabled={isLoading}
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
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-200 mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Setting Password..." : "Set Password"}
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
    </div>
  );
}

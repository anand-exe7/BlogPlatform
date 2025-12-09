"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Login:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-yellow-400 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="CK Club Logo" 
            className="w-24 h-24 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-black mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-800 mb-6 text-center">Login to your account</p>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-black font-bold">@</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white border-3 border-black rounded-lg focus:ring-4 focus:ring-black outline-none text-black placeholder-gray-600"
                placeholder="john@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-black font-bold">*</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white border-3 border-black rounded-lg focus:ring-4 focus:ring-black outline-none text-black placeholder-gray-600"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 border-2 border-black rounded" />
              <span className="ml-2 text-sm text-black font-medium">Remember me</span>
            </label>
            <a href="#" className="text-sm text-black font-bold hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black text-yellow-400 py-3 rounded-lg font-bold hover:bg-gray-900 transition duration-200 mt-6 disabled:bg-gray-700 disabled:cursor-not-allowed border-2 border-black"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-black mt-6 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="text-black font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

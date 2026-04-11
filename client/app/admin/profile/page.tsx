"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface PlatformStats {
  totalUsers: number;
  totalBlogs: number;
  totalPublished: number;
  totalLikes: number;
  totalComments: number;
}

export default function AdminProfile() {
  const router = useRouter();
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      if (parsedUser.role === "member") {
        router.push("/member/profile");
      } else {
        router.push("/login");
      }
      return;
    }

    setUser(parsedUser);
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const res = await api.get<{ success: boolean; data: PlatformStats }>("/stats/platform");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      setSaving(false);
      return;
    }

    try {
      await api.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error?.message || "Failed to change password" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Profile</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition"
            >
              ← Dashboard
            </Link>
            <span>Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {message.text && (
          <div className={`${message.type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700"} border rounded-lg p-4 mb-6`}>
            {message.text}
          </div>
        )}

        {/* Platform Analytics */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <h2 className="text-2xl font-bold mb-6">📊 Platform Analytics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
              <p className="text-purple-200">Total Members</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats?.totalBlogs || 0}</p>
              <p className="text-purple-200">Total Blogs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats?.totalPublished || 0}</p>
              <p className="text-purple-200">Published</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats?.totalLikes || 0}</p>
              <p className="text-purple-200">Total Likes</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats?.totalComments || 0}</p>
              <p className="text-purple-200">Total Comments</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Admin Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-lg">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Administrator
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Admin Since</p>
                <p className="font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium disabled:bg-gray-400 transition"
              >
                {saving ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Admin Quick Links</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/admin/dashboard"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-center font-medium transition"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/blogs"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg text-center font-medium transition"
            >
              📖 View Blogs
            </Link>
            <Link
              href="/"
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-lg text-center font-medium transition"
            >
              🏠 Homepage
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

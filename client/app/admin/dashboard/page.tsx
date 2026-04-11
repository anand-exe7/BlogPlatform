"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  reg_no: string;
  year: string;
  domain: string;
  status: string;
  ref_code: string;
  created_at: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  image?: string;
  status: string;
  created_at: string;
  author: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "blogs">("users");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/member/dashboard");
      return;
    }

    setUser(parsedUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [usersRes, blogsRes] = await Promise.all([
        api.get<{ success: boolean; data: { users: User[] } }>("/admin/users/pending"),
        api.get<{ success: boolean; data: { blogs: Blog[] } }>("/admin/blogs"),
      ]);
      setPendingUsers(usersRes.data.users || []);
      setBlogs(blogsRes.data.blogs || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await api.patch(`/admin/users/${userId}/approve`);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } catch (err) {
      console.error("Failed to approve user:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveBlog = async (blogId: string) => {
    setActionLoading(blogId);
    try {
      await api.patch(`/admin/blogs/${blogId}/approve`);
      fetchData();
    } catch (err) {
      console.error("Failed to approve blog:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBlog = async (blogId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setActionLoading(blogId);
    try {
      await api.patch(`/admin/blogs/${blogId}/reject`, { reason });
      fetchData();
    } catch (err) {
      console.error("Failed to reject blog:", err);
    } finally {
      setActionLoading(null);
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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/blogs"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition"
            >
              📖 View Public Blogs
            </Link>
            <Link
              href="/admin/profile"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition"
            >
              👤 Profile
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "users"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pending Users ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "blogs"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Blog Submissions ({blogs.filter(b => b.status === "pending_review").length})
          </button>
        </div>

        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Pending User Registrations</h2>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-500">No pending users</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Reg No</th>
                      <th className="text-left py-3 px-4">Year</th>
                      <th className="text-left py-3 px-4">Domain</th>
                      <th className="text-left py-3 px-4">Ref Code</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{u.name}</td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">{u.reg_no}</td>
                        <td className="py-3 px-4">{u.year}</td>
                        <td className="py-3 px-4">{u.domain}</td>
                        <td className="py-3 px-4 font-mono text-sm">{u.ref_code}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleApproveUser(u.id)}
                            disabled={actionLoading === u.id}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 transition"
                          >
                            {actionLoading === u.id ? "Processing..." : "Approve"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "blogs" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Blog Submissions</h2>
            {blogs.filter(b => b.status === "pending_review").length === 0 ? (
              <p className="text-gray-500">No pending blogs</p>
            ) : (
              <div className="space-y-4">
                {blogs.filter(b => b.status === "pending_review").map((blog) => (
                  <div key={blog.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{blog.title}</h3>
                        <p className="text-sm text-gray-500">By {blog.author.name} ({blog.author.email})</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        Pending Review
                      </span>
                    </div>
                    {blog.image && (
                      <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    )}
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveBlog(blog.id)}
                        disabled={actionLoading === blog.id}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectBlog(blog.id)}
                        disabled={actionLoading === blog.id}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

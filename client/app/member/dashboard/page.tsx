"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";

interface Blog {
  id: string;
  title: string;
  content: string;
  image?: string;
  links?: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export default function MemberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", links: "" });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "member") {
      if (parsedUser.role === "admin") {
        router.push("/admin/dashboard");
      }
      return;
    }

    setUser(parsedUser);
    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const res = await api.get<{ success: boolean; data: Blog[] }>("/blogs/my");
      setBlogs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: { title: string; content: string; links?: string; image?: string } = {
        title: formData.title,
        content: formData.content,
        links: formData.links || undefined,
      };

      if (imagePreview) {
        payload.image = imagePreview;
      }

      await api.post("/blogs", payload);
      setFormData({ title: "", content: "", links: "" });
      setImagePreview("");
      setImageFile(null);
      setShowForm(false);
      fetchBlogs();
    } catch (err: any) {
      console.error("Failed to create blog:", err);
      const errorMsg = err?.response?.data?.error?.message || "Failed to create blog";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForReview = async (blogId: string) => {
    try {
      await api.post(`/blogs/${blogId}/submit`);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to submit blog:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      pending_review: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[status] || styles.draft}`}>
        {status.replace("_", " ")}
      </span>
    );
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
          <h1 className="text-2xl font-bold">Member Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/blogs"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition"
            >
              📖 View Public Blogs
            </Link>
            <Link
              href="/member/profile"
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Blogs</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {showForm ? "Cancel" : "Create New Blog"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Create New Blog</h3>
            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter blog title"
                  required
                  minLength={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none h-40"
                  placeholder="Write your blog content here..."
                  required
                  minLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Links (optional)</label>
                <input
                  type="text"
                  value={formData.links}
                  onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Related links (comma separated)"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400 transition"
              >
                {submitting ? "Creating..." : "Create Draft"}
              </button>
            </form>
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">You haven&apos;t created any blogs yet.</p>
            <p className="text-gray-500 mt-2">Click &quot;Create New Blog&quot; to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{blog.title}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(blog.status)}
                </div>
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                {blog.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-red-700">Rejection Reason:</p>
                    <p className="text-sm text-red-600">{blog.rejection_reason}</p>
                  </div>
                )}
                {blog.status === "draft" && (
                  <button
                    onClick={() => handleSubmitForReview(blog.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Submit for Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "../lib/api";

interface Blog {
  id: string;
  title: string;
  content: string;
  image?: string;
  links?: string;
  author: {
    name: string;
    email: string;
  };
  created_at: string;
}

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get<{ success: boolean; data: { blogs: Blog[] } }>("/blogs/public");
      setBlogs(res.data?.blogs || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            Club Blog Platform
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === "admin" ? (
                <Link
                  href="/admin/dashboard"
                  className="text-gray-600 hover:text-indigo-600 transition font-medium"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  href="/member/dashboard"
                  className="text-gray-600 hover:text-indigo-600 transition font-medium"
                >
                  My Dashboard
                </Link>
              )}
              <Link
                href={`/${user.role === "admin" ? "admin" : "member"}/profile`}
                className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition"
              >
                👤 {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Blogs</h1>
          <p className="text-gray-600">Read the latest articles from our community members</p>
        </div>

        {blogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No blogs published yet.</p>
            <p className="text-gray-500 mt-2">Check back later for new content!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {blog.author.name}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {blog.content.length > 100 ? "..." : ""}
                    </span>
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2024 Club Blog Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

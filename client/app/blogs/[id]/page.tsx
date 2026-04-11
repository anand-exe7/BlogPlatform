"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";

interface Blog {
  id: string;
  title: string;
  content: string;
  image?: string;
  links?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  _count: {
    likes: number;
    comments: number;
  };
  userLiked?: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    name: string;
  };
}

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (params.id) {
      fetchBlog(params.id as string);
      fetchComments(params.id as string);
    }
  }, [params.id]);

  const fetchBlog = async (id: string) => {
    try {
      const res = await api.get<{ success: boolean; data: Blog }>(`/blogs/public/${id}`);
      setBlog(res.data);
      setLikeCount(res.data._count?.likes || 0);
      setUserLiked(res.data.userLiked || false);
    } catch (err) {
      setError("Blog not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (id: string) => {
    try {
      const res = await api.get<{ success: boolean; data: { comments: Comment[] } }>(`/comments/${id}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      if (confirm("Please login to like this blog. Go to login page?")) {
        window.location.href = "/login";
      }
      return;
    }

    setLikeLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: { liked: boolean; count: number } }>(`/like/${blog?.id}`);
      setUserLiked(res.data.liked);
      setLikeCount(res.data.count);
    } catch (err: any) {
      console.error("Failed to like:", err);
      alert(err?.response?.data?.error?.message || "Failed to like");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (confirm("Please login to comment. Go to login page?")) {
        window.location.href = "/login";
      }
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: { comment: Comment } }>(`/comment/${blog?.id}`, {
        content: newComment,
      });
      setComments([res.data.comment, ...comments]);
      setNewComment("");
    } catch (err: any) {
      console.error("Failed to comment:", err);
      alert(err?.response?.data?.error?.message || "Failed to comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comment/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <Link href="/blogs" className="text-indigo-600 hover:underline">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            Club Blog Platform
          </Link>
          <Link
            href="/blogs"
            className="text-gray-600 hover:text-indigo-600 transition"
          >
            ← Back to Blogs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          )}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium">
                {blog.author.name}
              </div>
              <span className="text-gray-500">
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {blog.content}
              </p>
            </div>
            {blog.links && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Related Links</h3>
                <p className="text-gray-600">{blog.links}</p>
              </div>
            )}

            {/* Like Section */}
            <div className="mt-8 pt-6 border-t flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  userLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {userLiked ? "❤️" : "🤍"} {likeCount} {likeCount === 1 ? "Like" : "Likes"}
              </button>
              <span className="text-gray-500">
                💬 {blog._count?.comments || 0} Comments
              </span>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Comments ({comments.length})</h2>

          {/* Comment Form */}
          <form onSubmit={handleComment} className="mb-6">
            {user ? (
              <div className="flex gap-3">
                <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    rows={3}
                    required
                  />
                  <button
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400 transition"
                  >
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-2">Login to comment on this blog</p>
                <Link
                  href="/login"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Login here
                </Link>
              </div>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{comment.user.name}</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                        {(user?.id === comment.user.id || user?.role === "admin") && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 text-sm hover:underline ml-auto"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blogs"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2024 Club Blog Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

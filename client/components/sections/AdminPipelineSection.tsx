"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  User,
  Calendar,
  ExternalLink,
  Loader2,
  FileText,
  Send,
} from "lucide-react";
import { adminApi, handleApiError, Post } from "@/lib/api";
import { toast } from "react-hot-toast";

interface AdminPipelineSectionProps {
  onApproveSuccess?: () => void;
  onAction?: (id: string) => void;
  blogs?: Post[];
  setBlogs?: React.Dispatch<React.SetStateAction<Post[]>>;
}

export default function AdminPipelineSection({
  onApproveSuccess,
  onAction,
  blogs,
  setBlogs,
}: AdminPipelineSectionProps) {
  const [internalPending, setInternalPending] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Post | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const displayBlogs = blogs || internalPending;

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getBlogs("pending_review");
      setInternalPending(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!blogs) {
      fetchPending();
    }
  }, [blogs]);

  useEffect(() => {
    if (displayBlogs.length > 0 && !selectedBlog) {
      setSelectedBlog(displayBlogs[0]);
    }
  }, [displayBlogs, selectedBlog]);

  const handleApprove = async (id: string) => {
    if (actionLoading === id) return; // Guard against double clicks
    setActionLoading(id);
    try {
      await adminApi.approveBlog(id);

      const updateList = (prev: Post[]) => prev.filter((b) => b.id !== id);
      if (setBlogs) setBlogs(updateList);
      setInternalPending(updateList);

      if (selectedBlog?.id === id) {
        const nextBlog = displayBlogs.find((b) => b.id !== id) || null;
        setSelectedBlog(nextBlog);
      }

      toast.success("Story approved and published!");
      onAction?.(id);
      onApproveSuccess?.();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (actionLoading === id) return;
    if (!rejectReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setActionLoading(id);
    try {
      await adminApi.rejectBlog(id, rejectReason);

      const updateList = (prev: Post[]) => prev.filter((b) => b.id !== id);
      if (setBlogs) setBlogs(updateList);
      setInternalPending(updateList);

      if (selectedBlog?.id === id) {
        const nextBlog = displayBlogs.find((b) => b.id !== id) || null;
        setSelectedBlog(nextBlog);
      }

      setRejectMode(false);
      setRejectReason("");
      toast.success("Story rejected.");
      onAction?.(id);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && displayBlogs.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#f5b800] w-12 h-12 mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
          Syncing Review Pipeline...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-gray-900 flex items-center gap-4"
        >
          <ShieldCheck className="text-amber-600 w-8 h-8 md:w-10 md:h-10" />
          Review Pipeline
          <span className="text-xl text-gray-300 font-medium ml-2">
            {displayBlogs.length} pending
          </span>
        </motion.h1>
      </div>

      {displayBlogs.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border-4 border-dashed border-gray-100 rounded-[3rem] p-20 text-center">
          <CheckCircle size={80} className="mx-auto text-emerald-100 mb-6" />
          <h2 className="text-3xl font-black text-gray-300 uppercase tracking-tighter">
            Queue is Crystal Clear
          </h2>
          <p className="text-gray-400 font-bold mt-2">
            All submissions have been processed. Great job!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[700px]">
          {/* Sidebar List */}
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[800px] custom-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {displayBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  layoutId={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                    selectedBlog?.id === blog.id
                      ? "bg-black text-white border-black shadow-2xl shadow-gray-200 -translate-y-1"
                      : "bg-white/80 border-gray-100 hover:border-amber-200 hover:bg-white"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock
                        size={12}
                        className={
                          selectedBlog?.id === blog.id
                            ? "text-amber-400"
                            : "text-gray-400"
                        }
                      />
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${selectedBlog?.id === blog.id ? "text-amber-400" : "text-gray-400"}`}
                      >
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-black leading-tight line-clamp-2 mb-4 group-hover:text-amber-600 transition-colors">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          selectedBlog?.id === blog.id
                            ? "bg-white/10 text-white"
                            : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {blog.author?.name?.charAt(0) || "U"}
                      </div>
                      <span
                        className={`text-xs font-bold ${selectedBlog?.id === blog.id ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {blog.author?.name || "Unknown Author"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Full Detail View */}
          <div className="lg:col-span-8 bg-white/70 backdrop-blur-2xl border border-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col">
            {selectedBlog ? (
              <div className="flex flex-col h-full">
                {/* Header Actions */}
                <div className="p-6 bg-white/50 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
                    <FileText size={16} /> Reading Mode
                  </div>
                  <div className="flex gap-3">
                    {!rejectMode ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectMode(true);
                          }}
                          disabled={!!actionLoading}
                          className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-100 transition-all flex items-center gap-2"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(selectedBlog.id);
                          }}
                          disabled={!!actionLoading}
                          className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
                        >
                          {actionLoading === selectedBlog.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <CheckCircle size={18} />
                          )}
                          Approve & Publish
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 w-full max-w-xl">
                        <input
                          autoFocus
                          placeholder="Enter rejection reason..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="flex-1 px-6 py-3 bg-gray-50 border border-gray-200 rounded-[1.2rem] focus:outline-none focus:border-rose-500 font-bold text-sm"
                        />
                        <button
                          onClick={() => setRejectMode(false)}
                          className="p-3 text-gray-400 hover:text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReject(selectedBlog.id)}
                          disabled={!!actionLoading}
                          className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center gap-2"
                        >
                          {actionLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Send size={18} />
                          )}
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
                  <div className="w-full h-[400px] rounded-[2.5rem] overflow-hidden mb-12 shadow-xl border-8 border-white">
                    <img
                      src={selectedBlog.image || selectedBlog.coverImage}
                      className="w-full h-full object-cover"
                      alt="Cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <div className="flex gap-2 mb-8">
                      {selectedBlog.tags?.map((t, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tighter">
                      {selectedBlog.title}
                    </h2>

                    <div className="flex items-center gap-4 mb-12 pb-12 border-b border-gray-100">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                        {selectedBlog.author?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-black text-gray-900">
                          {selectedBlog.author?.name || "Unknown Author"}
                        </div>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                          Submission Date:{" "}
                          {new Date(
                            selectedBlog.created_at,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-xl max-w-none text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedBlog.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30">
                <ShieldCheck size={100} className="mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-widest">
                  Select a draft to initiate review
                </h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

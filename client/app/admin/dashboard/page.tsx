"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Activity,
  UserCheck,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { adminApi, handleApiError, User, Post } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import Sidebar from "@/components/sidebar";
import { GrainOverlay, GridPattern } from "@/components/background";
import SlotCounter from "@/components/SlotCounter";
import { springTransition } from "@/lib/animations";
import { AuthModal } from "@/components/AuthModal";
import AdminPipelineSection from "@/components/sections/AdminPipelineSection";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading, logout } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "blogs">(
    "overview",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        setShowLoginModal(true);
        return;
      }
      if (!user?.is_super_admin) {
        router.push("/platform");
        return;
      }
      setShowLoginModal(false);
      fetchData();
    }
  }, [authLoading, isLoggedIn, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create a promise that rejects after 15 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(new Error("Connection timeout - server taking too long")),
          15000,
        );
      });

      const [statsRes, usersRes, pendingRes, blogsRes] = (await Promise.race([
        Promise.all([
          adminApi.getStats(),
          adminApi.getAllUsers(),
          adminApi.getPendingUsers(),
          adminApi.getBlogs("pending_review"),
        ]),
        timeoutPromise,
      ])) as any;

      setStats(statsRes);
      setAllUsers(usersRes);
      setPendingUsers(pendingRes);
      setBlogs(blogsRes);
    } catch (err: any) {
      console.error("Failed to fetch admin data:", err);
      setError(
        handleApiError(err) || err.message || "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminApi.approveUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setStats((prev: any) => ({
        ...prev,
        pendingUsers: prev.pendingUsers - 1,
        approvedUsers: prev.approvedUsers + 1,
      }));
      // Refresh all users to update their status tag
      const refreshedUsers = await adminApi.getAllUsers();
      setAllUsers(refreshedUsers);
      toast.success("User approved successfully!");
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveBlog = async (blogId: string) => {
    setActionLoading(blogId);
    try {
      await adminApi.approveBlog(blogId);
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
      setStats((prev: any) => ({
        ...prev,
        pendingBlogs: (prev?.pendingBlogs || 1) - 1,
      }));
      toast.success("Blog approved and published!");
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBlog = async (blogId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setActionLoading(blogId);
    try {
      await adminApi.rejectBlog(blogId, reason);
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
      setStats((prev: any) => ({
        ...prev,
        pendingBlogs: (prev?.pendingBlogs || 1) - 1,
      }));
      toast.success("Blog rejected.");
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center">
        <GrainOverlay />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f5b800] mb-4" />
        <p className="font-black text-gray-500 uppercase tracking-widest text-xs">
          Accessing Control Center...
        </p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center p-6 text-center">
        <GrainOverlay />
        <div className="bg-white/70 backdrop-blur-xl border border-rose-100 p-12 rounded-[3rem] shadow-xl max-w-lg">
          <XCircle size={64} className="text-rose-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">
            Connection Failed
          </h2>
          <p className="text-gray-500 font-bold mb-10 leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchData}
            className="bg-amber-600 hover:bg-black text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-amber-100"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-gray-900 selection:bg-[#f5b800] selection:text-white overflow-x-hidden relative">
      <GrainOverlay />
      <GridPattern />

      <Sidebar
        activeSection="admin"
        onSectionChange={(id) => {
          if (id !== "admin") {
            router.push(`/platform?section=${id}`);
          }
        }}
        onLogout={logout}
        isLoggedIn={isLoggedIn}
        userRole={user?.role}
        isSuperAdmin={user?.is_super_admin}
      />

      <main className="relative z-10 min-h-screen w-full flex flex-col items-center pt-20 md:pt-12 pb-12 px-4 md:px-8 lg:pl-32 transition-all duration-300">
        <div className="w-full max-w-7xl flex flex-col gap-8">
          {/* Hero Section - Admin Style */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/70 backdrop-blur-2xl border border-white/70 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.1)]">
            <motion.div
              className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-3xl"
              animate={{ x: [0, 30, -30, 0], scale: [1, 1.1, 0.9, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
                <div className="flex-1">
                  <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-amber-50 border border-amber-100 shadow-sm mb-8"
                  >
                    <ShieldCheck size={16} className="text-amber-600" />
                    <div className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-700">
                      Administrative Vault
                    </div>
                  </motion.div>

                  <motion.h1
                    initial={{ y: 26, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] text-gray-900 tracking-tighter"
                  >
                    MANAGE YOUR <br />
                    <span className="text-amber-600">CLUB.</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 text-xl text-gray-500 font-medium max-w-xl leading-relaxed"
                  >
                    Welcome back,{" "}
                    <span className="text-black font-black whitespace-nowrap">
                      {user?.name}
                    </span>
                    . You have{" "}
                    <span className="text-amber-600 font-black">
                      {stats?.pendingUsers} pending approvals
                    </span>{" "}
                    awaiting your signature.
                  </motion.p>
                </div>

                <div className="w-full lg:w-[400px] grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Total Members",
                      value: stats?.totalUsers,
                      icon: <Users />,
                      color: "text-blue-500",
                    },
                    {
                      label: "Total Stories",
                      value: stats?.totalBlogs,
                      icon: <FileText />,
                      color: "text-amber-500",
                    },
                    {
                      label: "Total Likes",
                      value: stats?.totalLikes,
                      icon: <Heart />,
                      color: "text-rose-500",
                    },
                    {
                      label: "Comments",
                      value: stats?.totalComments,
                      icon: <Activity />,
                      color: "text-emerald-500",
                    },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-white/80 p-6 rounded-[2rem] border border-white shadow-lg flex flex-col items-center text-center gap-1 hover:border-amber-200 transition-all group"
                    >
                      <div
                        className={`p-3 rounded-xl bg-gray-50 mb-2 group-hover:scale-110 transition-transform ${s.color}`}
                      >
                        {s.icon}
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-gray-900">
                        <SlotCounter value={s.value || 0} />
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {s.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[
              {
                id: "overview",
                label: "Overview",
                icon: <LayoutDashboard size={18} />,
              },
              { id: "users", label: "Members", icon: <Users size={18} /> },
              { id: "blogs", label: "Submissions", icon: <Clock size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-amber-600 text-white shadow-xl shadow-amber-200 -translate-y-1"
                    : "bg-white/70 text-gray-500 hover:bg-white hover:text-amber-600 border border-white/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Approval Alerts Section */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[3rem] p-8 md:p-10 shadow-xl relative overflow-hidden h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                      <UserCheck className="text-amber-600" />
                      Pending Approval
                    </h2>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-black">
                      {pendingUsers.length} Requests
                    </span>
                  </div>

                  <div className="space-y-4">
                    {pendingUsers.length === 0 ? (
                      <div className="text-center py-20 opacity-30">
                        <CheckCircle size={48} className="mx-auto mb-4" />
                        <p className="font-black text-sm uppercase tracking-widest">
                          Queue Clear
                        </p>
                      </div>
                    ) : (
                      pendingUsers.map((u) => (
                        <div
                          key={u.id}
                          className="bg-white/50 p-6 rounded-3xl border border-white flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center font-black text-amber-600 text-lg">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-gray-900">
                                {u.name}
                              </div>
                              <div className="text-xs text-gray-400 font-bold tracking-tight">
                                {u.reg_no} • {u.domain}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleApproveUser(u.id)}
                            disabled={actionLoading === u.id}
                            className="bg-amber-600 hover:bg-black text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50"
                          >
                            Approve
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Submissions Section */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[3rem] p-8 md:p-10 shadow-xl relative overflow-hidden h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                      <Clock className="text-[#f5b800]" />
                      Story Submissions
                    </h2>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-black">
                      {blogs.length} Pending
                    </span>
                  </div>

                  <div className="space-y-4">
                    {blogs.length === 0 ? (
                      <div className="text-center py-20 opacity-30">
                        <FileText size={48} className="mx-auto mb-4" />
                        <p className="font-black text-sm uppercase tracking-widest">
                          No Submissions
                        </p>
                      </div>
                    ) : (
                      blogs.map((b) => (
                        <div
                          key={b.id}
                          className="bg-white/50 p-6 rounded-3xl border border-white flex flex-col gap-4 group hover:bg-white hover:shadow-xl transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-black text-gray-900 leading-tight mb-1">
                                {b.title}
                              </h3>
                              <p className="text-xs text-gray-400 font-bold">
                                By {b.author.name}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveBlog(b.id)}
                                disabled={actionLoading === b.id}
                                className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                              >
                                <CheckCircle size={20} />
                              </button>
                              <button
                                onClick={() => handleRejectBlog(b.id)}
                                disabled={actionLoading === b.id}
                                className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"
                              >
                                <XCircle size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[3rem] p-8 md:p-10 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <h2 className="text-3xl font-black text-gray-900">
                    Member Directory
                  </h2>
                  <div className="relative flex-1 max-w-md">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search by name, reg_no, domain..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto -mx-10 px-10">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100">
                        <th className="pb-6 pr-4">Member Info</th>
                        <th className="pb-6 pr-4">College Context</th>
                        <th className="pb-6 pr-4">Account State</th>
                        <th className="pb-6 pr-4">Joined At</th>
                        <th className="pb-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {allUsers
                        .filter(
                          (u) =>
                            u.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            u.email
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            u.reg_no?.includes(searchQuery),
                        )
                        .map((u) => (
                          <tr
                            key={u.id}
                            className="group hover:bg-amber-50/30 transition-colors"
                          >
                            <td className="py-6 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-all">
                                  {u.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-black text-gray-900">
                                    {u.name}
                                  </div>
                                  <div className="text-xs text-gray-400 font-bold">
                                    {u.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 pr-4">
                              <div className="text-sm font-black text-gray-700">
                                {u.reg_no}
                              </div>
                              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {u.domain} • Year {u.year}
                              </div>
                            </td>
                            <td className="py-6 pr-4">
                              <span
                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                  u.status === "approved"
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    : "bg-amber-50 text-amber-600 border border-amber-100"
                                }`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="py-6 pr-4 text-sm text-gray-500 font-medium">
                              {new Date(
                                u.created_at || "",
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-6 text-right">
                              {u.status === "pending" && (
                                <button
                                  onClick={() => handleApproveUser(u.id)}
                                  className="text-amber-600 font-black text-xs hover:underline uppercase tracking-widest"
                                >
                                  Approve Now
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "blogs" && (
              <motion.div
                key="blogs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <AdminPipelineSection
                  blogs={blogs.filter((b) => b.status === "pending_review")}
                  setBlogs={setBlogs}
                  onAction={(id) => {
                    // Update stats locally when action happens in pipeline
                    setStats((prev: any) => ({
                      ...prev,
                      pendingBlogs: Math.max(0, (prev?.pendingBlogs || 1) - 1),
                    }));
                  }}
                  onApproveSuccess={() => {
                    fetchData();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AuthModal
        isOpen={showLoginModal}
        onClose={() => router.push("/platform")}
        onSuccess={() => {
          setShowLoginModal(false);
          fetchData();
        }}
      />
    </div>
  );
}

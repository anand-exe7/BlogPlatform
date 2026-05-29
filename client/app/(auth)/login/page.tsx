"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ChevronRight, User, ArrowLeft } from "lucide-react";
import { authApi, handleApiError } from "@/lib/api";
import { GrainOverlay, GridPattern } from "@/components/background";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Registration successful! Please wait for admin approval before logging in.");
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.login(formData);
      const user = response.user;

      if (user.role === "admin") {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(user));
        }
        router.push("/admin/dashboard");
      } else {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(user));
        }
        router.push("/platform");
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      if (errorMessage.toLowerCase().includes("not approved")) {
        router.push("/pending");
      } else {
        setError(errorMessage || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-4 relative overflow-hidden">
      <GrainOverlay />
      <GridPattern />

      {/* Back to Home Link */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black font-black uppercase tracking-widest text-xs transition-colors z-20"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white/40 backdrop-blur-2xl border border-white/70 rounded-[3rem] shadow-[0_40px_80px_-25px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row min-h-[600px] z-10"
      >
        {/* Decorative Side Panel */}
        <div className="hidden md:flex w-[40%] bg-gradient-to-br from-[#f5b800] via-amber-500 to-orange-600 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] border-[20px] border-white rounded-full animate-pulse" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-inner border border-white/20"
            >
              <User size={48} strokeWidth={2.5} />
            </motion.div>
            <div className="space-y-4">
              <h3 className="font-black text-2xl uppercase tracking-[0.2em] leading-tight">CODE<br/>KRAFTER</h3>
              <p className="text-white/80 font-bold text-sm tracking-wide leading-relaxed">
                Unlock your creative vault and share your perspective with the world.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Welcome Back</h2>
            <p className="text-gray-500 font-bold text-lg">Sign in to continue your journey.</p>
          </div>

          <AnimatePresence mode="wait">
            {(error || successMessage) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-5 rounded-2xl text-sm font-bold mb-8 flex items-center gap-3 border ${
                  successMessage 
                  ? 'bg-green-500/10 border-green-500/20 text-green-600' 
                  : 'bg-red-500/10 border-red-500/20 text-red-600'
                }`}
              >
                <div className={`w-2 h-2 rounded-full animate-pulse ${successMessage ? 'bg-green-500' : 'bg-red-500'}`} />
                {error || successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f5b800] transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-white/50 border border-gray-200 text-gray-900 pl-14 pr-6 py-4.5 rounded-[1.5rem] focus:outline-none focus:border-[#f5b800] focus:ring-1 focus:ring-[#f5b800] transition-all placeholder:text-gray-400 font-bold text-base"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f5b800] transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full bg-white/50 border border-gray-200 text-gray-900 pl-14 pr-6 py-4.5 rounded-[1.5rem] focus:outline-none focus:border-[#f5b800] focus:ring-1 focus:ring-[#f5b800] transition-all placeholder:text-gray-400 font-bold text-base"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-8"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Unlock Account
                  <ChevronRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 font-bold mt-10">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#f5b800] hover:underline whitespace-nowrap">
              Initialize Profile
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f5b800]" />
    </div>}>
      <LoginForm />
    </Suspense>
  );
}


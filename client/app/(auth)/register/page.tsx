"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, GraduationCap, Briefcase, ChevronRight, ArrowLeft, Clock, Settings } from "lucide-react";
import { authApi, handleApiError } from "@/lib/api";
import { GrainOverlay, GridPattern } from "@/components/background";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    year: "1",
    domain: "",
    email: "",
    reg_no: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters!");
      setIsLoading(false);
      return;
    }

    try {
      await authApi.signup({
        name: form.name,
        email: form.email,
        regNo: form.reg_no,
        year: parseInt(form.year),
        department: form.domain, // Mapping domain to department for consistency with AuthModal logic
        username: form.name.toLowerCase().replace(/\s+/g, '_') + Math.floor(Math.random() * 1000), // Generate a fallback username
        password: form.password,
      });
      
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(handleApiError(err) || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
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
        className="relative w-full max-w-5xl bg-white/40 backdrop-blur-2xl border border-white/70 rounded-[3rem] shadow-[0_40px_80px_-25px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row min-h-[700px] z-10"
      >
        {/* Decorative Side Panel */}
        <div className="hidden md:flex w-[35%] bg-gradient-to-br from-[#f5b800] via-amber-500 to-orange-600 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] border-[20px] border-white rounded-full animate-pulse" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-inner border border-white/20"
            >
              <GraduationCap size={48} strokeWidth={2.5} />
            </motion.div>
            <div className="space-y-4">
              <h3 className="font-black text-2xl uppercase tracking-[0.2em] leading-tight">JOIN THE<br/>FORCE</h3>
              <p className="text-white/80 font-bold text-sm tracking-wide leading-relaxed">
                Start your journey as a Code Krafter. Create your identity and share your voice.
              </p>
            </div>
          </div>
        </div>

        {/* Register Form Panel */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-center max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Initialize Profile</h2>
            <p className="text-gray-500 font-bold text-base">Become part of the premium creative community.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-3 border bg-red-500/10 border-red-500/20 text-red-600"
              >
                <div className="w-2 h-2 rounded-full animate-pulse bg-red-500" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup icon={<User size={18}/>} name="name" placeholder="Full Name" value={form.name} onChange={handleInputChange} required />
              <InputGroup icon={<Mail size={18}/>} type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleInputChange} required />
              <InputGroup icon={<GraduationCap size={18}/>} name="reg_no" placeholder="Registration No" value={form.reg_no} onChange={handleInputChange} required />
              <InputGroup icon={<Settings size={18}/>} name="domain" placeholder="Department / Interest" value={form.domain} onChange={handleInputChange} required />
              
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f5b800] transition-colors">
                  <Clock size={18} />
                </div>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/50 border border-gray-200 text-gray-900 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#f5b800] focus:ring-1 focus:ring-[#f5b800] transition-all appearance-none font-bold text-sm h-[52px]"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup icon={<Lock size={18}/>} type="password" name="password" placeholder="Password" value={form.password} onChange={handleInputChange} required />
              <InputGroup icon={<Lock size={18}/>} type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleInputChange} required />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white py-4.5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Profile
                  <ChevronRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 font-bold mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#f5b800] hover:underline whitespace-nowrap">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function InputGroup({ icon, type = "text", ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f5b800] transition-colors">
        {icon}
      </div>
      <input
        type={type}
        className="w-full bg-white/50 border border-gray-200 text-gray-900 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#f5b800] focus:ring-1 focus:ring-[#f5b800] transition-all placeholder:text-gray-400 font-bold text-sm h-[52px]"
        {...props}
      />
    </div>
  );
}


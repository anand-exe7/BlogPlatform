import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  LayoutDashboard,
  PenTool,
  BookHeart,
  Settings,
  ChevronUp,
  ChevronDown,
  LogOut,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/types/blog";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (id: Section) => void;
  onLogout?: () => void;
  onLogin?: () => void;
  isLoggedIn?: boolean;
  userRole?: string;
  isSuperAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  onLogout,
  onLogin,
  isLoggedIn = true,
  userRole,
  isSuperAdmin,
}) => {
  const router = useRouter();
  const [isWrapped, setIsWrapped] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isAdmin = userRole === "admin";

  // Check if we are on a touch device/mobile to handle interactions differently
  useEffect(() => {
    let ticking = false;
    const checkMobile = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsMobile(window.innerWidth < 1024 || "ontouchstart" in window);
          ticking = false;
        });
        ticking = true;
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    {
      id: "home",
      label: "Feed",
      icon: <Globe size={24} strokeWidth={2.5} />,
      color: "bg-[#F2B200]",
      shadow: "shadow-[#F2B200]/40",
      activeShadow: "0 0 25px rgba(242, 178, 0, 0.5)",
    },
    {
      id: "dashboard",
      label: "Main",
      icon: <LayoutDashboard size={24} strokeWidth={2.5} />,
      color: "bg-[#101828]",
      shadow: "shadow-[#101828]/30",
      activeShadow: "0 0 25px rgba(16, 24, 40, 0.4)",
    },
    {
      id: "new",
      label: "Write",
      icon: <PenTool size={24} strokeWidth={2.5} />,
      color: "bg-[#101828]",
      shadow: "shadow-[#101828]/30",
      activeShadow: "0 0 25px rgba(16, 24, 40, 0.4)",
    },
    {
      id: "myblogs",
      label: "Library",
      icon: <BookHeart size={24} strokeWidth={2.5} />,
      color: "bg-[#101828]",
      shadow: "shadow-[#101828]/30",
      activeShadow: "0 0 25px rgba(16, 24, 40, 0.4)",
    },
    {
      id: "admin",
      label: "Approvals",
      icon: <ShieldCheck size={24} strokeWidth={2.5} />,
      color: "bg-amber-600",
      shadow: "shadow-amber-600/30",
      activeShadow: "0 0 25px rgba(217, 119, 6, 0.4)",
      adminOnly: true,
    },
    {
      id: "settings",
      label: "Config",
      icon: <Settings size={24} strokeWidth={2.5} />,
      color: "bg-zinc-600",
      shadow: "shadow-zinc-600/30",
      activeShadow: "0 0 25px rgba(82, 82, 91, 0.4)",
    },
  ].filter((item) => !item.adminOnly || isAdmin);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setIsWrapped(!isWrapped);
    }
  };

  return isMobile ? (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-3xl border-t border-white/90 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id || (item.id === "admin" && typeof window !== "undefined" && window.location.pathname.includes("/admin"));
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                if (item.id === "admin") {
                  router.push("/admin/dashboard");
                } else {
                  onSectionChange(item.id as Section);
                }
              }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <div className={`
                relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                ${isActive ? `${item.color} text-white shadow-lg` : "text-gray-400"}
              `}>
                {isActive && <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none"></div>}
                <div className={isActive ? "scale-100" : ""}>
                  {item.icon}
                </div>
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}

      </div>
    </nav>
  ) : (
    <aside
      className="fixed left-4 top-1/2 -translate-y-1/2 z-[100]"
      onMouseEnter={() => setIsWrapped(false)}
      onMouseLeave={() => setIsWrapped(true)}
    >
      <motion.div
        transition={{ type: "spring", damping: 22, stiffness: 180 }}
        className="flex flex-col items-center bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 overflow-hidden p-3 sm:p-4"
      >
        <AnimatePresence mode="popLayout">
          {!isWrapped && (
            <motion.div
              key="nav-content"
              initial={{ opacity: 0, height: 0, scale: 0.8 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="flex flex-col items-center gap-5 sm:gap-6 mb-5 sm:mb-6"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="absolute left-full ml-6 px-4 py-2 bg-[#101828] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 pointer-events-none translate-x-[-15px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 shadow-xl whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-[#101828]"></div>
                  </div>

                  <motion.button
                    onClick={() => {
                      if (item.id === "admin") {
                        router.push("/admin/dashboard");
                      } else {
                        onSectionChange(item.id as Section);
                      }
                    }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      relative w-12 h-12 sm:w-14 sm:h-14 rounded-[1.2rem] sm:rounded-[1.4rem] flex items-center justify-center transition-all duration-500
                      ${item.color} ${item.shadow} text-white shadow-xl
                      ${activeSection === item.id ? "ring-[4px] ring-white/90 scale-105" : "hover:brightness-110"}
                    `}
                    style={{
                      boxShadow: activeSection === item.id ? item.activeShadow : undefined,
                    }}
                  >
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none"></div>
                    <div className="absolute inset-[1px] rounded-[inherit] border border-white/20 pointer-events-none"></div>

                    <motion.div
                      animate={activeSection === item.id ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="scale-90 sm:scale-100"
                    >
                      {item.icon}
                    </motion.div>

                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-6 sm:w-2 sm:h-7 bg-[#101828] rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              ))}

            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          onClick={handleLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-pointer group"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            {isWrapped ? <ChevronUp size={8} strokeWidth={4} /> : <ChevronDown size={8} strokeWidth={4} />}
          </div>

          <motion.div
            animate={{ y: isWrapped ? 0 : [0, -2, 0] }}
            transition={isWrapped ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 sm:w-16 sm:h-16 relative flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              <rect width="100" height="100" rx="35" fill="#1A1A1A" />
              <path d="M22 36 H40 V44 H30 V56 H40 V64 H22 V36 Z" fill="white" />
              <path d="M46 36 H54 V48 L64 36 H73 L61 51 L74 64 H65 L54 53 V64 H46 V36 Z" fill="white" />
            </svg>
          </motion.div>

          {isWrapped && (
            <div className="absolute inset-0 bg-transparent rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-1 h-1 bg-[#F2B200] rounded-full absolute -bottom-1 sm:-bottom-2 animate-pulse" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </aside>
  );
};

export default Sidebar;

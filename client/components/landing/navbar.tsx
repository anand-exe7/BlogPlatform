"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Home, Globe, ExternalLink, Menu, X } from "lucide-react"

const TABS = [
  { name: "HOME", href: "/", icon: Home },
  { name: "BLOGS", href: "/blogs", icon: Globe },
  { name: "OUR CLUB", href: "https://www.codekrafters.tech/", icon: ExternalLink, external: true },
]

export function Navbar() {
  const pathname = usePathname()
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent py-6">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0B1220]">
              <Image 
                src="/ck_logo.svg" 
                alt="CodeKrafters Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-[#0B1220]">
              BLOG <span className="text-[#F2B200]">SITE</span>
            </span>
          </Link>

          {/* Center Navigation - Pill Shape */}
          <div className="hidden lg:block">
            <div 
              className="flex items-center gap-1 rounded-full bg-[#0B1220] p-1.5 shadow-2xl relative"
              onMouseLeave={() => setHoveredTab(null)}
            >
              {TABS.map((tab) => {
                const isActive = 
                  tab.href === "/" 
                    ? pathname === "/" 
                    : !tab.external && pathname?.startsWith(tab.href);
                
                const isSelected = hoveredTab === tab.href || (hoveredTab === null && isActive);
                const Icon = tab.icon;

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    target={tab.external ? "_blank" : undefined}
                    rel={tab.external ? "noopener noreferrer" : undefined}
                    onMouseEnter={() => setHoveredTab(tab.href)}
                    className={`relative flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] font-black tracking-widest transition-colors hover:scale-105 active:scale-95 ${
                      isSelected ? "text-[#0B1220]" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 rounded-full bg-[#F2B200] shadow-[0_0_20px_rgba(242,178,0,0.3)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      {tab.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="hidden sm:flex h-12 gap-2 rounded-xl bg-[#F2B200] px-8 text-[11px] font-black tracking-widest text-[#0B1220] shadow-lg shadow-[#F2B200]/20 transition-all hover:bg-[#F2B200]/90 hover:shadow-xl hover:shadow-[#F2B200]/30 active:scale-95 items-center"
            >
              LOG IN
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="flex lg:hidden h-12 w-12 items-center justify-center rounded-xl bg-[#0B1220] text-white active:scale-95 transition-transform"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-[calc(100%+1rem)] left-4 right-4 bg-[#0B1220] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] lg:hidden overflow-hidden"
          >
            <motion.div 
              className="flex flex-col p-4 space-y-2"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.05
                  }
                }
              }}
            >
              {TABS.map((tab) => {
                const isActive = 
                  tab.href === "/" 
                    ? pathname === "/" 
                    : !tab.external && pathname?.startsWith(tab.href);
                const Icon = tab.icon;

                return (
                  <motion.div
                    key={tab.href}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                  >
                    <Link
                      href={tab.href}
                      target={tab.external ? "_blank" : undefined}
                      rel={tab.external ? "noopener noreferrer" : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl font-black tracking-widest transition-all overflow-hidden ${
                        isActive 
                          ? "bg-[#F2B200] text-[#0B1220]" 
                          : "bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-[#F2B200] shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] pointer-events-none" />
                      )}
                      <span className="relative z-10 flex items-center gap-4 w-full">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${isActive ? 'bg-[#0B1220]/10' : 'bg-white/5 group-hover:bg-[#F2B200]/20 group-hover:text-[#F2B200]'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {tab.name}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                }}
              >
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex sm:hidden items-center justify-center gap-2 p-4 rounded-2xl bg-[#F2B200] text-[#0B1220] font-black tracking-widest mt-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(242,178,0,0.2)]"
                >
                  LOG IN
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

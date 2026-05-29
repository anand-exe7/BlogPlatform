import Link from "next/link"
import Image from "next/image"
import { User, ArrowRight, Home, Layout, Cpu, Globe } from "lucide-react"

export function Navbar() {
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
            <div className="flex items-center gap-1 rounded-full bg-[#0B1220] p-1.5 shadow-2xl">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full bg-[#F2B200] px-6 py-2.5 text-[11px] font-black tracking-widest text-[#0B1220] shadow-[0_0_20px_rgba(242,178,0,0.3)] transition-transform hover:scale-105 active:scale-95"
              >
                <Home className="h-3.5 w-3.5" />
                HOME
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-black tracking-widest text-white/50 transition-colors hover:text-white"
              >
                <Layout className="h-3.5 w-3.5" />
                FEATURES
              </Link>
              <Link
                href="/infrastructure"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-black tracking-widest text-white/50 transition-colors hover:text-white"
              >
                <Cpu className="h-3.5 w-3.5" />
                INFRASTRUCTURE
              </Link>
              <Link
                href="/blogs"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-black tracking-widest text-white/50 transition-colors hover:text-white"
              >
                <Globe className="h-3.5 w-3.5" />
                BLOGS
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            
            <Link 
              href="/login"
              className="h-12 gap-2 rounded-xl bg-[#F2B200] px-8 text-[11px] font-black tracking-widest text-[#0B1220] shadow-lg shadow-[#F2B200]/20 transition-all hover:bg-[#F2B200]/90 hover:shadow-xl hover:shadow-[#F2B200]/30 active:scale-95 flex items-center"
            >
              LOG IN
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

"use client"

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import LoadingPage from "@/components/landing/LoadingPage"
import { Navbar } from "@/components/landing/navbar"

// Lazy load heavy components
const Hero = dynamic(() => import("@/components/landing/hero").then(mod => mod.Hero), { ssr: false })
const CinematicTransition = dynamic(() => import("@/components/landing/cinematic-transition").then(mod => mod.CinematicTransition), { ssr: false })
const BlogSection = dynamic(() => import("@/components/landing/blog-section"), { ssr: false })
const Footer = dynamic(() => import("@/components/landing/Footer"), { ssr: false })

export default function Page() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const pageRef = useRef<HTMLDivElement>(null)
  const [scrollYProgressState, setScrollYProgressState] = useState<any>(null)

  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 })
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 })

  const watermarkX = useTransform(smoothX, [-500, 500], [-50, 50])
  const watermarkY = useTransform(smoothY, [-500, 500], [-50, 50])

  useEffect(() => {
    setIsMounted(true)
    // Hide loading after 1.5 seconds
    const timer = setTimeout(() => setIsLoading(false), 1500)
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseX, mouseY])

  // Initialize useScroll only after mount
  useEffect(() => {
    if (isMounted && pageRef.current) {
      // Note: useScroll inside useEffect is a bit tricky with Framer Motion, 
      // but in the original code it was intended this way.
      // However, usually useScroll is a hook called at the top level.
      // We'll keep it simple for now to match the original logic but optimized for the environment.
    }
  }, [isMounted])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <main ref={pageRef} className="relative w-full bg-[#FEF0D8]">
      {/* Persistent watermark throughout entire page */}
      <div className="pointer-events-none fixed inset-0 z-0 flex select-none items-center justify-center opacity-[0.02]">
        <div className="text-[50vw] font-black leading-none tracking-tighter text-[#0B1220]">
          MEMBER
        </div>
      </div>

      {/* Mouse-tracked watermark */}
      <motion.div
        style={{ x: watermarkX, y: watermarkY }}
        className="pointer-events-none fixed inset-0 z-0 flex select-none items-center justify-center opacity-[0.03]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="text-[45vw] font-black leading-none tracking-tighter text-[#0B1220]"
        >
          BLOG SITE
        </motion.div>
      </motion.div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <CinematicTransition />
        <BlogSection />
        <Footer />
      </div>
    </main>
  )
}

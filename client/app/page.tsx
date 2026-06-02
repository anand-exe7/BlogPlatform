"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import LoadingPage from "@/components/landing/LoadingPage"
import { Navbar } from "@/components/landing/navbar"

// Lazy load heavy components
const Hero = dynamic(() => import("@/components/landing/hero").then(mod => mod.Hero), { ssr: false })
const CinematicTransition = dynamic(() => import("@/components/landing/cinematic-transition").then(mod => mod.CinematicTransition), { ssr: false })
const BlogSection = dynamic(() => import("@/components/landing/blog-section"), { ssr: false })
const Footer = dynamic(() => import("@/components/landing/Footer"), { ssr: false })

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <main className="relative w-full bg-[#FEF0D8]">
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

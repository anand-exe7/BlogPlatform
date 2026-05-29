"use client"

import { motion, useScroll, useSpring, AnimatePresence, useVelocity } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { ArrowRight, PenTool, Eye, Send } from "lucide-react"

const FEATURES = [
  {
    title: "Write Freely",
    description: "Draft blogs with a clean editor built for long-form thinking and creative flow.",
    image: "/minimalist-writing-interface.jpg",
    icon: PenTool,
  },
  {
    title: "Review Together",
    description: "Review with leads get their feedback incorporated seamlessly before publishing.",
    image: "/team-collaboration-review.jpg",
    icon: Eye,
  },
  {
    title: "Publish with Intent",
    description: "Blogs go live for everyone to read, engage, and share with the world.",
    image: "/digital-publishing-launch.jpg",
    icon: Send,
  },
]

export default function BlogLoopSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scrollVelocity = useVelocity(scrollYProgress)
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30,
  })

  useEffect(() => {
    let lastTime = performance.now()
    let currentProgress = 0
    const baseDuration = 4000 // ms per cycle

    const update = (now: number) => {
      const deltaTime = now - lastTime
      lastTime = now

      const velocity = Math.abs(smoothVelocity.get())
      const speedMultiplier = 1 + velocity * 10 // Adjust sensitivity

      currentProgress += (deltaTime * speedMultiplier) / baseDuration

      if (currentProgress >= 1) {
        currentProgress = 0
        setActiveIndex((prev) => (prev + 1) % FEATURES.length)
      }

      setProgress(currentProgress)
      requestAnimationFrame(update)
    }

    const raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [smoothVelocity])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-[#FEF0D8] flex flex-col md:flex-row items-center px-6 md:px-24 py-20 overflow-hidden"
    >
      {/* LEFT CONTENT */}
      <div className="w-full md:w-1/2 space-y-12 z-20 mb-16 md:mb-0">
        <div className="space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#F2B200] font-mono text-sm tracking-[0.3em] uppercase"
          >
            Workflow
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter text-[#0B1220] uppercase"
          >
            Explore <br />
            <span className="text-[#F2B200] italic">Blogs</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-[#0B1220]/60 max-w-md leading-relaxed"
        >
          Experience a focused writing → review → publish workflow designed for modern editorial teams.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="group relative flex items-center gap-6 px-12 py-6 bg-[#0B1220] text-white font-black rounded-full text-lg uppercase tracking-widest overflow-hidden transition-transform hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">Explore Now</span>
          <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          <div className="absolute inset-0 bg-[#F2B200] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* RIGHT ANIMATED AREA */}
      <div className="relative w-full md:w-1/2 h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[380px] h-[520px] border-2 border-[#0B1220]/5 rounded-[3rem] rotate-6 translate-x-8 translate-y-8" />
          <div className="w-[380px] h-[520px] border-2 border-[#0B1220]/5 rounded-[3rem] rotate-3 translate-x-4 translate-y-4" />
          <div className="w-[380px] h-[520px] border-2 border-[#0B1220]/5 rounded-[3rem] -rotate-3 -translate-x-4 -translate-y-4" />
        </div>

        <AnimatePresence mode="wait">
          <FeatureCard key={activeIndex} feature={FEATURES[activeIndex]} index={activeIndex} />
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-[500px] h-[600px] -rotate-90 opacity-20">
            <motion.circle
              cx="250"
              cy="300"
              r="280"
              fill="none"
              stroke="#0B1220"
              strokeWidth="2"
              strokeDasharray="1 10"
              style={{ pathLength: progress }}
            />
          </svg>
        </div>
      </div>

      {/* PROGRESS INDICATOR */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-4 items-end">
        <div className="flex gap-3">
          {FEATURES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                i === activeIndex ? "w-12 bg-[#0B1220]" : "w-4 bg-[#0B1220]/20"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B1220]/40">
          Step 0{activeIndex + 1} / 0{FEATURES.length}
        </span>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: (typeof FEATURES)[0]; index: number }) {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ x: 200, opacity: 0, rotate: 15, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
      exit={{ x: -200, opacity: 0, rotate: -15, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
        mass: 1.2,
      }}
      className="absolute w-[340px] md:w-[400px] h-[540px] bg-white border-[10px] border-[#0B1220]
                 rounded-[3rem] shadow-[32px_32px_0px_0px_rgba(11,18,32,0.1)]
                 overflow-hidden flex flex-col z-10"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-[55%] overflow-hidden group">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 5, ease: "easeOut" }}
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-8 right-8 w-16 h-16 bg-[#F2B200] border-[6px] border-[#0B1220] rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-xl">
          <Icon className="w-8 h-8 text-[#0B1220]" />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-12 flex flex-col justify-between flex-grow bg-white">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-black tracking-[0.5em] uppercase text-[#F2B200]">Phase 0{index + 1}</span>
            <div className="h-[2px] w-12 bg-[#0B1220]/10 rounded-full" />
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-[#0B1220] leading-none mb-6 uppercase tracking-tight">
            {feature.title}
          </h3>
          <p className="text-[#0B1220]/70 text-base md:text-lg leading-relaxed font-medium">{feature.description}</p>
        </div>

        <div className="flex justify-between items-end pt-6 border-t-2 border-[#0B1220]/5">
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
            className="w-12 h-12 rounded-full bg-black flex items-center justify-center border-2 border-[#F2B200]"
          >
            <img className="w-6 h-6 text-[#0B1220] bg-black fill" src="ck_logo.svg"/>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

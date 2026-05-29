"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { PenTool, FileText, BookOpen, Send, Layout, Layers, Zap, MousePointer2 } from "lucide-react"
import TextLine from "./TextLine"
import FloatingGlyph from "./FloatingGlyph"

const FLOATING_ELEMENTS = [
  { icon: PenTool, letter: "W", x: -300, y: -200, rotate: -15, scale: 1.1, delay: 0 },
  { icon: FileText, letter: "R", x: 320, y: -180, rotate: 20, scale: 1.3, delay: 0.1 },
  { icon: BookOpen, letter: "P", x: -350, y: 220, rotate: -25, scale: 1.2, delay: 0.2 },
  { icon: Send, letter: "S", x: 380, y: 250, rotate: 30, scale: 1.4, delay: 0.15 },
  { icon: Layout, letter: "L", x: -180, y: -300, rotate: 10, scale: 1, delay: 0.05 },
  { icon: Layers, letter: "A", x: 220, y: 320, rotate: -10, scale: 1.15, delay: 0.25 },
  { icon: Zap, letter: "Z", x: -400, y: 50, rotate: 45, scale: 0.9, delay: 0.3 },
  { icon: MousePointer2, letter: "I", x: 380, y: -100, rotate: -35, scale: 1.25, delay: 0.08 },
]

export function CinematicTransition() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 70 })
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 70 })
  const watermarkX = useTransform(smoothMouseX, [-500, 500], [-40, 40])
  const watermarkY = useTransform(smoothMouseY, [-500, 500], [-40, 40])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 25,
    damping: 25,
    restDelta: 0.002,
  })

  const opacity = useTransform(smoothProgress, [0.05, 0.15, 0.2, 0.25], [0, 1, 1, 0])
  const scale = useTransform(smoothProgress, [0.05, 0.15, 0.25], [0.5, 1, 0.5])
  const rotate = useTransform(smoothProgress, [0.05, 0.25], [0, -20])
  const y = useTransform(smoothProgress, [0.05, 0.15], [40, 0])
  const filter = useTransform(
    smoothProgress,
    [0.05, 0.12, 0.2, 0.25],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(15px)"],
  )

  useEffect(() => {
    setIsMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  if (!isMounted) {
    return <section className="relative h-[1200vh] bg-[#FEF0D8]" ref={containerRef} />
  }

  return (
    <section ref={containerRef} className="relative h-[1200vh] bg-[#FEF0D8]">
      {/* Watermark */}
      <motion.div
        style={{ x: watermarkX, y: watermarkY }}
        className="pointer-events-none fixed inset-0 z-0 flex select-none items-center justify-center opacity-[0.02]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="text-[40vw] font-black leading-none tracking-tighter text-[#0B1220]"
        >
          BLOG
        </motion.div>
      </motion.div>

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40">
          <div className="space-y-4 md:space-y-8 max-w-6xl px-4 flex flex-col items-center">
            <TextLine text="A growing library of" progress={smoothProgress} range={[0.4, 0.55]} speed={1.4} />
            <div className="flex flex-wrap items-baseline justify-center gap-1 md:gap-2">
              <TextLine text="Member" progress={smoothProgress} range={[0.55, 0.68]} speed={1} isAnchor isYellow />
              <TextLine text="-written blogs" progress={smoothProgress} range={[0.55, 0.68]} speed={1} isAnchor />
            </div>
            <TextLine text="published with intent" progress={smoothProgress} range={[0.68, 0.81]} speed={0.6} />
          </div>
        </div>

        <div className="relative z-30 flex items-center justify-center">
          <motion.div
            style={{
              opacity,
              scale,
              rotate,
              y,
              filter,
            }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="flex items-baseline gap-2 md:gap-4 text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-[#0B1220]"
            >
              <span className="font-[950] tracking-[-0.05em] flex uppercase leading-none">
                <span className="text-[#0B1220]">C</span>
                <span className="text-[#F2B200]">K</span>
              </span>
              <span className="text-2xl md:text-5xl lg:text-7xl font-bold tracking-normal opacity-80">BlogSite</span>
            </motion.div>
          </motion.div>

          {FLOATING_ELEMENTS.map((item, index) => (
            <FloatingGlyph
              key={index}
              icon={item.icon}
              letter={item.letter}
              x={item.x}
              y={item.y}
              rotate={item.rotate}
              scale={item.scale}
              progress={smoothProgress}
              delay={item.delay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

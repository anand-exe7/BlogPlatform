"use client"

import { motion, useTransform } from "framer-motion"

export default function FloatingGlyph({ icon: Icon, letter, x, y, rotate, scale, progress, delay }: any) {
  const scatterProgress = useTransform(progress, [0.12, 0.4], [0, 1])
  const glyphProgress = useTransform(scatterProgress, [delay * 0.5, Math.min(delay * 0.5 + 0.5, 1)], [0, 1])

  // Motion transforms for the "scatter from center" effect
  const translateX = useTransform(glyphProgress, [0, 0.4, 1], [0, x * 1.2, x])
  const translateY = useTransform(glyphProgress, [0, 0.4, 1], [0, y * 1.2, y])

  const rotation = useTransform(glyphProgress, [0, 0.6, 1], [0, rotate * 1.5, rotate])

  const scaleAnim = useTransform(glyphProgress, [0, 0.4, 1], [0, scale * 1.4, scale])

  // Floating effect for empty space
  const floatY = useTransform(progress, [0.45, 1], [0, Math.sin(delay * 20) * 30])
  const floatRotate = useTransform(progress, [0.45, 1], [0, Math.cos(delay * 15) * 15])

  return (
    <motion.div
      style={{
        x: translateX,
        y: useTransform([translateY, floatY], ([ty, fy]) => (ty as number) + (fy as number)),
        rotate: useTransform([rotation, floatRotate], ([r, fr]) => (r as number) + (fr as number)),
        scale: scaleAnim,
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -32,
        marginTop: -32,
        transformStyle: "preserve-3d",
      }}
      className="z-10"
    >
      <motion.div
        style={{
          opacity: useTransform(glyphProgress, [0, 0.2], [0, 1]),
        }}
        className="relative p-4 bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-[#0B1220]/15 shadow-[30px_30px_80px_-15px_rgba(11,18,32,0.25)]"
      >
        {/* Breathing Animation Wrapper */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: delay * 2,
          }}
          className="relative flex items-center justify-center w-10 h-10"
        >
          <Icon className="w-8 h-8 text-[#0B1220]" strokeWidth={2.5} />
          <span className="absolute -top-6 -right-6 text-5xl font-black text-[#0B1220]/5 select-none pointer-events-none italic">
            {letter}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

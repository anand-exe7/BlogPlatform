"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const heroItems = [
  {
    word: "Write.",
    color: "text-[#0B1220]",
  },
  {
    word: "Refine.",
    color: "text-[#F2B200]",
    tilted: true,
  },
  {
    word: "Publish.",
    color: "text-[#0B1220]",
  },
];

function SkidDust({ delay }: { delay: number }) {
  return (
    <div className="absolute bottom-2 left-0 h-1.5 w-full lg:bottom-4">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            x: [0, (i + 1) * 15, (i + 1) * 20],
            y: [0, -5, 2],
            scale: [0, 1.5, 0.5],
          }}
          transition={{
            duration: 0.5,
            delay: delay + 0.6 + i * 0.02,
            ease: "easeOut",
          }}
          className="absolute h-1 w-1 rounded-full bg-[#0B1220]/40 blur-[1px]"
          style={{ left: `${i * 15}%` }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0, 1.2, 0.8], x: [0, 20, 30] }}
        transition={{
          duration: 0.4,
          delay: delay + 0.6,
          ease: "easeOut",
        }}
        className="h-full w-full origin-left rounded-full bg-[#0B1220]/20 blur-[2px]"
      />
    </div>
  );
}

function UnscrambleText({ word }: { word: string }) {
  const [hovered, setHovered] = useState(false);

  // Pre-generate random values so they don't change on re-render
  const randomValues = word.split("").map((_, i) => ({
    yOffset: Math.random() * 50 - 25,
    xOffset: Math.random() * 40 - 20,
    rotationOffset: Math.random() * 120 - 60,
  }));

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block cursor-pointer"
      whileHover={{ scale: 1.05 }}
    >
      {word.split("").map((char, i) => (
        <motion.span
          key={i}
          animate={
            hovered
              ? {
                  y: [
                    0,
                    randomValues[i].yOffset,
                    randomValues[i].yOffset * 0.3,
                    0,
                  ],
                  x: [
                    0,
                    randomValues[i].xOffset,
                    randomValues[i].xOffset * 0.4,
                    0,
                  ],
                  rotate: [
                    0,
                    randomValues[i].rotationOffset,
                    randomValues[i].rotationOffset * 0.5,
                    0,
                  ],
                  opacity: [1, 0.3, 0.6, 1],
                  scaleX: [1, 0.5, 1.2, 1],
                  scaleY: [1, 1.4, 0.8, 1],
                }
              : { y: 0, x: 0, rotate: 0, opacity: 1, scaleX: 1, scaleY: 1 }
          }
          transition={{
            duration: 0.7,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse interaction
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  // Parallax transforms
  const paperRotate = useTransform(smoothX, [-500, 500], [-12, -4]);
  const paperX = useTransform(smoothX, [-500, 500], [-20, 20]);
  const paperY = useTransform(smoothY, [-500, 500], [-20, 20]); // Centered around the 0 initial position
  const watermarkX = useTransform(smoothX, [-500, 500], [-50, 50]);
  const watermarkY = useTransform(smoothY, [-500, 500], [-50, 50]);

  const logoX = useTransform(smoothX, [-500, 500], [20, -20]);
  const logoY = useTransform(smoothY, [-500, 500], [20, -20]);

  const paperBackground = useTransform(
    smoothX,
    [-500, 500],
    [
      "radial-gradient(circle at 0% 0%, rgba(242,178,0,0.1) 0%, transparent 50%)",
      "radial-gradient(circle at 100% 0%, rgba(242,178,0,0.1) 0%, transparent 50%)",
    ],
  );

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FEF0D8] px-6 pt-32 pb-20 lg:flex-row lg:px-20 lg:pt-0">
      {/* Dynamic Watermark */}
      <motion.div
        style={{ x: watermarkX, y: watermarkY }}
        className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center opacity-[0.03]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 150,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="text-[45vw] font-black leading-none tracking-tighter text-[#0B1220]"
        >
          BLOG SITE
        </motion.div>
      </motion.div>

      {/* Left Side: Hero Words */}
      <div className="relative z-20 flex flex-1 flex-col items-start justify-center text-left lg:items-center">
        <div className="flex flex-col items-start lg:items-center">
          {heroItems.map((item, idx) => (
            <motion.div
              key={idx}
              className="relative mb-4 flex flex-col items-start lg:mb-6 lg:items-center"
              animate={{ y: [0, -4, 0], opacity: [1, 0.95, 1] }}
              transition={{
                duration: 3 + idx * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: idx * 0.3,
              }}
            >
              <motion.h1
                initial={{ x: "-120vw", filter: "blur(20px)" }}
                animate={{ x: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.9,
                  delay: idx * 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  relative z-10 cursor-default text-[20vw] font-black leading-[0.85] tracking-tighter sm:text-[16vw] lg:text-[10vw]
                  ${item.color}
                  ${item.tilted ? "-rotate-[6deg] lg:-rotate-[4deg] translate-x-[-2vw] translate-y-[2vw]" : ""}
                `}
              >
                {item.tilted ? <UnscrambleText word={item.word} /> : item.word}
                <SkidDust delay={idx * 0.4} />
              </motion.h1>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side: Blog Visual & Logo Depth */}
      <div className="relative flex flex-1 items-center justify-center pt-20 lg:pt-0">
        {/* Layered Logo Interaction */}
        <motion.div
          style={{ x: logoX, y: logoY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 blur-[2px] lg:opacity-20 lg:blur-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="flex flex-col items-center rotate-[-12deg]"
          >
            <div className="relative flex h-40 w-40 items-center justify-center lg:h-80 lg:w-80">
              <div className="absolute inset-0 bg-[#0B1220] [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]" />
              <span className="relative z-10 text-4xl font-black text-[#FEF0D8] lg:text-8xl">
                B
              </span>
            </div>
            <span className="mt-4 text-4xl font-black tracking-tighter text-[#0B1220] lg:text-8xl">
              BLOG
            </span>
          </motion.div>
        </motion.div>

        {/* Landing Shockwave (Triggers when paper hits) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 4], opacity: [0.5, 0] }}
          transition={{ delay: 2.3, duration: 1, ease: "easeOut" }}
          className="absolute h-40 w-40 rounded-full border-4 border-[#F2B200]/30"
        />

        {/* Blog Article Visual (Physical Mouse-reactive Paper) */}
        <motion.div
          style={{ rotate: paperRotate, x: paperX, y: paperY }}
          initial={{
            y: "-120vh",
            rotate: -30,
            scale: 0.5,
            filter: "blur(10px)",
          }}
          animate={{ y: 0, rotate: -8, scale: 1, filter: "blur(0px)" }}
          transition={{
            y: {
              duration: 1.2,
              delay: 2.2,
              ease: [0.23, 1, 0.32, 1],
              type: "spring",
              damping: 12,
              stiffness: 70,
            },
            rotate: { duration: 1.5, delay: 2.2 },
            scale: { duration: 0.8, delay: 2.2 },
            filter: { duration: 1.2, delay: 2.2 },
          }}
          className="relative z-30 w-[280px] overflow-hidden rounded-[2px] bg-white p-5 shadow-[30px_30px_80px_-15px_rgba(11,18,32,0.2)] sm:w-[340px] lg:w-[360px] lg:p-7"
        >
          <motion.div
            style={{
              background: paperBackground,
            }}
            className="absolute inset-0 z-40 pointer-events-none"
          />

          <div className="mb-4 flex flex-wrap gap-2 lg:mb-6">
            {["EDITORIAL", "FUTURE"].map((tag) => (
              <span
                key={tag}
                className="bg-[#0B1220] px-2 py-0.5 text-[10px] font-black tracking-widest text-white"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[#0B1220] lg:mb-6 lg:text-4xl">
            The Art of Building Simple.
          </h2>

          <div className="relative mb-4 aspect-video w-full overflow-hidden bg-[#FEF0D8] lg:mb-6">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <Image
              src="/abstract-editorial-graphic.jpg"
              alt="Editorial Art"
              fill
              className="object-cover mix-blend-multiply opacity-80"
            />
          </div>

          <div className="flex items-center gap-4 border-t border-[#0B1220]/10 pt-4 lg:pt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 3.2, type: "spring" }}
              className="h-10 w-10 rounded-full bg-[#F2B200]"
            />
            <div className="flex flex-col gap-1">
              <div className="h-2 w-24 bg-[#0B1220]/10 rounded" />
              <div className="h-2 w-16 bg-[#0B1220]/5 rounded" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grainy Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-50 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </section>
  );
}

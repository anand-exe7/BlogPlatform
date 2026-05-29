'use client';

import { motion } from 'framer-motion';

export function GrainOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[5] opacity-[0.03] mix-blend-multiply"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
    />
  );
}

export function GridPattern() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#f8f7f4] via-transparent to-transparent opacity-90" />
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SlotCounterProps {
  value: number;
}

interface DigitProps {
  digit: number;
  play: boolean;
  delay: number;
}

function Digit({ digit, play, delay }: DigitProps) {
  return (
    <div className="relative h-[1.2em] w-[0.8em] overflow-hidden rounded-md bg-[#1a1a1a] text-white shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent z-10 pointer-events-none" />
      <motion.div
        initial={{ y: 0 }}
        animate={play ? { y: -digit * 10 + '%' } : { y: 0 }}
        transition={{ 
          duration: 1.5, 
          ease: [0.22, 1, 0.36, 1], 
          delay 
        }}
        className="absolute top-0 left-0 w-full flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d} className="h-[100%] w-full flex items-center justify-center font-bold">
            {d}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function SlotCounter({ value }: SlotCounterProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  const chars = value.toLocaleString().split('');

  return (
    <div ref={elementRef} className="flex items-center gap-[1px] font-mono">
      {chars.map((char, i) => (
        /\d/.test(char) 
          ? <Digit key={i} digit={parseInt(char)} play={isInView} delay={i * 0.1} />
          : <span key={i} className="text-current opacity-60 font-bold mx-1">{char}</span>
      ))}
    </div>
  );
}

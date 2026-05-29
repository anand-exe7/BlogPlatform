'use client';

import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, PenTool } from 'lucide-react';
import Link from 'next/link';
import { GrainOverlay, GridPattern } from '@/components/background';
import BlogFeed from '@/components/BlogFeed';

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-gray-900 selection:bg-[#f5b800] selection:text-white overflow-x-hidden relative">
      <GrainOverlay />
      <GridPattern />
      
      {/* Public Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">CodeKrafter</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-xl font-black text-sm text-gray-500 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-black text-white rounded-xl font-black text-sm shadow-xl hover:shadow-gray-200 transition-all flex items-center gap-2"
            >
              <PenTool size={16} /> Join Club
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full flex flex-col items-center pt-32 pb-24 px-4 md:px-8">
        <div className="w-full max-w-7xl">
          {/* Header Intro */}
          <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-8"
             >
               <div className="w-2 h-2 rounded-full bg-[#f5b800]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Open Access Portal</span>
             </motion.div>
             
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900 mb-8"
             >
               THE PUBLIC <br />
               <span className="text-amber-600">STORYBOARD.</span>
             </motion.h1>
             
             <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="max-w-2xl text-xl text-gray-500 font-medium leading-relaxed"
             >
               Explore the collective mind of the Code Krafters community. 
               Insights, tutorials, and stories from the bridge of the digital frontier.
             </motion.p>
          </div>

          <BlogFeed />
        </div>
      </main>

      {/* Decorative Footer Detail */}
      <footer className="relative z-10 py-12 border-t border-gray-100 flex flex-col items-center gap-6">
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          <span>Design</span>
          <span>•</span>
          <span>Stories</span>
          <span>•</span>
          <span>Code</span>
        </div>
        <p className="text-xs font-bold text-gray-300">© 2024 CODE KRAFTERS CLUB</p>
      </footer>
    </div>
  );
}

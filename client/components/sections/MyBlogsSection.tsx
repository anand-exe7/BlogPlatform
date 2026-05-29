// Save this as: components/sections/BlogSections.tsx
// This replaces HomeSection.tsx and MyBlogsSection.tsx

'use client';

import { motion, LayoutGroup, AnimatePresence, Variants } from 'framer-motion';
import { Home, PenTool, BookHeart } from 'lucide-react';
import { Post, Section } from '@/types/blog';
import PostCard from '../PostCard';

// Enhanced animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9,
    rotateX: -15
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  exit: { 
    opacity: 0, 
    y: -30,
    scale: 0.9,
    rotateX: 15,
    transition: {
      duration: 0.2
    }
  }
};

// Home Section Component
interface HomeSectionProps {
  posts: Post[];
  likedPosts: Set<string>;
  handleLike: (id: string) => void;
  handlePostClick: (post: Post) => void;
  setActiveSection: (section: Section) => void;
}

export function HomeSection({ 
  posts, 
  likedPosts, 
  handleLike, 
  handlePostClick,
  setActiveSection 
}: HomeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-7xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-gray-900 flex items-center gap-4"
        >
          <motion.div whileHover={{ rotate: 360, scale: 1.15 }} transition={{ duration: 0.55 }}>
            <Home className="text-[#f5b800] w-8 h-8 md:w-10 md:h-10" />
          </motion.div>
          All Blogs
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.08, rotate: 6 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveSection('new')}
          className="px-5 py-3 rounded-2xl bg-black text-white font-black shadow-lg inline-flex items-center gap-3"
        >
          <PenTool size={18} /> Write
        </motion.button>
      </div>

      <LayoutGroup>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
          style={{ perspective: 1000 }}
        >
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                layout
              >
                <PostCard
                  post={post}
                  isLiked={likedPosts.has(post.id)}
                  onLike={handleLike}
                  onClick={() => handlePostClick(post)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
}

// My Blogs Section Component
interface MyBlogsSectionProps {
  myPosts: Post[];
  likedPosts: Set<string>;
  handleLike: (id: string) => void;
  handlePostClick: (post: Post) => void;
  handleDeletePost: (id: string) => void;
  setActiveSection: (section: Section) => void;
}

export function MyBlogsSection({ 
  myPosts, 
  likedPosts, 
  handleLike, 
  handlePostClick,
  handleDeletePost,
  setActiveSection 
}: MyBlogsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.4 }}
      className="w-full max-w-7xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-gray-900 flex items-center gap-4"
        >
          <BookHeart className="text-[#f5b800] w-8 h-8 md:w-10 md:h-10" />
          My Library
        </motion.h1>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          onClick={() => setActiveSection('new')}
          className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg"
        >
          <PenTool size={20} />
        </motion.button>
      </div>

      <LayoutGroup>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
          style={{ perspective: 1000 }}
        >
          <AnimatePresence mode="popLayout">
            {myPosts.length > 0 ? (
              myPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  layout
                >
                  <PostCard
                    post={post}
                    isLiked={likedPosts.has(post.id)}
                    onLike={handleLike}
                    onClick={() => handlePostClick(post)}
                    showDelete
                    onDelete={() => handleDeletePost(post.id)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 opacity-50 col-span-full"
              >
                <p className="text-2xl font-bold">No stories yet.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
}

export default { HomeSection, MyBlogsSection };
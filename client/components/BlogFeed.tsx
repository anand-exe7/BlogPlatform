'use client';

import { useState, useEffect } from 'react';
import { motion, LayoutGroup, AnimatePresence, Variants } from 'framer-motion';
import { Home, Search, Filter } from 'lucide-react';
import { Post } from '@/types/blog';
import PostCard from './PostCard';
import BlogDetailModal from './BlogDetailModal';
import { blogApi, interactionApi } from '@/lib/api';
import { useApi } from '@/lib/hooks';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function BlogFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: fetchedPosts, loading } = useApi(() => blogApi.getAllPosts(), []);

  useEffect(() => {
    if (fetchedPosts && Array.isArray(fetchedPosts)) {
      // Initialize liked posts state from backend userLiked property
      const likedIds = new Set<string>();
      fetchedPosts.forEach((p: any) => {
        if (p.userLiked) {
          likedIds.add(p.id);
        }
      });
      setLikedPosts(likedIds);

      setPosts(fetchedPosts.map((p: any) => ({
        id: p.id,
        title: p.title,
        subtitle: p.excerpt || '',
        content: p.content || '',
        coverImage: p.image || p.coverImage || 'https://images.unsplash.com/photo-1499750789039-ca2a2f92c815?w=800&h=400&fit=crop',
        author: p.author?.name || 'Unknown',
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : new Date().toLocaleDateString(),
        tags: p.tags?.map((t: any) => t.tag?.name || t.name) || [],
        status: p.status || 'published',
        likes: p._count?.likes || 0,
        comments: p._count?.comments || 0,
        views: p.viewCount || 0,
      })));
    }
  }, [fetchedPosts]);

  const handleLike = async (id: string) => {
    try {
      const result = await interactionApi.toggleLike(id);
      const newLiked = new Set(likedPosts);
      if (result.liked) newLiked.add(id);
      else newLiked.delete(id);
      setLikedPosts(newLiked);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: result.count } : p));
    } catch (err) {
      console.error('Failed to like:', err);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading Feed...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 flex items-center gap-4">
          <Home className="text-[#f5b800] w-8 h-8 md:w-10 md:h-10" />
          Public Feed
        </h1>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-md border border-white rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all font-medium"
          />
        </div>
      </div>

      <LayoutGroup>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants} layout>
                <PostCard
                  post={post}
                  isLiked={likedPosts.has(post.id)}
                  onLike={handleLike}
                  onClick={() => setSelectedPost(post)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {selectedPost && (
        <BlogDetailModal
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          onLike={() => handleLike(selectedPost.id)}
          isLiked={likedPosts.has(selectedPost.id)}
        />
      )}
    </div>
  );
}

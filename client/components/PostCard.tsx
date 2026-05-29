'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Trash2 } from 'lucide-react';
import { Post } from '@/types/blog';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onDelete?: () => void;
  onLike: (id: string) => void;
  isLiked: boolean;
  showDelete?: boolean;
}

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  ({ post, onClick, onDelete, onLike, isLiked, showDelete = false }, ref) => {
    return (
      <motion.div
        ref={ref}
        layoutId={`card-container-${post.id}`}
        key={post.id}
        whileHover={{ 
          scale: 1.02, 
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
          y: -8
        }}
        onClick={onClick}
        className="bg-white/60 backdrop-blur-md p-4 md:p-6 rounded-[2rem] border border-white/50 shadow-sm cursor-pointer group relative overflow-hidden flex flex-col gap-4 will-change-transform"
        transition={{ 
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <motion.div 
          className="absolute -inset-40 bg-gradient-to-tr from-[#f5b800]/20 via-amber-200/10 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 pointer-events-none"
          transition={{ duration: 0.6 }}
        />
        
        {/* Image Section */}
        <motion.div 
          layoutId={`card-image-${post.id}`} 
          className="w-full aspect-[16/9] rounded-[1.5rem] overflow-hidden shadow-md relative z-10 bg-gray-100"
        >
          <motion.img 
            src={post.image || post.coverImage} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt={post.title}
            onError={(e) => { 
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=500&fit=crop"; 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        
        {/* Content Section */}
        <div className="flex-1 flex flex-col items-start gap-3 relative z-10">
          {/* Status Badge */}
          {post.status && post.status !== 'published' && (
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
              post.status === 'pending_review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
              post.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
              'bg-gray-50 text-gray-600 border-gray-100'
            }`}>
              {post.status.replace('_', ' ')}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-gray-100 group-hover:bg-[#f5b800] group-hover:text-white transition-colors duration-300 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>

          <motion.h3 
            layoutId={`card-title-${post.id}`} 
            className="text-xl md:text-2xl font-black text-gray-900 leading-tight group-hover:text-[#f5b800] transition-colors duration-300 line-clamp-2"
          >
            {post.title}
          </motion.h3>
          
          <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">
            {post.subtitle}
          </p>
          
          <div className="w-full h-px bg-gray-100 mt-auto mb-2 group-hover:bg-gray-200 transition-colors" />
          
          <div className="flex items-center justify-between w-full text-xs md:text-sm font-bold text-gray-400">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f5b800] to-amber-500 flex items-center justify-center text-white text-[10px]">
                {post.author.charAt(0)}
              </div>
              <span className="truncate max-w-[100px]">{post.author}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                className="flex items-center gap-1 hover:text-rose-500 transition-colors group/like"
              >
                <Heart 
                  size={14} 
                  className={`transition-all duration-300 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'group-hover/like:text-rose-500'}`}
                /> 
                <span className="tabular-nums">{post.likes}</span>
              </button>
              <span className="flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                <Eye size={14} /> <span className="tabular-nums">{post.views}</span>
              </span>
            </div>
          </div>
        </div>

        {showDelete && onDelete && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, backgroundColor: '#fee2e2', color: '#ef4444' }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur border border-red-200 text-red-500 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            title="Delete Blog"
          >
            <Trash2 size={16} />
          </motion.button>
        )}
      </motion.div>
    );
  }
);

PostCard.displayName = 'PostCard';

export default PostCard;
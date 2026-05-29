'use client';

import { motion } from 'framer-motion';
import { ImageIcon, Upload, Save, Calendar, Tag, User } from 'lucide-react';
import { NewPost } from '@/lib/types';

interface CreateBlogSectionProps {
  newPost: NewPost;
  setNewPost: (post: NewPost) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreatePost: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function CreateBlogSection({ 
  newPost, 
  setNewPost, 
  handleImageUpload,
  handleCreatePost,
  fileInputRef 
}: CreateBlogSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* Editor Section */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-white/50 space-y-6 h-fit order-2 lg:order-1"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog</h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Enter an engaging title..."
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#f5b800] focus:bg-white transition-all text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={newPost.coverImage}
                onChange={(e) => setNewPost({ ...newPost, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#f5b800] focus:bg-white transition-all"
              />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-2xl flex items-center justify-center transition-colors"
              title="Upload from PC"
            >
              <Upload size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={newPost.subtitle}
            onChange={(e) => setNewPost({ ...newPost, subtitle: e.target.value })}
            placeholder="A brief description..."
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#f5b800] focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="Write your story here..."
            rows={12}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#f5b800] focus:bg-white transition-all resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#f5b800] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={newPost.date}
                onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#f5b800] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              placeholder="Design, Tech, Lifestyle (comma separated)"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#f5b800] focus:bg-white transition-all"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreatePost}
          disabled={!newPost.title || !newPost.content}
          className="w-full bg-[#f5b800] hover:bg-[#e5a800] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-3 text-lg"
        >
          <Save size={20} /> Publish Story
        </motion.button>
      </motion.div>

      {/* Preview Section */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-white/50 h-fit sticky top-24 order-1 lg:order-2"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Live Preview</h3>

        <div className="space-y-4">
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
            {newPost.coverImage ? (
              <img 
                src={newPost.coverImage} 
                alt="Cover preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1499750789039-ca2a2f92c815?w=800&h=400&fit=crop";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon size={48} />
              </div>
            )}
          </div>

          {newPost.tags && (
            <div className="flex flex-wrap gap-2">
              {newPost.tags.split(',').map((tag, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-[#f5b800] text-white rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
            {newPost.title || 'Your title here...'}
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {newPost.subtitle || 'Your subtitle here...'}
          </p>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f5b800] to-amber-500 flex items-center justify-center text-white font-bold">
                {newPost.author.charAt(0) || 'A'}
              </div>
              <div>
                <div className="font-bold text-gray-900">{newPost.author || 'Author'}</div>
                <div className="text-sm text-gray-500">{newPost.date}</div>
              </div>
            </div>
          </div>

          {newPost.content && (
            <div className="pt-4">
              <p className="text-gray-700 leading-relaxed line-clamp-6">
                {newPost.content}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
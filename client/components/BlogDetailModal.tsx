import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Send, Trash2, Loader2 } from 'lucide-react';
import { Post } from '@/types/blog';
import { interactionApi, Comment, handleApiError } from '@/lib/api';

interface BlogDetailModalProps {
  selectedPost: Post;
  setSelectedPost: (post: Post | null) => void;
  onLike: (id: string) => void;
  isLiked: boolean;
}

export default function BlogDetailModal({ selectedPost, setSelectedPost, onLike, isLiked }: BlogDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPost) {
      fetchComments();
    }
  }, [selectedPost?.id]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await interactionApi.getComments(selectedPost.id);
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await interactionApi.addComment(selectedPost.id, newComment, replyingTo?.id);
      
      if (replyingTo) {
        // Find the parent and add it to its replies
        setComments(prev => prev.map(c => {
          if (c.id === replyingTo.id) {
            return {
              ...c,
              replies: [...(c.replies || []), comment]
            };
          }
          return c;
        }));
      } else {
        setComments(prev => [comment, ...prev]);
      }
      
      setNewComment("");
      setReplyingTo(null);
    } catch (err) {
      setError(handleApiError(err));
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (id: string, parentId?: string) => {
    try {
      await interactionApi.deleteComment(id);
      if (parentId) {
        setComments(prev => prev.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: c.replies?.filter(r => r.id !== id)
            };
          }
          return c;
        }));
      } else {
        setComments(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const CommentItem = ({ comment, isReply = false, parentId }: { comment: Comment, isReply?: boolean, parentId?: string }) => (
    <motion.div
      initial={{ opacity: 0, x: isReply ? 20 : 0 }}
      animate={{ opacity: 1, x: isReply ? 20 : 0 }}
      layout
      className={`p-5 md:p-6 bg-white border border-gray-100 rounded-[2rem] hover:shadow-lg transition-all group/comment ${isReply ? 'ml-4 md:ml-8 border-l-4 border-l-[#f5b800]/30' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-black shrink-0 ${isReply ? 'w-8 h-8 text-xs' : ''}`}>
            {comment.user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900 text-sm md:text-base">{comment.user.name}</span>
              {isReply && <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md font-black uppercase">Reply</span>}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
              {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
            <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base">
              {comment.content}
            </p>
            
            <div className="flex items-center gap-4 mt-4">
              {!isReply && (
                <button 
                  onClick={() => {
                    setReplyingTo(comment);
                    const textArea = document.querySelector('textarea');
                    textArea?.focus();
                  }}
                  className="text-[10px] font-black uppercase text-[#f5b800] hover:text-black transition-colors"
                >
                  Reply
                </button>
              )}
              <button
                onClick={() => handleDeleteComment(comment.id, parentId)}
                className="text-gray-300 hover:text-rose-500 opacity-0 group-hover/comment:opacity-100 transition-all text-[10px] font-black uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedPost(null)}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-8"
    >
      <motion.div
        layoutId={`card-container-${selectedPost.id}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedPost(null)}
          className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/10 hover:bg-black/20 backdrop-blur rounded-full flex items-center justify-center transition-all group"
        >
          <X size={24} className="text-black group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="relative h-[400px] md:h-[500px]">
            <motion.div
              layoutId={`card-image-${selectedPost.id}`}
              className="w-full h-full"
            >
              <img 
                src={selectedPost.image || selectedPost.coverImage} 
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
          
          <div className="px-8 md:px-16 pb-12 -mt-20 relative z-10">
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedPost.tags.map((tag, i) => (
                <span 
                  key={i}
                  className="px-4 py-1.5 bg-[#f5b800]/10 text-[#f5b800] border border-[#f5b800]/20 rounded-full text-xs font-black uppercase tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <motion.h1 
              layoutId={`card-title-${selectedPost.id}`}
              className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1]"
            >
              {selectedPost.title}
            </motion.h1>
            
            <p className="text-xl md:text-2xl text-gray-500 font-medium mb-10 leading-relaxed max-w-3xl">
              {selectedPost.subtitle}
            </p>
            
            <div className="flex items-center justify-between mb-12 pb-12 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f5b800] to-amber-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-amber-200">
                  {selectedPost.author.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-gray-900 text-lg">{selectedPost.author}</div>
                  <div className="text-sm text-gray-400 font-bold">{selectedPost.date}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onLike(selectedPost.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${
                    isLiked 
                    ? 'bg-rose-50 text-rose-500 border border-rose-100' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <Heart size={20} className={isLiked ? 'fill-rose-500' : ''} />
                  {selectedPost.likes}
                </button>
              </div>
            </div>
            
            <div className="prose prose-xl max-w-none mb-20 text-gray-800 font-medium leading-[1.8] whitespace-pre-wrap">
              {selectedPost.content}
            </div>

            {/* Discussion Section */}
            <div className="border-t border-gray-100 pt-16">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <MessageCircle size={32} className="text-[#f5b800]" />
                  Discussion
                  <span className="text-gray-300 ml-1">
                    {comments.reduce((acc, curr) => acc + 1 + (curr.replies?.length || 0), 0)}
                  </span>
                </h2>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="mb-12">
                <div className="relative group">
                  {replyingTo && (
                    <div className="absolute -top-10 left-0 flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-t-xl text-[10px] font-black uppercase text-amber-600">
                      Replying to @{replyingTo.user.name}
                      <button type="button" onClick={() => setReplyingTo(null)} className="hover:text-black">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={replyingTo ? `Add to the conversation with @${replyingTo.user.name}...` : "Add to the conversation..."}
                    className={`w-full bg-gray-50/50 border-2 border-gray-100 ${replyingTo ? 'rounded-b-3xl rounded-tr-3xl' : 'rounded-3xl'} p-6 md:p-8 text-lg focus:outline-none focus:border-[#f5b800] focus:bg-white transition-all resize-none min-h-[150px] font-medium`}
                    required
                  />
                  {error && <p className="text-rose-500 text-sm mt-2 font-bold px-4">{error}</p>}
                  
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="bg-[#f5b800] hover:bg-black text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-amber-200 hover:shadow-gray-200 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {submittingComment ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          {replyingTo ? 'Post Reply' : 'Share Thought'} 
                          <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Comment List */}
              <div className="space-y-8 pb-10">
                {loadingComments ? (
                  <div className="flex flex-col items-center py-20 gap-4">
                    <Loader2 className="animate-spin text-[#f5b800]" size={40} />
                    <p className="text-gray-400 font-bold">Fetching discussions...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                    <p className="text-xl font-bold text-gray-400">No thoughts shared yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-4">
                        <CommentItem comment={comment} />
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="space-y-4">
                            {comment.replies.map((reply) => (
                              <CommentItem key={reply.id} comment={reply} isReply parentId={comment.id} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

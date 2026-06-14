import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import StarRating from './StarRating';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

/**
 * ReviewDetailModal - Shows review details with comments and a new comment input.
 * Props: review, isOpen, onClose, onAddComment
 */
export default function ReviewDetailModal({ review, isOpen, onClose, onAddComment }) {
  const [commentText, setCommentText] = useState('');
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  function handleOverlayClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(review.id, commentText.trim());
    setCommentText('');
  }

  if (!review) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleOverlayClick}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-[600px] w-full max-h-[85vh] overflow-y-auto relative shadow-lg"
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="レビュー詳細"
          >
            {/* Close button */}
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all" onClick={onClose} aria-label="閉じる">
              <X size={20} />
            </button>

            {/* Original review */}
            <div className="pb-4 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <img
                  className="w-11 h-11 rounded-full object-cover"
                  src={review.reviewerAvatar}
                  alt={review.reviewerName}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[0.9375rem] font-semibold text-gray-900">{review.reviewerName}</span>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="text-sm text-gray-900 leading-relaxed mt-2">{review.text}</p>
            </div>

            {/* Comments section */}
            <div className="mb-4">
              <h3 className="text-[0.9375rem] font-semibold text-gray-900 mb-2">
                コメント ({review.comments?.length || 0})
              </h3>
              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
                {review.comments && review.comments.length > 0 ? (
                  review.comments.map((comment) => (
                    <div key={comment.id} className="bg-slate-50 rounded-lg px-4 py-2">
                      <span className="text-[0.8125rem] font-semibold text-gray-900 block mb-0.5">{comment.authorName}</span>
                      <p className="text-[0.8125rem] text-gray-500 leading-relaxed m-0">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[0.8125rem] text-gray-500 italic">まだコメントはありません</p>
                )}
              </div>
            </div>

            {/* New comment input */}
            <form className="flex gap-2 pt-4 border-t border-gray-200" onSubmit={handleSubmit}>
              <input
                type="text"
                className="flex-1 px-3.5 py-2.5 border border-violet-200 rounded-full text-sm outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                placeholder="コメントを書く..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2.5 bg-brand-gradient text-white rounded-full text-[0.8125rem] font-semibold shadow-sm shadow-violet-500/30 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!commentText.trim()}
              >
                <Send size={16} />
                <span>送信</span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

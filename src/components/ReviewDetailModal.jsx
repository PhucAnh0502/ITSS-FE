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
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleOverlayClick}
        >
          <motion.div
            className="modal-content"
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
            <button className="modal-close-btn" onClick={onClose} aria-label="閉じる">
              <X size={20} />
            </button>

            {/* Original review */}
            <div className="modal-review">
              <div className="modal-review__header">
                <img
                  className="modal-review__avatar"
                  src={review.reviewerAvatar}
                  alt={review.reviewerName}
                />
                <div className="modal-review__info">
                  <span className="modal-review__name">{review.reviewerName}</span>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="modal-review__text">{review.text}</p>
            </div>

            {/* Comments section */}
            <div className="modal-comments">
              <h3 className="modal-comments__title">
                コメント ({review.comments?.length || 0})
              </h3>
              <div className="modal-comments__list">
                {review.comments && review.comments.length > 0 ? (
                  review.comments.map((comment) => (
                    <div key={comment.id} className="modal-comment">
                      <span className="modal-comment__author">{comment.authorName}</span>
                      <p className="modal-comment__text">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="modal-comments__empty">まだコメントはありません</p>
                )}
              </div>
            </div>

            {/* New comment input */}
            <form className="modal-comment-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="modal-comment-form__input"
                placeholder="コメントを書く..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="modal-comment-form__btn"
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

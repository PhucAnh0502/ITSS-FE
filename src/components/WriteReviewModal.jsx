import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';

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
 * WriteReviewModal - Modal for writing a new review.
 * Props: isOpen, onClose, onSubmit, workspaces
 */
export default function WriteReviewModal({ isOpen, onClose, onSubmit, workspaces }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
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
    if (!selectedWorkspace || !rating || !reviewText.trim()) return;

    onSubmit({
      workspaceId: selectedWorkspace,
      rating,
      text: reviewText.trim(),
    });

    // Reset form
    setSelectedWorkspace('');
    setRating(0);
    setReviewText('');
    onClose();
  }

  const isValid = selectedWorkspace && rating > 0 && reviewText.trim().length > 0;

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
            aria-label="レビューを書く"
          >
            {/* Close button */}
            <button className="modal-close-btn" onClick={onClose} aria-label="閉じる">
              <X size={20} />
            </button>

            <h2 className="modal-title">レビューを書く</h2>

            <form className="write-review-form" onSubmit={handleSubmit}>
              {/* Workspace selector */}
              <div className="write-review-form__field">
                <label className="write-review-form__label">ワークスペースを選択</label>
                <select
                  className="write-review-form__select"
                  value={selectedWorkspace}
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                >
                  <option value="">選択してください</option>
                  {workspaces && workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Star rating */}
              <div className="write-review-form__field">
                <label className="write-review-form__label">評価</label>
                <div className="write-review-form__stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="write-review-form__star-btn"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${star}つ星`}
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                        color={(hoverRating || rating) >= star ? '#f59e0b' : '#d1d5db'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review text */}
              <div className="write-review-form__field">
                <label className="write-review-form__label">レビュー内容</label>
                <textarea
                  className="write-review-form__textarea"
                  placeholder="あなたの体験を共有してください..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="write-review-form__submit"
                disabled={!isValid}
              >
                投稿する
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

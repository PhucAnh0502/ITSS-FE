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
            aria-label="レビューを書く"
          >
            {/* Close button */}
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all" onClick={onClose} aria-label="閉じる">
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">レビューを書く</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Workspace selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[0.8125rem] font-semibold text-gray-900">ワークスペースを選択</label>
                <select
                  className="px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
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
              <div className="flex flex-col gap-1">
                <label className="text-[0.8125rem] font-semibold text-gray-900">評価</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 rounded transition-transform hover:scale-125"
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
              <div className="flex flex-col gap-1">
                <label className="text-[0.8125rem] font-semibold text-gray-900">レビュー内容</label>
                <textarea
                  className="px-3.5 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 resize-y min-h-[100px] outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  placeholder="あなたの体験を共有してください..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="self-end px-6 py-3 bg-green-500 text-white rounded-full text-[0.9375rem] font-semibold transition-colors hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

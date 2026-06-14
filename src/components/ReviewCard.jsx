import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import StarRating from './StarRating';
import ReviewDetailModal from './ReviewDetailModal';
import { LOCALIZATION } from '../utils/localization';

/**
 * Formats a date string into a Japanese relative time string.
 */
function formatRelativeTime(postedAt) {
  const now = new Date();
  const posted = new Date(postedAt);
  const diffMs = now - posted;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears >= 1) return `${diffYears}年前`;
  if (diffMonths >= 1) return `${diffMonths}ヶ月前`;
  if (diffDays >= 1) return `${diffDays}日前`;
  if (diffHours >= 1) return `${diffHours}時間前`;
  if (diffMinutes >= 1) return `${diffMinutes}分前`;
  return 'たった今';
}

/** A single media tile with optional video label / "+N more" overlay. */
function MediaTile({ item, className, extra }) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <img src={item.url} alt="" className="w-full h-full object-cover" loading="lazy" />
      {item.type === 'video' && (
        <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[0.625rem] px-1.5 py-0.5 rounded font-medium">
          Short Video
        </span>
      )}
      {extra}
    </div>
  );
}

/** Media-first gallery: edge-to-edge, with a 1 / 2 / mosaic layout by count. */
function ReviewMedia({ media }) {
  const count = media.length;
  if (count === 0) return null;

  return (
    <div className="-mx-4 my-3">
      {count === 1 && <MediaTile item={media[0]} className="h-56" />}

      {count === 2 && (
        <div className="grid grid-cols-2 gap-0.5">
          <MediaTile item={media[0]} className="h-40" />
          <MediaTile item={media[1]} className="h-40" />
        </div>
      )}

      {count >= 3 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-64">
          <MediaTile item={media[0]} className="row-span-2 h-full" />
          <MediaTile item={media[1]} className="h-full" />
          <MediaTile
            item={media[2]}
            className="h-full"
            extra={
              count > 3 ? (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-lg font-bold">
                  +{count - 3}
                </div>
              ) : null
            }
          />
        </div>
      )}
    </div>
  );
}

/** Small radial particle burst played when a review is marked helpful. */
function HelpfulBurst() {
  const dots = [0, 1, 2, 3, 4, 5];
  return (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {dots.map((i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-violet-500"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * 14, y: Math.sin(angle) * 14, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        );
      })}
    </span>
  );
}

export default function ReviewCard({ review, onHelpful, isHelpfulActive, helpfulCount, onAddComment }) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [burst, setBurst] = useState(false);
  const commentCount = review.comments?.length || 0;
  const displayHelpfulCount = helpfulCount != null ? helpfulCount : review.helpfulCount;

  const isLongText = review.text && review.text.length > 80;

  function handleCommentClick() {
    setModalOpen(true);
  }

  function handleHelpfulClick() {
    if (!isHelpfulActive) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }
    if (onHelpful) onHelpful(review.id);
  }

  function handleAddComment(reviewId, text) {
    if (onAddComment) {
      onAddComment(reviewId, text);
    }
  }

  return (
    <>
      <div className="review-card bg-white rounded-2xl p-4 text-left shadow-sm ring-1 ring-violet-100 hover:shadow-xl hover:shadow-violet-500/10 transition-shadow flex flex-col">
        {/* Reviewer header */}
        <div className="flex items-center gap-2.5 mb-3">
          <img
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-violet-100"
            src={review.reviewerAvatar}
            alt={review.reviewerName}
          />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">{review.reviewerName}</span>
            <span className="text-[0.6875rem] font-semibold text-violet-700 bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-full inline-flex items-center w-fit border border-white/70 ring-1 ring-violet-200/60">
              {review.badgeLabelJa || '認証済み学生'}
            </span>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{formatRelativeTime(review.postedAt)}</span>
        </div>

        <div className="mb-2">
          <StarRating rating={review.rating} />
        </div>

        <div className="mb-1">
          <p className={`text-sm text-gray-800 leading-relaxed m-0 ${!expanded && isLongText ? 'line-clamp-3' : ''}`}>
            {review.text}
          </p>
          {isLongText && (
            <button
              className="inline-block mt-1 p-0 border-none bg-transparent text-violet-600 text-[0.8125rem] font-medium cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '閉じる' : 'もっと見る'}
            </button>
          )}
        </div>

        {review.media && review.media.length > 0 && <ReviewMedia media={review.media} />}

        <div className="flex items-center gap-3 pt-3 mt-2 border-t border-gray-100">
          <motion.button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.8125rem] cursor-pointer transition-colors ${
              isHelpfulActive
                ? 'bg-violet-50 border border-violet-400 text-violet-600'
                : 'text-gray-500 bg-slate-50 border border-gray-200 hover:border-violet-400 hover:text-violet-600'
            }`}
            onClick={handleHelpfulClick}
            whileTap={{ scale: 0.92 }}
          >
            <motion.span
              className="relative inline-flex"
              animate={isHelpfulActive ? { scale: [1, 1.5, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <ThumbsUp size={14} fill={isHelpfulActive ? '#7c3aed' : 'none'} />
              <AnimatePresence>{burst && <HelpfulBurst />}</AnimatePresence>
            </motion.span>
            <span className="font-medium">{LOCALIZATION.buttons.helpful}</span>
            <span className="font-semibold">({displayHelpfulCount})</span>
          </motion.button>

          <motion.button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.8125rem] text-gray-500 bg-slate-50 border border-gray-200 cursor-pointer transition-colors hover:border-fuchsia-400 hover:text-fuchsia-600"
            onClick={handleCommentClick}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
          >
            <MessageCircle size={14} />
            <span className="font-medium">{LOCALIZATION.misc.comments} ({commentCount})</span>
          </motion.button>
        </div>
      </div>

      <ReviewDetailModal
        review={review}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddComment={handleAddComment}
      />
    </>
  );
}

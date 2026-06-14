import { useState } from 'react';
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

export default function ReviewCard({ review, onHelpful, isHelpfulActive, helpfulCount, onAddComment }) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const commentCount = review.comments?.length || 0;
  const displayHelpfulCount = helpfulCount != null ? helpfulCount : review.helpfulCount;

  const isLongText = review.text && review.text.length > 80;

  function handleCommentClick() {
    setModalOpen(true);
  }

  function handleAddComment(reviewId, text) {
    if (onAddComment) {
      onAddComment(reviewId, text);
    }
  }

  return (
    <>
      <div className="review-card bg-white rounded-2xl p-4 text-left shadow-sm border-none flex flex-col min-h-[220px]">
        <div className="flex items-center gap-2 mb-2">
          <img
            className="w-10 h-10 rounded-full object-cover shrink-0"
            src={review.reviewerAvatar}
            alt={review.reviewerName}
          />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">{review.reviewerName}</span>
            <span className="text-[0.6875rem] text-white font-semibold bg-green-500 px-2 py-0.5 rounded-full inline-block w-fit">{review.badgeLabelJa || '認証済み学生'}</span>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">{formatRelativeTime(review.postedAt)}</span>
        </div>

        <div className="mb-2">
          <StarRating rating={review.rating} />
        </div>

        <div className="flex-1 mb-2">
          <p className={`text-sm text-gray-900 leading-relaxed m-0 ${!expanded && isLongText ? 'line-clamp-3' : ''}`}>
            {review.text}
          </p>
          {isLongText && (
            <button
              className="inline-block mt-1 p-0 border-none bg-transparent text-green-500 text-[0.8125rem] font-medium cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '閉じる' : 'もっと見る'}
            </button>
          )}
        </div>

        {review.media && review.media.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-2 scrollbar-hide">
            {review.media.map((item, index) => (
              <div key={index} className="relative shrink-0 w-[120px] h-[90px] rounded-lg overflow-hidden">
                <img src={item.url} alt="" className="w-full h-full object-cover" />
                {item.type === 'video' && (
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[0.625rem] px-1.5 py-0.5 rounded font-medium">Short Video</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
          <button
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[0.8125rem] transition-all ${
              isHelpfulActive
                ? 'bg-green-50 border border-green-500 text-green-500'
                : 'text-gray-500 bg-slate-50 border border-gray-200 hover:border-green-500 hover:text-green-500'
            }`}
            onClick={() => onHelpful && onHelpful(review.id)}
          >
            <ThumbsUp size={14} />
            <span className="font-medium">{LOCALIZATION.buttons.helpful}</span>
            <span className="font-semibold">({displayHelpfulCount})</span>
          </button>

          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[0.8125rem] text-gray-500 bg-slate-50 border border-gray-200 cursor-pointer transition-all hover:border-green-500 hover:text-green-500"
            onClick={handleCommentClick}
          >
            <MessageCircle size={14} />
            <span className="font-medium">💬 {LOCALIZATION.misc.comments} ({commentCount})</span>
          </button>
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

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
      <div className={`review-card ${expanded ? 'review-card--expanded' : ''}`}>
        <div className="review-card__header">
          <img
            className="review-card__avatar"
            src={review.reviewerAvatar}
            alt={review.reviewerName}
          />
          <div className="review-card__author-info">
            <span className="review-card__name">{review.reviewerName}</span>
            <span className="review-card__badge">{review.badgeLabelJa || '認証済み学生'}</span>
          </div>
          <span className="review-card__time">{formatRelativeTime(review.postedAt)}</span>
        </div>

        <div className="review-card__rating">
          <StarRating rating={review.rating} />
        </div>

        <div className="review-card__text-container">
          <p className={`review-card__text ${!expanded && isLongText ? 'review-card__text--clamped' : ''}`}>
            {review.text}
          </p>
          {isLongText && (
            <button
              className="review-card__expand-btn"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '閉じる' : 'もっと見る'}
            </button>
          )}
        </div>

        {review.media && review.media.length > 0 && (
          <div className="review-card__media">
            {review.media.map((item, index) => (
              <div key={index} className="review-card__media-item">
                <img src={item.url} alt="" className="review-card__media-image" />
                {item.type === 'video' && (
                  <span className="review-card__media-video-label">Short Video</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="review-card__actions">
          <button
            className={`review-card__helpful-btn ${isHelpfulActive ? 'review-card__helpful-btn--active' : ''}`}
            onClick={() => onHelpful && onHelpful(review.id)}
          >
            <ThumbsUp size={14} className="review-card__helpful-icon" />
            <span className="review-card__helpful-label">{LOCALIZATION.buttons.helpful}</span>
            <span className="review-card__helpful-count">({displayHelpfulCount})</span>
          </button>

          <button className="review-card__comments" onClick={handleCommentClick}>
            <MessageCircle size={14} className="review-card__comments-icon" />
            <span className="review-card__comments-count">💬 {LOCALIZATION.misc.comments} ({commentCount})</span>
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

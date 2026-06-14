import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { useReviewCategory } from '../hooks/useReviewCategory';
import { useHelpful } from '../hooks/useHelpful';
import { LOCALIZATION } from '../utils/localization';
import { CategoryTags } from '../components/CategoryTags';
import ReviewCard from '../components/ReviewCard';
import WriteReviewModal from '../components/WriteReviewModal';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import workspacesData from '../data/workspaces.json';

/** Review category tags for filtering */
const reviewCategoryTags = [
  { value: 'all', label: LOCALIZATION.reviewCategories.all },
  { value: 'near-hust', label: LOCALIZATION.reviewCategories.nearHust },
  { value: 'cafe', label: LOCALIZATION.reviewCategories.cafe },
  { value: 'dormitory', label: LOCALIZATION.reviewCategories.dormitory },
  { value: 'group-activity', label: LOCALIZATION.reviewCategories.groupActivity },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

/**
 * ReviewPage - Community reviews page with 2-column grid layout.
 * Japanese text with green theme and framer-motion animations.
 */
function ReviewPage() {
  const { workspaceId } = useParams();

  // Load reviews (optionally filtered by workspace)
  const { reviews: initialReviews, loading, error } = useReviews(workspaceId);

  // Local state for reviews (to support in-memory additions)
  const [localReviews, setLocalReviews] = useState(null);
  const reviews = localReviews !== null ? localReviews : initialReviews;

  // Sync local state when initial reviews load
  if (localReviews === null && initialReviews && initialReviews.length > 0) {
    setLocalReviews(initialReviews);
  }

  // Category filtering
  const { selectedCategory, setCategory, results: filteredReviews } =
    useReviewCategory(reviews);

  // Helpful toggle state
  const { toggleHelpful, isHelpful, getCount } = useHelpful();

  // Write review modal state
  const [writeModalOpen, setWriteModalOpen] = useState(false);

  // Add a comment to a review (in-memory)
  function handleAddComment(reviewId, text) {
    setLocalReviews((prev) => {
      if (!prev) return prev;
      return prev.map((r) => {
        if (r.id !== reviewId) return r;
        const newComment = {
          id: `comment-${Date.now()}`,
          authorName: '匿名ユーザー',
          text,
          postedAt: new Date().toISOString(),
        };
        return { ...r, comments: [...(r.comments || []), newComment] };
      });
    });
  }

  // Add a new review (in-memory)
  function handleWriteReview({ workspaceId: wsId, rating, text }) {
    const newReview = {
      id: `review-${Date.now()}`,
      workspaceId: wsId,
      reviewerName: '匿名ユーザー',
      reviewerAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      badge: 'New Member',
      badgeLabelJa: '新メンバー',
      rating,
      text,
      media: [],
      postedAt: new Date().toISOString(),
      helpfulCount: 0,
      comments: [],
      category: 'cafe',
    };
    setLocalReviews((prev) => (prev ? [newReview, ...prev] : [newReview]));
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <LoadingIndicator />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto md:p-4">
      {/* Header */}
      <header className="mb-2">
        <motion.h1
          className="text-[1.75rem] font-extrabold m-0 mb-1 text-brand-gradient"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {LOCALIZATION.headings.communityReviews}
        </motion.h1>
        <motion.p
          className="text-[0.9rem] text-gray-500 m-0 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {LOCALIZATION.headings.communitySubtitle}
        </motion.p>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          {/* Category Tags */}
          <CategoryTags
            tags={reviewCategoryTags}
            selectedTag={selectedCategory}
            onSelect={(tag) => setCategory(tag || 'all')}
          />
          <motion.button
            className="bg-brand-gradient text-white border-none rounded-3xl px-5 py-2.5 text-sm font-semibold cursor-pointer transition-opacity whitespace-nowrap flex items-center gap-1.5 shadow-sm shadow-violet-500/30 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:outline-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setWriteModalOpen(true)}
          >
            <Plus size={16} />
            {LOCALIZATION.buttons.writeReview}
          </motion.button>
        </div>
      </header>

      {/* Review Grid - 2 columns with staggered animation */}
      {filteredReviews.length === 0 ? (
        <EmptyState message={LOCALIZATION.empty.noReviews} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="flex min-w-0"
            >
              <ReviewCard
                review={review}
                onHelpful={() => toggleHelpful(review.id)}
                isHelpfulActive={isHelpful(review.id)}
                helpfulCount={getCount(review.id, review.helpfulCount)}
                onAddComment={handleAddComment}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        onSubmit={handleWriteReview}
        workspaces={workspacesData}
      />
    </div>
  );
}

export default ReviewPage;

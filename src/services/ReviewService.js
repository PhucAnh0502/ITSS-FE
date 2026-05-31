import { getReviewsByWorkspace, getAllReviews } from '../data/ReviewRepository';

/**
 * Get reviews, optionally filtered by workspace ID, sorted by most recent first.
 * @param {string|null|undefined} workspaceId - Optional workspace ID to filter by
 * @returns {Promise<Array>} Array of review objects sorted by postedAt descending
 */
export async function getReviews(workspaceId) {
  if (workspaceId) {
    return getReviewsByWorkspace(workspaceId);
  }
  return getAllReviews();
}

/**
 * Filter reviews by category.
 * @param {Array} reviews - Array of review objects to filter
 * @param {string|null|undefined} category - Category to filter by; "all" or null/undefined returns all reviews
 * @returns {Array} Filtered array of reviews
 */
export function filterByCategory(reviews, category) {
  if (!category || category === 'all') {
    return reviews;
  }
  return reviews.filter((review) => review?.category === category);
}

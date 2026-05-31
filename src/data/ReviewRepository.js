import reviewsData from './reviews.json';

/**
 * Get reviews for a specific workspace, sorted by most recent first.
 * @param {string} workspaceId - The workspace ID to filter reviews by
 * @returns {Promise<Array>} Array of review objects sorted by postedAt descending
 */
export function getReviewsByWorkspace(workspaceId) {
  return new Promise((resolve) => {
    try {
      const reviews = reviewsData ?? [];
      const filtered = reviews.filter((r) => r?.workspaceId === workspaceId);
      const sorted = filtered.sort(
        (a, b) => new Date(b?.postedAt ?? 0) - new Date(a?.postedAt ?? 0)
      );
      resolve(sorted);
    } catch (error) {
      resolve([]);
    }
  });
}

/**
 * Get all reviews sorted by most recent first.
 * @returns {Promise<Array>} Array of all review objects sorted by postedAt descending
 */
export function getAllReviews() {
  return new Promise((resolve) => {
    try {
      const reviews = reviewsData ?? [];
      const sorted = [...reviews].sort(
        (a, b) => new Date(b?.postedAt ?? 0) - new Date(a?.postedAt ?? 0)
      );
      resolve(sorted);
    } catch (error) {
      resolve([]);
    }
  });
}

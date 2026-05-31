import { useState, useCallback } from 'react';

/**
 * Hook for managing session-based helpful toggle state.
 * Maintains a set of review IDs that the user has marked as helpful during this session.
 *
 * @returns {{ toggleHelpful: function, isHelpful: function, getCount: function }}
 */
export function useHelpful() {
  const [helpfulSet, setHelpfulSet] = useState(new Set());

  /**
   * Toggle a review's helpful state. Adds the reviewId if not present, removes it if already present.
   * @param {string} reviewId - The review ID to toggle
   */
  const toggleHelpful = useCallback((reviewId) => {
    setHelpfulSet((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  }, []);

  /**
   * Check if a review is currently marked as helpful by the user.
   * @param {string} reviewId - The review ID to check
   * @returns {boolean} Whether the user has marked this review as helpful
   */
  const isHelpful = useCallback(
    (reviewId) => {
      return helpfulSet.has(reviewId);
    },
    [helpfulSet]
  );

  /**
   * Get the display count for a review's helpful button.
   * Returns baseCount + 1 if the user has marked it helpful, otherwise baseCount.
   * @param {string} reviewId - The review ID
   * @param {number} baseCount - The original helpful count from mock data
   * @returns {number} The display count
   */
  const getCount = useCallback(
    (reviewId, baseCount) => {
      return helpfulSet.has(reviewId) ? baseCount + 1 : baseCount;
    },
    [helpfulSet]
  );

  return { toggleHelpful, isHelpful, getCount };
}

export default useHelpful;

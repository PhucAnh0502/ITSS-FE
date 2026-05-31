import { useState, useEffect } from 'react';
import { getAllReviews, getReviewsByWorkspace } from '../data/ReviewRepository';

/**
 * Hook to load reviews, optionally filtered by workspace ID.
 * @param {string} [workspaceId] - Optional workspace ID to filter reviews
 * @returns {{ reviews: Array, loading: boolean, error: string|null }}
 */
export function useReviews(workspaceId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);
        const data = workspaceId
          ? await getReviewsByWorkspace(workspaceId)
          : await getAllReviews();
        if (!cancelled) {
          setReviews(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Không thể tải đánh giá');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  return { reviews, loading, error };
}

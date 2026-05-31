import { useState, useMemo } from 'react';
import { filterByCategory } from '../services/ReviewService';

/**
 * Hook for filtering reviews by category.
 * Takes a reviews array as input and returns filtered results based on selected category.
 *
 * @param {Array} reviews - Array of review objects to filter
 * @returns {{ selectedCategory: string, setCategory: function, results: Array }}
 */
export function useReviewCategory(reviews) {
  const [selectedCategory, setCategory] = useState('all');

  const results = useMemo(() => {
    return filterByCategory(reviews || [], selectedCategory);
  }, [reviews, selectedCategory]);

  return { selectedCategory, setCategory, results };
}

export default useReviewCategory;

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReviewCategory } from '../../hooks/useReviewCategory';

const mockReviews = [
  { id: 'r1', category: 'cafe', text: 'Great cafe' },
  { id: 'r2', category: 'near-hust', text: 'Close to campus' },
  { id: 'r3', category: 'cafe', text: 'Another cafe review' },
  { id: 'r4', category: 'dormitory', text: 'Dorm review' },
];

describe('useReviewCategory', () => {
  it('should initialize with "all" category and return all reviews', () => {
    const { result } = renderHook(() => useReviewCategory(mockReviews));

    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.results).toEqual(mockReviews);
  });

  it('should filter reviews when category is set', () => {
    const { result } = renderHook(() => useReviewCategory(mockReviews));

    act(() => {
      result.current.setCategory('cafe');
    });

    expect(result.current.selectedCategory).toBe('cafe');
    expect(result.current.results).toHaveLength(2);
    expect(result.current.results.every((r) => r.category === 'cafe')).toBe(true);
  });

  it('should return all reviews when category is set back to "all"', () => {
    const { result } = renderHook(() => useReviewCategory(mockReviews));

    act(() => {
      result.current.setCategory('cafe');
    });
    expect(result.current.results).toHaveLength(2);

    act(() => {
      result.current.setCategory('all');
    });
    expect(result.current.results).toEqual(mockReviews);
  });

  it('should return empty array when no reviews match the category', () => {
    const { result } = renderHook(() => useReviewCategory(mockReviews));

    act(() => {
      result.current.setCategory('group-activity');
    });

    expect(result.current.results).toEqual([]);
  });

  it('should handle empty reviews array', () => {
    const { result } = renderHook(() => useReviewCategory([]));

    expect(result.current.results).toEqual([]);
  });

  it('should handle null/undefined reviews', () => {
    const { result } = renderHook(() => useReviewCategory(null));

    expect(result.current.results).toEqual([]);
  });
});

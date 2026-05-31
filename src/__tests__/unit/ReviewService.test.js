import { describe, it, expect } from 'vitest';
import { getReviews, filterByCategory } from '../../services/ReviewService';

describe('ReviewService', () => {
  describe('getReviews', () => {
    it('should return all reviews sorted by postedAt descending when no workspaceId is provided', async () => {
      const reviews = await getReviews();
      expect(reviews.length).toBeGreaterThan(0);

      for (let i = 0; i < reviews.length - 1; i++) {
        const current = new Date(reviews[i].postedAt).getTime();
        const next = new Date(reviews[i + 1].postedAt).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    it('should return reviews for a specific workspace when workspaceId is provided', async () => {
      const workspaceId = 'the-lab-coffee';
      const reviews = await getReviews(workspaceId);
      expect(reviews.length).toBeGreaterThan(0);
      reviews.forEach((review) => {
        expect(review.workspaceId).toBe(workspaceId);
      });
    });

    it('should return reviews sorted by postedAt descending for a specific workspace', async () => {
      const reviews = await getReviews('the-lab-coffee');
      for (let i = 0; i < reviews.length - 1; i++) {
        const current = new Date(reviews[i].postedAt).getTime();
        const next = new Date(reviews[i + 1].postedAt).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    it('should return an empty array for a non-existent workspace', async () => {
      const reviews = await getReviews('non-existent-workspace');
      expect(reviews).toEqual([]);
    });

    it('should return all reviews when workspaceId is null', async () => {
      const reviews = await getReviews(null);
      expect(reviews.length).toBeGreaterThan(0);
    });

    it('should return all reviews when workspaceId is undefined', async () => {
      const reviews = await getReviews(undefined);
      expect(reviews.length).toBeGreaterThan(0);
    });
  });

  describe('filterByCategory', () => {
    const mockReviews = [
      { id: '1', category: 'cafe', text: 'Great cafe' },
      { id: '2', category: 'near-hust', text: 'Close to campus' },
      { id: '3', category: 'cafe', text: 'Another cafe' },
      { id: '4', category: 'dormitory', text: 'Dorm review' },
      { id: '5', category: 'group-activity', text: 'Group study' },
    ];

    it('should return all reviews when category is "all"', () => {
      const result = filterByCategory(mockReviews, 'all');
      expect(result).toEqual(mockReviews);
    });

    it('should return all reviews when category is null', () => {
      const result = filterByCategory(mockReviews, null);
      expect(result).toEqual(mockReviews);
    });

    it('should return all reviews when category is undefined', () => {
      const result = filterByCategory(mockReviews, undefined);
      expect(result).toEqual(mockReviews);
    });

    it('should filter reviews by "cafe" category', () => {
      const result = filterByCategory(mockReviews, 'cafe');
      expect(result).toHaveLength(2);
      result.forEach((review) => {
        expect(review.category).toBe('cafe');
      });
    });

    it('should filter reviews by "near-hust" category', () => {
      const result = filterByCategory(mockReviews, 'near-hust');
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('near-hust');
    });

    it('should filter reviews by "dormitory" category', () => {
      const result = filterByCategory(mockReviews, 'dormitory');
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('dormitory');
    });

    it('should filter reviews by "group-activity" category', () => {
      const result = filterByCategory(mockReviews, 'group-activity');
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('group-activity');
    });

    it('should return an empty array for a non-matching category', () => {
      const result = filterByCategory(mockReviews, 'non-existent');
      expect(result).toEqual([]);
    });

    it('should return an empty array when reviews array is empty', () => {
      const result = filterByCategory([], 'cafe');
      expect(result).toEqual([]);
    });
  });
});

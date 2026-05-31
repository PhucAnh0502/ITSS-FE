import { describe, it, expect } from 'vitest';
import { getReviewsByWorkspace, getAllReviews } from '../../data/ReviewRepository';

describe('ReviewRepository', () => {
  describe('getAllReviews', () => {
    it('returns a promise that resolves to an array', async () => {
      const result = await getAllReviews();
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns all reviews from mock data', async () => {
      const result = await getAllReviews();
      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('returns reviews sorted by postedAt descending (most recent first)', async () => {
      const result = await getAllReviews();
      for (let i = 0; i < result.length - 1; i++) {
        const current = new Date(result[i].postedAt).getTime();
        const next = new Date(result[i + 1].postedAt).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });
  });

  describe('getReviewsByWorkspace', () => {
    it('returns only reviews for the specified workspace', async () => {
      const result = await getReviewsByWorkspace('the-lab-coffee');
      expect(result.length).toBeGreaterThanOrEqual(3);
      result.forEach((review) => {
        expect(review.workspaceId).toBe('the-lab-coffee');
      });
    });

    it('returns reviews sorted by postedAt descending', async () => {
      const result = await getReviewsByWorkspace('the-lab-coffee');
      for (let i = 0; i < result.length - 1; i++) {
        const current = new Date(result[i].postedAt).getTime();
        const next = new Date(result[i + 1].postedAt).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    it('returns empty array for a workspace with no reviews', async () => {
      const result = await getReviewsByWorkspace('non-existent-workspace');
      expect(result).toEqual([]);
    });
  });
});

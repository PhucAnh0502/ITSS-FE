// Feature: hust-workspace-finder, Property 8: Reviews sorted by recency
// Feature: hust-workspace-finder, Property 9: Review category filter correctness
// **Validates: Requirements 5.1, 5.4**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getReviews, filterByCategory } from '../../services/ReviewService';

// Valid review categories
const VALID_CATEGORIES = ['near-hust', 'cafe', 'dormitory', 'group-activity'];

// Generator for a valid ISO 8601 timestamp using integer milliseconds
const arbISOTimestamp = fc
  .integer({
    min: new Date('2020-01-01T00:00:00Z').getTime(),
    max: new Date('2025-12-31T23:59:59Z').getTime(),
  })
  .map((ms) => new Date(ms).toISOString());

// Generator for a review object with required fields
const arbReview = fc.record({
  id: fc.string({ minLength: 1, maxLength: 10 }),
  workspaceId: fc.string({ minLength: 1, maxLength: 10 }),
  postedAt: arbISOTimestamp,
  category: fc.constantFrom(...VALID_CATEGORIES),
});

// Generator for an array of reviews
const arbReviews = fc.array(arbReview, { minLength: 0, maxLength: 30 });

// Generator for a specific category selection
const arbCategory = fc.constantFrom(...VALID_CATEGORIES);

describe('ReviewService - Property Tests', () => {
  describe('Property 8: Reviews sorted by recency', () => {
    it('getReviews returns reviews in descending postedAt order', async () => {
      const reviews = await getReviews();

      // Verify that for any two adjacent reviews, the earlier one has a
      // postedAt timestamp >= the later one
      for (let i = 0; i < reviews.length - 1; i++) {
        const current = new Date(reviews[i].postedAt).getTime();
        const next = new Date(reviews[i + 1].postedAt).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    it('filterByCategory with "all" preserves input order (sorted reviews remain sorted)', () => {
      fc.assert(
        fc.property(arbReviews, (reviews) => {
          // Sort reviews by postedAt descending (simulating what getReviews does)
          const sorted = [...reviews].sort(
            (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
          );

          // filterByCategory with "all" should return them as-is (preserving order)
          const result = filterByCategory(sorted, 'all');

          // Verify the result maintains descending chronological order
          for (let i = 0; i < result.length - 1; i++) {
            const current = new Date(result[i].postedAt).getTime();
            const next = new Date(result[i + 1].postedAt).getTime();
            expect(current).toBeGreaterThanOrEqual(next);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 9: Review category filter correctness', () => {
    it('filterByCategory returns only reviews matching the selected category', () => {
      fc.assert(
        fc.property(arbReviews, arbCategory, (reviews, category) => {
          const result = filterByCategory(reviews, category);

          // Every result must have the matching category
          for (const review of result) {
            expect(review.category).toBe(category);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('filterByCategory returns all reviews that match the selected category (completeness)', () => {
      fc.assert(
        fc.property(arbReviews, arbCategory, (reviews, category) => {
          const result = filterByCategory(reviews, category);

          // All reviews with the matching category must be in the result
          const expectedMatches = reviews.filter((r) => r.category === category);
          expect(result).toHaveLength(expectedMatches.length);
        }),
        { numRuns: 100 }
      );
    });

    it('filterByCategory with "all" returns the full input array', () => {
      fc.assert(
        fc.property(arbReviews, (reviews) => {
          const result = filterByCategory(reviews, 'all');
          expect(result).toEqual(reviews);
          expect(result).toHaveLength(reviews.length);
        }),
        { numRuns: 100 }
      );
    });

    it('filterByCategory with null/undefined returns the full input array', () => {
      fc.assert(
        fc.property(arbReviews, (reviews) => {
          const resultNull = filterByCategory(reviews, null);
          expect(resultNull).toEqual(reviews);

          const resultUndefined = filterByCategory(reviews, undefined);
          expect(resultUndefined).toEqual(reviews);
        }),
        { numRuns: 100 }
      );
    });
  });
});

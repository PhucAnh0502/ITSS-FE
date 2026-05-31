// Feature: hust-workspace-finder, Property 10: Helpful toggle is self-inverse
// **Validates: Requirements 5.6**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, act } from '@testing-library/react';
import { useHelpful } from '../../hooks/useHelpful';

// Generator for arbitrary review IDs (non-empty strings)
const arbReviewId = fc.string({ minLength: 1, maxLength: 20 });

// Generator for non-negative integer base counts
const arbBaseCount = fc.nat({ max: 10000 });

describe('useHelpful - Property Tests', () => {
  describe('Property 10: Helpful toggle is self-inverse', () => {
    it('initial state: isHelpful is false and getCount returns baseCount', () => {
      fc.assert(
        fc.property(arbReviewId, arbBaseCount, (reviewId, baseCount) => {
          const { result } = renderHook(() => useHelpful());

          // Initial state: not helpful
          expect(result.current.isHelpful(reviewId)).toBe(false);
          expect(result.current.getCount(reviewId, baseCount)).toBe(baseCount);
        }),
        { numRuns: 100 }
      );
    });

    it('toggling once marks as helpful and increments count by 1', () => {
      fc.assert(
        fc.property(arbReviewId, arbBaseCount, (reviewId, baseCount) => {
          const { result } = renderHook(() => useHelpful());

          // Toggle once
          act(() => {
            result.current.toggleHelpful(reviewId);
          });

          // After first toggle: helpful is true, count is baseCount + 1
          expect(result.current.isHelpful(reviewId)).toBe(true);
          expect(result.current.getCount(reviewId, baseCount)).toBe(baseCount + 1);
        }),
        { numRuns: 100 }
      );
    });

    it('toggling twice returns to original state (self-inverse)', () => {
      fc.assert(
        fc.property(arbReviewId, arbBaseCount, (reviewId, baseCount) => {
          const { result } = renderHook(() => useHelpful());

          // Toggle once (mark as helpful)
          act(() => {
            result.current.toggleHelpful(reviewId);
          });

          // Toggle again (remove helpful)
          act(() => {
            result.current.toggleHelpful(reviewId);
          });

          // After second toggle: back to original state
          expect(result.current.isHelpful(reviewId)).toBe(false);
          expect(result.current.getCount(reviewId, baseCount)).toBe(baseCount);
        }),
        { numRuns: 100 }
      );
    });

    it('self-inverse property holds regardless of initial baseCount value', () => {
      fc.assert(
        fc.property(arbReviewId, arbBaseCount, (reviewId, baseCount) => {
          const { result } = renderHook(() => useHelpful());

          // Capture initial count
          const initialCount = result.current.getCount(reviewId, baseCount);
          expect(initialCount).toBe(baseCount);

          // Toggle on
          act(() => {
            result.current.toggleHelpful(reviewId);
          });
          const afterFirstToggle = result.current.getCount(reviewId, baseCount);
          expect(afterFirstToggle).toBe(baseCount + 1);

          // Toggle off
          act(() => {
            result.current.toggleHelpful(reviewId);
          });
          const afterSecondToggle = result.current.getCount(reviewId, baseCount);

          // Self-inverse: final count equals initial count
          expect(afterSecondToggle).toBe(initialCount);
        }),
        { numRuns: 100 }
      );
    });
  });
});

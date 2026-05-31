// Feature: hust-workspace-finder, Property 11: Navigation animation direction matches navigation type
// **Validates: Requirements 6.1, 6.2**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, act } from '@testing-library/react';
import { useTransition } from '../../hooks/useTransition';

// Generator for navigation types
const arbNavigationType = fc.constantFrom('forward', 'backward', 'tab');

// Generator for arbitrary sequences of navigation events
const arbNavigationSequence = fc.array(arbNavigationType, { minLength: 1, maxLength: 20 });

describe('useTransition - Property Tests', () => {
  describe('Property 11: Navigation animation direction matches navigation type', () => {
    it('forward navigation always produces slide-left direction', () => {
      fc.assert(
        fc.property(arbNavigationSequence, (sequence) => {
          const { result } = renderHook(() => useTransition());

          // Apply the sequence, then navigate forward
          for (const navType of sequence) {
            act(() => {
              result.current.onNavigate(navType);
            });
          }

          // After any sequence, a forward navigation must produce slide-left
          act(() => {
            result.current.onNavigate('forward');
          });

          expect(result.current.direction).toBe('slide-left');
        }),
        { numRuns: 100 }
      );
    });

    it('backward navigation always produces slide-right direction', () => {
      fc.assert(
        fc.property(arbNavigationSequence, (sequence) => {
          const { result } = renderHook(() => useTransition());

          // Apply the sequence, then navigate backward
          for (const navType of sequence) {
            act(() => {
              result.current.onNavigate(navType);
            });
          }

          // After any sequence, a backward navigation must produce slide-right
          act(() => {
            result.current.onNavigate('backward');
          });

          expect(result.current.direction).toBe('slide-right');
        }),
        { numRuns: 100 }
      );
    });

    it('tab navigation always produces fade direction', () => {
      fc.assert(
        fc.property(arbNavigationSequence, (sequence) => {
          const { result } = renderHook(() => useTransition());

          // Apply the sequence, then navigate via tab
          for (const navType of sequence) {
            act(() => {
              result.current.onNavigate(navType);
            });
          }

          // After any sequence, a tab navigation must produce fade
          act(() => {
            result.current.onNavigate('tab');
          });

          expect(result.current.direction).toBe('fade');
        }),
        { numRuns: 100 }
      );
    });

    it('direction mapping is consistent regardless of previous direction state', () => {
      fc.assert(
        fc.property(arbNavigationSequence, (sequence) => {
          const { result } = renderHook(() => useTransition());

          // For each navigation event in the sequence, verify the mapping holds
          for (const navType of sequence) {
            act(() => {
              result.current.onNavigate(navType);
            });

            const expectedDirection =
              navType === 'forward' ? 'slide-left' :
              navType === 'backward' ? 'slide-right' :
              'fade';

            expect(result.current.direction).toBe(expectedDirection);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});

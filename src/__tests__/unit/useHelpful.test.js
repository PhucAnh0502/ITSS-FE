import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHelpful } from '../../hooks/useHelpful';

describe('useHelpful', () => {
  it('should initialize with no reviews marked as helpful', () => {
    const { result } = renderHook(() => useHelpful());

    expect(result.current.isHelpful('review-1')).toBe(false);
    expect(result.current.getCount('review-1', 5)).toBe(5);
  });

  it('should mark a review as helpful when toggled', () => {
    const { result } = renderHook(() => useHelpful());

    act(() => {
      result.current.toggleHelpful('review-1');
    });

    expect(result.current.isHelpful('review-1')).toBe(true);
    expect(result.current.getCount('review-1', 5)).toBe(6);
  });

  it('should unmark a review when toggled again (self-inverse)', () => {
    const { result } = renderHook(() => useHelpful());

    act(() => {
      result.current.toggleHelpful('review-1');
    });
    expect(result.current.isHelpful('review-1')).toBe(true);
    expect(result.current.getCount('review-1', 5)).toBe(6);

    act(() => {
      result.current.toggleHelpful('review-1');
    });
    expect(result.current.isHelpful('review-1')).toBe(false);
    expect(result.current.getCount('review-1', 5)).toBe(5);
  });

  it('should handle multiple reviews independently', () => {
    const { result } = renderHook(() => useHelpful());

    act(() => {
      result.current.toggleHelpful('review-1');
      result.current.toggleHelpful('review-2');
    });

    expect(result.current.isHelpful('review-1')).toBe(true);
    expect(result.current.isHelpful('review-2')).toBe(true);
    expect(result.current.isHelpful('review-3')).toBe(false);

    expect(result.current.getCount('review-1', 3)).toBe(4);
    expect(result.current.getCount('review-2', 0)).toBe(1);
    expect(result.current.getCount('review-3', 10)).toBe(10);
  });

  it('should return baseCount when review is not marked helpful', () => {
    const { result } = renderHook(() => useHelpful());

    expect(result.current.getCount('any-review', 0)).toBe(0);
    expect(result.current.getCount('any-review', 42)).toBe(42);
  });

  it('should return baseCount + 1 when review is marked helpful', () => {
    const { result } = renderHook(() => useHelpful());

    act(() => {
      result.current.toggleHelpful('review-1');
    });

    expect(result.current.getCount('review-1', 0)).toBe(1);
    expect(result.current.getCount('review-1', 99)).toBe(100);
  });
});

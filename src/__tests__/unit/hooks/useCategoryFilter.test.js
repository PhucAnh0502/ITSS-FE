import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCategoryFilter } from '../../../hooks/useCategoryFilter';

const mockWorkspaces = [
  { id: '1', name: 'The Lab Coffee', category: 'cafe' },
  { id: '2', name: 'Green Garden Cafe', category: 'cafe' },
  { id: '3', name: 'Quiet Zone Library', category: 'library' },
  { id: '4', name: 'HUST Workspace', category: 'coworking' },
  { id: '5', name: 'Study Room A', category: 'study-room' },
];

describe('useCategoryFilter', () => {
  it('returns all workspaces when no category is selected', () => {
    const { result } = renderHook(() => useCategoryFilter(mockWorkspaces));
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.results).toEqual(mockWorkspaces);
  });

  it('filters workspaces by selected category', () => {
    const { result } = renderHook(() => useCategoryFilter(mockWorkspaces));
    act(() => {
      result.current.setCategory('cafe');
    });
    expect(result.current.selectedCategory).toBe('cafe');
    expect(result.current.results).toHaveLength(2);
    expect(result.current.results.every((ws) => ws.category === 'cafe')).toBe(true);
  });

  it('toggles category off when same category is selected again', () => {
    const { result } = renderHook(() => useCategoryFilter(mockWorkspaces));
    act(() => {
      result.current.setCategory('cafe');
    });
    expect(result.current.selectedCategory).toBe('cafe');
    act(() => {
      result.current.setCategory('cafe');
    });
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.results).toEqual(mockWorkspaces);
  });

  it('switches category when a different category is selected', () => {
    const { result } = renderHook(() => useCategoryFilter(mockWorkspaces));
    act(() => {
      result.current.setCategory('cafe');
    });
    expect(result.current.results).toHaveLength(2);
    act(() => {
      result.current.setCategory('library');
    });
    expect(result.current.selectedCategory).toBe('library');
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].name).toBe('Quiet Zone Library');
  });

  it('returns empty array when category has no matches', () => {
    const { result } = renderHook(() => useCategoryFilter(mockWorkspaces));
    act(() => {
      result.current.setCategory('nonexistent');
    });
    expect(result.current.results).toHaveLength(0);
  });

  it('handles null workspaces gracefully', () => {
    const { result } = renderHook(() => useCategoryFilter(null));
    expect(result.current.results).toEqual([]);
  });
});

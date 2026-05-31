import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSearch } from '../../../hooks/useSearch';

const mockWorkspaces = [
  { id: '1', name: 'The Lab Coffee', address: '123 Hai Bà Trưng' },
  { id: '2', name: 'Green Garden Cafe', address: '456 Đống Đa' },
  { id: '3', name: 'Quiet Zone Library', address: '789 Bach Khoa' },
  { id: '4', name: 'HUST Workspace', address: '1 Đại Cồ Việt' },
];

describe('useSearch', () => {
  it('returns all workspaces when query is empty', () => {
    const { result } = renderHook(() => useSearch(mockWorkspaces));
    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual(mockWorkspaces);
  });

  it('filters workspaces by name (case-insensitive)', () => {
    const { result } = renderHook(() => useSearch(mockWorkspaces));
    act(() => {
      result.current.setQuery('lab');
    });
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].name).toBe('The Lab Coffee');
  });

  it('filters workspaces by address', () => {
    const { result } = renderHook(() => useSearch(mockWorkspaces));
    act(() => {
      result.current.setQuery('Bach Khoa');
    });
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].name).toBe('Quiet Zone Library');
  });

  it('returns empty array when no matches found', () => {
    const { result } = renderHook(() => useSearch(mockWorkspaces));
    act(() => {
      result.current.setQuery('nonexistent');
    });
    expect(result.current.results).toHaveLength(0);
  });

  it('handles null workspaces gracefully', () => {
    const { result } = renderHook(() => useSearch(null));
    expect(result.current.results).toEqual([]);
  });

  it('updates results in real-time as query changes', () => {
    const { result } = renderHook(() => useSearch(mockWorkspaces));
    act(() => {
      result.current.setQuery('c');
    });
    const firstResults = result.current.results;
    act(() => {
      result.current.setQuery('coffee');
    });
    expect(result.current.results.length).toBeLessThanOrEqual(firstResults.length);
  });
});

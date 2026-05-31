import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFilters } from '../../../hooks/useFilters';

const mockWorkspaces = [
  { id: '1', name: 'Workspace A', availability: 'available', quietnessLevel: 4, hasWifi: true, hasPowerOutlets: true, distanceFromHust: 0.5 },
  { id: '2', name: 'Workspace B', availability: 'busy', quietnessLevel: 2, hasWifi: false, hasPowerOutlets: true, distanceFromHust: 1.5 },
  { id: '3', name: 'Workspace C', availability: 'available', quietnessLevel: 5, hasWifi: true, hasPowerOutlets: false, distanceFromHust: 3.0 },
  { id: '4', name: 'Workspace D', availability: 'available', quietnessLevel: 3, hasWifi: true, hasPowerOutlets: true, distanceFromHust: 0.8 },
];

describe('useFilters', () => {
  it('returns all workspaces when no filters are active', () => {
    const { result } = renderHook(() => useFilters(mockWorkspaces));
    expect(result.current.results).toEqual(mockWorkspaces);
    expect(result.current.activeFilters).toBe(0);
  });

  it('filters by availability', () => {
    const { result } = renderHook(() => useFilters(mockWorkspaces));
    act(() => {
      result.current.setFilter('availability', 'available');
    });
    expect(result.current.results).toHaveLength(3);
    expect(result.current.results.every((ws) => ws.availability === 'available')).toBe(true);
    expect(result.current.activeFilters).toBe(1);
  });

  it('filters by hasWifi', () => {
    const { result } = renderHook(() => useFilters(mockWorkspaces));
    act(() => {
      result.current.setFilter('hasWifi', true);
    });
    expect(result.current.results).toHaveLength(3);
    expect(result.current.results.every((ws) => ws.hasWifi === true)).toBe(true);
  });

  it('applies AND logic with multiple filters', () => {
    const { result } = renderHook(() => useFilters(mockWorkspaces));
    act(() => {
      result.current.setFilter('availability', 'available');
      result.current.setFilter('hasWifi', true);
      result.current.setFilter('maxDistance', 1.0);
    });
    // Only Workspace A (available, wifi, 0.5km) and D (available, wifi, 0.8km) match all three
    expect(result.current.results).toHaveLength(2);
    expect(result.current.activeFilters).toBe(3);
  });

  it('filters by maxDistance', () => {
    const { result } = renderHook(() => useFilters(mockWorkspaces));
    act(() => {
      result.current.setFilter('maxDistance', 1.0);
    });
    expect(result.current.results).toHaveLength(2);
    expect(result.current.results.every((ws) => ws.distanceFromHust <= 1.0)).toBe(true);
  });

  it('clearFilters resets all filters and shows all workspaces', () => {
    const { result } = renderHook(() => useFilters(mockWorkspaces));
    act(() => {
      result.current.setFilter('availability', 'available');
      result.current.setFilter('hasWifi', true);
    });
    expect(result.current.activeFilters).toBe(2);
    act(() => {
      result.current.clearFilters();
    });
    expect(result.current.results).toEqual(mockWorkspaces);
    expect(result.current.activeFilters).toBe(0);
  });

  it('handles null workspaces gracefully', () => {
    const { result } = renderHook(() => useFilters(null));
    expect(result.current.results).toEqual([]);
  });
});

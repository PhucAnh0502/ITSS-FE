import { describe, it, expect } from 'vitest';
import { applyFilters } from '../../services/FilterService';

const mockWorkspaces = [
  {
    id: 'ws-1',
    name: 'Quiet Cafe',
    availability: 'available',
    quietnessLevel: 5,
    hasWifi: true,
    hasPowerOutlets: true,
    distanceFromHust: 0.5,
  },
  {
    id: 'ws-2',
    name: 'Busy Library',
    availability: 'busy',
    quietnessLevel: 4,
    hasWifi: true,
    hasPowerOutlets: false,
    distanceFromHust: 1.2,
  },
  {
    id: 'ws-3',
    name: 'Noisy Hub',
    availability: 'available',
    quietnessLevel: 2,
    hasWifi: false,
    hasPowerOutlets: true,
    distanceFromHust: 3.0,
  },
  {
    id: 'ws-4',
    name: 'Closed Space',
    availability: 'closed',
    quietnessLevel: 3,
    hasWifi: true,
    hasPowerOutlets: true,
    distanceFromHust: 0.8,
  },
];

describe('FilterService - applyFilters', () => {
  it('returns all workspaces when filters are all null', () => {
    const filters = {
      availability: null,
      quietnessLevel: null,
      hasWifi: null,
      hasPowerOutlets: null,
      maxDistance: null,
    };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result).toEqual(mockWorkspaces);
  });

  it('returns all workspaces when filters object is null', () => {
    const result = applyFilters(mockWorkspaces, null);
    expect(result).toEqual(mockWorkspaces);
  });

  it('returns empty array when workspaces is null', () => {
    const filters = { availability: 'available' };
    const result = applyFilters(null, filters);
    expect(result).toEqual([]);
  });

  it('filters by availability', () => {
    const filters = { availability: 'available' };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result).toHaveLength(2);
    expect(result.every((ws) => ws.availability === 'available')).toBe(true);
  });

  it('filters by quietnessLevel', () => {
    const filters = { quietnessLevel: 4 };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ws-2');
  });

  it('filters by hasWifi', () => {
    const filters = { hasWifi: true };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result).toHaveLength(3);
    expect(result.every((ws) => ws.hasWifi === true)).toBe(true);
  });

  it('filters by hasPowerOutlets', () => {
    const filters = { hasPowerOutlets: true };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result).toHaveLength(3);
    expect(result.every((ws) => ws.hasPowerOutlets === true)).toBe(true);
  });

  it('filters by maxDistance', () => {
    const filters = { maxDistance: 1.0 };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result).toHaveLength(2);
    expect(result.every((ws) => ws.distanceFromHust <= 1.0)).toBe(true);
  });

  it('applies AND logic with multiple filters', () => {
    const filters = {
      availability: 'available',
      hasWifi: true,
      hasPowerOutlets: true,
    };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ws-1');
  });

  it('returns empty array when no workspace matches all criteria', () => {
    const filters = {
      availability: 'available',
      quietnessLevel: 5,
      hasWifi: false,
    };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result).toHaveLength(0);
  });

  it('handles empty workspaces array', () => {
    const filters = { availability: 'available' };
    const result = applyFilters([], filters);
    expect(result).toEqual([]);
  });

  it('includes workspace at exact maxDistance boundary', () => {
    const filters = { maxDistance: 1.2 };
    const result = applyFilters(mockWorkspaces, filters);
    expect(result.some((ws) => ws.id === 'ws-2')).toBe(true);
  });
});

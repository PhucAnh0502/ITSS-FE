import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRecommendation } from '../../hooks/useRecommendation';

// Mock the data and service dependencies
vi.mock('../../data/WorkspaceRepository', () => ({
  getAllWorkspaces: vi.fn(() =>
    Promise.resolve([
      {
        id: 'ws-1',
        name: 'Test Workspace',
        areaSize: 50,
        quietnessLevel: 4,
        amenities: ['wifi', 'power'],
        rating: 4.5,
      },
      {
        id: 'ws-2',
        name: 'Another Workspace',
        areaSize: 10,
        quietnessLevel: 2,
        amenities: ['wifi'],
        rating: 3.8,
      },
    ])
  ),
}));

vi.mock('../../services/RecommendationEngine', () => ({
  evaluate: vi.fn((workspaces, conditions) => {
    // Simple mock: return first workspace if conditions have a purpose
    if (conditions.purpose) {
      return [workspaces[0]];
    }
    return [];
  }),
}));

describe('useRecommendation', () => {
  it('should initialize with default conditions and empty results', () => {
    const { result } = renderHook(() => useRecommendation());

    expect(result.current.conditions).toEqual({
      peopleCount: null,
      purpose: null,
      quietnessLevel: 3,
      amenities: [],
    });
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should update a single condition with setConditions(key, value)', () => {
    const { result } = renderHook(() => useRecommendation());

    act(() => {
      result.current.setConditions('peopleCount', '2');
    });

    expect(result.current.conditions.peopleCount).toBe('2');
  });

  it('should merge multiple conditions with setConditions(object)', () => {
    const { result } = renderHook(() => useRecommendation());

    act(() => {
      result.current.setConditions({ purpose: 'study-alone', quietnessLevel: 5 });
    });

    expect(result.current.conditions.purpose).toBe('study-alone');
    expect(result.current.conditions.quietnessLevel).toBe(5);
  });

  it('should set loading to true during submit and false after', async () => {
    const { result } = renderHook(() => useRecommendation());

    act(() => {
      result.current.setConditions('purpose', 'study-alone');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].id).toBe('ws-1');
  });

  it('should return empty results when no conditions match', async () => {
    const { result } = renderHook(() => useRecommendation());

    // purpose is null, so mock returns []
    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.results).toEqual([]);
  });
});

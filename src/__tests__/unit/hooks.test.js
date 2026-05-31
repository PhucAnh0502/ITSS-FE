import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useReviews } from '../../hooks/useReviews';

// Mock the data repositories
vi.mock('../../data/WorkspaceRepository', () => ({
  getAllWorkspaces: vi.fn(),
  getWorkspaceById: vi.fn(),
}));

vi.mock('../../data/ReviewRepository', () => ({
  getAllReviews: vi.fn(),
  getReviewsByWorkspace: vi.fn(),
}));

import { getAllWorkspaces, getWorkspaceById } from '../../data/WorkspaceRepository';
import { getAllReviews, getReviewsByWorkspace } from '../../data/ReviewRepository';

describe('useWorkspaces', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return workspaces after loading', async () => {
    const mockData = [{ id: '1', name: 'Test Workspace' }];
    getAllWorkspaces.mockResolvedValue(mockData);

    const { result } = renderHook(() => useWorkspaces());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.workspaces).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should set error state when loading fails', async () => {
    getAllWorkspaces.mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useWorkspaces());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.workspaces).toEqual([]);
    expect(result.current.error).toBe('Không thể tải dữ liệu không gian làm việc');
  });

  it('should start with loading true and empty workspaces', () => {
    getAllWorkspaces.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useWorkspaces());

    expect(result.current.loading).toBe(true);
    expect(result.current.workspaces).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});

describe('useWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a workspace by id', async () => {
    const mockWorkspace = { id: 'ws-1', name: 'The Lab Coffee' };
    getWorkspaceById.mockResolvedValue(mockWorkspace);

    const { result } = renderHook(() => useWorkspace('ws-1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.workspace).toEqual(mockWorkspace);
    expect(result.current.error).toBeNull();
  });

  it('should set error state when loading fails', async () => {
    getWorkspaceById.mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useWorkspace('invalid-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.workspace).toBeNull();
    expect(result.current.error).toBe('Không thể tải dữ liệu không gian làm việc');
  });

  it('should refetch when id changes', async () => {
    const ws1 = { id: 'ws-1', name: 'Workspace 1' };
    const ws2 = { id: 'ws-2', name: 'Workspace 2' };
    getWorkspaceById.mockResolvedValueOnce(ws1).mockResolvedValueOnce(ws2);

    const { result, rerender } = renderHook(({ id }) => useWorkspace(id), {
      initialProps: { id: 'ws-1' },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.workspace).toEqual(ws1);

    rerender({ id: 'ws-2' });

    await waitFor(() => {
      expect(result.current.workspace).toEqual(ws2);
    });
  });
});

describe('useReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load all reviews when no workspaceId is provided', async () => {
    const mockReviews = [
      { id: 'r1', text: 'Great place' },
      { id: 'r2', text: 'Nice cafe' },
    ];
    getAllReviews.mockResolvedValue(mockReviews);

    const { result } = renderHook(() => useReviews());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.reviews).toEqual(mockReviews);
    expect(result.current.error).toBeNull();
    expect(getAllReviews).toHaveBeenCalled();
    expect(getReviewsByWorkspace).not.toHaveBeenCalled();
  });

  it('should load reviews for a specific workspace when workspaceId is provided', async () => {
    const mockReviews = [{ id: 'r1', workspaceId: 'ws-1', text: 'Good' }];
    getReviewsByWorkspace.mockResolvedValue(mockReviews);

    const { result } = renderHook(() => useReviews('ws-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.reviews).toEqual(mockReviews);
    expect(result.current.error).toBeNull();
    expect(getReviewsByWorkspace).toHaveBeenCalledWith('ws-1');
    expect(getAllReviews).not.toHaveBeenCalled();
  });

  it('should set error state when loading fails', async () => {
    getAllReviews.mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useReviews());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.reviews).toEqual([]);
    expect(result.current.error).toBe('Không thể tải đánh giá');
  });

  it('should refetch when workspaceId changes', async () => {
    const reviews1 = [{ id: 'r1', workspaceId: 'ws-1' }];
    const reviews2 = [{ id: 'r2', workspaceId: 'ws-2' }];
    getReviewsByWorkspace
      .mockResolvedValueOnce(reviews1)
      .mockResolvedValueOnce(reviews2);

    const { result, rerender } = renderHook(
      ({ workspaceId }) => useReviews(workspaceId),
      { initialProps: { workspaceId: 'ws-1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.reviews).toEqual(reviews1);

    rerender({ workspaceId: 'ws-2' });

    await waitFor(() => {
      expect(result.current.reviews).toEqual(reviews2);
    });
  });
});

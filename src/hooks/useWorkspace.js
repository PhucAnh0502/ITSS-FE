import { useState, useEffect } from 'react';
import { getWorkspaceById } from '../data/WorkspaceRepository';

/**
 * Hook to load a single workspace by ID.
 * @param {string} id - The workspace ID to load
 * @returns {{ workspace: Object|null, loading: boolean, error: string|null }}
 */
export function useWorkspace(id) {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWorkspace() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWorkspaceById(id);
        if (!cancelled) {
          setWorkspace(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Không thể tải dữ liệu không gian làm việc');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchWorkspace();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { workspace, loading, error };
}

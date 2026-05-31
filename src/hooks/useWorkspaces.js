import { useState, useEffect } from 'react';
import { getAllWorkspaces } from '../data/WorkspaceRepository';

/**
 * Hook to load all workspaces from the data layer.
 * @returns {{ workspaces: Array, loading: boolean, error: string|null }}
 */
export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWorkspaces() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllWorkspaces();
        if (!cancelled) {
          setWorkspaces(data);
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

    fetchWorkspaces();

    return () => {
      cancelled = true;
    };
  }, []);

  return { workspaces, loading, error };
}

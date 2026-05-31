import { useState, useCallback } from 'react';
import { getAllWorkspaces } from '../data/WorkspaceRepository';
import { evaluate } from '../services/RecommendationEngine';

/**
 * Hook for managing smart search recommendation state.
 * Maintains conditions, triggers evaluation, and returns top results.
 *
 * @returns {{ conditions: object, setConditions: function, submit: function, results: Array, loading: boolean }}
 */
export function useRecommendation() {
  const [conditions, setConditionsState] = useState({
    peopleCount: null,
    purpose: null,
    quietnessLevel: 3,
    amenities: [],
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Update conditions. Accepts either:
   * - (key, value) to update a single field
   * - (newConditions) object to merge multiple fields
   */
  const setConditions = useCallback((keyOrObj, value) => {
    if (typeof keyOrObj === 'string') {
      setConditionsState((prev) => ({ ...prev, [keyOrObj]: value }));
    } else if (typeof keyOrObj === 'object' && keyOrObj !== null) {
      setConditionsState((prev) => ({ ...prev, ...keyOrObj }));
    }
  }, []);

  /**
   * Submit conditions: loads all workspaces, evaluates them, and sets results.
   */
  const submit = useCallback(async () => {
    setLoading(true);
    try {
      const workspaces = await getAllWorkspaces();
      const recommended = evaluate(workspaces, conditions);
      setResults(recommended);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [conditions]);

  return { conditions, setConditions, submit, results, loading };
}

export default useRecommendation;

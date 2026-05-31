import { useState, useMemo } from 'react';
import { applyFilters } from '../services/FilterService';

const initialFilters = {
  availability: null,
  quietnessLevel: null,
  hasWifi: null,
  hasPowerOutlets: null,
  maxDistance: null,
};

/**
 * useFilters - Multi-criteria AND filtering hook for workspaces.
 *
 * @param {Array} workspaces - Array of workspace objects to filter
 * @returns {{ filters: Object, activeFilters: number, setFilter: Function, clearFilters: Function, results: Array }}
 */
export function useFilters(workspaces) {
  const [filters, setFilters] = useState({ ...initialFilters });

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ ...initialFilters });
  };

  const activeFilters = useMemo(() => {
    return Object.values(filters).filter((v) => v != null).length;
  }, [filters]);

  const results = useMemo(() => {
    return applyFilters(workspaces || [], filters);
  }, [workspaces, filters]);

  return { filters, activeFilters, setFilter, clearFilters, results };
}

export default useFilters;

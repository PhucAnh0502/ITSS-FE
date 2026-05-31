import { useState, useMemo } from 'react';

/**
 * useCategoryFilter - Category toggle filter hook for workspaces.
 * Selecting the same category again deselects it (toggle behavior).
 *
 * @param {Array} workspaces - Array of workspace objects to filter
 * @returns {{ selectedCategory: string|null, setCategory: Function, results: Array }}
 */
export function useCategoryFilter(workspaces) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const setCategory = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const results = useMemo(() => {
    if (!workspaces) return [];
    if (selectedCategory == null) return workspaces;
    return workspaces.filter((ws) => ws.category === selectedCategory);
  }, [workspaces, selectedCategory]);

  return { selectedCategory, setCategory, results };
}

export default useCategoryFilter;

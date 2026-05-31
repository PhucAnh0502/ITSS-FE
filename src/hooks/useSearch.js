import { useState, useMemo } from 'react';
import { search } from '../services/SearchService';

/**
 * useSearch - Real-time search hook for workspaces.
 * Performs case-insensitive matching on workspace name and address.
 *
 * @param {Array} workspaces - Array of workspace objects to search through
 * @returns {{ query: string, setQuery: Function, results: Array }}
 */
export function useSearch(workspaces) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    return search(workspaces || [], query);
  }, [workspaces, query]);

  return { query, setQuery, results };
}

export default useSearch;

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'hust-workspace-favorites';

/**
 * Read favorites from localStorage.
 * @returns {string[]} Array of workspace IDs
 */
function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Write favorites to localStorage.
 * @param {string[]} favorites
 */
function writeToStorage(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage might be full or unavailable
  }
}

/**
 * useFavorites - Manages favorite workspace IDs persisted in localStorage.
 *
 * @returns {{
 *   favorites: string[],
 *   isFavorite: (id: string) => boolean,
 *   toggleFavorite: (id: string) => void,
 *   count: number
 * }}
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(readFromStorage);

  // Sync to localStorage whenever favorites change
  useEffect(() => {
    writeToStorage(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fId) => fId !== id);
      }
      return [...prev, id];
    });
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    count: favorites.length,
  };
}

export default useFavorites;

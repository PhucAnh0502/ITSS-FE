/**
 * SearchService - Performs case-insensitive search on workspace name and address.
 */

/**
 * Searches workspaces by matching query against name and address fields.
 * @param {Array} workspaces - Array of workspace objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered workspaces matching the query
 */
export function search(workspaces, query) {
  if (!query || query.trim() === '') {
    return workspaces;
  }

  const normalizedQuery = query.toLowerCase();

  return workspaces.filter((workspace) => {
    const name = (workspace.name || '').toLowerCase();
    const address = (workspace.address || '').toLowerCase();
    return name.includes(normalizedQuery) || address.includes(normalizedQuery);
  });
}

export default { search };

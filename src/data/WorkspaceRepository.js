import workspacesData from './workspaces.json';

/**
 * Get all workspaces from mock data.
 * @returns {Promise<Array>} Array of workspace objects
 */
export function getAllWorkspaces() {
  return new Promise((resolve) => {
    try {
      const workspaces = workspacesData ?? [];
      resolve(workspaces);
    } catch (error) {
      resolve([]);
    }
  });
}

/**
 * Get a single workspace by its ID.
 * @param {string} id - The workspace ID
 * @returns {Promise<Object|null>} The workspace object or null if not found
 */
export function getWorkspaceById(id) {
  return new Promise((resolve) => {
    try {
      const workspaces = workspacesData ?? [];
      const workspace = workspaces.find((w) => w?.id === id) ?? null;
      resolve(workspace);
    } catch (error) {
      resolve(null);
    }
  });
}

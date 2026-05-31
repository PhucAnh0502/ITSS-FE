/**
 * FilterService - Applies AND-logic multi-criteria filtering on workspaces.
 */

/**
 * Filters workspaces based on active filter criteria using AND logic.
 * A workspace must satisfy ALL non-null filter criteria to be included.
 *
 * @param {Array} workspaces - Array of workspace objects
 * @param {Object} filters - Filter state object
 * @param {string|null} filters.availability - "available" | "busy" | null
 * @param {number|null} filters.quietnessLevel - 1-5 or null
 * @param {boolean|null} filters.hasWifi - true/false or null
 * @param {boolean|null} filters.hasPowerOutlets - true/false or null
 * @param {number|null} filters.maxDistance - Max km from HUST or null
 * @returns {Array} Workspaces satisfying all active filter criteria
 */
export function applyFilters(workspaces, filters) {
  if (!filters || !workspaces) {
    return workspaces || [];
  }

  return workspaces.filter((workspace) => {
    // Availability filter
    if (filters.availability != null) {
      if (workspace.availability !== filters.availability) {
        return false;
      }
    }

    // Quietness level filter
    if (filters.quietnessLevel != null) {
      if (workspace.quietnessLevel !== filters.quietnessLevel) {
        return false;
      }
    }

    // Wi-Fi filter
    if (filters.hasWifi != null) {
      if (workspace.hasWifi !== filters.hasWifi) {
        return false;
      }
    }

    // Power outlets filter
    if (filters.hasPowerOutlets != null) {
      if (workspace.hasPowerOutlets !== filters.hasPowerOutlets) {
        return false;
      }
    }

    // Max distance filter
    if (filters.maxDistance != null) {
      if (workspace.distanceFromHust > filters.maxDistance) {
        return false;
      }
    }

    return true;
  });
}

export default { applyFilters };

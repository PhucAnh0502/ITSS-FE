/**
 * RecommendationEngine - Scores workspaces against user conditions and returns top recommendations.
 *
 * Scoring algorithm:
 * 1. People capacity: +1 if workspace area supports the selected group size
 * 2. Purpose match: +1 if workspace amenities/quietness align with purpose
 * 3. Quietness match: +1 if workspace quietness level is within ±1 of requested level
 * 4. Amenities match: +1 for each matching amenity
 *
 * Results are sorted by score descending, ties broken by rating descending.
 * Returns top 3 (or fewer if less than 3 match any criterion).
 */

/**
 * Checks if workspace area supports the selected people count.
 * @param {number} areaSize - Workspace area in square meters
 * @param {string} peopleCount - "1" | "2" | "3-4" | "5+"
 * @returns {boolean}
 */
function matchesPeopleCapacity(areaSize, peopleCount) {
  switch (peopleCount) {
    case '1':
      return areaSize >= 5;
    case '2':
      return areaSize >= 10;
    case '3-4':
      return areaSize >= 30;
    case '5+':
      return areaSize >= 50;
    default:
      return false;
  }
}

/**
 * Checks if workspace aligns with the selected purpose.
 * @param {object} workspace - Workspace object
 * @param {string} purpose - "study-alone" | "group-work" | "meeting"
 * @returns {boolean}
 */
function matchesPurpose(workspace, purpose) {
  switch (purpose) {
    case 'study-alone':
      return workspace.quietnessLevel >= 4;
    case 'group-work':
      return workspace.areaSize >= 30;
    case 'meeting':
      return (workspace.amenities || []).includes('projector');
    default:
      return false;
  }
}

/**
 * Checks if workspace quietness is within ±1 of the requested level.
 * @param {number} workspaceQuietness - Workspace quietness level (1-5)
 * @param {number} requestedQuietness - Requested quietness level (1-5)
 * @returns {boolean}
 */
function matchesQuietness(workspaceQuietness, requestedQuietness) {
  return Math.abs(workspaceQuietness - requestedQuietness) <= 1;
}

/**
 * Counts how many requested amenities the workspace has.
 * @param {string[]} workspaceAmenities - Workspace amenities array
 * @param {string[]} requestedAmenities - Requested amenities array
 * @returns {number} Count of matching amenities
 */
function countMatchingAmenities(workspaceAmenities, requestedAmenities) {
  if (!requestedAmenities || requestedAmenities.length === 0) {
    return 0;
  }
  const wsAmenities = workspaceAmenities || [];
  return requestedAmenities.filter((amenity) => wsAmenities.includes(amenity)).length;
}

/**
 * Calculates the total score for a workspace against the given conditions.
 * @param {object} workspace - Workspace object
 * @param {object} conditions - SmartSearchConditions object
 * @returns {number} Total score
 */
export function calculateScore(workspace, conditions) {
  let score = 0;

  // +1 for people capacity match
  if (matchesPeopleCapacity(workspace.areaSize || 0, conditions.peopleCount)) {
    score += 1;
  }

  // +1 for purpose match
  if (matchesPurpose(workspace, conditions.purpose)) {
    score += 1;
  }

  // +1 for quietness within ±1
  if (matchesQuietness(workspace.quietnessLevel || 0, conditions.quietnessLevel || 0)) {
    score += 1;
  }

  // +1 per matching amenity
  score += countMatchingAmenities(workspace.amenities, conditions.amenities);

  return score;
}

/**
 * Evaluates all workspaces against the given conditions and returns top 3 recommendations.
 * @param {Array} workspaces - Array of workspace objects
 * @param {object} conditions - SmartSearchConditions object
 * @returns {Array} Top 3 workspaces sorted by score descending, ties broken by rating
 */
export function evaluate(workspaces, conditions) {
  if (!workspaces || workspaces.length === 0 || !conditions) {
    return [];
  }

  // Score each workspace
  const scored = workspaces.map((workspace) => ({
    workspace,
    score: calculateScore(workspace, conditions),
  }));

  // Filter to only workspaces that match at least one criterion (score > 0)
  const matching = scored.filter((item) => item.score > 0);

  // Sort by score descending, break ties by rating descending
  matching.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (b.workspace.rating || 0) - (a.workspace.rating || 0);
  });

  // Return top 3 (or fewer)
  return matching.slice(0, 3).map((item) => item.workspace);
}

export default { evaluate, calculateScore };

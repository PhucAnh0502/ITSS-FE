// Feature: hust-workspace-finder, Property 6: Recommendation scoring correctness
// Feature: hust-workspace-finder, Property 7: Recommendation returns top-3 by score
// **Validates: Requirements 4.2, 4.3**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { evaluate, calculateScore } from '../../services/RecommendationEngine';

// Valid amenities pool
const VALID_AMENITIES = ['wifi', 'power', 'ac', 'projector', 'parking'];

// SmartSearchConditions generator
const arbConditions = fc.record({
  peopleCount: fc.constantFrom('1', '2', '3-4', '5+'),
  purpose: fc.constantFrom('study-alone', 'group-work', 'meeting'),
  quietnessLevel: fc.integer({ min: 1, max: 5 }),
  amenities: fc.subarray(VALID_AMENITIES),
});

// Workspace generator with fields relevant to scoring
const arbWorkspace = fc.record({
  id: fc.string({ minLength: 1, maxLength: 10 }),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  areaSize: fc.integer({ min: 5, max: 200 }),
  quietnessLevel: fc.integer({ min: 1, max: 5 }),
  amenities: fc.subarray(VALID_AMENITIES),
  rating: fc.double({ min: 1.0, max: 5.0, noNaN: true }),
});

// Generator for an array of workspaces
const arbWorkspaces = fc.array(arbWorkspace, { minLength: 0, maxLength: 20 });

/**
 * Reference scoring implementation that mirrors the design spec:
 * 1. People capacity: +1 if workspace area supports group size
 * 2. Purpose match: +1 if workspace aligns with purpose
 * 3. Quietness match: +1 if |workspace.quietnessLevel - conditions.quietnessLevel| <= 1
 * 4. Amenities match: +1 per matching amenity
 */
function referenceScore(workspace, conditions) {
  let score = 0;

  // People capacity
  const areaSize = workspace.areaSize || 0;
  switch (conditions.peopleCount) {
    case '1': if (areaSize >= 5) score += 1; break;
    case '2': if (areaSize >= 10) score += 1; break;
    case '3-4': if (areaSize >= 30) score += 1; break;
    case '5+': if (areaSize >= 50) score += 1; break;
  }

  // Purpose match
  switch (conditions.purpose) {
    case 'study-alone': if ((workspace.quietnessLevel || 0) >= 4) score += 1; break;
    case 'group-work': if (areaSize >= 30) score += 1; break;
    case 'meeting': if ((workspace.amenities || []).includes('projector')) score += 1; break;
  }

  // Quietness match
  if (Math.abs((workspace.quietnessLevel || 0) - (conditions.quietnessLevel || 0)) <= 1) {
    score += 1;
  }

  // Amenities match
  const wsAmenities = workspace.amenities || [];
  const reqAmenities = conditions.amenities || [];
  for (const amenity of reqAmenities) {
    if (wsAmenities.includes(amenity)) {
      score += 1;
    }
  }

  return score;
}

describe('RecommendationEngine - Property Tests', () => {
  // Property 6: Recommendation scoring correctness
  describe('Property 6: Recommendation scoring correctness', () => {
    it('calculateScore equals sum of matched criteria (people capacity + purpose + quietness + amenities)', () => {
      fc.assert(
        fc.property(arbWorkspace, arbConditions, (workspace, conditions) => {
          const actual = calculateScore(workspace, conditions);
          const expected = referenceScore(workspace, conditions);
          expect(actual).toBe(expected);
        }),
        { numRuns: 100 }
      );
    });

    it('score is always non-negative', () => {
      fc.assert(
        fc.property(arbWorkspace, arbConditions, (workspace, conditions) => {
          const score = calculateScore(workspace, conditions);
          expect(score).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 100 }
      );
    });

    it('score is bounded by maximum possible (1 + 1 + 1 + number of requested amenities)', () => {
      fc.assert(
        fc.property(arbWorkspace, arbConditions, (workspace, conditions) => {
          const score = calculateScore(workspace, conditions);
          const maxScore = 3 + (conditions.amenities || []).length;
          expect(score).toBeLessThanOrEqual(maxScore);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 7: Recommendation returns top-3 by score
  describe('Property 7: Recommendation returns top-3 by score', () => {
    it('evaluate returns at most 3 workspaces', () => {
      fc.assert(
        fc.property(arbWorkspaces, arbConditions, (workspaces, conditions) => {
          const results = evaluate(workspaces, conditions);
          expect(results.length).toBeLessThanOrEqual(3);
        }),
        { numRuns: 100 }
      );
    });

    it('results are sorted in descending score order', () => {
      fc.assert(
        fc.property(arbWorkspaces, arbConditions, (workspaces, conditions) => {
          const results = evaluate(workspaces, conditions);
          for (let i = 0; i < results.length - 1; i++) {
            const scoreA = calculateScore(results[i], conditions);
            const scoreB = calculateScore(results[i + 1], conditions);
            expect(scoreA).toBeGreaterThanOrEqual(scoreB);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('ties are broken by rating (descending)', () => {
      fc.assert(
        fc.property(arbWorkspaces, arbConditions, (workspaces, conditions) => {
          const results = evaluate(workspaces, conditions);
          for (let i = 0; i < results.length - 1; i++) {
            const scoreA = calculateScore(results[i], conditions);
            const scoreB = calculateScore(results[i + 1], conditions);
            if (scoreA === scoreB) {
              expect(results[i].rating || 0).toBeGreaterThanOrEqual(results[i + 1].rating || 0);
            }
          }
        }),
        { numRuns: 100 }
      );
    });

    it('returned workspaces are the highest-scoring ones from the input', () => {
      fc.assert(
        fc.property(arbWorkspaces, arbConditions, (workspaces, conditions) => {
          const results = evaluate(workspaces, conditions);
          if (results.length === 0) return;

          // Score all workspaces and get those with score > 0
          const scored = workspaces
            .map((ws) => ({ workspace: ws, score: calculateScore(ws, conditions) }))
            .filter((item) => item.score > 0);

          // Sort by score desc, then rating desc
          scored.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.workspace.rating || 0) - (a.workspace.rating || 0);
          });

          // The top 3 from our reference sort should match the results
          const expectedTop3 = scored.slice(0, 3).map((item) => item.workspace);
          expect(results).toHaveLength(expectedTop3.length);
          for (let i = 0; i < results.length; i++) {
            expect(results[i]).toBe(expectedTop3[i]);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('only workspaces with score > 0 are returned', () => {
      fc.assert(
        fc.property(arbWorkspaces, arbConditions, (workspaces, conditions) => {
          const results = evaluate(workspaces, conditions);
          for (const ws of results) {
            expect(calculateScore(ws, conditions)).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});

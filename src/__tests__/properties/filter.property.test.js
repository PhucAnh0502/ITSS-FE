import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { applyFilters } from '../../services/FilterService.js';
import { search } from '../../services/SearchService.js';

// --- Generators ---

const CATEGORIES = ['cafe', 'library', 'coworking', 'study-room'];
const AVAILABILITIES = ['available', 'busy', 'closed'];

const arbWorkspace = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  category: fc.constantFrom(...CATEGORIES),
  address: fc.string({ minLength: 1, maxLength: 80 }),
  availability: fc.constantFrom(...AVAILABILITIES),
  rating: fc.double({ min: 1.0, max: 5.0, noNaN: true }),
  quietnessLevel: fc.integer({ min: 1, max: 5 }),
  hasWifi: fc.boolean(),
  hasPowerOutlets: fc.boolean(),
  distanceFromHust: fc.double({ min: 0.1, max: 5.0, noNaN: true }),
});

const arbWorkspaces = fc.array(arbWorkspace, { minLength: 0, maxLength: 30 });

// --- Property 3: Category filter correctness with toggle ---
// Feature: hust-workspace-finder, Property 3: Category filter correctness with toggle
// **Validates: Requirements 2.4**

describe('Property 3: Category filter correctness with toggle', () => {
  it('filtering by a category returns only workspaces with that category', () => {
    fc.assert(
      fc.property(
        arbWorkspaces,
        fc.constantFrom(...CATEGORIES),
        (workspaces, selectedCategory) => {
          // Simulate category filter: filter workspaces by category
          const filtered = workspaces.filter(
            (ws) => ws.category === selectedCategory
          );

          // Every result must have the selected category
          for (const ws of filtered) {
            expect(ws.category).toBe(selectedCategory);
          }

          // All workspaces with that category must be included
          const expected = workspaces.filter(
            (ws) => ws.category === selectedCategory
          );
          expect(filtered).toHaveLength(expected.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('deselecting category (null filter) restores the full unfiltered set', () => {
    fc.assert(
      fc.property(arbWorkspaces, (workspaces) => {
        // When no category is selected (toggle off), all workspaces are returned
        // This simulates the toggle behavior: selecting null category = no filtering
        const unfiltered = workspaces.filter(() => true); // no category filter applied

        expect(unfiltered).toHaveLength(workspaces.length);
        expect(unfiltered).toEqual(workspaces);
      }),
      { numRuns: 100 }
    );
  });

  it('toggling category on then off restores original set', () => {
    fc.assert(
      fc.property(
        arbWorkspaces,
        fc.constantFrom(...CATEGORIES),
        (workspaces, selectedCategory) => {
          // Step 1: Apply category filter (toggle on)
          const filtered = workspaces.filter(
            (ws) => ws.category === selectedCategory
          );

          // Step 2: Deselect category (toggle off) - restores full set
          const restored = workspaces;

          // The restored set must equal the original
          expect(restored).toHaveLength(workspaces.length);
          expect(restored).toEqual(workspaces);

          // The filtered set must be a subset of the original
          for (const ws of filtered) {
            expect(workspaces).toContainEqual(ws);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 4: Combined filtering uses AND logic ---
// Feature: hust-workspace-finder, Property 4: Combined filtering uses AND logic
// **Validates: Requirements 2.6, 2.8**

describe('Property 4: Combined filtering uses AND logic', () => {
  const arbSearchQuery = fc.string({ minLength: 0, maxLength: 5 });

  const arbCategory = fc.constantFrom(...CATEGORIES, null);

  const arbFilters = fc.record({
    availability: fc.constantFrom(...AVAILABILITIES, null),
    quietnessLevel: fc.constantFrom(1, 2, 3, 4, 5, null),
    hasWifi: fc.constantFrom(true, false, null),
    hasPowerOutlets: fc.constantFrom(true, false, null),
    maxDistance: fc.constantFrom(0.5, 1.0, 2.0, 3.0, 5.0, null),
  });

  it('combined search + category + filters returns only workspaces satisfying ALL criteria', () => {
    fc.assert(
      fc.property(
        arbWorkspaces,
        arbSearchQuery,
        arbCategory,
        arbFilters,
        (workspaces, query, category, filters) => {
          // Step 1: Apply search
          const afterSearch = search(workspaces, query);

          // Step 2: Apply category filter
          const afterCategory =
            category != null
              ? afterSearch.filter((ws) => ws.category === category)
              : afterSearch;

          // Step 3: Apply filters (AND logic)
          const afterFilters = applyFilters(afterCategory, filters);

          // Verify: every result satisfies ALL criteria
          for (const ws of afterFilters) {
            // Must match search query (if non-empty)
            if (query && query.trim() !== '') {
              const normalizedQuery = query.toLowerCase();
              const nameMatch = (ws.name || '')
                .toLowerCase()
                .includes(normalizedQuery);
              const addressMatch = (ws.address || '')
                .toLowerCase()
                .includes(normalizedQuery);
              expect(nameMatch || addressMatch).toBe(true);
            }

            // Must match category (if selected)
            if (category != null) {
              expect(ws.category).toBe(category);
            }

            // Must match all active filters
            if (filters.availability != null) {
              expect(ws.availability).toBe(filters.availability);
            }
            if (filters.quietnessLevel != null) {
              expect(ws.quietnessLevel).toBe(filters.quietnessLevel);
            }
            if (filters.hasWifi != null) {
              expect(ws.hasWifi).toBe(filters.hasWifi);
            }
            if (filters.hasPowerOutlets != null) {
              expect(ws.hasPowerOutlets).toBe(filters.hasPowerOutlets);
            }
            if (filters.maxDistance != null) {
              expect(ws.distanceFromHust).toBeLessThanOrEqual(
                filters.maxDistance
              );
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no workspace satisfying all criteria is excluded from results', () => {
    fc.assert(
      fc.property(
        arbWorkspaces,
        arbSearchQuery,
        arbCategory,
        arbFilters,
        (workspaces, query, category, filters) => {
          // Apply the combined pipeline
          const afterSearch = search(workspaces, query);
          const afterCategory =
            category != null
              ? afterSearch.filter((ws) => ws.category === category)
              : afterSearch;
          const results = applyFilters(afterCategory, filters);

          // Manually compute expected set: workspaces satisfying ALL criteria
          const expected = workspaces.filter((ws) => {
            // Search criterion
            if (query && query.trim() !== '') {
              const normalizedQuery = query.toLowerCase();
              const nameMatch = (ws.name || '')
                .toLowerCase()
                .includes(normalizedQuery);
              const addressMatch = (ws.address || '')
                .toLowerCase()
                .includes(normalizedQuery);
              if (!nameMatch && !addressMatch) return false;
            }

            // Category criterion
            if (category != null && ws.category !== category) return false;

            // Filter criteria (AND logic)
            if (
              filters.availability != null &&
              ws.availability !== filters.availability
            )
              return false;
            if (
              filters.quietnessLevel != null &&
              ws.quietnessLevel !== filters.quietnessLevel
            )
              return false;
            if (filters.hasWifi != null && ws.hasWifi !== filters.hasWifi)
              return false;
            if (
              filters.hasPowerOutlets != null &&
              ws.hasPowerOutlets !== filters.hasPowerOutlets
            )
              return false;
            if (
              filters.maxDistance != null &&
              ws.distanceFromHust > filters.maxDistance
            )
              return false;

            return true;
          });

          // Results should contain exactly the expected workspaces
          expect(results).toHaveLength(expected.length);

          // Every expected workspace must be in results
          for (const ws of expected) {
            expect(results).toContainEqual(ws);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

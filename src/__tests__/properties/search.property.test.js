// Feature: hust-workspace-finder, Property 2: Search returns only matching workspaces
// **Validates: Requirements 2.2**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { search } from '../../services/SearchService';

// Generator for a workspace object with name and address fields
const arbWorkspace = fc.record({
  id: fc.string({ minLength: 1, maxLength: 10 }),
  name: fc.string({ minLength: 0, maxLength: 50 }),
  address: fc.string({ minLength: 0, maxLength: 80 }),
});

// Generator for an array of workspaces
const arbWorkspaces = fc.array(arbWorkspace, { minLength: 0, maxLength: 20 });

// Generator for a non-empty, non-whitespace query string
const arbNonEmptyQuery = fc
  .string({ minLength: 1, maxLength: 20 })
  .filter((s) => s.trim().length > 0);

describe('SearchService - Property Tests', () => {
  it('Property 2: Search results contain only workspaces whose name or address includes the query (case-insensitive)', () => {
    fc.assert(
      fc.property(arbWorkspaces, arbNonEmptyQuery, (workspaces, query) => {
        const results = search(workspaces, query);
        const normalizedQuery = query.toLowerCase();

        // Every result must match the query in name or address
        for (const ws of results) {
          const nameMatch = (ws.name || '').toLowerCase().includes(normalizedQuery);
          const addressMatch = (ws.address || '').toLowerCase().includes(normalizedQuery);
          expect(nameMatch || addressMatch).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Search results include all matching workspaces (completeness)', () => {
    fc.assert(
      fc.property(arbWorkspaces, arbNonEmptyQuery, (workspaces, query) => {
        const results = search(workspaces, query);
        const normalizedQuery = query.toLowerCase();

        // Every workspace that matches must be in the results
        const expectedMatches = workspaces.filter((ws) => {
          const nameMatch = (ws.name || '').toLowerCase().includes(normalizedQuery);
          const addressMatch = (ws.address || '').toLowerCase().includes(normalizedQuery);
          return nameMatch || addressMatch;
        });

        expect(results).toHaveLength(expectedMatches.length);
        for (const expected of expectedMatches) {
          expect(results).toContain(expected);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Empty/null/whitespace query returns the full workspace list', () => {
    fc.assert(
      fc.property(arbWorkspaces, (workspaces) => {
        // Test with empty string
        expect(search(workspaces, '')).toEqual(workspaces);
        // Test with null
        expect(search(workspaces, null)).toEqual(workspaces);
        // Test with whitespace
        expect(search(workspaces, '   ')).toEqual(workspaces);
      }),
      { numRuns: 100 }
    );
  });
});

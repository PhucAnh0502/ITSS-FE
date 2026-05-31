// Feature: hust-workspace-finder, Property 1: Workspace card rendering completeness
// **Validates: Requirements 1.2, 4.4**

import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import WorkspaceCard from '../../components/WorkspaceCard';

afterEach(() => {
  cleanup();
});

// Generator for a valid workspace object with all required fields
const arbWorkspace = fc.record({
  id: fc.string({ minLength: 1, maxLength: 10 }),
  photos: fc.array(
    fc.webUrl(),
    { minLength: 1, maxLength: 5 }
  ),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  address: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0),
  availability: fc.constantFrom('available', 'busy', 'closed'),
  rating: fc.double({ min: 1.0, max: 5.0, noNaN: true }),
  reviewCount: fc.integer({ min: 1, max: 1000 }),
  description: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
  featureTags: fc.array(
    fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
    { minLength: 1, maxLength: 5 }
  ),
});

// Map availability status to expected Japanese badge labels
const statusLabels = {
  available: '空席あり',
  busy: '満席',
  closed: '閉店',
};

describe('WorkspaceCard - Property Tests', () => {
  it('Property 1: For any valid workspace, the rendered card contains photo, name, location, status, rating, description, and tags', () => {
    fc.assert(
      fc.property(arbWorkspace, (workspace) => {
        cleanup();
        const { container } = render(
          <WorkspaceCard workspace={workspace} onClick={() => {}} />
        );

        // 1. Photo (img element) is present with src matching photos[0]
        const img = container.querySelector('.workspace-card__image');
        expect(img).not.toBeNull();
        expect(img.getAttribute('src')).toBe(workspace.photos[0]);

        // 2. Name text is present in the name heading
        const nameEl = container.querySelector('.workspace-card__name');
        expect(nameEl).not.toBeNull();
        expect(nameEl.textContent).toBe(workspace.name);

        // 3. Address text is present in the location element
        const locationEl = container.querySelector('.workspace-card__location');
        expect(locationEl).not.toBeNull();
        expect(locationEl.textContent).toContain(workspace.address);

        // 4. Status badge is present with correct Japanese label
        const badgeEl = container.querySelector('.workspace-card__badge');
        expect(badgeEl).not.toBeNull();
        const expectedLabel = statusLabels[workspace.availability];
        expect(badgeEl.textContent).toBe(expectedLabel);

        // 5. Rating value is displayed
        const ratingEl = container.querySelector('.workspace-card__rating-value');
        expect(ratingEl).not.toBeNull();
        const displayRating = workspace.rating.toFixed(1);
        expect(ratingEl.textContent).toBe(displayRating);

        // 6. Description text is present
        const descEl = container.querySelector('.workspace-card__description');
        expect(descEl).not.toBeNull();
        expect(descEl.textContent).toBe(workspace.description);

        // 7. Feature tags are rendered (at least the first tag is visible)
        const tagEls = container.querySelectorAll('.workspace-card__tag');
        expect(tagEls.length).toBeGreaterThanOrEqual(1);
        expect(tagEls[0].textContent).toBe(workspace.featureTags[0]);
      }),
      { numRuns: 100 }
    );
  });
});

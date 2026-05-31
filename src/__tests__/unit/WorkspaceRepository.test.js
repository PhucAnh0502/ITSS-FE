import { describe, it, expect } from 'vitest';
import { getAllWorkspaces, getWorkspaceById } from '../../data/WorkspaceRepository';

describe('WorkspaceRepository', () => {
  describe('getAllWorkspaces', () => {
    it('returns a promise that resolves to an array', async () => {
      const result = await getAllWorkspaces();
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns all workspaces from mock data', async () => {
      const result = await getAllWorkspaces();
      expect(result.length).toBeGreaterThanOrEqual(8);
    });

    it('each workspace has an id field', async () => {
      const result = await getAllWorkspaces();
      result.forEach((workspace) => {
        expect(workspace).toHaveProperty('id');
        expect(typeof workspace.id).toBe('string');
      });
    });
  });

  describe('getWorkspaceById', () => {
    it('returns the correct workspace for a valid id', async () => {
      const result = await getWorkspaceById('the-lab-coffee');
      expect(result).not.toBeNull();
      expect(result.id).toBe('the-lab-coffee');
      expect(result.name).toBe('The Lab Coffee');
    });

    it('returns null for a non-existent id', async () => {
      const result = await getWorkspaceById('non-existent-id');
      expect(result).toBeNull();
    });

    it('returns null for undefined id', async () => {
      const result = await getWorkspaceById(undefined);
      expect(result).toBeNull();
    });
  });
});

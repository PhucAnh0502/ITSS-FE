import { describe, it, expect } from 'vitest';
import { search } from '../../services/SearchService';

const mockWorkspaces = [
  { id: '1', name: 'The Lab Coffee', address: '26 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội' },
  { id: '2', name: 'HUST Workspace', address: '1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội' },
  { id: '3', name: 'Green Garden Cafe', address: '15 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội' },
  { id: '4', name: 'Quiet Zone Library', address: '100 Đống Đa, Hà Nội' },
];

describe('SearchService', () => {
  describe('search()', () => {
    it('returns all workspaces when query is empty string', () => {
      const result = search(mockWorkspaces, '');
      expect(result).toEqual(mockWorkspaces);
    });

    it('returns all workspaces when query is null', () => {
      const result = search(mockWorkspaces, null);
      expect(result).toEqual(mockWorkspaces);
    });

    it('returns all workspaces when query is undefined', () => {
      const result = search(mockWorkspaces, undefined);
      expect(result).toEqual(mockWorkspaces);
    });

    it('returns all workspaces when query is whitespace only', () => {
      const result = search(mockWorkspaces, '   ');
      expect(result).toEqual(mockWorkspaces);
    });

    it('matches workspace by name (case-insensitive)', () => {
      const result = search(mockWorkspaces, 'lab');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('The Lab Coffee');
    });

    it('matches workspace by address (case-insensitive)', () => {
      const result = search(mockWorkspaces, 'Đống Đa');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Quiet Zone Library');
    });

    it('performs case-insensitive matching', () => {
      const result = search(mockWorkspaces, 'HUST');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('HUST Workspace');
    });

    it('returns multiple matches when query matches several workspaces', () => {
      const result = search(mockWorkspaces, 'Hai Bà Trưng');
      expect(result).toHaveLength(3);
    });

    it('returns empty array when no workspaces match', () => {
      const result = search(mockWorkspaces, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('handles empty workspace array', () => {
      const result = search([], 'coffee');
      expect(result).toEqual([]);
    });

    it('matches partial strings in name', () => {
      const result = search(mockWorkspaces, 'Coff');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('The Lab Coffee');
    });

    it('matches partial strings in address', () => {
      const result = search(mockWorkspaces, 'Đại Cồ');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('HUST Workspace');
    });

    it('handles workspaces with missing name gracefully', () => {
      const workspaces = [{ id: '1', address: 'Some Address' }];
      const result = search(workspaces, 'Some');
      expect(result).toHaveLength(1);
    });

    it('handles workspaces with missing address gracefully', () => {
      const workspaces = [{ id: '1', name: 'Test Place' }];
      const result = search(workspaces, 'Test');
      expect(result).toHaveLength(1);
    });
  });
});

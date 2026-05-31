import { describe, it, expect } from 'vitest';
import { evaluate, calculateScore } from '../../services/RecommendationEngine.js';

describe('RecommendationEngine', () => {
  const baseWorkspace = {
    id: 'test-ws',
    name: 'Test Workspace',
    category: 'cafe',
    address: '123 Test St',
    availability: 'available',
    rating: 4.0,
    quietnessLevel: 3,
    hasWifi: true,
    hasPowerOutlets: true,
    distanceFromHust: 1.0,
    areaSize: 40,
    amenities: ['wifi', 'power', 'ac'],
    featureTags: [],
  };

  describe('calculateScore', () => {
    it('should return 0 when no criteria match', () => {
      const workspace = { ...baseWorkspace, areaSize: 3, quietnessLevel: 1, amenities: [] };
      const conditions = {
        peopleCount: '1',
        purpose: 'study-alone',
        quietnessLevel: 5,
        amenities: ['projector'],
      };
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(0);
    });

    it('should give +1 for people capacity match (1 person, areaSize >= 5)', () => {
      const workspace = { ...baseWorkspace, areaSize: 5 };
      const conditions = { peopleCount: '1', purpose: 'meeting', quietnessLevel: 1, amenities: [] };
      // areaSize=5 >= 5 → +1, purpose meeting needs projector (not in amenities) → 0, quietness |3-1|=2 > 1 → 0
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(1);
    });

    it('should give +1 for people capacity match (2 people, areaSize >= 10)', () => {
      const workspace = { ...baseWorkspace, areaSize: 10 };
      const conditions = { peopleCount: '2', purpose: 'meeting', quietnessLevel: 1, amenities: [] };
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(1);
    });

    it('should give +1 for people capacity match (3-4 people, areaSize >= 30)', () => {
      const workspace = { ...baseWorkspace, areaSize: 30 };
      const conditions = { peopleCount: '3-4', purpose: 'meeting', quietnessLevel: 1, amenities: [] };
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(1);
    });

    it('should give +1 for people capacity match (5+ people, areaSize >= 50)', () => {
      const workspace = { ...baseWorkspace, areaSize: 50 };
      const conditions = { peopleCount: '5+', purpose: 'meeting', quietnessLevel: 1, amenities: [] };
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(1);
    });

    it('should give +1 for purpose match (study-alone, quietness >= 4)', () => {
      const workspace = { ...baseWorkspace, quietnessLevel: 4, areaSize: 3, amenities: [] };
      const conditions = { peopleCount: '5+', purpose: 'study-alone', quietnessLevel: 1, amenities: [] };
      // areaSize=3 < 50 → 0, purpose study-alone quietness=4 >= 4 → +1, |4-1|=3 > 1 → 0
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(1);
    });

    it('should give +1 for purpose match (group-work, areaSize >= 30)', () => {
      const workspace = { ...baseWorkspace, areaSize: 30, quietnessLevel: 1, amenities: [] };
      const conditions = { peopleCount: '5+', purpose: 'group-work', quietnessLevel: 5, amenities: [] };
      // areaSize=30 < 50 → 0, purpose group-work area=30 >= 30 → +1, |1-5|=4 > 1 → 0
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(1);
    });

    it('should give +1 for purpose match (meeting, has projector)', () => {
      const workspace = { ...baseWorkspace, areaSize: 3, quietnessLevel: 1, amenities: ['projector'] };
      const conditions = { peopleCount: '5+', purpose: 'meeting', quietnessLevel: 5, amenities: [] };
      // areaSize=3 < 50 → 0, purpose meeting has projector → +1, |1-5|=4 > 1 → 0
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(1);
    });

    it('should give +1 for quietness within ±1', () => {
      const workspace = { ...baseWorkspace, quietnessLevel: 3, areaSize: 3, amenities: [] };
      const conditions = { peopleCount: '5+', purpose: 'meeting', quietnessLevel: 4, amenities: [] };
      // areaSize=3 < 50 → 0, purpose meeting no projector → 0, |3-4|=1 <= 1 → +1
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(1);
    });

    it('should give +1 per matching amenity', () => {
      const workspace = { ...baseWorkspace, areaSize: 3, quietnessLevel: 1, amenities: ['wifi', 'power', 'ac'] };
      const conditions = { peopleCount: '5+', purpose: 'meeting', quietnessLevel: 5, amenities: ['wifi', 'ac'] };
      // areaSize=3 < 50 → 0, purpose meeting no projector → 0, |1-5|=4 > 1 → 0, amenities: wifi+ac = +2
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(2);
    });

    it('should accumulate all criteria scores', () => {
      const workspace = { ...baseWorkspace, areaSize: 50, quietnessLevel: 4, amenities: ['wifi', 'power', 'projector'] };
      const conditions = { peopleCount: '5+', purpose: 'study-alone', quietnessLevel: 4, amenities: ['wifi', 'power'] };
      // areaSize=50 >= 50 → +1, purpose study-alone quietness=4 >= 4 → +1, |4-4|=0 <= 1 → +1, amenities: wifi+power = +2
      const score = calculateScore(workspace, conditions);
      expect(score).toBe(5);
    });
  });

  describe('evaluate', () => {
    it('should return empty array for empty workspaces', () => {
      const conditions = { peopleCount: '1', purpose: 'study-alone', quietnessLevel: 3, amenities: [] };
      expect(evaluate([], conditions)).toEqual([]);
    });

    it('should return empty array for null workspaces', () => {
      const conditions = { peopleCount: '1', purpose: 'study-alone', quietnessLevel: 3, amenities: [] };
      expect(evaluate(null, conditions)).toEqual([]);
    });

    it('should return empty array for null conditions', () => {
      expect(evaluate([baseWorkspace], null)).toEqual([]);
    });

    it('should return at most 3 workspaces', () => {
      const workspaces = Array.from({ length: 10 }, (_, i) => ({
        ...baseWorkspace,
        id: `ws-${i}`,
        areaSize: 50,
        quietnessLevel: 4,
        amenities: ['wifi', 'power'],
        rating: 4.0 - i * 0.1,
      }));
      const conditions = { peopleCount: '5+', purpose: 'study-alone', quietnessLevel: 4, amenities: ['wifi'] };
      const results = evaluate(workspaces, conditions);
      expect(results.length).toBe(3);
    });

    it('should return fewer than 3 if fewer match', () => {
      const workspaces = [
        { ...baseWorkspace, id: 'ws-1', areaSize: 50, rating: 4.5 },
        { ...baseWorkspace, id: 'ws-2', areaSize: 3, quietnessLevel: 1, amenities: [], rating: 3.0 },
      ];
      const conditions = { peopleCount: '5+', purpose: 'meeting', quietnessLevel: 1, amenities: [] };
      // ws-1: areaSize=50 >= 50 → +1, purpose meeting no projector → 0, |3-1|=2 > 1 → 0 = score 1
      // ws-2: areaSize=3 < 50 → 0, purpose meeting no projector → 0, |1-1|=0 <= 1 → +1 = score 1
      const results = evaluate(workspaces, conditions);
      expect(results.length).toBe(2);
    });

    it('should sort by score descending', () => {
      const workspaces = [
        { ...baseWorkspace, id: 'low', areaSize: 5, quietnessLevel: 1, amenities: [], rating: 5.0 },
        { ...baseWorkspace, id: 'high', areaSize: 50, quietnessLevel: 4, amenities: ['wifi', 'power'], rating: 3.0 },
      ];
      const conditions = { peopleCount: '5+', purpose: 'study-alone', quietnessLevel: 4, amenities: ['wifi'] };
      // low: areaSize=5 < 50 → 0, purpose study-alone quietness=1 < 4 → 0, |1-4|=3 > 1 → 0, no amenities → 0 = score 0
      // high: areaSize=50 >= 50 → +1, purpose study-alone quietness=4 >= 4 → +1, |4-4|=0 <= 1 → +1, wifi → +1 = score 4
      const results = evaluate(workspaces, conditions);
      expect(results.length).toBe(1); // low has score 0, filtered out
      expect(results[0].id).toBe('high');
    });

    it('should break ties by rating descending', () => {
      const workspaces = [
        { ...baseWorkspace, id: 'low-rating', areaSize: 50, quietnessLevel: 4, amenities: ['wifi'], rating: 3.0 },
        { ...baseWorkspace, id: 'high-rating', areaSize: 50, quietnessLevel: 4, amenities: ['wifi'], rating: 4.8 },
      ];
      const conditions = { peopleCount: '5+', purpose: 'study-alone', quietnessLevel: 4, amenities: ['wifi'] };
      const results = evaluate(workspaces, conditions);
      expect(results[0].id).toBe('high-rating');
      expect(results[1].id).toBe('low-rating');
    });

    it('should exclude workspaces with score 0', () => {
      const workspaces = [
        { ...baseWorkspace, id: 'no-match', areaSize: 3, quietnessLevel: 1, amenities: [], rating: 5.0 },
      ];
      const conditions = { peopleCount: '5+', purpose: 'meeting', quietnessLevel: 5, amenities: ['projector'] };
      // areaSize=3 < 50 → 0, purpose meeting no projector → 0, |1-5|=4 > 1 → 0, no projector → 0 = score 0
      const results = evaluate(workspaces, conditions);
      expect(results.length).toBe(0);
    });

    it('should handle workspaces with missing fields gracefully', () => {
      const workspace = { id: 'minimal', name: 'Minimal', rating: 3.0 };
      const conditions = { peopleCount: '1', purpose: 'study-alone', quietnessLevel: 3, amenities: ['wifi'] };
      // Should not throw
      const results = evaluate([workspace], conditions);
      expect(Array.isArray(results)).toBe(true);
    });
  });
});

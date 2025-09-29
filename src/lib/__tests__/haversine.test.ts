// @ts-nocheck
// Tests are intended to run with Vitest (dev dependency). TypeScript types for Vitest may not be available in this environment.
import { describe, test, expect } from 'vitest';
import { haversineDistance, withinRadius } from '../haversine';

// Test known distance: approximate distance between two points
// Example: London (51.5074, -0.1278) to Paris (48.8566, 2.3522) ~ 343 km

describe('haversine helper', () => {
  test('computes approximate distance between London and Paris', () => {
    const d = haversineDistance(51.5074, -0.1278, 48.8566, 2.3522);
    // Accept approximate distance within 5km
    expect(d).toBeGreaterThan(338000);
    expect(d).toBeLessThan(348000);
  });

  test('withinRadius returns true for small radius', () => {
    // Two very close points in same location
    const aLat = 37.4219999;
    const aLon = -122.0840575;
    const bLat = 37.4220000;
    const bLon = -122.0840580;
    expect(withinRadius(aLat, aLon, bLat, bLon, 5)).toBe(true);
  });

  test('withinRadius returns false for large separation', () => {
    // San Francisco vs New York
    const sfLat = 37.7749;
    const sfLon = -122.4194;
    const nyLat = 40.7128;
    const nyLon = -74.0060;
    expect(withinRadius(sfLat, sfLon, nyLat, nyLon, 1000)).toBe(false);
  });
});

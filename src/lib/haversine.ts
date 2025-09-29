export function toRadians(deg: number) {
  return deg * (Math.PI / 180);
}

// Returns distance in meters between two lat/lng points
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function withinRadius(lat1: number, lon1: number, lat2: number, lon2: number, radiusMeters: number): boolean {
  return haversineDistance(lat1, lon1, lat2, lon2) <= radiusMeters;
}

/**
 * Geodesic and Measurement Utilities for Maps
 */

/**
 * Calculates geodesic distance between two [lng, lat] points in meters using Haversine.
 */
export function getDistanceBetweenPoints(coord1, coord2) {
  if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) return 0;
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371008.8; // Earth's mean radius in meters
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates the total length of polyline coordinates [[lng, lat], ...] in meters.
 */
export function getLineLengthMeters(coordinates) {
  if (!coordinates || coordinates.length < 2) return 0;
  let totalMeters = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalMeters += getDistanceBetweenPoints(coordinates[i], coordinates[i + 1]);
  }
  return totalMeters;
}

/**
 * Calculates the geodesic area of polygon coordinates [[lng, lat], ...] in square meters.
 */
export function getPolygonAreaSqMeters(coordinates) {
  if (!coordinates || coordinates.length < 3) return 0;
  const R = 6371008.8;
  let total = 0;
  const len = coordinates.length;
  for (let i = 0; i < len; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[(i + 1) % len];
    const rad1 = (p1[0] * Math.PI) / 180;
    const rad2 = (p2[0] * Math.PI) / 180;
    const lat1 = (p1[1] * Math.PI) / 180;
    const lat2 = (p2[1] * Math.PI) / 180;
    total += (rad2 - rad1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  return Math.abs((total * R * R) / 2);
}

/**
 * Formats distance in meters to localized string (m).
 */
export function formatDistance(meters) {
  if (meters === undefined || meters === null || isNaN(meters)) return '';
  return `${Math.round(meters).toLocaleString('pt-BR')} m`;
}

/**
 * Formats area in square meters to localized string (m²).
 */
export function formatArea(sqMeters) {
  if (sqMeters === undefined || sqMeters === null || isNaN(sqMeters)) return '';
  return `${Math.round(sqMeters).toLocaleString('pt-BR')} m²`;
}

/**
 * Calculates per-segment and total geodesic distances for a polyline [[lng, lat], ...]
 */
export function getLineSegmentDetails(coordinates) {
  if (!coordinates || coordinates.length < 2) {
    return { segments: [], totalMeters: 0, totalStr: '', summaryStr: '' };
  }

  const segments = [];
  let totalMeters = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[i + 1];
    const dist = getDistanceBetweenPoints(p1, p2);

    // Skip zero or near-zero duplicate points (less than 0.1 meters)
    if (dist < 0.1) continue;

    totalMeters += dist;

    // Calculate bearing angle from p1 to p2 in degrees (0 = North, 90 = East, 180 = South, 270 = West)
    const dLon = ((p2[0] - p1[0]) * Math.PI) / 180;
    const lat1 = (p1[1] * Math.PI) / 180;
    const lat2 = (p2[1] * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

    // Keep text upright (between -90 and 90 degrees relative to horizontal)
    let textAngle = bearing - 90;
    while (textAngle > 90) textAngle -= 180;
    while (textAngle < -90) textAngle += 180;

    const midPoint = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    segments.push({
      index: i + 1,
      p1,
      p2,
      midPoint,
      bearing,
      textAngle,
      distanceMeters: dist,
      distanceStr: formatDistance(dist),
    });
  }

  const totalStr = formatDistance(totalMeters);
  const summaryStr = segments.length > 1
    ? `${totalStr} (${segments.map(s => s.distanceStr).join(' + ')})`
    : `${totalStr}`;

  return {
    segments,
    totalMeters,
    totalStr,
    summaryStr,
  };
}

/**
 * Returns formatted measurement label for an annotation.
 */
export function getAnnotationMeasurement(ann) {
  if (!ann || !ann.coordinates) return '';
  if (ann.type === 'line') {
    const details = getLineSegmentDetails(ann.coordinates);
    return details.summaryStr || details.totalStr;
  }
  if (ann.type === 'polygon') {
    const area = getPolygonAreaSqMeters(ann.coordinates);
    return formatArea(area);
  }
  return '';
}

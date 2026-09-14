import * as satellite from "satellite.js";

/** Globe altitude units: multiples of Earth radius (km → alt = km / R). */
export const EARTH_RADIUS_KM = 6371;

export interface GeoPoint {
  lat: number;
  lng: number;
  alt: number;
}

export function satrecFromTle(line1: string, line2: string) {
  return satellite.twoline2satrec(line1, line2);
}

type SatRec = ReturnType<typeof satellite.twoline2satrec>;

export function geoPointFromSatrec(
  satrec: SatRec,
  date: Date
): GeoPoint | null {
  const result = satellite.propagate(satrec, date);
  if (!result || !result.position) return null;

  const gmst = satellite.gstime(date);
  const geo = satellite.eciToGeodetic(result.position, gmst);

  return {
    lat: satellite.degreesLat(geo.latitude),
    lng: satellite.degreesLong(geo.longitude),
    alt: geo.height / EARTH_RADIUS_KM,
  };
}

/** Sample ~one orbit for the 3D path. */
export function sampleIssOrbit(
  satrec: SatRec,
  start: Date,
  options?: { durationMin?: number; steps?: number }
) {
  const durationMin = options?.durationMin ?? 93;
  const steps = options?.steps ?? 200;
  const durationMs = durationMin * 60 * 1000;

  const orbit: GeoPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = new Date(start.getTime() + (durationMs * i) / steps);
    const point = geoPointFromSatrec(satrec, t);
    if (!point) continue;

    orbit.push(point);
  }

  return { orbit };
}

export type IssPath = {
  id: string;
  points: GeoPoint[];
};

export function buildIssPaths(orbit: GeoPoint[]): IssPath[] {
  return [{ id: "iss-orbit", points: orbit }];
}

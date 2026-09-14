"use client";

import { useEffect, useState } from "react";
import {
  buildIssPaths,
  geoPointFromSatrec,
  sampleIssOrbit,
  satrecFromTle,
  type GeoPoint,
  type IssPath,
} from "@/lib/world/satellite-orbit";

export interface IssOrbitState {
  name: string;
  paths: IssPath[];
  position: GeoPoint;
}

export function useIssOrbit() {
  const [iss, setIss] = useState<IssOrbitState | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tick: ReturnType<typeof setInterval> | undefined;

    async function load() {
      try {
        const res = await fetch("/api/satellite-tle");
        if (!res.ok) return;
        const data = (await res.json()) as {
          name: string;
          line1: string;
          line2: string;
        };

        const satrec = satrecFromTle(data.line1, data.line2);
        const now = new Date();
        const { orbit } = sampleIssOrbit(satrec, now);
        const position = geoPointFromSatrec(satrec, now);
        if (!position || cancelled) return;

        setIss({
          name: data.name.replace(/^0\s+/, "") || "ISS",
          paths: buildIssPaths(orbit),
          position,
        });

        tick = setInterval(() => {
          const next = geoPointFromSatrec(satrec, new Date());
          if (!next || cancelled) return;
          setIss((prev) => (prev ? { ...prev, position: next } : prev));
        }, 1000);
      } catch {
        // ISS overlay is optional — globe still works without it.
      }
    }

    load();
    return () => {
      cancelled = true;
      if (tick) clearInterval(tick);
    };
  }, []);

  return iss;
}

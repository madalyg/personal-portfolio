"use client";

import { useEffect, useState } from "react";
import type { GeoPoint, IssOrbitPayload, IssPath } from "@/lib/world/iss-types";

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
        const res = await fetch("/api/iss-orbit");
        if (!res.ok) return;
        const data = (await res.json()) as IssOrbitPayload;
        if (cancelled) return;

        setIss({
          name: data.name,
          paths: data.paths,
          position: data.position,
        });

        tick = setInterval(async () => {
          try {
            const posRes = await fetch("/api/iss-position");
            if (!posRes.ok || cancelled) return;
            const next = (await posRes.json()) as GeoPoint;
            setIss((prev) => (prev ? { ...prev, position: next } : prev));
          } catch {
            // keep last known position
          }
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

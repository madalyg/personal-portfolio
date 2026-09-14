"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Papa from "papaparse";
import { Eye, X } from "lucide-react";
import {
  AmbientLight,
  BackSide,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Raycaster,
  SphereGeometry,
  Vector2,
} from "three";
import type { GlobeMethods } from "react-globe.gl";
import {
  getNotebooksForLocation,
  isPdfNotebook,
  type PdfTravelNotebook,
  type TravelNotebook,
} from "@/lib/data/travel-notebooks";
import { GlobeViewfinder } from "@/components/world/globe-viewfinder";
import {
  flyToDoor,
  flyToGlobe,
  GLOBE_RETURN_MS,
  lockOrbitTargetToDoor,
  waitForCameraFlight,
} from "@/components/world/globe-door-travel";
import {
  createSpaceDoor,
  disposeSpaceDoor,
} from "@/components/world/space-door";
import { issHoverLabelHtml } from "@/components/world/iss-hover-label";
import { useIssOrbit } from "@/components/world/use-iss-orbit";
import type { IssPath } from "@/lib/world/iss-types";

const Globe = dynamic(
  () => import("three").then(() => import("react-globe.gl")),
  { ssr: false }
);
const NotebookViewer = dynamic(
  () => import("@/components/world/notebook-viewer").then((m) => m.NotebookViewer),
  { ssr: false }
);

interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
  galleryUrl: string | null;
  /** A location can have more than one — the viewer lets visitors cycle between them. */
  notebooks: TravelNotebook[];
}

const ACCENT = "#5eead4";
const ACCENT_DIM = "#2dd4bf";
const HIGHLIGHT = "#ff3864";
const GLOBE_ATMOSPHERE = "#5ad2d6";
const ISS_MARKER = "#fafafa";

const HIGHLIGHTED_LOCATIONS = new Set([
  "Washington D.C.",
  "Leon, Spain",
  "Denver, Colorado",
  "Paris, France",
]);

function isHighlightedLocation(location: LocationPoint) {
  return HIGHLIGHTED_LOCATIONS.has(location.name);
}

function toLocationPoint(d: object): LocationPoint {
  return d as LocationPoint;
}

function highlightRingColor(t: number) {
  const alpha = Math.pow(1 - t, 0.45);
  return `rgba(255, 65, 105, ${alpha})`;
}

function gallerySlugFromUrl(galleryUrl: string | null | undefined) {
  if (!galleryUrl) return null;
  const match = galleryUrl.match(/\/world\/([a-z0-9-]+)$/);
  return match?.[1] ?? null;
}

function resolveGalleryUrl(
  galleryUrl: string | null,
  activeSlugs: Set<string>
): string | null {
  const slug = gallerySlugFromUrl(galleryUrl);
  if (!slug || !activeSlugs.has(slug)) return null;
  return galleryUrl;
}

export function GlobeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const doorRef = useRef<Group | null>(null);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewModeRef = useRef<"globe" | "door">("globe");
  const transitioningRef = useRef(false);
  const unlockDoorTargetRef = useRef<(() => void) | null>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [locations, setLocations] = useState<LocationPoint[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<LocationPoint | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [openNotebooks, setOpenNotebooks] = useState<PdfTravelNotebook[] | null>(
    null
  );
  const iss = useIssOrbit();

  const issMarkerMesh = useMemo(
    () =>
      new Mesh(
        new SphereGeometry(0.32, 20, 20),
        new MeshBasicMaterial({ color: ISS_MARKER })
      ),
    []
  );

  const issObjectData = useMemo(() => {
    if (!iss) return [];
    return [{ ...iss.position, id: "iss" }];
  }, [iss]);

  const issPathsData = useMemo(() => iss?.paths ?? [], [iss?.paths]);

  // Measure container for a responsive canvas.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Load locations from CSV, but only treat a pin as an active gallery when
  // photos still exist on disk (active-galleries.json / API).
  useEffect(() => {
    let cancelled = false;

    async function loadLocations() {
      try {
        const [csvText, activeRes] = await Promise.all([
          fetch("/visited_locations.csv").then((r) => {
            if (!r.ok) throw new Error("CSV fetch failed");
            return r.text();
          }),
          fetch("/api/travel-galleries")
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

        let activeSlugs = new Set<string>(
          Array.isArray(activeRes?.slugs) ? activeRes.slugs : []
        );
        if (activeSlugs.size === 0) {
          const manifest = await fetch("/travel/active-galleries.json")
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []);
          if (Array.isArray(manifest)) {
            activeSlugs = new Set(manifest);
          }
        }

        if (cancelled) return;

        Papa.parse<Record<string, string>>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (cancelled) return;
            const rows = results.data
              .map((row) => {
                const lat = parseFloat(row["Latitude"]);
                const lng = parseFloat(row["Longitude"]);
                const name = row["Location Name"]?.trim();
                const rawGalleryUrl = row["galleryUrl"]?.trim() || null;
                if (!name || Number.isNaN(lat) || Number.isNaN(lng)) return null;
                return {
                  name,
                  lat,
                  lng,
                  galleryUrl: resolveGalleryUrl(rawGalleryUrl, activeSlugs),
                  notebooks: getNotebooksForLocation(name),
                } as LocationPoint;
              })
              .filter((row): row is LocationPoint => row !== null);
            setLocations(rows);
          },
          error: () => {
            if (!cancelled) setLoadError(true);
          },
        });
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    loadLocations();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-rotate, pausing gracefully while the visitor is interacting.
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !locations || !globeReady) return;

    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.4 }, 0);

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;

    const pause = () => {
      controls.autoRotate = false;
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
    const scheduleResume = () => {
      if (viewModeRef.current === "door") return;
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
      resumeTimeout.current = setTimeout(() => {
        if (viewModeRef.current === "globe") {
          controls.autoRotate = true;
        }
      }, 3000);
    };

    controls.addEventListener("start", pause);
    controls.addEventListener("end", scheduleResume);

    return () => {
      controls.removeEventListener("start", pause);
      controls.removeEventListener("end", scheduleResume);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, globeReady]);

  // White door floating far out in the starfield behind the globe.
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !globeReady) return;

    const door = createSpaceDoor();
    doorRef.current = door;
    globe.scene().add(door);

    return () => {
      doorRef.current = null;
      globe.scene().remove(door);
      disposeSpaceDoor(door);
    };
  }, [globeReady]);

  async function travelToDoor() {
    const globe = globeRef.current;
    const door = doorRef.current;
    if (!globe || !door || transitioningRef.current || viewModeRef.current === "door") {
      return;
    }

    transitioningRef.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    await flyToDoor(globe, door);
    unlockDoorTargetRef.current?.();
    unlockDoorTargetRef.current = lockOrbitTargetToDoor(globe, door);
    viewModeRef.current = "door";
    transitioningRef.current = false;
  }

  async function travelToGlobe() {
    const globe = globeRef.current;
    if (!globe || transitioningRef.current || viewModeRef.current === "globe") {
      return;
    }

    transitioningRef.current = true;
    unlockDoorTargetRef.current?.();
    unlockDoorTargetRef.current = null;
    flyToGlobe(globe);
    await waitForCameraFlight(GLOBE_RETURN_MS);
    viewModeRef.current = "globe";
    transitioningRef.current = false;

    const controls = globe.controls();
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      if (viewModeRef.current === "globe") {
        controls.autoRotate = true;
      }
    }, 3000);
  }

  // Click the space door to fly toward it.
  useEffect(() => {
    const globe = globeRef.current;
    const door = doorRef.current;
    if (!globe || !globeReady || !door) return;

    const canvas = globe.renderer().domElement;
    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const handleClick = (event: MouseEvent) => {
      if (viewModeRef.current === "door" || transitioningRef.current) return;

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, globe.camera());
      const hits = raycaster.intersectObject(door, true);
      if (hits.length > 0) {
        event.stopPropagation();
        void travelToDoor();
      }
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
    // travelToDoor is stable enough for this listener; re-bind when globe mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeReady, locations]);

  const ringsData = useMemo(
    () => (locations ?? []).filter((d) => d.galleryUrl),
    [locations]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100svh-4rem)] min-h-0 w-full overflow-hidden bg-[#04070a]"
    >
      {dimensions.width > 0 && locations && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/world/earth-night.jpg?v=2"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          globeCurvatureResolution={2}
          showAtmosphere
          atmosphereColor={GLOBE_ATMOSPHERE}
          atmosphereAltitude={0.21}
          onGlobeReady={() => {
            setGlobeReady(true);
            const globe = globeRef.current;
            if (!globe) return;

            // Render at a higher internal resolution than the display's
            // native pixel ratio (the library clamps to 2x by default) so
            // points that sit close together stay crisp and distinguishable
            // instead of anti-aliasing into a single blurry blob.
            const renderer = globe.renderer();
            renderer.setPixelRatio(
              Math.min(Math.max(window.devicePixelRatio, 2) * 1.5, 3)
            );
            renderer.toneMappingExposure = 1.12;

            const scene = globe.scene();
            const maxAniso = renderer.capabilities.getMaxAnisotropy();

            // Cool blue fill so baked land reads dark blue, not gray.
            scene.traverse((obj) => {
              if (obj instanceof AmbientLight) {
                obj.color.setHex(0x7a96b0);
                obj.intensity = Math.PI * 1.38;
              }
              if (obj instanceof DirectionalLight) {
                obj.color.setHex(0xdce6f0);
                obj.intensity = 0.38 * Math.PI;
              }
            });

            // Anisotropic filtering keeps continent edges from smearing
            // when the camera is zoomed in at a glancing angle.
            scene.traverse((obj) => {
              if (!(obj instanceof Mesh)) return;
              const material = obj.material;
              if (!(material instanceof MeshPhongMaterial) || !material.map) {
                return;
              }
              if (material.side === BackSide) return;

              material.map.anisotropy = maxAniso;
              material.map.needsUpdate = true;
              if (material.bumpMap) {
                material.bumpMap.anisotropy = maxAniso;
                material.bumpMap.needsUpdate = true;
              }

              material.emissiveMap = material.map;
              material.emissive = new Color(0xfff2dc);
              material.emissiveIntensity = 0.48;
              material.color = new Color(0x9eb4c8);
              material.shininess = 2;
              material.specular = new Color(0x111111);
              material.needsUpdate = true;
            });
          }}
          pointsData={locations}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.01}
          pointResolution={32}
          pointRadius={(d: object) => {
            const loc = toLocationPoint(d);
            return loc.galleryUrl || loc.notebooks.length > 0 ? 0.45 : 0.28;
          }}
          pointColor={(d: object) => {
            const loc = toLocationPoint(d);
            if (isHighlightedLocation(loc)) return HIGHLIGHT;
            if (loc.galleryUrl || loc.notebooks.length > 0) return ACCENT;
            return ACCENT_DIM;
          }}
          pointLabel={(d: object) => toLocationPoint(d).name}
          onPointClick={(d: object) => {
            if (viewModeRef.current === "door" || transitioningRef.current) return;
            setSelected(toLocationPoint(d));
          }}
          onGlobeClick={() => {
            if (viewModeRef.current === "door" && !transitioningRef.current) {
              void travelToGlobe();
            }
          }}
          ringsData={ringsData}
          ringLat="lat"
          ringLng="lng"
          ringColor={(d: object) => {
            const loc = toLocationPoint(d);
            if (isHighlightedLocation(loc)) {
              return highlightRingColor;
            }
            return (t: number) => `rgba(94, 234, 212, ${1 - t})`;
          }}
          ringMaxRadius={(d: object) =>
            isHighlightedLocation(toLocationPoint(d)) ? 4.6 : 3.2
          }
          ringPropagationSpeed={(d: object) =>
            isHighlightedLocation(toLocationPoint(d)) ? 1.35 : 2
          }
          ringRepeatPeriod={(d: object) =>
            isHighlightedLocation(toLocationPoint(d)) ? 1000 : 1400
          }
          pathsData={issPathsData}
          pathPoints={(d: object) => (d as IssPath).points}
          pathPointLat="lat"
          pathPointLng="lng"
          pathPointAlt="alt"
          pathColor={() => ["#7dd3fc", "#38bdf8"]}
          pathStroke={0.16}
          objectsData={issObjectData}
          objectLat="lat"
          objectLng="lng"
          objectAltitude="alt"
          objectLabel={issHoverLabelHtml}
          objectThreeObject={issMarkerMesh}
        />
      )}

      {!locations && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs tracking-widest text-zinc-300">
          booting systems...
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-red-400">
          Could not load location data.
        </div>
      )}

      {locations && <GlobeViewfinder />}

      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1 font-mono text-[11px] uppercase tracking-widest text-zinc-300">
        <span>Drag to rotate · Scroll to zoom · Tap location to enter</span>
        {iss && (
          <span className="inline-flex items-center gap-1.5 text-zinc-300">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.65)]"
              aria-hidden
            />
            <span>LIVE: ISS (TLE tracking)</span>
          </span>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative m-4 w-full max-w-sm rounded-lg border border-white/10 bg-[#0a0f12]/95 p-6 shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute right-3 top-3 text-zinc-300 transition-colors duration-200 hover:text-zinc-200"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-4 pr-6">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-medium tracking-tight text-zinc-50">
                  {selected.name}
                </h3>

                {selected.galleryUrl && (
                  <Link
                    href={selected.galleryUrl}
                    className="group mt-4 inline-flex items-center gap-2 border-t border-white/10 pt-4 font-mono text-xs uppercase tracking-widest text-teal-300 transition-colors duration-200 hover:text-teal-200"
                  >
                    <Eye
                      className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                    More
                  </Link>
                )}
              </div>

              {selected.notebooks.length > 0 && (() => {
                const pdfNotebooks = selected.notebooks.filter(isPdfNotebook);
                const researchHref = selected.notebooks.find((n) => n.href)?.href;
                const notebookIcon = (
                  <Image
                    src="/notebook-icon.jpg"
                    alt=""
                    width={112}
                    height={112}
                    className="h-[112px] w-[112px] object-cover transition-transform duration-300 ease-precise group-hover:scale-105"
                  />
                );

                if (pdfNotebooks.length > 0) {
                  return (
                    <button
                      type="button"
                      onClick={() => setOpenNotebooks(pdfNotebooks)}
                      aria-label={`Open notebook for ${selected.name}`}
                      title="Open notebook"
                      className="group relative shrink-0 overflow-hidden rounded-md transition-transform duration-200"
                    >
                      {notebookIcon}
                    </button>
                  );
                }

                if (researchHref) {
                  return (
                    <Link
                      href={researchHref}
                      onClick={() => setSelected(null)}
                      aria-label={`View research for ${selected.name}`}
                      title="View research"
                      className="group relative shrink-0 overflow-hidden rounded-md transition-transform duration-200"
                    >
                      {notebookIcon}
                    </Link>
                  );
                }

                return null;
              })()}
            </div>
          </div>
        </div>
      )}

      {openNotebooks && (
        <NotebookViewer
          notebooks={openNotebooks}
          onClose={() => setOpenNotebooks(null)}
        />
      )}
    </div>
  );
}

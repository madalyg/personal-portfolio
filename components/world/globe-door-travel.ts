import type { GlobeMethods } from "react-globe.gl";
import type { Group } from "three";
import { Vector3 } from "three";

export const INITIAL_GLOBE_POV = { lat: 20, lng: 10, altitude: 2.4 } as const;
export const DOOR_FLIGHT_MS = 2800;
export const GLOBE_RETURN_MS = 2800;

/** Camera sits this many units past the door, looking back at its face. */
const DOOR_CAMERA_STANDOFF = 78;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function getDoorCameraPose(door: Group) {
  const doorPos = new Vector3();
  door.getWorldPosition(doorPos);
  const outward = doorPos.clone().normalize();
  const cameraPos = doorPos.clone().add(outward.multiplyScalar(DOOR_CAMERA_STANDOFF));
  return { cameraPos, targetPos: doorPos.clone() };
}

export function animateCameraFlight(
  globe: GlobeMethods,
  toCamera: Vector3,
  toTarget: Vector3,
  durationMs: number
): Promise<void> {
  return new Promise((resolve) => {
    const camera = globe.camera();
    const controls = globe.controls();
    const fromCamera = camera.position.clone();
    const fromTarget = controls.target.clone();
    const start = performance.now();

    controls.autoRotate = false;
    const wasEnabled = controls.enabled;
    controls.enabled = false;

    const tick = (now: number) => {
      const t = easeOutCubic(Math.min((now - start) / durationMs, 1));
      camera.position.lerpVectors(fromCamera, toCamera, t);
      controls.target.lerpVectors(fromTarget, toTarget, t);
      controls.update();

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        controls.enabled = wasEnabled;
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

/**
 * globe.gl snaps orbit target back to Earth on every change — keep it on the
 * door while the visitor is in door view.
 */
export function lockOrbitTargetToDoor(
  globe: GlobeMethods,
  door: Group
): () => void {
  const controls = globe.controls();
  const lock = () => {
    const doorPos = new Vector3();
    door.getWorldPosition(doorPos);
    controls.target.copy(doorPos);
  };
  controls.addEventListener("change", lock);
  return () => controls.removeEventListener("change", lock);
}

export async function flyToDoor(globe: GlobeMethods, door: Group) {
  const { cameraPos, targetPos } = getDoorCameraPose(door);
  const controls = globe.controls();
  controls.minDistance = 24;
  controls.maxDistance = globe.getGlobeRadius() * 6;
  await animateCameraFlight(globe, cameraPos, targetPos, DOOR_FLIGHT_MS);
}

export function flyToGlobe(globe: GlobeMethods) {
  const globeR = globe.getGlobeRadius();
  const controls = globe.controls();
  controls.target.set(0, 0, 0);
  controls.minDistance = globeR + Math.max(0.001, globe.camera().near * 1.1);
  controls.maxDistance = globeR * 100;
  controls.update();
  globe.pointOfView({ ...INITIAL_GLOBE_POV }, GLOBE_RETURN_MS);
}

export function waitForCameraFlight(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

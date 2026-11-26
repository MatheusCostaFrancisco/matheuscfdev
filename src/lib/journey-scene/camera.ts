import { MathUtils, Vector3 } from "three";
import type { PerspectiveCamera } from "three";

const FOCUS_DISTANCE = 60; // from the planet plane, along z
const FOLLOW_RATE = 3.5; // 1/s; higher is snappier
const PARALLAX_X = 5; // world units at full pointer deflection
const PARALLAX_Y = 3;
const TILT_RANGE_DEG = 25; // device tilt that equals full deflection
const TILT_REST_BETA_DEG = 45; // phone held at a comfortable reading angle
const LANDING_DISTANCE = 420; // how far back along z the landing flight starts
const LANDING_SECONDS = 1.6;

// iOS asks for a permission prompt before delivering orientation events; the
// journey never prompts, so there the tilt parallax is simply off.
function orientationNeedsPermission(): boolean {
  if (typeof DeviceOrientationEvent === "undefined") return true;
  return "requestPermission" in DeviceOrientationEvent;
}

export type CameraRig = {
  focusStage(index: number): void;
  /** Ends the landing flight at once, with the camera on its final position. */
  finishLanding(): void;
  update(delta: number): void;
  dispose(): void;
};

/**
 * Drives the camera: it flies (damped) to the stage chosen with focusStage
 * and adds a soft parallax from the mouse and, where it needs no permission
 * prompt, from the device tilt. Starts already on `initialIndex`, without a
 * flight. With `landing`, it instead starts far back along z and flies in to
 * the initial stage, decelerating, in LANDING_SECONDS. dispose() removes the
 * listeners.
 */
export function createCameraRig(
  camera: PerspectiveCamera,
  stops: readonly Vector3[],
  initialIndex: number,
  landing = false,
): CameraRig {
  const target = new Vector3();
  const goal = new Vector3();
  const lookAt = new Vector3();
  const lookTarget = new Vector3();
  const pointer = { x: 0, y: 0 };

  const setStop = (index: number) => {
    const last = stops.length - 1;
    const stop = stops[MathUtils.clamp(index, 0, Math.max(last, 0))];
    if (stop === undefined) return;
    lookTarget.copy(stop);
    target.set(stop.x, stop.y, stop.z + FOCUS_DISTANCE);
  };

  let landingTime = landing ? 0 : LANDING_SECONDS;

  setStop(initialIndex);
  lookAt.copy(lookTarget);
  camera.position.copy(target);
  if (landing) camera.position.z += LANDING_DISTANCE;
  camera.lookAt(lookAt);

  const setGoal = () =>
    goal.set(
      target.x + pointer.x * PARALLAX_X,
      target.y + pointer.y * PARALLAX_Y,
      target.z,
    );

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer.x = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
    pointer.y = -((event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
  };

  const onOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma === null || event.beta === null) return;
    pointer.x = MathUtils.clamp(event.gamma / TILT_RANGE_DEG, -1, 1);
    pointer.y = MathUtils.clamp(
      -(event.beta - TILT_REST_BETA_DEG) / TILT_RANGE_DEG,
      -1,
      1,
    );
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  const tilt = !orientationNeedsPermission();
  if (tilt) window.addEventListener("deviceorientation", onOrientation);

  return {
    focusStage: setStop,
    finishLanding() {
      if (landingTime >= LANDING_SECONDS) return;
      landingTime = LANDING_SECONDS;
      setGoal();
      camera.position.copy(goal);
      lookAt.copy(lookTarget);
      camera.lookAt(lookAt);
    },
    update(delta) {
      const k = 1 - Math.exp(-FOLLOW_RATE * delta);
      setGoal();
      if (landingTime < LANDING_SECONDS) {
        landingTime = Math.min(landingTime + delta, LANDING_SECONDS);
        const left = 1 - landingTime / LANDING_SECONDS;
        camera.position.set(goal.x, goal.y, goal.z + LANDING_DISTANCE * left ** 3);
      } else {
        camera.position.lerp(goal, k);
      }
      lookAt.lerp(lookTarget, k);
      camera.lookAt(lookAt);
    },
    dispose() {
      window.removeEventListener("pointermove", onPointerMove);
      if (tilt) window.removeEventListener("deviceorientation", onOrientation);
    },
  };
}

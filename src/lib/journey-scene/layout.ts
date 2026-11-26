import { Vector3 } from "three";

// Layout: nodes follow a gentle S-curve down the view, at a fixed depth. The
// spacing comes from the node count, so any number of worlds fits. On a
// portrait viewport the curve is narrowed and the camera comes closer, so the
// current and the next planet fill the tall stage (T-079).
const DEPTH = -120;
const HALF_HEIGHT = 52;
const CURVE_AMPLITUDE = 16;
const CURVE_TURNS = 1.25; // sine periods over the whole path
const PORTRAIT_AMPLITUDE_RATIO = 0.2; // of the spacing between nodes
const LANDSCAPE_DISTANCE = 60; // camera distance from the planet plane
const PORTRAIT_SPACINGS_IN_VIEW = 5; // path spacings that fit the stage height
// Look-at drop, in spacings: past 0.5 the pair sits above the stage center,
// leaving room under the next label for the bottom HUD panels.
const PORTRAIT_SHIFT_SPACINGS = 0.75;
const CAMERA_FOV_DEG = 60;

/** Camera framing of the path: distance from the plane and look-at shift. */
export type Framing = {
  /** Distance along z from the planet plane. */
  distance: number;
  /** Added to the look-at y of every stage but the last (negative: toward the next). */
  shift: number;
};

/** World distance between two consecutive stages. */
export function pathSpacing(count: number): number {
  return (HALF_HEIGHT * 2) / Math.max(count - 1, 1);
}

/** Position of every stage, in order; the camera rig flies between them. */
export function nodePositions(count: number, portrait: boolean): Vector3[] {
  const last = Math.max(count - 1, 1);
  const amplitude = portrait
    ? pathSpacing(count) * PORTRAIT_AMPLITUDE_RATIO
    : CURVE_AMPLITUDE;
  return Array.from({ length: count }, (_, index) => {
    const t = index / last;
    return new Vector3(
      Math.sin(t * Math.PI * 2 * CURVE_TURNS) * amplitude,
      HALF_HEIGHT - t * HALF_HEIGHT * 2,
      DEPTH,
    );
  });
}

/** Portrait frames the current stage and the next one, sitting in the upper half. */
export function framing(count: number, portrait: boolean): Framing {
  if (!portrait) return { distance: LANDSCAPE_DISTANCE, shift: 0 };
  const spacing = pathSpacing(count);
  const halfView = (spacing * PORTRAIT_SPACINGS_IN_VIEW) / 2;
  const distance = halfView / Math.tan((CAMERA_FOV_DEG / 2) * (Math.PI / 180));
  return { distance, shift: -spacing * PORTRAIT_SHIFT_SPACINGS };
}

export const CAMERA_FOV = CAMERA_FOV_DEG;

import type { Color, Object3D } from "three";
import type { JourneyState } from "../journey-state";

/** Order, count and status of every stage, straight from journeyState. */
export type SceneStages = Pick<JourneyState, "worlds" | "finalBoss">;

/**
 * Colors read from the journey theme tokens (ADR 0007, palette in ADR 0010),
 * never hardcoded. Each field names the CSS custom property it comes from.
 */
export type ScenePalette = {
  /** --journey-space: clear color and fog. */
  space: Color;
  /** --journey-star: white stars and lights. */
  star: Color;
  /** --journey-star-blue: blue-white stars. */
  starBlue: Color;
  /** --journey-current: current world state color (HUD tone). */
  current: Color;
  /** --journey-completed: completed world state color. */
  completed: Color;
  /** --journey-locked: locked state color (lock icon, unlit trail). */
  locked: Color;
  /** --color-accent-500 of the journey scale: legacy nebula sprites. */
  nebula: Color;
  /** --journey-nebula-indigo / -violet / -blue / -magenta: nebula stops. */
  nebulaIndigo: Color;
  nebulaViolet: Color;
  nebulaBlue: Color;
  nebulaMagenta: Color;
  /** --journey-core / -core-amber / -core-ember: current world warm core, white to orange. */
  core: Color;
  coreAmber: Color;
  coreEmber: Color;
  /** --journey-halo: blue-violet halo around the current world. */
  halo: Color;
  /** --journey-seal: gold ring or seal of completed worlds. */
  seal: Color;
  /** --journey-locked-body: dark, desaturated locked planet body. */
  lockedBody: Color;
  /** --journey-trail: blue-white light of the trail. */
  trail: Color;
};

/**
 * A part of the scene (the starfield, and the planets with their light trail). The scene adds
 * `object`, calls `update` once per frame with the seconds since the previous
 * frame, and calls `dispose` once on teardown to free what the layer created.
 */
export type SceneLayer = {
  object: Object3D;
  update(delta: number): void;
  dispose(): void;
};

/** A planet projected to the host: pixels from its top-left corner. */
export type LabelPoint = { x: number; y: number; visible: boolean };

/** What the React shell can do with a mounted scene. */
export type JourneySceneHandle = {
  /** Moves the camera to the stage at `index` (clamped to the stage count). */
  focusStage(index: number): void;
  /**
   * Receives every planet's host-pixel position after each rendered frame
   * (and once on set), in stage order. The array is reused between calls.
   * null stops tracking.
   */
  setLabelTracker(
    track: ((points: readonly LabelPoint[]) => void) | null,
  ): void;
  /** Highlights the planet under the pointer; null clears it. */
  hoverStage(index: number | null): void;
  /** Highlights the planet whose card has keyboard focus; null clears it. */
  highlightFocused(index: number | null): void;
  /** Stops (true) or resumes (false) the render loop; scene state is kept. */
  setPaused(paused: boolean): void;
  dispose(): void;
};

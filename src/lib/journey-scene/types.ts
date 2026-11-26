import type { Color, Object3D } from "three";
import type { JourneyState } from "../journey-state";

/** Order, count and status of every stage, straight from journeyState. */
export type SceneStages = Pick<JourneyState, "worlds" | "finalBoss">;

/** Colors read from the journey theme tokens (ADR 0007), never hardcoded. */
export type ScenePalette = {
  space: Color;
  star: Color;
  current: Color;
  completed: Color;
  locked: Color;
  nebula: Color;
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

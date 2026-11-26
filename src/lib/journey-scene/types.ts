import type { Color, Object3D } from "three";

/** Colors read from the journey theme tokens (ADR 0007), never hardcoded. */
export type ScenePalette = {
  space: Color;
  star: Color;
  current: Color;
  completed: Color;
  nebula: Color;
};

/**
 * A part of the scene (starfield now, planets and trail later). The scene adds
 * `object`, calls `update` once per frame with the seconds since the previous
 * frame, and calls `dispose` once on teardown to free what the layer created.
 */
export type SceneLayer = {
  object: Object3D;
  update(delta: number): void;
  dispose(): void;
};

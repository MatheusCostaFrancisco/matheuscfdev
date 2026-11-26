// Lazy entry of the journey 3D scene (ADR 0009). Only reached through
// import() from src/components/JourneyScene.tsx, so three stays out of the
// main chunk.
import { Color, FogExp2, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { createPlanets } from "./planets";
import { createStarfield } from "./starfield";
import type { SceneLayer, ScenePalette, SceneStages } from "./types";

export const MAX_PIXEL_RATIO = 2;
const MAX_FRAME_DELTA = 0.1; // seconds; avoids a jump after a long frame
const FOG_DENSITY = 0.0008;

function readColor(style: CSSStyleDeclaration, name: string): Color | null {
  const value = style.getPropertyValue(name).trim();
  return value === "" ? null : new Color(value);
}

// The tokens exist only under data-theme="journey" (ADR 0007). Without them
// the page is not the journey and the scene does not start.
function readPalette(host: HTMLElement): ScenePalette | null {
  const style = getComputedStyle(host);
  const space = readColor(style, "--journey-space");
  const star = readColor(style, "--color-fg");
  const current = readColor(style, "--journey-current");
  const completed = readColor(style, "--journey-completed");
  const locked = readColor(style, "--journey-locked");
  const nebula = readColor(style, "--color-accent-500");
  if (!space || !star || !current || !completed || !locked || !nebula)
    return null;
  return { space, star, current, completed, locked, nebula };
}

function noop(): void {
  // Nothing was created, so there is nothing to free.
}

/**
 * Mounts the scene canvas inside `host` and returns its teardown. The render
 * loop runs only while the document is visible; the pixel ratio is capped at
 * MAX_PIXEL_RATIO. Teardown (idempotent) stops the loop, disposes every layer
 * (geometries, materials, textures) and the renderer, releases the WebGL
 * context and removes the canvas. A lost WebGL context tears the scene down
 * too, leaving the HTML map as the view.
 */
export function mountJourneyScene(
  host: HTMLElement,
  stages: SceneStages,
): () => void {
  const palette = readPalette(host);
  if (palette === null) return noop;

  const renderer = new WebGLRenderer({ antialias: false, alpha: false });
  renderer.setClearColor(palette.space, 1);
  const canvas = renderer.domElement;
  canvas.className = "journey-scene-canvas";

  const scene = new Scene();
  scene.fog = new FogExp2(palette.space, FOG_DENSITY);
  const camera = new PerspectiveCamera(60, 1, 0.1, 2000);

  const layers: SceneLayer[] = [
    createStarfield(palette),
    createPlanets(palette, stages),
  ];
  for (const layer of layers) scene.add(layer.object);

  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  let frame = 0;
  let last = 0;
  let shown = false;

  const tick = (now: number) => {
    const delta = Math.min((now - last) / 1000, MAX_FRAME_DELTA);
    last = now;
    for (const layer of layers) layer.update(delta);
    renderer.render(scene, camera);
    if (!shown) {
      shown = true;
      canvas.dataset.ready = "true";
    }
    frame = requestAnimationFrame(tick);
  };

  const play = () => {
    if (frame !== 0 || document.hidden) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const onVisibilityChange = () => {
    if (document.hidden) pause();
    else play();
  };

  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    pause();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    for (const layer of layers) {
      scene.remove(layer.object);
      layer.dispose();
    }
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  function onContextLost(event: Event) {
    event.preventDefault();
    dispose();
  }

  canvas.addEventListener("webglcontextlost", onContextLost);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibilityChange);
  host.append(canvas);
  resize();
  play();

  return dispose;
}

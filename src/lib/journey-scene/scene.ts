// Lazy entry of the journey 3D scene (ADR 0009). Only reached through
// import() from src/components/JourneyScene.tsx, so three stays out of the
// main chunk.
import {
  Color,
  FogExp2,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { createBloom } from "./bloom";
import { createCameraRig } from "./camera";
import { createPlanets, nodePositions } from "./planets";
import { createStarfield } from "./starfield";
import type {
  JourneySceneHandle,
  SceneLayer,
  ScenePalette,
  SceneStages,
} from "./types";

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

const inertHandle: JourneySceneHandle = {
  focusStage() {
    // Nothing was created, so there is nothing to move.
  },
  pickStage() {
    return null;
  },
  hoverStage() {
    // Nothing was created, so there is nothing to highlight.
  },
  highlightFocused() {
    // Nothing was created, so there is nothing to highlight.
  },
  dispose() {
    // Nothing was created, so there is nothing to free.
  },
};

/**
 * Mounts the scene canvas inside `host` and returns its teardown. The render
 * loop runs only while the document is visible; the pixel ratio is capped at
 * MAX_PIXEL_RATIO. Teardown (idempotent) stops the loop, disposes every layer
 * (geometries, materials, textures) and the renderer, releases the WebGL
 * context and removes the canvas. A lost WebGL context tears the scene down
 * too, leaving the HTML map as the view. The camera starts on the stage at
 * `initialIndex` and `focusStage` flies it to another one.
 */
export function mountJourneyScene(
  host: HTMLElement,
  stages: SceneStages,
  initialIndex: number,
): JourneySceneHandle {
  const palette = readPalette(host);
  if (palette === null) return inertHandle;

  const renderer = new WebGLRenderer({ antialias: false, alpha: false });
  renderer.setClearColor(palette.space, 1);
  const canvas = renderer.domElement;
  canvas.className = "journey-scene-canvas";

  const scene = new Scene();
  scene.fog = new FogExp2(palette.space, FOG_DENSITY);
  const camera = new PerspectiveCamera(60, 1, 0.1, 2000);

  const planets = createPlanets(palette, stages);
  const layers: SceneLayer[] = [createStarfield(palette), planets];
  for (const layer of layers) scene.add(layer.object);
  const rig = createCameraRig(
    camera,
    nodePositions(stages.worlds.length + 1),
    initialIndex,
  );

  const bloom = createBloom(renderer, scene, camera, palette.space);

  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    bloom.setSize(width, height, pixelRatio);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const pickStage = (clientX: number, clientY: number): number | null => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    ndc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1),
    );
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects([...planets.bodies], false)[0];
    if (hit === undefined) return null;
    const index = planets.bodies.findIndex((body) => body === hit.object);
    return index < 0 ? null : index;
  };

  let frame = 0;
  let last = 0;
  let shown = false;

  const tick = (now: number) => {
    const delta = Math.min((now - last) / 1000, MAX_FRAME_DELTA);
    last = now;
    for (const layer of layers) layer.update(delta);
    rig.update(delta);
    bloom.render();
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
    rig.dispose();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    for (const layer of layers) {
      scene.remove(layer.object);
      layer.dispose();
    }
    bloom.dispose();
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

  return {
    focusStage: rig.focusStage,
    pickStage,
    hoverStage: planets.setHover,
    highlightFocused: planets.setFocus,
    dispose,
  };
}

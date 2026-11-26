// Lazy entry of the journey 3D scene (ADR 0009). Only reached through
// import() from src/components/JourneyScene.tsx, so three stays out of the
// main chunk.
import {
  Color,
  FogExp2,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { createBloom } from "./bloom";
import { createCameraRig } from "./camera";
import { CAMERA_FOV, framing, nodePositions } from "./layout";
import { createNebula } from "./nebula";
import { createPlanets } from "./planets";
import type { PlanetsLayer } from "./planets";
import { createStarfield } from "./starfield";
import type {
  JourneySceneHandle,
  LabelPoint,
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

const PALETTE_TOKENS = {
  space: "--journey-space",
  star: "--journey-star",
  starBlue: "--journey-star-blue",
  current: "--journey-current",
  completed: "--journey-completed",
  locked: "--journey-locked",
  nebulaIndigo: "--journey-nebula-indigo",
  nebulaViolet: "--journey-nebula-violet",
  nebulaBlue: "--journey-nebula-blue",
  nebulaMagenta: "--journey-nebula-magenta",
  core: "--journey-core",
  coreAmber: "--journey-core-amber",
  coreEmber: "--journey-core-ember",
  halo: "--journey-halo",
  seal: "--journey-seal",
  lockedBody: "--journey-locked-body",
  trail: "--journey-trail",
} satisfies Record<keyof ScenePalette, string>;

// The tokens exist only under data-theme="journey" (ADR 0007, ADR 0010).
// Without any one of them the page is not the journey and the scene does not
// start.
function readPalette(host: HTMLElement): ScenePalette | null {
  const style = getComputedStyle(host);
  const read = (key: keyof ScenePalette): Color | null =>
    readColor(style, PALETTE_TOKENS[key]);
  const space = read("space");
  const star = read("star");
  const starBlue = read("starBlue");
  const current = read("current");
  const completed = read("completed");
  const locked = read("locked");
  const nebulaIndigo = read("nebulaIndigo");
  const nebulaViolet = read("nebulaViolet");
  const nebulaBlue = read("nebulaBlue");
  const nebulaMagenta = read("nebulaMagenta");
  const core = read("core");
  const coreAmber = read("coreAmber");
  const coreEmber = read("coreEmber");
  const halo = read("halo");
  const seal = read("seal");
  const lockedBody = read("lockedBody");
  const trail = read("trail");
  if (
    !space ||
    !star ||
    !starBlue ||
    !current ||
    !completed ||
    !locked ||
    !nebulaIndigo ||
    !nebulaViolet ||
    !nebulaBlue ||
    !nebulaMagenta ||
    !core ||
    !coreAmber ||
    !coreEmber ||
    !halo ||
    !seal ||
    !lockedBody ||
    !trail
  )
    return null;
  return {
    space,
    star,
    starBlue,
    current,
    completed,
    locked,
    nebulaIndigo,
    nebulaViolet,
    nebulaBlue,
    nebulaMagenta,
    core,
    coreAmber,
    coreEmber,
    halo,
    seal,
    lockedBody,
    trail,
  };
}

/**
 * Mounts the scene canvas inside `host` and returns its handle (null when the
 * theme palette is missing, so the shell keeps the HTML map). The render
 * loop runs only while the document is visible and the host is in the
 * viewport; the pixel ratio is capped at
 * MAX_PIXEL_RATIO. Teardown (idempotent) stops the loop, disposes every layer
 * (geometries, materials, textures) and the renderer, releases the WebGL
 * context and removes the canvas. A lost WebGL context tears the scene down
 * too (and calls `onLost`), leaving the HTML map as the view. The camera starts on the stage at
 * `initialIndex` and `focusStage` flies it to another one. With `landing` it
 * first flies in from far back (T-078); pausing ends that flight at once.
 */
export function mountJourneyScene(
  host: HTMLElement,
  stages: SceneStages,
  initialIndex: number,
  onLost?: () => void,
  landing = false,
): JourneySceneHandle | null {
  const palette = readPalette(host);
  if (palette === null) return null;

  const renderer = new WebGLRenderer({ antialias: false, alpha: false });
  renderer.setClearColor(palette.space, 1);
  const canvas = renderer.domElement;
  canvas.className = "journey-scene-canvas";

  const scene = new Scene();
  scene.fog = new FogExp2(palette.space, FOG_DENSITY);
  const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 2000);

  const stageCount = stages.worlds.length + 1;
  // The host is hidden until the stage shows, so its size can still be 0 here.
  const isPortrait = () =>
    host.clientWidth > 0 && host.clientHeight > 0
      ? host.clientWidth < host.clientHeight
      : window.innerWidth < window.innerHeight;
  let portrait = isPortrait();
  let positions = nodePositions(stageCount, portrait);
  let planets: PlanetsLayer = createPlanets(palette, stages, portrait);
  const starfield = createStarfield(palette);
  const nebula = createNebula(palette);
  const layers: SceneLayer[] = [nebula, starfield, planets];
  for (const layer of layers) scene.add(layer.object);
  const rig = createCameraRig(
    camera,
    positions,
    framing(stageCount, portrait),
    initialIndex,
    landing,
  );

  let hovered: number | null = null;
  let focused: number | null = null;

  // Orientation flip (resize, device rotation): the path and the camera
  // framing are rebuilt for the new aspect, keeping the current stage.
  const relayout = () => {
    const next = isPortrait();
    if (next === portrait) return;
    portrait = next;
    const old = planets;
    scene.remove(old.object);
    old.dispose();
    positions = nodePositions(stageCount, portrait);
    planets = createPlanets(palette, stages, portrait);
    planets.setHover(hovered);
    planets.setFocus(focused);
    const slot = layers.indexOf(old);
    if (slot >= 0) layers[slot] = planets;
    scene.add(planets.object);
    rig.setLayout(positions, framing(stageCount, portrait));
  };

  const bloom = createBloom(renderer, scene, camera, palette.space);

  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    relayout();
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    bloom.setSize(width, height, pixelRatio);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Resizing clears the canvas; while paused, redraw the held frame once.
    if (userPaused && shown) {
      bloom.render();
      projectLabels();
    }
  };

  const projected = new Vector3();
  const points: LabelPoint[] = Array.from({ length: stageCount }, () => ({
    x: 0,
    y: 0,
    visible: false,
  }));
  let tracker: ((points: readonly LabelPoint[]) => void) | null = null;
  // Projects every planet to host pixels; the shell writes them to the DOM.
  const projectLabels = () => {
    if (tracker === null) return;
    const width = host.clientWidth;
    const height = host.clientHeight;
    camera.updateMatrixWorld();
    positions.forEach((position, index) => {
      const point = points[index];
      if (point === undefined) return;
      projected.copy(position).project(camera);
      point.x = ((projected.x + 1) / 2) * width;
      point.y = ((1 - projected.y) / 2) * height;
      point.visible =
        projected.z < 1 &&
        Math.abs(projected.x) <= 1 &&
        Math.abs(projected.y) <= 1;
    });
    tracker(points);
  };

  let frame = 0;
  let last = 0;
  let shown = false;
  let userPaused = false;
  let inView = true;

  const tick = (now: number) => {
    const delta = Math.min((now - last) / 1000, MAX_FRAME_DELTA);
    last = now;
    for (const layer of layers) layer.update(delta);
    rig.update(delta);
    nebula.object.position.copy(camera.position);
    projectLabels();
    bloom.render();
    if (!shown) {
      shown = true;
      canvas.dataset.ready = "true";
    }
    frame = requestAnimationFrame(tick);
  };

  const play = () => {
    if (frame !== 0 || document.hidden || userPaused || !inView) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const setPaused = (paused: boolean) => {
    userPaused = paused;
    if (paused) {
      pause();
      rig.finishLanding();
      if (shown) {
        bloom.render();
        projectLabels();
      }
    } else play();
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
    intersection.disconnect();
    sizeObserver.disconnect();
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
    onLost?.();
  }

  // The loop also rests while the stage is scrolled out of the viewport (or
  // hidden) and resumes when it comes back. The observer also tracks size
  // changes of the host, such as the stage being shown for the first time.
  const intersection = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (entry === undefined) return;
    inView = entry.isIntersecting;
    if (inView) play();
    else pause();
  });
  const sizeObserver = new ResizeObserver(resize);

  canvas.addEventListener("webglcontextlost", onContextLost);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibilityChange);
  host.append(canvas);
  intersection.observe(host);
  sizeObserver.observe(host);
  resize();
  play();

  return {
    focusStage(index) {
      rig.focusStage(index);
      // Paused, the loop does not run: place the labels once for the new focus.
      if (userPaused && shown) projectLabels();
    },
    setLabelTracker(track) {
      tracker = track;
      projectLabels();
    },
    hoverStage(index) {
      hovered = index;
      planets.setHover(index);
    },
    highlightFocused(index) {
      focused = index;
      planets.setFocus(index);
    },
    setPaused,
    dispose,
  };
}

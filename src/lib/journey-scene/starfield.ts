import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  Points,
  SRGBColorSpace,
  ShaderMaterial,
  Vector2,
} from "three";
import type { SceneLayer, ScenePalette } from "./types";

const FIXED_COUNT = 1100;
const FALLING_COUNT = 500;
const FAR_Z = 1600;
// Behind the planet plane (z -120), so no star crosses in front of a planet.
const NEAR_Z = 160;
const FADE_IN = 140; // units of travel over which a respawned star fades in
// Star field spread relative to depth, so the screen density stays even
// from near to far for a 60deg vertical FOV on wide and narrow viewports.
const SPREAD_X = 1.3;
const SPREAD_Y = 0.75;
const FALL_SPEED = 7; // units per second, away from the camera into the scene
const BLUE_SHARE = 0.3; // share of stars tinted with the blue-white token
const MIN_SIZE = 1.2;
const MAX_SIZE = 3.4;

const STAR_VERTEX = `
attribute float aSize;
attribute vec3 aColor;
uniform float uScale;
uniform float uFadeIn;
varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float depth = -mv.z;
  float fadeIn = uFadeIn > 0.0
    ? smoothstep(0.0, uFadeIn, -position.z - ${NEAR_Z.toFixed(1)})
    : 1.0;
  vColor = aColor * fadeIn * clamp(1.15 - depth / ${FAR_Z.toFixed(1)}, 0.0, 1.0);
  gl_PointSize = clamp(aSize * uScale / depth, 1.0, 12.0);
  gl_Position = projectionMatrix * mv;
}
`;

const STAR_FRAGMENT = `
uniform sampler2D uMap;
varying vec3 vColor;
void main() {
  float alpha = texture2D(uMap, gl_PointCoord).a;
  gl_FragColor = vec4(vColor * alpha, 1.0);
}
`;

const drawingSize = new Vector2();

function radialTexture(stops: readonly [number, string][]): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context !== null) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    for (const [offset, color] of stops) gradient.addColorStop(offset, color);
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function placeStar(
  positions: Float32Array,
  index: number,
  z: number,
  spreadDepth: number = -z,
): void {
  const depth = spreadDepth;
  positions[index * 3] = (Math.random() * 2 - 1) * depth * SPREAD_X;
  positions[index * 3 + 1] = (Math.random() * 2 - 1) * depth * SPREAD_Y;
  positions[index * 3 + 2] = z;
}

type StarLayer = {
  points: Points;
  positions: Float32Array;
  positionAttribute: BufferAttribute;
  count: number;
  dispose(): void;
};

function createStarLayer(
  palette: ScenePalette,
  count: number,
  texture: CanvasTexture,
  fadeIn: number,
): StarLayer {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const tint = new Color();
  for (let index = 0; index < count; index += 1) {
    placeStar(positions, index, -(NEAR_Z + Math.random() * (FAR_Z - NEAR_Z)));
    const base = Math.random() < BLUE_SHARE ? palette.starBlue : palette.star;
    tint.copy(base).multiplyScalar(0.55 + Math.random() * 0.45);
    tint.toArray(colors, index * 3);
    // Most stars small, a few large.
    sizes[index] = MIN_SIZE + Math.random() ** 3 * (MAX_SIZE - MIN_SIZE);
  }
  const positionAttribute = new BufferAttribute(positions, 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));

  const scale = { value: 400 };
  const material = new ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uScale: scale,
      uFadeIn: { value: fadeIn },
    },
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geometry, material);
  // The fall moves vertices, not the object: keep it from being culled.
  points.frustumCulled = false;
  points.onBeforeRender = (renderer) => {
    scale.value = renderer.getDrawingBufferSize(drawingSize).y / 2;
  };
  return {
    points,
    positions,
    positionAttribute,
    count,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

/**
 * Starfield with depth: a fixed layer of additive white and
 * blue-white star sprites, and a falling layer that drifts slowly into the
 * scene and respawns near the camera once a star passes the far plane. Sprites
 * are drawn procedurally; depth fades the far ones. Owns its geometry, materials and textures.
 */
export function createStarfield(palette: ScenePalette): SceneLayer {
  const group = new Group();

  const starTexture = radialTexture([
    [0, "rgba(255,255,255,1)"],
    [0.3, "rgba(255,255,255,0.6)"],
    [1, "rgba(255,255,255,0)"],
  ]);
  const fixed = createStarLayer(palette, FIXED_COUNT, starTexture, 0);
  const falling = createStarLayer(palette, FALLING_COUNT, starTexture, FADE_IN);
  group.add(fixed.points, falling.points);

  return {
    object: group,
    update(delta) {
      const { positions, positionAttribute, count } = falling;
      for (let index = 0; index < count; index += 1) {
        const zIndex = index * 3 + 2;
        const z = (positions[zIndex] ?? -NEAR_Z) - FALL_SPEED * delta;
        if (z < -FAR_Z) {
          // Same x/y spread as the initial placement, only z restarts.
          placeStar(
            positions,
            index,
            -NEAR_Z,
            NEAR_Z + Math.random() * (FAR_Z - NEAR_Z),
          );
        }
        else positions[zIndex] = z;
      }
      positionAttribute.needsUpdate = true;
    },
    dispose() {
      fixed.dispose();
      falling.dispose();
      starTexture.dispose();
    },
  };
}

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  NormalBlending,
  Points,
  PointsMaterial,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
} from "three";
import type { SceneLayer, ScenePalette } from "./types";

const STAR_COUNT = 1600;
const FAR_Z = 1600;
const NEAR_Z = 80; // respawn before a star grows past ~8 css px
// Star field spread relative to depth, so the screen density stays even
// from near to far for a 60deg vertical FOV on wide and narrow viewports.
const SPREAD_X = 1.3;
const SPREAD_Y = 0.75;
const DRIFT_SPEED = 6; // units per second towards the camera
const ROLL_SPEED = 0.004; // rad per second around the view axis

// Nebula clouds: peak opacity at or below the 0.22 alpha of the CSS nebula
// (ADR 0007), so HUD text over the scene keeps the AA contrast computed there.
type NebulaCloud = {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
};

const NEBULAE: readonly NebulaCloud[] = [
  { x: -520, y: 320, z: -1300, size: 1500, opacity: 0.22 },
  { x: 700, y: -380, z: -1100, size: 1300, opacity: 0.14 },
  { x: 60, y: -40, z: -1500, size: 1900, opacity: 0.08 },
];

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

function placeStar(positions: Float32Array, index: number, z: number): void {
  const depth = -z;
  positions[index * 3] = (Math.random() * 2 - 1) * depth * SPREAD_X;
  positions[index * 3 + 1] = (Math.random() * 2 - 1) * depth * SPREAD_Y;
  positions[index * 3 + 2] = z;
}

function pickStarColor(palette: ScenePalette): Color {
  const roll = Math.random();
  if (roll < 0.1) return palette.completed;
  if (roll < 0.3) return palette.current;
  return palette.star;
}

/**
 * Starfield with depth plus teal nebula clouds. Stars drift slowly towards the
 * camera and respawn at the far plane; exponential fog (set by the scene)
 * dims the far ones. Owns its geometry, materials and textures.
 */
export function createStarfield(palette: ScenePalette): SceneLayer {
  const group = new Group();

  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  for (let index = 0; index < STAR_COUNT; index += 1) {
    placeStar(positions, index, -(NEAR_Z + Math.random() * (FAR_Z - NEAR_Z)));
    pickStarColor(palette).toArray(colors, index * 3);
  }
  const positionAttribute = new BufferAttribute(positions, 3);
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", positionAttribute);
  starGeometry.setAttribute("color", new BufferAttribute(colors, 3));

  const starTexture = radialTexture([
    [0, "rgba(255,255,255,1)"],
    [0.35, "rgba(255,255,255,0.55)"],
    [1, "rgba(255,255,255,0)"],
  ]);
  const starMaterial = new PointsMaterial({
    size: 1.6,
    map: starTexture,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  });
  const stars = new Points(starGeometry, starMaterial);
  // The drift moves vertices, not the object: keep it from being culled.
  stars.frustumCulled = false;
  group.add(stars);

  const nebulaTexture = radialTexture([
    [0, "rgba(255,255,255,1)"],
    [0.45, "rgba(255,255,255,0.45)"],
    [1, "rgba(255,255,255,0)"],
  ]);
  const nebulaMaterials = NEBULAE.map(
    (cloud) =>
      new SpriteMaterial({
        map: nebulaTexture,
        color: palette.nebula,
        opacity: cloud.opacity,
        transparent: true,
        depthWrite: false,
        blending: NormalBlending,
        fog: false,
      }),
  );
  NEBULAE.forEach((cloud, index) => {
    const material = nebulaMaterials[index];
    if (material === undefined) return;
    const sprite = new Sprite(material);
    sprite.position.set(cloud.x, cloud.y, cloud.z);
    sprite.scale.set(cloud.size, cloud.size, 1);
    sprite.renderOrder = -1;
    group.add(sprite);
  });

  return {
    object: group,
    update(delta) {
      for (let index = 0; index < STAR_COUNT; index += 1) {
        const zIndex = index * 3 + 2;
        const z = (positions[zIndex] ?? -FAR_Z) + DRIFT_SPEED * delta;
        if (z > -NEAR_Z) placeStar(positions, index, -FAR_Z);
        else positions[zIndex] = z;
      }
      positionAttribute.needsUpdate = true;
      stars.rotation.z += ROLL_SPEED * delta;
    },
    dispose() {
      starGeometry.dispose();
      starMaterial.dispose();
      starTexture.dispose();
      for (const material of nebulaMaterials) material.dispose();
      nebulaTexture.dispose();
    },
  };
}

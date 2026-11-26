import {
  BackSide,
  Color,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
} from "three";
import type { SceneLayer, ScenePalette } from "./types";

// Scene copies the camera position onto the sphere every frame (skybox style),
// so RADIUS only has to stay inside the camera far plane (2000).
const RADIUS = 1800;
const SPIN_SPEED = 0.004; // radians per second around the vertical axis
// Caps the cloud brightness: protects the 3:1 contrast of the focus ring and the
// AA contrast of HUD text. Re-check contrast if INTENSITY goes above 0.85 or the
// magenta mix (hot * 0.6 in the shader) goes above 0.6.
const INTENSITY = 0.85;

const NEBULA_VERTEX = `
varying vec3 vDirection;
void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Value noise on the sphere direction, summed over four octaves, picks where
// each token sits; every color is mixed over the space color, no texture.
const NEBULA_FRAGMENT = `
uniform vec3 uSpace;
uniform vec3 uIndigo;
uniform vec3 uViolet;
uniform vec3 uBlue;
uniform vec3 uMagenta;
uniform float uIntensity;
varying vec3 vDirection;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 4; octave++) {
    sum += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return sum;
}

void main() {
  vec3 p = normalize(vDirection);
  float body = smoothstep(0.35, 0.8, fbm(p * 2.2));
  float tint = fbm(p * 1.6 + 7.3);
  float wisp = smoothstep(0.55, 0.85, fbm(p * 4.5 + 19.1));
  float hot = smoothstep(0.62, 0.9, fbm(p * 3.0 + 41.7));

  vec3 cloud = mix(uIndigo, uBlue, smoothstep(0.3, 0.6, tint));
  cloud = mix(cloud, uViolet, smoothstep(0.45, 0.75, fbm(p * 1.9 + 3.1)));
  cloud = mix(cloud, uMagenta, hot * 0.6);

  float amount = clamp(body * 0.8 + wisp * 0.35, 0.0, 1.0) * uIntensity;
  gl_FragColor = vec4(mix(uSpace, cloud, amount), 1.0);
}
`;

/**
 * Procedural blue-violet nebula: an inverted sphere around the scene whose
 * fragment shader mixes the nebula tokens (indigo, violet, blue, subtle
 * magenta) over the space color with noise; no image. It rotates slowly in
 * `update`, so it stops with the render loop. Owns its geometry and material.
 */
export function createNebula(palette: ScenePalette): SceneLayer {
  const geometry = new SphereGeometry(RADIUS, 48, 32);
  const material = new ShaderMaterial({
    uniforms: {
      uSpace: { value: new Color().copy(palette.space) },
      uIndigo: { value: new Color().copy(palette.nebulaIndigo) },
      uViolet: { value: new Color().copy(palette.nebulaViolet) },
      uBlue: { value: new Color().copy(palette.nebulaBlue) },
      uMagenta: { value: new Color().copy(palette.nebulaMagenta) },
      uIntensity: { value: INTENSITY },
    },
    vertexShader: NEBULA_VERTEX,
    fragmentShader: NEBULA_FRAGMENT,
    side: BackSide,
    depthWrite: false,
    fog: false,
  });
  const mesh = new Mesh(geometry, material);
  mesh.renderOrder = -2;
  mesh.frustumCulled = false;

  return {
    object: mesh,
    update(delta) {
      mesh.rotation.y += SPIN_SPEED * delta;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

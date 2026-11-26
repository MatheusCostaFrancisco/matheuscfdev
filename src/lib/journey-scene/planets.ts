import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  LineCurve3,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NormalBlending,
  Points,
  PointsMaterial,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import type { JourneyStatus } from "../journey-state";
import { BLOOM_LAYER } from "./bloom";
import { nodePositions, pathSpacing } from "./layout";
import type { SceneLayer, ScenePalette, SceneStages } from "./types";

const MAX_RADIUS = 4;
const RADIUS_RATIO = 0.3; // of the spacing between nodes
const BOSS_SCALE = 1.25;
const TRAIL_RADIUS = 0.18;
const PULSE_SPEED = 2.2; // rad per second
const ORBIT_SPEED = 0.9; // rad per second
const ORBIT_PARTICLES = 14;
const ATMOSPHERE_SCALE = 1.14; // shell radius over planet radius
const FLOW_SPEED = 0.35; // trail lengths per second
const FLOW_PER_SEGMENT = 3;
const FLARE_SPIN = 0.08; // rad per second
const SHELL_OPACITY = { base: 0.06, swing: 0.08 }; // atmosphere pulse range
const HALO_OPACITY = { base: 0.22, swing: 0.2 }; // current planet halo pulse range
const FOG_DRIFT_SPEED = 0.6; // rad per second
const FOG_DRIFT_AMOUNT = 0.08; // fraction of the fog size
// Hover and focus feedback: a lit planet grows and glows brighter, a locked
// one gets a smaller, dimmer lift so it still reads as unavailable.
const LIT_HIGHLIGHT = { scale: 0.2, emissive: 0.45 };
const LOCKED_HIGHLIGHT = { scale: 0.07, emissive: 0.18 };
const HIGHLIGHT_RATE = 10; // 1/s; exponential approach to the target

type Highlight = {
  node: Group;
  /** Writes the emissive level (or the core's brightness) for this planet. */
  setEmissive(value: number): void;
  base: number;
  lift: { scale: number; emissive: number };
  amount: number;
};

const CORE_RIPPLE = { amplitude: 0.045, frequency: 2.6, speed: 0.55 };
// base + LIT_HIGHLIGHT.emissive stays under 1.0 so hover never saturates the core.
const CORE_BASE_LEVEL = 0.5;

const CORE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  varying float vNoise;
  varying float vRim;

  float field(vec3 p, float t) {
    float a = sin(p.x * uFrequency + t) * sin(p.y * uFrequency * 1.3 - t * 0.8);
    float b = sin(p.z * uFrequency * 1.7 + t * 1.2 + p.x * 1.1);
    float c = sin((p.x + p.y + p.z) * uFrequency * 2.3 - t * 0.6);
    return a * 0.5 + b * 0.3 + c * 0.2;
  }

  void main() {
    float n = field(position, uTime);
    vNoise = n * 0.5 + 0.5;
    vec3 displaced = position + normal * n * uAmplitude * length(position);
    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
    vec3 viewNormal = normalize(normalMatrix * normal);
    vRim = 1.0 - abs(dot(viewNormal, normalize(-viewPosition.xyz)));
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const CORE_FRAGMENT = /* glsl */ `
  uniform vec3 uWhite;
  uniform vec3 uAmber;
  uniform vec3 uEmber;
  uniform float uLevel;
  varying float vNoise;
  varying float vRim;

  void main() {
    float heat = clamp(vNoise * 1.15 - vRim * 0.35, 0.0, 1.0);
    vec3 color = mix(uEmber, uAmber, smoothstep(0.1, 0.55, heat));
    color = mix(color, uWhite, smoothstep(0.75, 1.0, heat) * 0.4);
    gl_FragColor = vec4(color * uLevel, 1.0);
  }
`;

type Stage = { status: JourneyStatus; isBoss: boolean };
type AnyMaterial =
  | MeshBasicMaterial
  | MeshStandardMaterial
  | PointsMaterial
  | ShaderMaterial
  | SpriteMaterial;

function drawTexture(
  draw: (context: CanvasRenderingContext2D, size: number) => void,
): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context !== null) draw(context, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function glowTexture(): CanvasTexture {
  return drawTexture((context, size) => {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.35)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  });
}

function flareTexture(): CanvasTexture {
  return drawTexture((context, size) => {
    const center = size / 2;
    context.translate(center, center);
    for (let ray = 0; ray < 4; ray += 1) {
      const gradient = context.createLinearGradient(0, 0, center, 0);
      gradient.addColorStop(0, "rgba(255,255,255,0.9)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(0, -size * 0.025);
      context.lineTo(center, 0);
      context.lineTo(0, size * 0.025);
      context.closePath();
      context.fill();
      context.rotate(Math.PI / 2);
    }
  });
}

function sealTexture(fill: Color, ink: Color): CanvasTexture {
  return drawTexture((context, size) => {
    context.beginPath();
    context.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2);
    context.fillStyle = fill.getStyle();
    context.fill();
    context.lineWidth = size * 0.06;
    context.strokeStyle = ink.getStyle();
    context.stroke();
    context.beginPath();
    context.moveTo(size * 0.28, size * 0.52);
    context.lineTo(size * 0.44, size * 0.68);
    context.lineTo(size * 0.74, size * 0.34);
    context.lineWidth = size * 0.1;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  });
}

function lockTexture(ink: Color): CanvasTexture {
  return drawTexture((context, size) => {
    context.strokeStyle = ink.getStyle();
    context.fillStyle = ink.getStyle();
    context.lineWidth = size * 0.09;
    context.lineCap = "round";
    context.beginPath();
    context.arc(size / 2, size * 0.4, size * 0.16, Math.PI, 0);
    context.lineTo(size * 0.66, size * 0.52);
    context.moveTo(size * 0.34, size * 0.4);
    context.lineTo(size * 0.34, size * 0.52);
    context.stroke();
    context.beginPath();
    context.roundRect(
      size * 0.26,
      size * 0.5,
      size * 0.48,
      size * 0.34,
      size * 0.06,
    );
    context.fill();
  });
}

/** The planets layer also exposes highlight controls for hover and focus. */
export type PlanetsLayer = SceneLayer & {
  /** Planet under the pointer, or null. Lit planets grow and glow; locked ones get a dimmer lift. */
  setHover(index: number | null): void;
  /** Planet whose card has keyboard focus, or null. Same look as hover. */
  setFocus(index: number | null): void;
};

/**
 * One planet per world plus the final boss as a star at the end, linked by a
 * light trail. Count and order come from `stages`, whose statuses were
 * computed by journeyState (T-058); nothing here assigns a status. completed:
 * lit planet, ring and seal. current: atmosphere shell, ring, pulsing glow,
 * orbiting particles and the trail lit (with a light flow) up to it. locked:
 * dark, desaturated, lock marker and fog sprite, trail off. The final boss is
 * a star with rays and a flat corona, dim and grey while locked.
 * Owns every geometry, material and texture it creates. `portrait` picks the
 * narrow, vertical path layout; a change of orientation rebuilds the layer.
 */
export function createPlanets(
  palette: ScenePalette,
  stages: SceneStages,
  portrait: boolean,
): PlanetsLayer {
  const group = new Group();
  const stageList: Stage[] = [
    ...stages.worlds.map((world) => ({
      status: world.status,
      isBoss: false,
    })),
    { status: stages.finalBoss.status, isBoss: true },
  ];
  const positions = nodePositions(stageList.length, portrait);
  const spacing = pathSpacing(stageList.length);
  const radius = Math.min(MAX_RADIUS, spacing * RADIUS_RATIO);

  const lockedTone = palette.locked.clone().multiplyScalar(0.55);
  const glow = glowTexture();
  const flare = flareTexture();
  const seal = sealTexture(palette.completed, palette.space);
  const lock = lockTexture(palette.locked);
  const geometries: BufferGeometry[] = [];
  const materials: AnyMaterial[] = [];
  const track = <T extends BufferGeometry>(geometry: T): T => {
    geometries.push(geometry);
    return geometry;
  };
  const trackMaterial = <T extends AnyMaterial>(material: T): T => {
    materials.push(material);
    return material;
  };

  group.add(new AmbientLight(palette.star, 0.35));
  const sun = new DirectionalLight(palette.star, 2.2);
  sun.position.set(-40, 50, 30);
  group.add(sun);

  const pulses: { sprite: Sprite; base: number }[] = [];
  const shells: MeshBasicMaterial[] = [];
  const flares: SpriteMaterial[] = [];
  const fogs: { sprite: Sprite; base: number; phase: number }[] = [];
  const orbits: Group[] = [];
  const coreMaterials: ShaderMaterial[] = [];
  const highlights: Highlight[] = [];
  let hovered: number | null = null;
  let focused: number | null = null;

  stageList.forEach((stage, index) => {
    const position = positions[index];
    if (position === undefined) return;
    const size = stage.isBoss ? radius * BOSS_SCALE : radius;
    const node = new Group();
    node.position.copy(position);

    const lit = stage.status !== "locked";
    const emissiveBase = stage.isBoss ? 0.9 : 0.18;
    const tone =
      stage.status === "completed" ? palette.completed : palette.current;
    const isCore = stage.status === "current" && !stage.isBoss;
    const coreMaterial = isCore
      ? trackMaterial(
          new ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uAmplitude: { value: CORE_RIPPLE.amplitude },
              uFrequency: { value: CORE_RIPPLE.frequency },
              uWhite: { value: palette.core.clone() },
              uAmber: { value: palette.coreAmber.clone() },
              uEmber: { value: palette.coreEmber.clone() },
              uLevel: { value: CORE_BASE_LEVEL },
            },
            vertexShader: CORE_VERTEX,
            fragmentShader: CORE_FRAGMENT,
          }),
        )
      : null;
    const body = isCore
      ? null
      : trackMaterial(
          new MeshStandardMaterial(
            lit
              ? {
                  color: tone,
                  emissive: tone,
                  emissiveIntensity: emissiveBase,
                  roughness: 0.7,
                  metalness: 0,
                }
              : { color: lockedTone, roughness: 1, metalness: 0 },
          ),
        );
    const surface = coreMaterial ?? body;
    if (surface === null) return;
    const planet = new Mesh(
      track(new SphereGeometry(size, isCore ? 64 : 32, isCore ? 48 : 24)),
      surface,
    );
    // The core stays out of the bloom pass: its glow comes from the halo, so
    // the bloom does not wash the surface variation out to white.
    if (lit && !isCore) planet.layers.enable(BLOOM_LAYER);
    node.add(planet);
    if (body !== null && !lit) body.emissive.copy(lockedTone);
    if (coreMaterial !== null) {
      coreMaterials.push(coreMaterial);
      highlights.push({
        node,
        setEmissive(value) {
          coreMaterial.uniforms.uLevel.value = value;
        },
        base: CORE_BASE_LEVEL,
        lift: LIT_HIGHLIGHT,
        amount: 0,
      });
    } else if (body !== null) {
      highlights.push({
        node,
        setEmissive(value) {
          body.emissiveIntensity = value;
        },
        base: lit ? emissiveBase : 0,
        lift: lit ? LIT_HIGHLIGHT : LOCKED_HIGHLIGHT,
        amount: 0,
      });
    }

    if (stage.status === "current") {
      const shell = trackMaterial(
        new MeshBasicMaterial({
          color: palette.halo,
          transparent: true,
          opacity: SHELL_OPACITY.base,
          side: BackSide,
          blending: AdditiveBlending,
          depthWrite: false,
          fog: false,
        }),
      );
      const atmosphere = new Mesh(
        track(new SphereGeometry(size * ATMOSPHERE_SCALE, 32, 24)),
        shell,
      );
      atmosphere.layers.enable(BLOOM_LAYER);
      node.add(atmosphere);
      shells.push(shell);
    }

    if (stage.status !== "locked" && !stage.isBoss) {
      const ringMaterial = trackMaterial(
        new MeshBasicMaterial({
          color: palette.completed,
          transparent: true,
          opacity: 0.7,
          side: DoubleSide,
        }),
      );
      const ring = new Mesh(
        track(new RingGeometry(size * 1.45, size * 1.75, 64)),
        ringMaterial,
      );
      ring.rotation.set(Math.PI / 2.4, 0.3, 0);
      ring.layers.enable(BLOOM_LAYER);
      node.add(ring);
    }

    if (stage.status === "completed") {
      const sealSprite = new Sprite(
        trackMaterial(new SpriteMaterial({ map: seal, fog: false })),
      );
      sealSprite.scale.setScalar(size * 0.85);
      sealSprite.position.set(size * 0.9, size * 0.9, size * 0.5);
      node.add(sealSprite);
    }

    if (stage.isBoss) {
      // A star, not a planet: a self-lit core with diffraction rays. Locked,
      // the rays stay grey but large enough to read as a star.
      const flareMaterial = trackMaterial(
        new SpriteMaterial({
          map: flare,
          color: lit ? palette.star : palette.locked,
          transparent: true,
          opacity: lit ? 0.9 : 0.6,
          depthWrite: false,
          blending: AdditiveBlending,
          fog: false,
        }),
      );
      const rays = new Sprite(flareMaterial);
      rays.scale.setScalar(size * (lit ? 6 : 9));
      if (lit) rays.layers.enable(BLOOM_LAYER);
      node.add(rays);
      flares.push(flareMaterial);
    }

    if (stage.status === "current" || (stage.isBoss && lit)) {
      const halo = new Sprite(
        trackMaterial(
          new SpriteMaterial({
            map: glow,
            color: stage.status === "current" ? palette.halo : tone,
            transparent: true,
            opacity: HALO_OPACITY.base,
            depthWrite: false,
            blending: AdditiveBlending,
            fog: false,
          }),
        ),
      );
      halo.scale.setScalar(size * 4.2);
      halo.layers.enable(BLOOM_LAYER);
      node.add(halo);
      if (stage.status === "current")
        pulses.push({ sprite: halo, base: size * 4.2 });
    }

    if (stage.status === "current") {
      const orbit = new Group();
      const orbitPositions = new Float32Array(ORBIT_PARTICLES * 3);
      for (let particle = 0; particle < ORBIT_PARTICLES; particle += 1) {
        const angle = (particle / ORBIT_PARTICLES) * Math.PI * 2;
        const distance = size * (1.7 + (particle % 3) * 0.18);
        orbitPositions[particle * 3] = Math.cos(angle) * distance;
        orbitPositions[particle * 3 + 1] = Math.sin(angle) * distance * 0.35;
        orbitPositions[particle * 3 + 2] = Math.sin(angle) * distance;
      }
      const orbitGeometry = track(new BufferGeometry());
      orbitGeometry.setAttribute(
        "position",
        new BufferAttribute(orbitPositions, 3),
      );
      const orbitMaterial = trackMaterial(
        new PointsMaterial({
          size: size * 0.32,
          map: glow,
          color: palette.current,
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
      );
      const particles = new Points(orbitGeometry, orbitMaterial);
      particles.layers.enable(BLOOM_LAYER);
      orbit.add(particles);
      orbit.rotation.z = 0.35;
      node.add(orbit);
      orbits.push(orbit);
    }

    if (stage.isBoss && !lit) {
      // Flat corona facing the camera, so it reads as a star and not as the
      // tilted ring of a planet.
      const corona = new Sprite(
        trackMaterial(
          new SpriteMaterial({
            map: glow,
            color: palette.locked,
            transparent: true,
            opacity: 0.45,
            depthWrite: false,
            blending: AdditiveBlending,
            fog: false,
          }),
        ),
      );
      corona.scale.setScalar(size * 2.8);
      corona.position.set(0, 0, -size * 0.2);
      node.add(corona);
      const dimHalo = new Sprite(
        trackMaterial(
          new SpriteMaterial({
            map: glow,
            color: palette.locked,
            transparent: true,
            opacity: 0.18,
            depthWrite: false,
            blending: AdditiveBlending,
            fog: false,
          }),
        ),
      );
      dimHalo.scale.setScalar(size * 4);
      node.add(dimHalo);
    }

    if (stage.status === "locked") {
      const fogSprite = new Sprite(
        trackMaterial(
          new SpriteMaterial({
            map: glow,
            color: lockedTone,
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
            fog: false,
          }),
        ),
      );
      fogSprite.scale.setScalar(size * 3.6);
      fogSprite.position.set(0, 0, -size * 0.2);
      fogSprite.renderOrder = 1;
      node.add(fogSprite);
      fogs.push({ sprite: fogSprite, base: size * 3.6, phase: index * 1.7 });
      const lockSprite = new Sprite(
        trackMaterial(new SpriteMaterial({ map: lock, fog: false })),
      );
      lockSprite.scale.setScalar(size * 1.1);
      lockSprite.position.set(0, 0, size * 1.05);
      lockSprite.renderOrder = 2;
      node.add(lockSprite);
    }

    group.add(node);
  });

  const flowSegments: { from: Vector3; to: Vector3 }[] = [];

  // Trail: segment i joins node i to node i+1 and is lit when the next node
  // is reachable (completed or current), so the light ends at the current one.
  for (let index = 0; index < stageList.length - 1; index += 1) {
    const from = positions[index];
    const to = positions[index + 1];
    const next = stageList[index + 1];
    if (from === undefined || to === undefined || next === undefined) continue;
    const reached = next.status !== "locked";
    const material = trackMaterial(
      new MeshBasicMaterial({
        color: reached ? palette.completed : palette.locked,
        transparent: true,
        opacity: reached ? 0.9 : 0.22,
        blending: reached ? AdditiveBlending : NormalBlending,
        depthWrite: false,
      }),
    );
    const tube = new Mesh(
      track(
        new TubeGeometry(new LineCurve3(from, to), 1, TRAIL_RADIUS, 6, false),
      ),
      material,
    );
    tube.renderOrder = -1;
    if (reached) {
      tube.layers.enable(BLOOM_LAYER);
      flowSegments.push({ from, to });
    }
    group.add(tube);
  }

  // Light flow: small glows travelling along the lit trail, from the first
  // stage to the current one. They advance in update(), so a paused scene
  // holds them still.
  const flowPositions = new Float32Array(
    flowSegments.length * FLOW_PER_SEGMENT * 3,
  );
  const flowGeometry = track(new BufferGeometry());
  const flowAttribute = new BufferAttribute(flowPositions, 3);
  flowGeometry.setAttribute("position", flowAttribute);
  const flow = new Points(
    flowGeometry,
    trackMaterial(
      new PointsMaterial({
        size: radius * 0.55,
        map: glow,
        color: palette.star,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    ),
  );
  flow.frustumCulled = false;
  flow.layers.enable(BLOOM_LAYER);
  group.add(flow);
  const flowPoint = new Vector3();
  const writeFlow = (time: number) => {
    flowSegments.forEach((segment, segmentIndex) => {
      for (let spark = 0; spark < FLOW_PER_SEGMENT; spark += 1) {
        const t = (time * FLOW_SPEED + spark / FLOW_PER_SEGMENT) % 1;
        flowPoint.lerpVectors(segment.from, segment.to, t);
        flowAttribute.setXYZ(
          segmentIndex * FLOW_PER_SEGMENT + spark,
          flowPoint.x,
          flowPoint.y,
          flowPoint.z,
        );
      }
    });
    flowAttribute.needsUpdate = true;
  };
  writeFlow(0);

  let elapsed = 0;
  return {
    object: group,
    setHover(index) {
      hovered = index;
    },
    setFocus(index) {
      focused = index;
    },
    update(delta) {
      elapsed += delta;
      const active = hovered ?? focused;
      const ease = 1 - Math.exp(-HIGHLIGHT_RATE * delta);
      highlights.forEach((highlight, index) => {
        const target = index === active ? 1 : 0;
        highlight.amount += (target - highlight.amount) * ease;
        highlight.node.scale.setScalar(1 + highlight.lift.scale * highlight.amount);
        highlight.setEmissive(
          highlight.base + highlight.lift.emissive * highlight.amount,
        );
      });
      for (const material of coreMaterials)
        material.uniforms.uTime.value = elapsed * CORE_RIPPLE.speed * Math.PI * 2;
      const wave = (Math.sin(elapsed * PULSE_SPEED) + 1) / 2;
      for (const pulse of pulses) {
        pulse.sprite.scale.setScalar(pulse.base * (0.85 + wave * 0.3));
        pulse.sprite.material.opacity =
          HALO_OPACITY.base + wave * HALO_OPACITY.swing;
      }
      for (const orbit of orbits) orbit.rotation.y += ORBIT_SPEED * delta;
      for (const shell of shells) shell.opacity = SHELL_OPACITY.base + wave * SHELL_OPACITY.swing;
      for (const material of flares) material.rotation += FLARE_SPIN * delta;
      for (const fog of fogs) {
        const drift = Math.sin(elapsed * FOG_DRIFT_SPEED + fog.phase);
        fog.sprite.scale.setScalar(fog.base * (1 + drift * FOG_DRIFT_AMOUNT));
      }
      writeFlow(elapsed);
    },
    dispose() {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      glow.dispose();
      flare.dispose();
      seal.dispose();
      lock.dispose();
    },
  };
}

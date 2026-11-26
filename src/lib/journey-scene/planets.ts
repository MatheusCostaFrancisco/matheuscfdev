import {
  AdditiveBlending,
  AmbientLight,
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
  SphereGeometry,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import type { JourneyStatus } from "../journey-state";
import { BLOOM_LAYER } from "./bloom";
import type { SceneLayer, ScenePalette, SceneStages } from "./types";

// Layout: nodes follow a gentle S-curve down the view, at a fixed depth. The
// spacing comes from the node count, so any number of worlds fits.
const DEPTH = -120;
const HALF_HEIGHT = 52;
const CURVE_AMPLITUDE = 16;
const CURVE_TURNS = 1.25; // sine periods over the whole path
const MAX_RADIUS = 4;
const RADIUS_RATIO = 0.3; // of the spacing between nodes
const BOSS_SCALE = 1.25;
const TRAIL_RADIUS = 0.18;
const PULSE_SPEED = 2.2; // rad per second
const ORBIT_SPEED = 0.9; // rad per second
const ORBIT_PARTICLES = 14;
// Hover and focus feedback: a lit planet grows and glows brighter, a locked
// one gets a smaller, dimmer lift so it still reads as unavailable.
const LIT_HIGHLIGHT = { scale: 0.2, emissive: 0.45 };
const LOCKED_HIGHLIGHT = { scale: 0.07, emissive: 0.18 };
const HIGHLIGHT_RATE = 10; // 1/s; exponential approach to the target

type Highlight = {
  node: Group;
  material: MeshStandardMaterial;
  base: number;
  lift: { scale: number; emissive: number };
  amount: number;
};

type Stage = { status: JourneyStatus; isBoss: boolean };
type AnyMaterial =
  | MeshBasicMaterial
  | MeshStandardMaterial
  | PointsMaterial
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

/** Position of every stage, in order; the camera rig flies between them. */
export function nodePositions(count: number): Vector3[] {
  const last = Math.max(count - 1, 1);
  return Array.from({ length: count }, (_, index) => {
    const t = index / last;
    return new Vector3(
      Math.sin(t * Math.PI * 2 * CURVE_TURNS) * CURVE_AMPLITUDE,
      HALF_HEIGHT - t * HALF_HEIGHT * 2,
      DEPTH,
    );
  });
}

/**
 * One planet per world plus the final boss as a star at the end, linked by a
 * light trail. Count and order come from `stages`, whose statuses were
 * computed by journeyState (T-058); nothing here assigns a status. completed:
 * lit planet, ring and seal. current: pulsing glow, orbiting particles and
 * trail lit up to it. locked: dark, desaturated, lock marker, trail off.
 * Owns every geometry, material and texture it creates.
 */
export function createPlanets(
  palette: ScenePalette,
  stages: SceneStages,
): PlanetsLayer {
  const group = new Group();
  const stageList: Stage[] = [
    ...stages.worlds.map((world) => ({
      status: world.status,
      isBoss: false,
    })),
    { status: stages.finalBoss.status, isBoss: true },
  ];
  const positions = nodePositions(stageList.length);
  const spacing = (HALF_HEIGHT * 2) / Math.max(stageList.length - 1, 1);
  const radius = Math.min(MAX_RADIUS, spacing * RADIUS_RATIO);

  const lockedTone = palette.locked.clone().multiplyScalar(0.55);
  const glow = glowTexture();
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
  const orbits: Group[] = [];
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
    const body = trackMaterial(
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
    const planet = new Mesh(track(new SphereGeometry(size, 32, 24)), body);
    if (lit) planet.layers.enable(BLOOM_LAYER);
    node.add(planet);
    if (!lit) body.emissive.copy(lockedTone);
    highlights.push({
      node,
      material: body,
      base: lit ? emissiveBase : 0,
      lift: lit ? LIT_HIGHLIGHT : LOCKED_HIGHLIGHT,
      amount: 0,
    });

    if (stage.status === "completed") {
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
      const sealSprite = new Sprite(
        trackMaterial(new SpriteMaterial({ map: seal, fog: false })),
      );
      sealSprite.scale.setScalar(size * 0.85);
      sealSprite.position.set(size * 0.9, size * 0.9, size * 0.5);
      node.add(sealSprite);
    }

    if (stage.status === "current" || (stage.isBoss && lit)) {
      const halo = new Sprite(
        trackMaterial(
          new SpriteMaterial({
            map: glow,
            color: tone,
            transparent: true,
            opacity: 0.6,
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
      const corona = new Mesh(
        track(new RingGeometry(size * 1.35, size * 1.9, 64)),
        trackMaterial(
          new MeshBasicMaterial({
            color: palette.locked,
            transparent: true,
            opacity: 0.35,
            side: DoubleSide,
            depthWrite: false,
          }),
        ),
      );
      corona.rotation.set(Math.PI / 2.8, 0.2, 0);
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
      const lockSprite = new Sprite(
        trackMaterial(new SpriteMaterial({ map: lock, fog: false })),
      );
      lockSprite.scale.setScalar(size * 1.1);
      lockSprite.position.set(0, 0, size * 1.05);
      node.add(lockSprite);
    }

    group.add(node);
  });

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
    if (reached) tube.layers.enable(BLOOM_LAYER);
    group.add(tube);
  }

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
        highlight.material.emissiveIntensity =
          highlight.base + highlight.lift.emissive * highlight.amount;
      });
      const wave = (Math.sin(elapsed * PULSE_SPEED) + 1) / 2;
      for (const pulse of pulses) {
        pulse.sprite.scale.setScalar(pulse.base * (0.85 + wave * 0.3));
        pulse.sprite.material.opacity = 0.4 + wave * 0.35;
      }
      for (const orbit of orbits) orbit.rotation.y += ORBIT_SPEED * delta;
    },
    dispose() {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      glow.dispose();
      seal.dispose();
      lock.dispose();
    },
  };
}

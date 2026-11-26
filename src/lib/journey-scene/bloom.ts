import {
  Layers,
  type Color,
  type Material,
  Mesh,
  MeshBasicMaterial,
  Vector2,
  type Camera,
  type Object3D,
  ShaderMaterial,
  type Scene,
  type WebGLRenderer,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/** Layer of everything that glows: lit planets, the current one and the lit trail. */
export const BLOOM_LAYER = 1;

const BLOOM_STRENGTH = 0.85;
const BLOOM_RADIUS = 0.55;
const BLOOM_THRESHOLD = 0.12;

const bloomLayers = new Layers();
bloomLayers.set(BLOOM_LAYER);

const mixMaterial = () =>
  new ShaderMaterial({
    uniforms: { baseTexture: { value: null }, bloomTexture: { value: null } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D baseTexture;
      uniform sampler2D bloomTexture;
      varying vec2 vUv;
      void main() {
        gl_FragColor = texture2D(baseTexture, vUv) + vec4(texture2D(bloomTexture, vUv).rgb, 0.0);
      }
    `,
  });

export type BloomPipeline = {
  render(): void;
  setSize(width: number, height: number, pixelRatio: number): void;
  dispose(): void;
};

type Swapped = { mesh: Mesh; material: Material | Material[] }[];
type Hidden = Object3D[];

/**
 * Selective bloom with modules shipped in three (no extra dependency): the
 * scene is rendered once with only the objects on BLOOM_LAYER visible and
 * blurred by UnrealBloomPass, then rendered normally and the glow is added on
 * top. Lights stay untouched so no shader is recompiled between the passes.
 * Contrast worst case: a canvas pixel saturated to white under the 70% scrim
 * (ADR 0007) leaves text-fg on the bare page at about 6.5:1, and all
 * text-fg-muted sits on opaque bg-surface-raised cards, so the bloom cannot
 * push the HUD text below 4.5:1.
 * Non-glowing meshes are drawn black in the bloom pass (not hidden) so they
 * still occlude the glow behind them.
 */
export function createBloom(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  clearColor: Color,
): BloomPipeline {
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  const bloomRender = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new Vector2(1, 1),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD,
  );
  bloomComposer.addPass(bloomRender);
  bloomComposer.addPass(bloomPass);

  const mix = mixMaterial();
  const mixPass = new ShaderPass(mix, "baseTexture");
  mixPass.needsSwap = true;
  mix.uniforms.bloomTexture.value = bloomComposer.renderTarget2.texture;
  const finalComposer = new EffectComposer(renderer);
  const finalRender = new RenderPass(scene, camera);
  const outputPass = new OutputPass();
  finalComposer.addPass(finalRender);
  finalComposer.addPass(mixPass);
  finalComposer.addPass(outputPass);

  const black = new MeshBasicMaterial({ color: 0x000000 });
  const swapped: Swapped = [];
  const hidden: Hidden = [];
  const darkenNonGlowing = (object: Object3D) => {
    if (!object.visible || object.layers.test(bloomLayers)) return;
    if (object instanceof Mesh) {
      swapped.push({ mesh: object, material: object.material });
      object.material = black;
    } else if ("isPoints" in object || "isSprite" in object) {
      object.visible = false;
      hidden.push(object);
    }
  };

  return {
    render() {
      scene.traverse(darkenNonGlowing);
      renderer.setClearColor(0x000000, 1);
      bloomComposer.render();
      renderer.setClearColor(clearColor, 1);
      for (const { mesh, material } of swapped) mesh.material = material;
      swapped.length = 0;
      for (const object of hidden) object.visible = true;
      hidden.length = 0;
      finalComposer.render();
    },
    setSize(width, height, pixelRatio) {
      for (const composer of [bloomComposer, finalComposer]) {
        composer.setPixelRatio(pixelRatio);
        composer.setSize(width, height);
      }
    },
    dispose() {
      black.dispose();
      bloomPass.dispose();
      bloomRender.dispose();
      finalRender.dispose();
      mixPass.dispose();
      mix.dispose();
      outputPass.dispose();
      bloomComposer.dispose();
      finalComposer.dispose();
    },
  };
}

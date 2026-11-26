// Capability gate of the journey 3D scene (ADR 0009). Lives in the main chunk,
// so it must never import three: the scene itself is loaded with import() only
// after this check passes.

type NetworkInformationHint = {
  readonly saveData?: boolean;
};

// Chromium-only hints, absent from lib.dom. Both are optional: a browser that
// does not expose them is not treated as a weak device.
declare global {
  interface Navigator {
    readonly deviceMemory?: number;
    readonly connection?: NetworkInformationHint;
  }
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const MIN_DEVICE_MEMORY_GB = 4;

function supportsWebGl2(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (gl === null) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * True when the 3D scene may load: no reduced motion, no Save-Data,
 * navigator.deviceMemory >= 4 when the browser defines it, and WebGL2.
 * Otherwise the HTML map of the journey page stays as the only view.
 * The WebGL2 probe runs last because it creates (and drops) a context.
 */
export function canRenderJourneyScene(): boolean {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  if (navigator.connection?.saveData === true) return false;
  const memory = navigator.deviceMemory;
  if (memory !== undefined && memory < MIN_DEVICE_MEMORY_GB) return false;
  return supportsWebGl2();
}

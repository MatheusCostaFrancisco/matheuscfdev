import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  REDUCED_MOTION_QUERY,
  canRenderJourneyScene,
} from "../lib/journey-scene/gate";

/**
 * Decorative 3D backdrop of the journey page (ADR 0009). The HTML map is
 * always the content; this only adds an aria-hidden canvas behind it when the
 * capability gate passes. three is fetched with import() on demand, so the
 * main chunk carries only this shell. If the gate fails, the chunk does not
 * load or WebGL breaks, nothing is shown and the HTML map stays as the view.
 *
 * Rendered into <body> so no transformed ancestor (scroll reveal) turns the
 * fixed layer into a local one.
 */
export function JourneyScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (host === null) return;

    const motion = window.matchMedia(REDUCED_MOTION_QUERY);
    let teardown: (() => void) | null = null;
    // Bumped on every stop, so an import that resolves late is ignored.
    let generation = 0;

    const start = () => {
      if (teardown !== null || !canRenderJourneyScene()) return;
      generation += 1;
      const ticket = generation;
      import("../lib/journey-scene/scene")
        .then(({ mountJourneyScene }) => {
          if (ticket !== generation || teardown !== null) return;
          teardown = mountJourneyScene(host);
        })
        .catch(() => {
          // Chunk failed to load or WebGL could not start: keep the HTML map.
        });
    };

    const stop = () => {
      generation += 1;
      teardown?.();
      teardown = null;
    };

    // Back/forward cache: pagehide tears the scene down, pageshow restores it.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) start();
    };
    const onMotionChange = () => {
      if (motion.matches) stop();
      else start();
    };

    start();
    window.addEventListener("pagehide", stop);
    window.addEventListener("pageshow", onPageShow);
    motion.addEventListener("change", onMotionChange);
    return () => {
      window.removeEventListener("pagehide", stop);
      window.removeEventListener("pageshow", onPageShow);
      motion.removeEventListener("change", onMotionChange);
      stop();
    };
  }, []);

  return createPortal(
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 print:hidden"
    />,
    document.body,
  );
}

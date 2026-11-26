import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { JourneyState } from "../lib/journey-state";
import type {
  JourneySceneHandle,
  SceneStages,
} from "../lib/journey-scene/types";
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
 * An ::after scrim in the space color sits over the canvas so text on the
 * bare page background keeps 4.5:1 even over the brightest lit planet or glow
 * (axe cannot measure contrast over a canvas).
 *
 * Rendered into <body> so no transformed ancestor (scroll reveal) turns the
 * fixed layer into a local one.
 *
 * The camera follows `activeIndex` (the stage being read or focused).
 */
type JourneySceneProps = {
  state: JourneyState;
  activeIndex: number;
  /** Called with the stage index when a planet is clicked. */
  onPickStage: (index: number) => void;
};

// Pick only when the click lands on the bare page: html, body or a layout
// surface marked with data-scene-pick (App wrapper, main, the journey section,
// the world list and its track). Site chrome (header, footer), cards and
// controls never match, so they cannot open a world the user did not choose.
const pickableSelector = "html, body, [data-scene-pick]";

export function JourneyScene({
  state,
  activeIndex,
  onPickStage,
}: JourneySceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<SceneStages>(state);
  stagesRef.current = state;
  const indexRef = useRef(activeIndex);
  indexRef.current = activeIndex;
  const pickRef = useRef(onPickStage);
  pickRef.current = onPickStage;
  const handleRef = useRef<JourneySceneHandle | null>(null);
  // Statuses do not depend on the locale: remount only when they change.
  const stagesKey = [...state.worlds, state.finalBoss]
    .map((stage) => `${stage.id}:${stage.status}`)
    .join("|");

  useEffect(() => {
    const host = hostRef.current;
    if (host === null) return;

    const motion = window.matchMedia(REDUCED_MOTION_QUERY);
    let mounted: JourneySceneHandle | null = null;
    // Bumped on every stop, so an import that resolves late is ignored.
    let generation = 0;

    const start = () => {
      if (mounted !== null || !canRenderJourneyScene()) return;
      generation += 1;
      const ticket = generation;
      import("../lib/journey-scene/scene")
        .then(({ mountJourneyScene }) => {
          if (ticket !== generation || mounted !== null) return;
          mounted = mountJourneyScene(
            host,
            stagesRef.current,
            indexRef.current,
          );
          handleRef.current = mounted;
        })
        .catch(() => {
          // Chunk failed to load or WebGL could not start: keep the HTML map.
        });
    };

    const stop = () => {
      generation += 1;
      mounted?.dispose();
      mounted = null;
      handleRef.current = null;
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
  }, [stagesKey]);

  // The canvas sits behind the page and takes no pointer events, so a pointer
  // event that lands outside content and controls (page background, layout
  // gutters) is tested against the planets. Keyboard users open the same
  // panel from the cards.
  useEffect(() => {
    const pickAt = (event: MouseEvent): number | null => {
      const target = event.target;
      if (!(target instanceof Element)) return null;
      if (!target.matches(pickableSelector)) return null;
      if (window.getSelection()?.isCollapsed === false) return null;
      return handleRef.current?.pickStage(event.clientX, event.clientY) ?? null;
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const index = pickAt(event);
      if (index !== null) pickRef.current(index);
    };
    const onMove = (event: PointerEvent) => {
      document.body.style.cursor = pickAt(event) !== null ? "pointer" : "";
    };
    window.addEventListener("click", onClick);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove);
      document.body.style.cursor = "";
    };
  }, []);

  useEffect(() => {
    handleRef.current?.focusStage(activeIndex);
  }, [activeIndex]);

  return createPortal(
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 print:hidden after:absolute after:inset-0 after:bg-(--journey-space) after:opacity-70 after:content-['']"
    />,
    document.body,
  );
}

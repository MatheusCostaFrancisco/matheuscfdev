import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
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
 * Decorative 3D stage of the journey page (ADR 0009, ADR 0007 addendum
 * 2026-11-26 T-073). The HTML map is always the content; when the capability
 * gate passes this renders an aria-hidden, full-viewport-width stage (height
 * 100dvh minus the header) holding the canvas, with the current planet
 * centered. three is fetched with import() on demand, so the main chunk
 * carries only this shell. If the gate fails, reduced motion is on, the chunk
 * does not load or the WebGL context is lost, the stage is not rendered at
 * all and the HTML map stays as the view. Nothing overlaps the stage, so it
 * carries no text and needs no contrast treatment.
 *
 * The camera follows `activeIndex` (the stage being read or focused).
 */
type JourneySceneProps = {
  state: JourneyState;
  activeIndex: number;
  /** Called with the stage index when a planet is clicked. */
  onPickStage: (index: number) => void;
  /** True while the canvas is mounted and animating (or held paused). */
  onActiveChange: (active: boolean) => void;
  /** User choice to hold the render loop. */
  paused: boolean;
};

export function JourneyScene({
  state,
  activeIndex,
  onPickStage,
  onActiveChange,
  paused,
}: JourneySceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const stagesRef = useRef<SceneStages>(state);
  stagesRef.current = state;
  const indexRef = useRef(activeIndex);
  indexRef.current = activeIndex;
  const pickRef = useRef(onPickStage);
  pickRef.current = onPickStage;
  const activeRef = useRef(onActiveChange);
  activeRef.current = onActiveChange;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
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
            stop,
          );
          handleRef.current = mounted;
          mounted.setPaused(pausedRef.current);
          setActive(true);
          activeRef.current(true);
        })
        .catch(() => {
          // Chunk failed to load or WebGL could not start: keep the HTML map.
        });
    };

    function stop() {
      generation += 1;
      mounted?.dispose();
      mounted = null;
      handleRef.current = null;
      setActive(false);
      activeRef.current(false);
    }

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

  // Pointer events on the stage are tested against the planets. Keyboard
  // users open the same panel from the cards.
  useEffect(() => {
    const host = hostRef.current;
    if (host === null) return;
    const pickAt = (event: MouseEvent): number | null => {
      if (window.getSelection()?.isCollapsed === false) return null;
      return handleRef.current?.pickStage(event.clientX, event.clientY) ?? null;
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const index = pickAt(event);
      if (index !== null) pickRef.current(index);
    };
    const setHover = (index: number | null) => {
      host.style.cursor = index !== null ? "pointer" : "";
      handleRef.current?.hoverStage(index);
    };
    const onMove = (event: PointerEvent) => setHover(pickAt(event));
    const onLeave = () => setHover(null);
    host.addEventListener("click", onClick);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("click", onClick);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Keyboard focus inside a stage card lights its planet like a hover. The
  // cards are the list items whose id is a stage id, in stage order.
  useEffect(() => {
    const ids = stagesKey.split("|").map((entry) => entry.split(":")[0]);
    const stageOf = (target: EventTarget | null): number | null => {
      if (!(target instanceof Element) || !target.matches(":focus-visible"))
        return null;
      const card = target.closest("li[id]");
      const index = card === null ? -1 : ids.indexOf(card.id);
      return index < 0 ? null : index;
    };
    const onFocusIn = (event: FocusEvent) =>
      handleRef.current?.highlightFocused(stageOf(event.target));
    const onFocusOut = () => handleRef.current?.highlightFocused(null);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [stagesKey]);

  useEffect(() => {
    handleRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    handleRef.current?.focusStage(activeIndex);
  }, [activeIndex]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn(
        active &&
          "relative -mt-20 ml-[calc(50%-50vw)] h-[calc(100dvh-var(--spacing-header))] w-screen overflow-hidden bg-journey-space print:hidden",
        !active && "hidden",
      )}
    />
  );
}

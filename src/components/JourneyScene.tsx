import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { useContent } from "../lib/use-content";
import type { JourneyState, JourneyStatus } from "../lib/journey-state";
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
 * all and the HTML map stays as the view. The canvas host is aria-hidden; the
 * HUD (ADR 0007 addendum T-074) sits in a sibling layer in the stage corners,
 * on translucent panels with measured contrast, and never covers the center.
 *
 * The camera follows `activeIndex`, which only changes through `onNavigate`:
 * focus or arrow keys on a label, a drag or horizontal swipe on the stage, or
 * the previous/next buttons. The stage is touch-action: pan-y so vertical
 * swipes and the wheel keep scrolling the page.
 */
const SWIPE_THRESHOLD = 60;

type NavButtonProps = {
  direction: "previous" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
};

function NavButton({ direction, label, disabled, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      data-hud-panel
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "pointer-events-auto absolute top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-2xl border border-line bg-surface-raised/90 text-fg transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 active:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surface-raised/90",
        direction === "previous" ? "left-2 sm:left-4" : "right-2 sm:right-4",
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={direction === "previous" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
const LABEL_EDGE = 8;
/** Matches the mt-7 (1.75rem) that drops the label below its planet. */
const LABEL_OFFSET = 28;

export type StageLabel = {
  id: string;
  title: string;
  status: JourneyStatus;
  statusLabel: string;
  xp: number;
};

type JourneySceneProps = {
  state: JourneyState;
  activeIndex: number;
  /** Moves the camera to a stage index. */
  onNavigate: (index: number) => void;
  /** One label per stage, in stage order, attached to its planet. */
  labels: readonly StageLabel[];
  /** Called with the stage id and the label button when a label is activated. */
  onOpenStage: (id: string, opener: HTMLElement) => void;
  /** True while the canvas is mounted and animating (or held paused). */
  onActiveChange: (active: boolean) => void;
  /** User choice to hold the render loop. */
  paused: boolean;
  /** Minimal HUD laid over the stage corners; rendered only while the stage is. */
  hud: ReactNode;
};

export function JourneyScene({
  state,
  activeIndex,
  onNavigate,
  labels,
  onOpenStage,
  onActiveChange,
  paused,
  hud,
}: JourneySceneProps) {
  const { ui } = useContent();
  const text = ui.journey;
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const stagesRef = useRef<SceneStages>(state);
  stagesRef.current = state;
  const indexRef = useRef(activeIndex);
  indexRef.current = activeIndex;
  const activeRef = useRef(onActiveChange);
  activeRef.current = onActiveChange;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const handleRef = useRef<JourneySceneHandle | null>(null);
  // The landing flight plays on the first mount only; remounts (bfcache
  // restore, status change) start already on the stage.
  const landedRef = useRef(false);
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
          const handle = mountJourneyScene(
            host,
            stagesRef.current,
            indexRef.current,
            stop,
            !landedRef.current,
          );
          if (handle === null) return;
          landedRef.current = true;
          mounted = handle;
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

  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const layerRef = useRef<HTMLDivElement>(null);
  // A label hidden by the tracker cannot take focus: arrow navigation parks
  // the target index here and the tracker focuses it once it is visible.
  const pendingFocusRef = useRef<number | null>(null);
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const lastIndex = labels.length - 1;

  // Label buttons follow their planets: the scene loop hands over the
  // projected positions and they go straight to style.transform, with no
  // React state per frame. A label is clamped to the stage and hidden while
  // it would sit under a HUD panel; the stage cards stay the keyboard route
  // for planets that are off camera or covered.
  useEffect(() => {
    if (!active) return;
    handleRef.current?.setLabelTracker((points) => {
      const layer = layerRef.current;
      if (layer === null) return;
      const bounds = layer.getBoundingClientRect();
      const panels = Array.from(
        layer.querySelectorAll("[data-hud-panel]"),
        (panel) => panel.getBoundingClientRect(),
      );
      points.forEach((point, index) => {
        const button = labelRefs.current[index];
        if (button === null || button === undefined) return;
        const halfWidth = button.offsetWidth / 2;
        const x = Math.min(
          Math.max(point.x, halfWidth + LABEL_EDGE),
          bounds.width - halfWidth - LABEL_EDGE,
        );
        const y = Math.min(
          Math.max(point.y, LABEL_EDGE),
          bounds.height - LABEL_OFFSET - button.offsetHeight - LABEL_EDGE,
        );
        button.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        const left = bounds.left + x - halfWidth;
        const top = bounds.top + y + LABEL_OFFSET;
        const covered = panels.some(
          (panel) =>
            left < panel.right &&
            left + button.offsetWidth > panel.left &&
            top < panel.bottom &&
            top + button.offsetHeight > panel.top,
        );
        const shown = point.visible && !covered;
        button.style.visibility = shown ? "visible" : "hidden";
        if (shown && pendingFocusRef.current === index) {
          pendingFocusRef.current = null;
          button.focus({ preventScroll: true });
        }
      });
    });
    return () => handleRef.current?.setLabelTracker(null);
  }, [active, stagesKey]);

  // Keyboard focus on a stage label or inside a stage card lights its planet
  // like a hover. The cards are the list items whose id is a stage id.
  useEffect(() => {
    const ids = stagesKey.split("|").map((entry) => entry.split(":")[0]);
    const stageOf = (target: EventTarget | null): number | null => {
      if (!(target instanceof Element) || !target.matches(":focus-visible"))
        return null;
      const label = target.closest("[data-stage-label]");
      if (label instanceof HTMLElement)
        return Number(label.dataset.stageLabel);
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

  const step = (from: number, delta: number) => {
    const next = from + delta;
    if (next < 0 || next > lastIndex) return;
    onNavigate(next);
  };

  const onLabelKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const delta =
      event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : event.key === "ArrowRight" || event.key === "ArrowDown"
          ? 1
          : 0;
    if (delta === 0) return;
    event.preventDefault();
    const next = index + delta;
    if (next < 0 || next > lastIndex) return;
    const target = labelRefs.current[next];
    if (target !== null && target !== undefined && target.style.visibility === "visible") {
      target.focus({ preventScroll: true });
    } else {
      pendingFocusRef.current = next;
      onNavigate(next);
    }
  };

  const onStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("button")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const onStagePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragRef.current;
    if (start === null || start.id !== event.pointerId) return;
    dragRef.current = null;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    step(activeIndex, dx < 0 ? 1 : -1);
  };
  const onStagePointerCancel = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    handleRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    handleRef.current?.focusStage(activeIndex);
  }, [activeIndex]);

  return (
    <div
      onPointerDown={onStagePointerDown}
      onPointerUp={onStagePointerUp}
      onPointerCancel={onStagePointerCancel}
      className={cn(
        active &&
          "relative touch-pan-y -mt-20 ml-[calc(50%-50vw)] h-[calc(100dvh-var(--spacing-header))] w-screen overflow-hidden bg-journey-space print:hidden",
        !active && "hidden",
      )}
    >
      <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />
      {active && (
        <div
          ref={layerRef}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {hud}
          <NavButton
            direction="previous"
            label={text.previousWorld(labels[activeIndex - 1]?.title ?? "")}
            disabled={activeIndex <= 0}
            onClick={() => step(activeIndex, -1)}
          />
          <NavButton
            direction="next"
            label={text.nextWorld(labels[activeIndex + 1]?.title ?? "")}
            disabled={activeIndex >= lastIndex}
            onClick={() => step(activeIndex, 1)}
          />
          {labels.map((label, index) => (
            <button
              key={label.id}
              ref={(node) => {
                labelRefs.current[index] = node;
              }}
              type="button"
              data-stage-label={index}
              onFocus={() => onNavigate(index)}
              onKeyDown={(event) => onLabelKeyDown(event, index)}
              onClick={(event) => onOpenStage(label.id, event.currentTarget)}
              onPointerEnter={() => handleRef.current?.hoverStage(index)}
              onPointerLeave={() => handleRef.current?.hoverStage(null)}
              style={{ visibility: "hidden" }}
              className={cn(
                "pointer-events-auto absolute left-0 top-0 mt-7 min-h-11 w-max max-w-40 -translate-x-1/2 cursor-pointer rounded-2xl border bg-surface-raised/90 px-3 py-1.5 text-left text-xs leading-tight text-fg transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 active:bg-surface-sunken sm:max-w-52 sm:text-sm",
                label.status === "current"
                  ? "border-journey-current"
                  : label.status === "locked"
                    ? "border-dashed border-line"
                    : "border-line",
              )}
            >
              <span className="block font-semibold [overflow-wrap:anywhere]">
                {label.title}
              </span>
              <span className="sr-only">, </span>
              <span className="block text-fg-muted">
                {label.statusLabel} {"·"} {label.xp}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

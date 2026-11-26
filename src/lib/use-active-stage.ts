import { useEffect, useRef, useState, type RefObject } from "react";
import { REDUCED_MOTION_QUERY } from "./journey-scene/gate";

const ANCHOR_RATIO = 0.5;

const STEP_BY_KEY: Record<string, number> = {
  ArrowUp: -1,
  ArrowLeft: -1,
  ArrowDown: 1,
  ArrowRight: 1,
};

// A programmatic scroll (hash, arrow key) owns the index until the page has
// been still for this long, so measuring cannot override the chosen card.
const LOCK_START_MS = 400;
const LOCK_IDLE_MS = 150;

// -1 when the hash names no card.
function indexFromHash(ids: readonly string[]): number {
  try {
    return ids.indexOf(decodeURIComponent(window.location.hash.slice(1)));
  } catch {
    return -1;
  }
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

/**
 * Which stage of the journey list is active, for the 3D camera. It starts
 * from the URL hash (#world-3 / #mundo-3), then follows scroll (the card
 * closest to the middle of the viewport), focus inside a card (which also locks the index), and the arrow
 * keys while focus is in the list, which scroll to and focus the previous/next
 * card. Elsewhere, and past the first/last card, arrows scroll the page as
 * usual. A hash or arrow-key scroll locks the index until the scroll settles.
 * `ids` are the card ids in order.
 */
export function useActiveStage(
  ids: readonly string[],
  listRef: RefObject<HTMLElement | null>,
): number {
  const [index, setIndex] = useState(() => Math.max(indexFromHash(ids), 0));
  const indexRef = useRef(index);
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useEffect(() => {
    const list = listRef.current;
    if (list === null) return;
    const cards = () => Array.from(list.children);
    const choose = (next: number) => {
      indexRef.current = next;
      setIndex(next);
    };

    let frame = 0;
    let locked = false;
    let unlockTimer = 0;
    const lock = (ms: number) => {
      locked = true;
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        locked = false;
      }, ms);
    };
    const measure = () => {
      frame = 0;
      if (locked) return;
      const anchor = window.innerHeight * ANCHOR_RATIO;
      let best = indexRef.current;
      let bestDistance = Infinity;
      cards().forEach((card, position) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - anchor);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = position;
        }
      });
      if (best !== indexRef.current) choose(best);
    };
    const onScroll = () => {
      if (locked) {
        lock(LOCK_IDLE_MS);
        return;
      }
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    const goTo = (next: number) => {
      const card = cards()[next];
      if (!(card instanceof HTMLElement)) return;
      choose(next);
      lock(LOCK_START_MS);
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      card.scrollIntoView({
        block: "center",
        behavior: reduced ? "instant" : "smooth",
      });
      card.focus({ preventScroll: true });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step = STEP_BY_KEY[event.key];
      if (step === undefined || event.defaultPrevented) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return;
      if (isEditable(event.target)) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      const current = cards().findIndex((card) => card.contains(target));
      if (current < 0) return;
      const next = current + step;
      if (next < 0 || next >= cards().length) return;
      event.preventDefault();
      goTo(next);
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const position = cards().findIndex((card) => card.contains(target));
      if (position < 0) return;
      lock(LOCK_START_MS);
      if (position !== indexRef.current) choose(position);
    };

    const onHashChange = () => {
      const position = indexFromHash(idsRef.current);
      if (position < 0) return;
      lock(LOCK_START_MS);
      choose(position);
    };

    if (indexFromHash(idsRef.current) >= 0) lock(LOCK_START_MS);

    window.addEventListener("scroll", onScroll, { passive: true });
    list.addEventListener("keydown", onKeyDown);
    window.addEventListener("hashchange", onHashChange);
    list.addEventListener("focusin", onFocusIn);
    return () => {
      window.removeEventListener("scroll", onScroll);
      list.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(unlockTimer);
      window.removeEventListener("hashchange", onHashChange);
      list.removeEventListener("focusin", onFocusIn);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [listRef]);

  return index;
}

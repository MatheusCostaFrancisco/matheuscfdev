import { useCallback, useEffect, useRef, useState } from "react";

// -1 when the hash names no stage.
function indexFromHash(ids: readonly string[]): number {
  try {
    return ids.indexOf(decodeURIComponent(window.location.hash.slice(1)));
  } catch {
    return -1;
  }
}

/**
 * Which stage the 3D camera is on. Starts on the stage named by the URL hash
 * (#world-3 / #mundo-3) or on `fallbackIndex` (the current world), follows
 * later hash changes, and is otherwise driven only by `goTo` (labels, drag,
 * swipe, previous/next buttons). Scrolling the page does not move it.
 */
export function useStageIndex(
  ids: readonly string[],
  fallbackIndex: number,
): { index: number; goTo: (next: number) => void } {
  const count = ids.length;
  const [index, setIndex] = useState(() => {
    const fromHash = indexFromHash(ids);
    return fromHash >= 0 ? fromHash : fallbackIndex;
  });
  const idsRef = useRef(ids);
  idsRef.current = ids;

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.min(Math.max(next, 0), count - 1));
    },
    [count],
  );

  useEffect(() => {
    const onHashChange = () => {
      const position = indexFromHash(idsRef.current);
      if (position >= 0) setIndex(position);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return { index: Math.min(index, Math.max(count - 1, 0)), goTo };
}

function findHashTarget(hash: string): HTMLElement | null {
  if (hash.length <= 1) return null

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)))
  } catch {
    return null
  }
}

/**
 * Moves focus to the element named by the URL hash without scrolling, so the
 * next Tab starts inside that section. The target gets tabindex="-1" when it
 * is not focusable yet. A missing target or a malformed hash does nothing.
 */
export function focusHashTarget(hash: string): void {
  const target = findHashTarget(hash)
  if (!target) return

  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

/**
 * Scrolls to the element named by the URL hash and moves focus to it. The
 * browser's own hash scroll runs before React has rendered the sections, so
 * it is repeated after the first render. The jump is instant (it also
 * overrides the smooth scrolling enabled in CSS), which keeps
 * prefers-reduced-motion users safe.
 */
export function scrollToHash(hash: string): void {
  const target = findHashTarget(hash)
  if (!target) return

  target.scrollIntoView({ behavior: 'instant', block: 'start' })
  focusHashTarget(hash)
}

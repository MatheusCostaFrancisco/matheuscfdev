/**
 * Scrolls to the element named by the URL hash. The browser's own hash scroll
 * runs before React has rendered the sections, so it is repeated after the
 * first render. The jump is instant (it also overrides the smooth scrolling
 * enabled in CSS), which keeps prefers-reduced-motion users safe. A missing
 * target or a malformed hash leaves the page where it is.
 */
export function scrollToHash(hash: string): void {
  if (hash.length <= 1) return

  let id: string
  try {
    id = decodeURIComponent(hash.slice(1))
  } catch {
    return
  }

  document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
}

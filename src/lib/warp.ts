// Light tunnel played when a link goes to the journey page (T-067). It is a
// standalone entry loaded by its own <script> in every page HTML (including
// 404.html, which has no React). It imports nothing: importing ./routes would
// make Rollup share that code through this chunk and the main chunk would
// load it statically. The journey paths come from vite.config.ts (define).
// Visuals live in src/index.css (.warp-tunnel); the arrival is a CSS-only
// entrance on the journey page (no cross-document view transition, see ADR 0009).
const TUNNEL_MS = 1400
const OVERLAY_TTL_MS = TUNNEL_MS + 3000

let timers: number[] = []

function normalize(pathname: string): string {
  const path = pathname.toLowerCase().replace(/index\.html$/, '')
  return path.endsWith('/') ? path : `${path}/`
}

function isJourney(pathname: string): boolean {
  const path = normalize(pathname)
  return __JOURNEY_PATHS__.some((journey) => journey === path)
}

function clearTunnel(): void {
  timers.forEach((id) => window.clearTimeout(id))
  timers = []
  document.querySelectorAll('.warp-tunnel').forEach((node) => node.remove())
  document.body.inert = false
}

function journeyTarget(event: MouseEvent): URL | null {
  if (event.defaultPrevented || event.button !== 0) return null
  // Keyboard activation (detail 0) navigates at once: no silent delay.
  if (event.detail === 0) return null
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return null
  if (!(event.target instanceof Element)) return null
  const anchor = event.target.closest('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) return null
  if (anchor.hasAttribute('download')) return null
  if (anchor.target !== '' && anchor.target !== '_self') return null
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  if (!isJourney(url.pathname)) return null
  if (isJourney(window.location.pathname)) return null
  return url
}

function onClick(event: MouseEvent): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const url = journeyTarget(event)
  if (url === null) return
  event.preventDefault()
  if (document.querySelector('.warp-tunnel') !== null) return
  const overlay = document.createElement('div')
  overlay.className = 'warp-tunnel'
  overlay.setAttribute('aria-hidden', 'true')
  document.body.append(overlay)
  document.body.inert = true
  timers = [
    window.setTimeout(() => window.location.assign(url.href), TUNNEL_MS),
    window.setTimeout(clearTunnel, OVERLAY_TTL_MS),
  ]
}

document.addEventListener('click', onClick)
// Leaving the page (bfcache included) cancels the pending navigation; a restored
// page comes back clean, with no overlay and no inert body.
window.addEventListener('pagehide', clearTunnel)
window.addEventListener('pageshow', clearTunnel)

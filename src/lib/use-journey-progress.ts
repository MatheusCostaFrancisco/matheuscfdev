import { useLayoutEffect, type RefObject } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const ANCHOR_RATIO = 0.6
const MARKER_SELECTOR = '[data-journey-marker]'

/**
 * Draws a vertical line progressively with scroll. The fill element is plain
 * markup at full length; this hook only takes over (scaleY, compositor-only)
 * when JavaScript runs and the user has not asked for reduced motion. The
 * track always ends at the center of the last stage marker (measured when the
 * content size changes). Scroll events only schedule a requestAnimationFrame;
 * the layout read happens inside that frame. Progress is forced to 1 when the
 * page is scrolled to the end, so the line always completes.
 */
export function useJourneyProgress(
  trackRef: RefObject<HTMLElement | null>,
  fillRef: RefObject<HTMLElement | null>,
): void {
  useLayoutEffect(() => {
    const track = trackRef.current
    const fill = fillRef.current
    const wrapper = track?.parentElement
    if (!track || !fill || !wrapper) return
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY)

    let frame = 0
    let animating = false

    const fitTrack = () => {
      const markers = wrapper.querySelectorAll<HTMLElement>(MARKER_SELECTOR)
      const marker = markers.item(markers.length - 1)
      const lastItem = marker?.closest('li')
      if (!lastItem || !marker) return
      const center =
        lastItem.offsetTop + marker.offsetTop + marker.offsetHeight / 2
      track.style.bottom = `${Math.max(0, wrapper.offsetHeight - center)}px`
    }

    const paint = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const atEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 1
      const anchor = window.innerHeight * ANCHOR_RATIO
      const raw = rect.height > 0 ? (anchor - rect.top) / rect.height : 1
      const progress = atEnd ? 1 : Math.min(1, Math.max(0, raw))
      fill.style.transform = `scaleY(${progress})`
    }

    const schedule = () => {
      if (animating && frame === 0) frame = window.requestAnimationFrame(paint)
    }

    const observer = new ResizeObserver(() => {
      fitTrack()
      schedule()
    })

    const stop = () => {
      animating = false
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== 0) window.cancelAnimationFrame(frame)
      frame = 0
      fill.style.removeProperty('transform')
    }

    const start = () => {
      animating = true
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
      paint()
    }

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) stop()
      else start()
    }

    fitTrack()
    observer.observe(wrapper)
    if (!motionQuery.matches) start()
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      motionQuery.removeEventListener('change', onMotionChange)
      observer.disconnect()
      stop()
    }
  }, [trackRef, fillRef])
}

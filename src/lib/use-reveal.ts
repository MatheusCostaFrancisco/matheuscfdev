import { useLayoutEffect } from 'react'

const SECTION_SELECTOR = 'main > section'
const ITEM_SELECTOR = '[data-reveal-item]'
const HIDDEN_SELECTOR = '[data-reveal="hidden"]'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const STAGGER_MS = 70
const MAX_DELAY_MS = 280

/**
 * Scroll-triggered reveal. Content is plain visible markup; this hook only
 * marks elements as hidden after checking that IntersectionObserver exists and
 * that the user has not asked for reduced motion. Each element is unobserved
 * once revealed and loses its data-reveal attribute when the transition ends.
 *
 * Only short elements are hidden: the items, the non-item children of sections
 * that have items (headings, intro), and whole sections that have no items. A
 * single visible pixel is enough to reveal, so tall elements never get stuck.
 * The hash target and everything before it start revealed, and focus inside a
 * hidden element reveals it at once.
 */
export function useReveal(): void {
  useLayoutEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    if (motionQuery.matches) return

    const candidates = collectCandidates()
    const hidden = new Set<HTMLElement>()

    const show = (el: HTMLElement, instant: boolean) => {
      if (!hidden.delete(el)) return
      observer.unobserve(el)
      if (instant) {
        el.style.transition = 'none'
        el.dataset.reveal = 'shown'
        void el.offsetHeight
        clear(el)
      } else {
        el.dataset.reveal = 'shown'
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            show(entry.target, false)
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )

    const showUpToHash = () => {
      const target = readHashTarget(window.location.hash)
      if (!target) return
      for (const el of hidden) {
        if (isAtOrBefore(el, target)) show(el, true)
      }
    }

    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      let el = event.target.closest<HTMLElement>(HIDDEN_SELECTOR)
      while (el) {
        show(el, true)
        el = el.parentElement?.closest<HTMLElement>(HIDDEN_SELECTOR) ?? null
      }
    }

    const onTransitionEnd = (event: TransitionEvent) => {
      const el = event.target
      if (
        el instanceof HTMLElement &&
        event.propertyName === 'opacity' &&
        el.dataset.reveal === 'shown'
      ) {
        clear(el)
      }
    }

    const stopAll = () => {
      observer.disconnect()
      for (const el of Array.from(hidden)) show(el, true)
    }

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) stopAll()
    }

    const hashTarget = readHashTarget(window.location.hash)
    for (const el of candidates) {
      if (hashTarget && isAtOrBefore(el, hashTarget)) continue
      if (el.getBoundingClientRect().height > window.innerHeight) continue
      el.dataset.reveal = 'hidden'
      hidden.add(el)
      observer.observe(el)
    }

    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('transitionend', onTransitionEnd)
    window.addEventListener('hashchange', showUpToHash)
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('transitionend', onTransitionEnd)
      window.removeEventListener('hashchange', showUpToHash)
      motionQuery.removeEventListener('change', onMotionChange)
      observer.disconnect()
      for (const el of candidates) clear(el)
    }
  }, [])
}

function collectCandidates(): HTMLElement[] {
  const result: HTMLElement[] = []
  for (const section of document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)) {
    const items = Array.from(section.querySelectorAll<HTMLElement>(ITEM_SELECTOR))
    if (items.length === 0) {
      result.push(section)
      continue
    }
    for (const child of Array.from(section.children)) {
      if (child instanceof HTMLElement && !child.querySelector(ITEM_SELECTOR)) result.push(child)
    }
    items.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * STAGGER_MS, MAX_DELAY_MS)}ms`)
      result.push(item)
    })
  }
  return result
}

function clear(el: HTMLElement): void {
  delete el.dataset.reveal
  el.style.removeProperty('--reveal-delay')
  el.style.removeProperty('transition')
}

/** True when el is the target, contains it, precedes it, or is a non-item part of the target section. */
function isAtOrBefore(el: HTMLElement, target: HTMLElement): boolean {
  if (el === target || el.contains(target)) return true
  if (el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) return true
  return target.matches(SECTION_SELECTOR) && target.contains(el) && !el.matches(ITEM_SELECTOR)
}

function readHashTarget(hash: string): HTMLElement | null {
  if (hash.length <= 1) return null
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)))
  } catch {
    return null
  }
}

// Route map for the static pages (ADR 0005, slugs in ADR 0008). This is the only place where page
// paths are written: vite.config.ts derives the HTML entries and the canonical,
// og:url and hreflang URLs from it, and components link through it.
// Keep it DOM-free: vite.config.ts imports it.
import { defaultLocale, locales, type Locale } from './locale'

export const pages = ['home', 'journey', 'books'] as const

export type Page = (typeof pages)[number]

export type Route = {
  readonly locale: Locale
  readonly page: Page
}

/** Path of every page per locale, with leading and trailing slash. */
export const routes: Readonly<Record<Locale, Readonly<Record<Page, string>>>> = {
  en: {
    home: '/en/',
    journey: '/en/journey/',
    books: '/en/books/',
  },
  'pt-BR': {
    home: '/pt/',
    journey: '/pt/jornada/',
    books: '/pt/livros/',
  },
}

/** Lowercases and normalizes a pathname to the "/a/b/" form of the map. */
function normalizePathname(pathname: string): string {
  const segments = pathname
    .toLowerCase()
    .split('/')
    .filter((segment) => segment.length > 0)
  if (segments[segments.length - 1] === 'index.html') segments.pop()
  return segments.length === 0 ? '/' : `/${segments.join('/')}/`
}

/**
 * Resolves a URL pathname to its locale and page. Matching ignores case, a
 * missing trailing slash and a trailing `index.html` (`/pt/livros`,
 * `/pt/livros/index.html`). Any path outside the map resolves to the English
 * home.
 */
export function resolveRoute(pathname: string): Route {
  const normalized = normalizePathname(pathname)
  for (const locale of locales) {
    for (const page of pages) {
      if (routes[locale][page] === normalized) return { locale, page }
    }
  }
  return { locale: defaultLocale, page: 'home' }
}

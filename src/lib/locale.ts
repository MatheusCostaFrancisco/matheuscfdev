export const locales = ['en', 'pt-BR'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Path prefix of the static page built for each locale (see ADR 0002). */
export const localePaths: Record<Locale, string> = {
  en: '/en/',
  'pt-BR': '/pt/',
}

/**
 * Resolves the locale from a URL pathname by its first segment:
 * `/pt`, `/pt/` and `/pt/...` resolve to `pt-BR`; anything else resolves to `en`.
 */
export function localeFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split('/').find((segment) => segment.length > 0)
  return firstSegment?.toLowerCase() === 'pt' ? 'pt-BR' : defaultLocale
}

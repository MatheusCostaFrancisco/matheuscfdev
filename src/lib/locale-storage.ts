import type { Locale } from './locale'

/** localStorage key holding the visitor's explicit language choice (see ADR 0002). */
export const localeStorageKey = 'matheuscfdev.locale'

/** Remembers the chosen locale; storage can be blocked, so failures are ignored. */
export function storeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(localeStorageKey, locale)
  } catch {
    // Storage unavailable (private mode, blocked cookies): the choice just is not remembered.
  }
}

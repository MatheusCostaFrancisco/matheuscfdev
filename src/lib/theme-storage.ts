import { parseThemePreference, themeStorageKey, type ThemePreference } from './theme'

// Kept apart from theme.ts, which vite.config.ts imports under a config
// tsconfig without DOM types.

/** Saved choice; storage can be blocked, so failures read as "system". */
export function readThemePreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(themeStorageKey))
  } catch {
    return 'system'
  }
}

/** Remembers the choice ("system" clears it); failures are ignored. */
export function storeThemePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(themeStorageKey)
    } else {
      window.localStorage.setItem(themeStorageKey, preference)
    }
  } catch {
    // Storage unavailable (private mode, blocked cookies): the choice lasts only for the session.
  }
}

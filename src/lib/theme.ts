/**
 * Theme preference (docs/adr/0011-dark-theme.md). "system" leaves data-theme
 * unset on <html> so the CSS follows prefers-color-scheme; "light" and "dark"
 * set data-theme to the same value. The journey page owns data-theme="journey"
 * and is never touched (ADR 0010).
 */

/** localStorage key holding the visitor's explicit theme choice. */
export const themeStorageKey = 'matheuscfdev.theme'

export const themePreferences = ['system', 'light', 'dark'] as const

export type ThemePreference = (typeof themePreferences)[number]

/** Explicit themes, the only values written to data-theme. */
export type ExplicitTheme = Exclude<ThemePreference, 'system'>

export const explicitThemes: readonly ExplicitTheme[] = ['light', 'dark']

/**
 * Surface color of each theme, used by the theme-color metas. Mirrors
 * --color-surface in src/index.css (light in @theme, dark in @layer base);
 * update both together.
 */
export const themeSurface: Record<ExplicitTheme, string> = {
  light: '#f7f9fc',
  dark: '#0b1120',
}

/** A missing or unknown saved value means "follow the system". */
export function parseThemePreference(value: string | null | undefined): ThemePreference {
  return themePreferences.find((preference) => preference === value) ?? 'system'
}

/**
 * Content of one theme-color meta. An explicit theme paints both metas with its
 * surface; "system" leaves each meta on the surface of its own media query.
 */
export function themeColorContent(preference: ThemePreference, media: string): string {
  if (preference !== 'system') return themeSurface[preference]
  return media.includes('dark') ? themeSurface.dark : themeSurface.light
}

/**
 * Inline <head> script injected on every generated page except the journey
 * (vite.config.ts, themePlugin). It runs before the stylesheet paints and
 * applies the same rule as parseThemePreference: only "light" or "dark" set
 * data-theme and paint both theme-color metas with that theme's surface (same
 * result as themeColorContent); anything else leaves both untouched.
 */
export const themeInitScript = `(function(){try{var t=window.localStorage.getItem(${JSON.stringify(themeStorageKey)});if(${JSON.stringify(explicitThemes)}.indexOf(t)>=0){var d=document;d.documentElement.setAttribute("data-theme",t);var s=${JSON.stringify(themeSurface)}[t];var m=d.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++)m[i].setAttribute("content",s)}}catch(e){}})();`

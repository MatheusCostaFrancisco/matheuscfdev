import { themeSurface, type ThemePreference } from './theme'
import { storeThemePreference } from './theme-storage'

const switchingAttribute = 'data-theme-switching'

/**
 * Keeps the browser bar in step with an explicit choice: both theme-color metas
 * get that theme's surface; "system" restores each meta's own media color.
 */
function syncThemeColorMetas(preference: ThemePreference): void {
  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
  metas.forEach((meta) => {
    const own = meta.media.includes('dark') ? themeSurface.dark : themeSurface.light
    meta.content = preference === 'system' ? own : themeSurface[preference]
  })
}

/**
 * Applies and saves the choice. "system" removes data-theme so the CSS follows
 * prefers-color-scheme live. The switching attribute lets the stylesheet
 * suppress transitions for two frames so colors never animate on a switch.
 */
export function applyThemePreference(preference: ThemePreference): void {
  const root = document.documentElement
  root.setAttribute(switchingAttribute, '')
  if (preference === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', preference)
  }
  syncThemeColorMetas(preference)
  storeThemePreference(preference)
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => root.removeAttribute(switchingAttribute))
  })
}

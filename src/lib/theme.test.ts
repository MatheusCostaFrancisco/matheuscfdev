import { describe, expect, it } from 'vitest'
import {
  parseThemePreference,
  themeColorContent,
  themeInitScript,
  themeStorageKey,
  themeSurface,
} from './theme'

describe('parseThemePreference', () => {
  it('keeps each valid saved value', () => {
    expect(parseThemePreference('system')).toBe('system')
    expect(parseThemePreference('light')).toBe('light')
    expect(parseThemePreference('dark')).toBe('dark')
  })

  it('returns system for a missing value', () => {
    expect(parseThemePreference(null)).toBe('system')
    expect(parseThemePreference(undefined)).toBe('system')
  })

  it('returns system for an invalid value', () => {
    expect(parseThemePreference('')).toBe('system')
    expect(parseThemePreference('Dark')).toBe('system')
    expect(parseThemePreference(' light')).toBe('system')
    expect(parseThemePreference('journey')).toBe('system')
  })
})

describe('themeInitScript', () => {
  it('reads the same storage key as the helpers', () => {
    expect(themeInitScript).toContain(JSON.stringify(themeStorageKey))
  })

  it('guards localStorage with try/catch', () => {
    expect(themeInitScript).toMatch(/try\{.*localStorage.*\}catch\(e\)\{\}/)
  })
})

describe('themeColorContent', () => {
  const light = '(prefers-color-scheme: light)'
  const dark = '(prefers-color-scheme: dark)'

  it('keeps each meta on its own media surface for system', () => {
    expect(themeColorContent('system', light)).toBe(themeSurface.light)
    expect(themeColorContent('system', dark)).toBe(themeSurface.dark)
  })

  it('paints both metas with the light surface for light', () => {
    expect(themeColorContent('light', light)).toBe(themeSurface.light)
    expect(themeColorContent('light', dark)).toBe(themeSurface.light)
  })

  it('paints both metas with the dark surface for dark', () => {
    expect(themeColorContent('dark', light)).toBe(themeSurface.dark)
    expect(themeColorContent('dark', dark)).toBe(themeSurface.dark)
  })
})

describe('themeInitScript meta sync', () => {
  function run(saved: string | null): { theme: string | null; contents: string[] } {
    const metas = [{ content: themeSurface.light }, { content: themeSurface.dark }]
    const root: Record<string, string> = {}
    const fakeDocument = {
      documentElement: { setAttribute: (name: string, value: string) => (root[name] = value) },
      querySelectorAll: () =>
        metas.map((meta) => ({
          setAttribute: (_name: string, value: string) => (meta.content = value),
        })),
    }
    const fakeWindow = { localStorage: { getItem: () => saved } }
    new Function('window', 'document', themeInitScript)(fakeWindow, fakeDocument)
    return { theme: root['data-theme'] ?? null, contents: metas.map((meta) => meta.content) }
  }

  it('paints both metas with the saved dark surface', () => {
    expect(run('dark')).toEqual({ theme: 'dark', contents: [themeSurface.dark, themeSurface.dark] })
  })

  it('paints both metas with the saved light surface', () => {
    expect(run('light')).toEqual({
      theme: 'light',
      contents: [themeSurface.light, themeSurface.light],
    })
  })

  it('leaves the metas alone for system or no saved value', () => {
    const untouched = [themeSurface.light, themeSurface.dark]
    expect(run('system')).toEqual({ theme: null, contents: untouched })
    expect(run(null)).toEqual({ theme: null, contents: untouched })
  })
})

import { describe, expect, it } from 'vitest'
import { parseThemePreference, themeInitScript, themeStorageKey } from './theme'

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

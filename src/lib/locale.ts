// DOM-free on purpose: vite.config.ts imports the route map, which depends on
// this module, and the config is type-checked without DOM types.

export const locales = ['en', 'pt-BR'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

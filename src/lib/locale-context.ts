import { createContext, useContext } from 'react'
import { defaultLocale, type Locale } from './locale'

export const LocaleContext = createContext<Locale>(defaultLocale)

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

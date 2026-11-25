import type { Locale } from '../lib/locale'
import { experienceYears } from './career'
import { createEn } from './en'
import { createPtBR } from './pt-BR'
import type { SiteContent } from './types'

const years = experienceYears(new Date())

export const siteContent: Record<Locale, SiteContent> = {
  en: createEn(years),
  'pt-BR': createPtBR(years),
}

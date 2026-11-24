import type { Locale } from '../lib/locale'
import { en } from './en'
import { ptBR } from './pt-BR'
import type { SiteContent } from './types'

export const siteContent: Record<Locale, SiteContent> = {
  en,
  'pt-BR': ptBR,
}

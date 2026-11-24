import { siteContent } from '../content/site-content'
import type { SiteContent } from '../content/types'
import { useLocale } from './locale-context'

export function useContent(): SiteContent {
  return siteContent[useLocale()]
}

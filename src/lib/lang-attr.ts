import type { Locale } from './locale'

/** Value for the `lang` attribute of a passage: only set when it differs from the page locale. */
export function langAttr(passage: Locale | undefined, pageLocale: Locale): Locale | undefined {
  return passage !== undefined && passage !== pageLocale ? passage : undefined
}

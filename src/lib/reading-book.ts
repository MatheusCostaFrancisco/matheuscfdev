import type { Book } from '../content/books'

/**
 * Picks the book to highlight among the reading-now ones: the one with the highest
 * informed progress; with none informed, the first. Returns null for an empty list.
 */
export function pickReadingBook(reading: readonly Book[]): Book | null {
  let best: Book | null = null
  for (const book of reading) {
    if (best === null) {
      best = book
    } else if (book.progress !== null && (best.progress === null || book.progress > best.progress)) {
      best = book
    }
  }
  return best
}

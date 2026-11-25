/** Source: content/livros.md. Titles and authors are shared by both locales; `*Lang` marks the language they are written in. */

import type { Locale } from '../lib/locale'

export interface Book {
  readonly title: string
  readonly titleLang?: Locale
  readonly author: string
  readonly authorLang?: Locale
  /** Reading progress in percent (0-100); null when not informed ('—'). */
  readonly progress: number | null
}

export interface BookSeries {
  readonly kind: 'series'
  readonly name: string
  readonly nameLang?: Locale
  readonly author: string
  /** Books in reading order (position 1..n). */
  readonly books: readonly (Book & { readonly position: number })[]
}

export type ReadBookEntry = ({ readonly kind: 'book' } & Book) | BookSeries

export interface Books {
  readonly reading: readonly Book[]
  readonly read: readonly ReadBookEntry[]
  readonly wantToRead: readonly Pick<Book, 'title' | 'titleLang' | 'author' | 'authorLang'>[]
}

const percy = 'Rick Riordan'

export const books: Books = {
  reading: [
    { title: 'A Maneira Rápida e Fácil de Falar com Eficácia', titleLang: 'pt-BR', author: 'Dale Carnegie', progress: null },
    { title: 'Código Limpo (Clean Code)', titleLang: 'pt-BR', author: 'Robert C. Martin', progress: 70 },
    { title: 'Arquitetura Limpa', titleLang: 'pt-BR', author: 'Robert C. Martin', progress: 20 },
  ],
  read: [
    {
      kind: 'series',
      name: 'Percy Jackson e os Olimpianos',
      nameLang: 'pt-BR',
      author: percy,
      books: [
        { position: 1, title: 'O Ladrão de Raios', titleLang: 'pt-BR', author: percy, progress: 100 },
        { position: 2, title: 'O Mar de Monstros', titleLang: 'pt-BR', author: percy, progress: 100 },
        { position: 3, title: 'A Maldição do Titã', titleLang: 'pt-BR', author: percy, progress: 100 },
        { position: 4, title: 'A Batalha do Labirinto', titleLang: 'pt-BR', author: percy, progress: 100 },
        { position: 5, title: 'O Último Olimpiano', titleLang: 'pt-BR', author: percy, progress: 100 },
      ],
    },
    { kind: 'book', title: 'A Arte da Guerra', titleLang: 'pt-BR', author: 'Sun Tzu', progress: 100 },
    { kind: 'book', title: 'O Livro dos Cinco Anéis', titleLang: 'pt-BR', author: 'Miyamoto Musashi', progress: 100 },
  ],
  wantToRead: [
    { title: 'O Programador Pragmático', titleLang: 'pt-BR', author: 'Andrew Hunt e David Thomas', authorLang: 'pt-BR' },
    { title: 'AI Engineering', titleLang: 'en', author: 'Chip Huyen' },
    { title: 'Musashi', author: 'Eiji Yoshikawa' },
    { title: 'O Nome do Vento', titleLang: 'pt-BR', author: 'Patrick Rothfuss' },
  ],
}

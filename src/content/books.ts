/** Source: content/livros.md. Titles and authors are shared by both locales. */

export interface Book {
  readonly title: string
  readonly author: string
  /** Reading progress in percent (0-100); null when not informed ('—'). */
  readonly progress: number | null
}

export interface BookSeries {
  readonly kind: 'series'
  readonly name: string
  readonly author: string
  /** Books in reading order (position 1..n). */
  readonly books: readonly (Book & { readonly position: number })[]
}

export type ReadBookEntry = ({ readonly kind: 'book' } & Book) | BookSeries

export interface Books {
  readonly reading: readonly Book[]
  readonly read: readonly ReadBookEntry[]
  readonly wantToRead: readonly Pick<Book, 'title' | 'author'>[]
}

const percy = 'Rick Riordan'

export const books: Books = {
  reading: [
    { title: 'A Maneira Rápida e Fácil de Falar com Eficácia', author: 'Dale Carnegie', progress: null },
    { title: 'Código Limpo (Clean Code)', author: 'Robert C. Martin', progress: 70 },
    { title: 'Arquitetura Limpa', author: 'Robert C. Martin', progress: 20 },
  ],
  read: [
    {
      kind: 'series',
      name: 'Percy Jackson e os Olimpianos',
      author: percy,
      books: [
        { position: 1, title: 'O Ladrão de Raios', author: percy, progress: 100 },
        { position: 2, title: 'O Mar de Monstros', author: percy, progress: 100 },
        { position: 3, title: 'A Maldição do Titã', author: percy, progress: 100 },
        { position: 4, title: 'A Batalha do Labirinto', author: percy, progress: 100 },
        { position: 5, title: 'O Último Olimpiano', author: percy, progress: 100 },
      ],
    },
    { kind: 'book', title: 'A Arte da Guerra', author: 'Sun Tzu', progress: 100 },
    { kind: 'book', title: 'O Livro dos Cinco Anéis', author: 'Miyamoto Musashi', progress: 100 },
  ],
  wantToRead: [
    { title: 'O Programador Pragmático', author: 'Andrew Hunt e David Thomas' },
    { title: 'AI Engineering', author: 'Chip Huyen' },
    { title: 'Musashi', author: 'Eiji Yoshikawa' },
    { title: 'O Nome do Vento', author: 'Patrick Rothfuss' },
  ],
}

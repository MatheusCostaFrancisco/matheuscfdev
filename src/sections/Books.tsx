import { books } from "../content/books";
import type { Book } from "../content/books";
import { langAttr } from "../lib/lang-attr";
import { useLocale } from "../lib/locale-context";
import { useContent } from "../lib/use-content";

type BookLineProps = {
  book: Pick<Book, "title" | "titleLang" | "author" | "authorLang">;
};

function BookLine({ book }: BookLineProps) {
  const locale = useLocale();
  return (
    <>
      <p
        lang={langAttr(book.titleLang, locale)}
        className="text-base font-semibold text-fg [overflow-wrap:anywhere]"
      >
        {book.title}
      </p>
      <p
        lang={langAttr(book.authorLang, locale)}
        className="text-sm text-fg-muted [overflow-wrap:anywhere]"
      >
        {book.author}
      </p>
    </>
  );
}

type ProgressBookProps = {
  book: Book;
};

function ProgressBook({ book }: ProgressBookProps) {
  const locale = useLocale();
  return (
    <li data-reveal-item className="min-w-0 rounded-2xl border border-line bg-surface-raised p-5 shadow-sm">
      <BookLine book={book} />
      {book.progress !== null && (
        <div className="mt-3 flex items-center gap-3">
          <progress
            value={book.progress}
            max={100}
            aria-label={book.title}
            lang={langAttr(book.titleLang, locale)}
            className="h-2 min-w-0 flex-1 appearance-none overflow-hidden rounded-2xl border-0 bg-line-strong [&::-moz-progress-bar]:rounded-2xl [&::-moz-progress-bar]:bg-accent-900 [&::-webkit-progress-bar]:rounded-2xl [&::-webkit-progress-bar]:bg-line-strong [&::-webkit-progress-value]:rounded-2xl [&::-webkit-progress-value]:bg-accent-900"
          />
          <span className="text-sm font-medium text-fg">{book.progress}%</span>
        </div>
      )}
    </li>
  );
}

export function Books() {
  const { navigation, ui } = useContent();
  const locale = useLocale();
  const item = navigation.find((nav) => nav.id === "books");

  if (!item) return null;

  const { groups, seriesBooks } = ui.books;

  return (
    <section
      id={item.id}
      aria-labelledby="books-title"
      className="section-offset py-10"
    >
      <h1 id="books-title" className="text-3xl font-bold text-fg sm:text-4xl [overflow-wrap:anywhere]">
        {ui.books.heading}
      </h1>

      <h2 className="mt-8 text-xl font-semibold text-fg">{groups.reading}</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {books.reading.map((book) => (
          <ProgressBook key={book.title} book={book} />
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-fg">{groups.read}</h2>
      <ul className="mt-4 space-y-4">
        {books.read.map((entry) =>
          entry.kind === "series" ? (
            <li
              key={entry.name}
              data-reveal-item
              className="min-w-0 rounded-2xl bg-surface-sunken p-5"
            >
              <h3 className="text-base font-semibold text-fg [overflow-wrap:anywhere]">
                <span lang={langAttr(entry.nameLang, locale)}>{entry.name}</span>
                <span className="font-normal text-fg-muted">
                  {" · "}
                  {entry.books.length} {seriesBooks}
                </span>
              </h3>
              <p className="text-sm text-fg-muted">{entry.author}</p>
              <ol className="mt-3 space-y-1 text-sm text-fg">
                {entry.books.map((book) => (
                  <li
                    key={book.position}
                    className="flex gap-2 [overflow-wrap:anywhere]"
                  >
                    <span className="text-fg-muted">{book.position}.</span>
                    <span
                      lang={langAttr(book.titleLang, locale)}
                      className="min-w-0"
                    >
                      {book.title}
                    </span>
                  </li>
                ))}
              </ol>
            </li>
          ) : (
            <li
              key={entry.title}
              data-reveal-item
              className="min-w-0 rounded-2xl border border-line bg-surface-raised p-5"
            >
              <BookLine book={entry} />
            </li>
          ),
        )}
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-fg">
        {groups.wantToRead}
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {books.wantToRead.map((book) => (
          <li
            key={book.title}
            data-reveal-item
            className="min-w-0 rounded-2xl border border-dashed border-line bg-surface-raised p-5"
          >
            <BookLine book={book} />
          </li>
        ))}
      </ul>
    </section>
  );
}

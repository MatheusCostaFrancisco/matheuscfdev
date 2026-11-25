import { books } from "../content/books";
import { roadmap } from "../content/roadmap";
import { langAttr } from "../lib/lang-attr";
import { useLocale } from "../lib/locale-context";
import { pickReadingBook } from "../lib/reading-book";
import { getStageStatuses } from "../lib/roadmap-stage";
import { routes } from "../lib/routes";
import { useContent } from "../lib/use-content";

const linkClass =
  "flex min-h-11 items-center rounded-2xl border border-line bg-surface-raised px-5 py-3 text-base font-medium text-fg shadow-sm [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 motion-safe:transition-colors hover:border-accent-600 hover:text-accent-800 active:bg-surface-sunken";

export function Teasers() {
  const { ui } = useContent();
  const locale = useLocale();
  const { stages } = roadmap[locale];
  const statuses = getStageStatuses(stages, new Date());
  const stage = stages[statuses.indexOf("current")];
  const book = pickReadingBook(books.reading);

  return (
    <section aria-labelledby="teasers-title" className="py-10">
      <h2 id="teasers-title" className="sr-only">
        {ui.teasers.heading}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        <li className="min-w-0">
          <a href={routes[locale].roadmap} className={linkClass}>
            <span>
              {stage ? (
                <>
                  {ui.teasers.roadmapLabel}:{" "}
                  <span lang={langAttr(stage.themeLang, locale)}>
                    {stage.theme}
                  </span>
                </>
              ) : (
                ui.teasers.roadmapFallback
              )}
            </span>
          </a>
        </li>
        <li className="min-w-0">
          <a href={routes[locale].books} className={linkClass}>
            <span>
              {book ? (
                <>
                  {ui.teasers.booksLabel}:{" "}
                  <span lang={langAttr(book.titleLang, locale)}>
                    {book.title}
                  </span>
                  {book.progress !== null && ` (${book.progress}%)`}
                </>
              ) : (
                ui.teasers.booksFallback
              )}
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}

import { RECOMMENDATIONS_URL, testimonials } from "../content/testimonials";
import type { Testimonial } from "../content/testimonials";
import { langAttr } from "../lib/lang-attr";
import { useLocale } from "../lib/locale-context";
import { useContent } from "../lib/use-content";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { ui } = useContent();
  const locale = useLocale();
  const { quote } = testimonial;
  const translated = locale === "en";
  const paragraphs = translated ? quote.en.paragraphs : quote["pt-BR"];
  const date = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(testimonial.date));

  return (
    <figure data-reveal-item className="min-w-0 rounded-2xl border border-line bg-surface-raised p-5 shadow-sm sm:p-6">
      {translated && (
        <p className="mb-3 inline-block rounded-2xl border border-line-strong bg-surface-sunken px-3 py-1 text-sm font-medium text-fg-muted">
          {ui.testimonials.translatedLabel}
        </p>
      )}
      <blockquote className="space-y-3 text-base text-fg [overflow-wrap:anywhere]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </blockquote>
      <figcaption className="mt-4 border-t border-line pt-4 text-sm text-fg-muted [overflow-wrap:anywhere]">
        <span className="block text-base font-semibold text-fg">
          {testimonial.name}
        </span>
        <span className="mt-1 block">
          <span className="sr-only">{ui.testimonials.profileTitleLabel}: </span>
          <span lang={langAttr(testimonial.profileTitleLang, locale)}>
            {testimonial.profileTitle}
          </span>
        </span>
        <span className="mt-1 block font-medium text-accent-700">
          {testimonial.company}
        </span>
        <span className="mt-1 block">
          <span className="sr-only">{ui.testimonials.relationshipLabel}: </span>
          {ui.testimonials.relationships[testimonial.relationship]}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          <time dateTime={testimonial.date}>{date}</time>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const { ui } = useContent();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="section-offset py-10"
    >
      <h2 id="testimonials-title" className="text-2xl font-semibold text-fg">
        {ui.testimonials.heading}
      </h2>
      <div className="mt-8 grid gap-4">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={`${testimonial.name}-${testimonial.date}`}
            testimonial={testimonial}
          />
        ))}
      </div>
      <a
        href={RECOMMENDATIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-11 items-center rounded-2xl border border-line bg-surface-raised px-5 py-3 text-base font-medium text-fg shadow-sm [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 motion-safe:transition-colors hover:border-accent-600 hover:text-accent-800 active:bg-surface-sunken"
      >
        {ui.testimonials.viewOriginal}
        <span className="sr-only"> {ui.opensInNewTab}</span>
      </a>
    </section>
  );
}

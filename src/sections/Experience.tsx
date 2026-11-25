import { toDateTime } from "../lib/period";
import { useContent } from "../lib/use-content";

type PeriodDateProps = { label: string };

function PeriodDate({ label }: PeriodDateProps) {
  const dateTime = toDateTime(label);
  return dateTime ? <time dateTime={dateTime}>{label}</time> : <>{label}</>;
}

export function Experience() {
  const { experience, navigation } = useContent();
  const experienceItem = navigation.find((item) => item.id === "experience");

  if (!experienceItem) return null;

  return (
    <section
      id={experienceItem.id}
      aria-labelledby="experience-title"
      className="scroll-mt-20 py-10"
    >
      <h2 id="experience-title" className="text-2xl font-semibold text-fg">
        {experienceItem.label}
      </h2>
      <ol className="mt-8 ml-2 border-l-2 border-line">
        {experience.map((job) => (
          <li
            key={`${job.company}-${job.start}`}
            data-reveal-item
            className="relative pb-10 pl-6 last:pb-0 sm:pl-8"
          >
            <span
              aria-hidden="true"
              className="absolute top-2 -left-1.75 size-3 rounded-full border-2 border-accent-600 bg-surface"
            />
            <article className="min-w-0">
              <h3 className="text-xl font-semibold text-fg">{job.role}</h3>
              <p className="mt-1 text-base font-medium text-accent-700">
                {job.company}
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                <PeriodDate label={job.start} /> –{" "}
                <PeriodDate label={job.end} />
                {job.location ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span className="sr-only">, </span>
                    {job.location}
                  </>
                ) : null}
              </p>
              {job.context ? (
                <p className="mt-1 text-sm text-fg-muted">{job.context}</p>
              ) : null}
              {job.note ? (
                <p className="mt-3 inline-block rounded-2xl border border-accent-600 bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800">
                  {job.note}
                </p>
              ) : null}
              {job.bullets.length > 0 ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-fg marker:text-accent-600">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="break-words">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

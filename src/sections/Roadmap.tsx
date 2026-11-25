import { useRef } from "react";
import { roadmap } from "../content/roadmap";
import { langAttr } from "../lib/lang-attr";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/locale-context";
import { getStageStatuses } from "../lib/roadmap-stage";
import { useContent } from "../lib/use-content";
import { useJourneyProgress } from "../lib/use-journey-progress";

export function Roadmap() {
  const { navigation, ui } = useContent();
  const locale = useLocale();
  const item = navigation.find((nav) => nav.id === "roadmap");
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  useJourneyProgress(trackRef, fillRef);

  if (!item) return null;

  const { title, destination, whyNow, stages } = roadmap[locale];
  const statuses = getStageStatuses(stages, new Date());

  return (
    <section
      id={item.id}
      aria-labelledby="roadmap-title"
      className="scroll-mt-20 py-10"
    >
      <h1
        id="roadmap-title"
        className="text-3xl font-bold text-fg sm:text-4xl [overflow-wrap:anywhere]"
      >
        {title}
      </h1>

      <div className="mt-8 rounded-2xl border border-line bg-surface-raised p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-sm font-medium text-fg-muted">
              {ui.roadmap.from}
            </dt>
            <dd
              lang={langAttr(destination.fromLang, locale)}
              className="mt-1 text-lg font-semibold text-fg [overflow-wrap:anywhere]"
            >
              {destination.from}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm font-medium text-fg-muted">
              {ui.roadmap.to}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-accent-800 [overflow-wrap:anywhere]">
              {destination.to}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-base text-fg-muted">{destination.phrase}</p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-fg">{whyNow.title}</h2>
      <p className="mt-2 text-base text-fg-muted">{whyNow.intro}</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {whyNow.pillars.map((pillar) => (
          <li
            key={pillar.title}
            className="min-w-0 rounded-2xl bg-surface-sunken p-5"
          >
            <h3
              lang={langAttr(pillar.titleLang, locale)}
              className="text-base font-semibold text-fg"
            >
              {pillar.title}
            </h3>
            <p className="mt-1 text-sm text-fg-muted">{pillar.description}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-fg">
        {ui.roadmap.stagesHeading}
      </h2>
      <div className="relative mt-4">
        <div
          ref={trackRef}
          aria-hidden="true"
          className="absolute bottom-0 left-[0.4375rem] top-9 w-0.5 bg-line"
        >
          <div
            ref={fillRef}
            className="journey-fill h-full w-full bg-accent-600"
          />
        </div>
        <ol className="space-y-4 pl-8">
          {stages.map((stage, index) => {
            const status = statuses[index] ?? "upcoming";
            const headingId = `roadmap-stage-${stage.id}`;
            return (
              <li
                key={stage.id}
                aria-labelledby={headingId}
                aria-current={status === "current" ? "step" : undefined}
                className={cn(
                  "relative min-w-0 rounded-2xl border bg-surface-raised p-6 shadow-sm",
                  status === "current"
                    ? "border-accent-600 border-2"
                    : "border-line",
                  status === "upcoming" && "border-dashed",
                )}
              >
                <span
                  aria-hidden="true"
                  data-journey-marker
                  className={cn(
                    "absolute -left-8 top-7 size-4 rounded-full border-2",
                    status === "upcoming"
                      ? "border-line-strong bg-surface"
                      : "border-accent-600 bg-accent-600",
                  )}
                >
                  {status === "current" && (
                    <span className="journey-pulse absolute inset-0 rounded-full bg-accent-600" />
                  )}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 id={headingId} className="text-lg font-semibold text-fg">
                    {stage.label}
                    <span className="font-normal text-fg-muted">
                      {" · "}
                      {stage.period}
                    </span>
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-2xl px-3 py-1 text-sm font-medium",
                      status === "current"
                        ? "bg-accent-800 text-on-accent"
                        : "bg-accent-50 text-accent-800",
                    )}
                  >
                    <span aria-hidden="true">
                      {status === "done"
                        ? "✓"
                        : status === "current"
                          ? "●"
                          : "○"}
                    </span>
                    {ui.roadmap.status[status]}
                  </span>
                </div>
                <p
                  lang={langAttr(stage.themeLang, locale)}
                  className="mt-2 text-base font-medium text-accent-800"
                >
                  {stage.theme}
                </p>
                {stage.study.length > 0 && (
                  <>
                    <h4 className="mt-4 text-sm font-semibold text-fg">
                      {ui.roadmap.studyHeading}
                    </h4>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-fg-muted">
                      {stage.study.map((entry) => (
                        <li key={entry} className="[overflow-wrap:anywhere]">
                          {entry}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <h4 className="mt-4 text-sm font-semibold text-fg">
                  {ui.roadmap.deliverableHeading}
                </h4>
                <p className="mt-1 text-sm text-fg-muted">
                  {stage.deliverable}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

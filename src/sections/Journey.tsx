import { useRef, type ReactNode } from "react";
import { JourneyScene } from "../components/JourneyScene";
import { journey } from "../content/journey";
import type { JourneyBoss } from "../content/journey";
import { cn } from "../lib/cn";
import { journeyState, type JourneyStatus } from "../lib/journey-state";
import { langAttr } from "../lib/lang-attr";
import { useLocale } from "../lib/locale-context";
import { useContent } from "../lib/use-content";
import { useJourneyProgress } from "../lib/use-journey-progress";

const legendStatuses: readonly JourneyStatus[] = [
  "completed",
  "current",
  "locked",
];

const statusTone: Record<JourneyStatus, string> = {
  completed: "text-journey-completed",
  current: "text-journey-current",
  locked: "text-journey-locked",
};

type StatusIconProps = {
  status: JourneyStatus;
};

function StatusIcon({ status }: StatusIconProps) {
  return (
    <svg
      aria-hidden="true"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {status === "completed" && <path d="M20 6 9 17l-5-5" />}
      {status === "current" && <circle cx="12" cy="12" r="5" fill="currentColor" />}
      {status === "locked" && (
        <>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </>
      )}
    </svg>
  );
}

type StatusBadgeProps = {
  status: JourneyStatus;
  label: string;
};

function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl border border-current px-3 py-1 text-sm font-medium",
        statusTone[status],
      )}
    >
      <StatusIcon status={status} />
      {label}
    </span>
  );
}

type XpBarProps = {
  value: number;
  label: string;
  status: JourneyStatus;
};

function XpBar({ value, label, status }: XpBarProps) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <progress
        value={value}
        max={100}
        aria-label={label}
        className={cn(
          "h-2 min-w-0 flex-1 appearance-none overflow-hidden rounded-full border border-line-strong bg-surface-sunken",
          "[&::-webkit-progress-bar]:bg-surface-sunken",
          "[&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:rounded-full",
          status === "locked"
            ? "[&::-webkit-progress-value]:bg-journey-locked [&::-moz-progress-bar]:bg-journey-locked"
            : "[&::-webkit-progress-value]:bg-journey-completed [&::-moz-progress-bar]:bg-journey-completed",
        )}
      />
      <span aria-hidden="true" className="text-sm font-medium text-fg-muted">
        {value}%
      </span>
    </div>
  );
}

type BossBlockProps = {
  boss: JourneyBoss;
};

function BossBlock({ boss }: BossBlockProps) {
  const locale = useLocale();
  const { ui } = useContent();
  const text = ui.journey;
  return (
    <div className="mt-4 rounded-2xl bg-surface-sunken p-4">
      <p className="text-sm font-semibold text-fg">{text.bossHeading}</p>
      <p
        lang={langAttr(boss.lang, locale)}
        className="mt-1 flex gap-2 text-sm text-fg-muted [overflow-wrap:anywhere]"
      >
        <span aria-hidden="true">{boss.done ? "✓" : "○"}</span>
        <span className="min-w-0">
          <span className="sr-only">
            {boss.done ? text.itemDone : text.itemNotDone}:{" "}
          </span>
          {boss.label}
        </span>
      </p>
      {boss.link !== undefined && (
        <a
          href={boss.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-2xl text-sm font-medium text-accent-700 underline underline-offset-4 transition-colors hover:text-accent-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 active:text-accent-900"
        >
          {text.deliverableLink}
          <span className="sr-only"> {ui.opensInNewTab}</span>
        </a>
      )}
    </div>
  );
}

const cardClass =
  "relative min-w-0 section-offset rounded-2xl border bg-surface-raised p-6";

function cardTone(status: JourneyStatus): string {
  if (status === "current") {
    return "border-2 border-journey-current shadow-journey-glow-md";
  }
  return status === "locked" ? "border-dashed border-line" : "border-line";
}

type MarkerProps = {
  status: JourneyStatus;
};

function Marker({ status }: MarkerProps) {
  return (
    <span
      aria-hidden="true"
      data-journey-marker
      className={cn(
        "absolute -left-8 top-7 size-4 rounded-full border-2",
        status === "locked" &&
          "border-journey-locked bg-surface",
        status === "completed" &&
          "border-journey-completed bg-journey-completed",
        status === "current" &&
          "border-journey-current bg-journey-current shadow-journey-glow-sm",
      )}
    >
      {status === "current" && (
        <span className="journey-pulse absolute inset-0 rounded-full bg-journey-current" />
      )}
    </span>
  );
}

type StageCardProps = {
  id: string;
  title: string;
  note?: string;
  status: JourneyStatus;
  xp: number;
  lockedWorld: number | undefined;
  checklist?: ReactNode;
  boss: JourneyBoss;
};

function StageCard({
  id,
  title,
  note,
  status,
  xp,
  lockedWorld,
  checklist,
  boss,
}: StageCardProps) {
  const { ui } = useContent();
  const text = ui.journey;
  const headingId = `${id}-title`;
  return (
    <li
      id={id}
      aria-labelledby={headingId}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(cardClass, cardTone(status))}
    >
      <Marker status={status} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          id={headingId}
          className="text-lg font-semibold text-fg [overflow-wrap:anywhere]"
        >
          {title}
        </h3>
        <StatusBadge status={status} label={text.status[status]} />
      </div>
      {status === "locked" && lockedWorld !== undefined && (
        <p className="mt-2 text-sm text-journey-locked">
          {text.lockedBy(lockedWorld)}
        </p>
      )}
      {note !== undefined && (
        <p className="mt-2 text-sm text-fg-muted">{note}</p>
      )}
      <XpBar value={xp} label={text.xpLabel(title)} status={status} />
      {checklist}
      <BossBlock boss={boss} />
    </li>
  );
}

export function Journey() {
  const { navigation, ui } = useContent();
  const locale = useLocale();
  const item = navigation.find((nav) => nav.id === "journey");
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  useJourneyProgress(trackRef, fillRef);

  if (!item) return null;

  const { destination, worlds, finalBoss } = journey[locale];
  const text = ui.journey;
  const state = journeyState(worlds, finalBoss);
  const lastWorld = worlds[worlds.length - 1];

  return (
    <section
      id={item.id}
      aria-labelledby="journey-title"
      className="section-offset py-10"
    >
      <JourneyScene />
      <h1
        id="journey-title"
        className="text-3xl font-bold text-fg sm:text-4xl [overflow-wrap:anywhere]"
      >
        {text.title}
      </h1>

      <div className="mt-8 rounded-2xl border border-line bg-surface-raised p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-sm font-medium text-fg-muted">{text.from}</dt>
            <dd
              lang={langAttr(destination.fromLang, locale)}
              className="mt-1 text-lg font-semibold text-fg [overflow-wrap:anywhere]"
            >
              {destination.from}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm font-medium text-fg-muted">{text.to}</dt>
            <dd
              lang={langAttr(destination.toLang, locale)}
              className="mt-1 text-lg font-semibold text-journey-current [overflow-wrap:anywhere]"
            >
              {destination.to}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm font-medium text-fg-muted">
              {text.totalXp}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-fg">
              {state.totalXp}%
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm font-medium text-fg-muted">
              {text.worldsCompleted}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-fg">
              {state.completedLabel}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-base text-fg-muted">{destination.phrase}</p>
        <p className="mt-6 text-sm font-semibold text-fg">
          {text.legendHeading}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {legendStatuses.map((status) => (
            <li key={status}>
              <StatusBadge status={status} label={text.status[status]} />
            </li>
          ))}
        </ul>
      </div>

      <h2 className="sr-only">{text.worldsHeading}</h2>
      <div className="relative mt-8">
        <div
          ref={trackRef}
          aria-hidden="true"
          className="absolute bottom-0 left-[0.4375rem] top-9 w-0.5 bg-line"
        >
          <div
            ref={fillRef}
            className="journey-fill h-full w-full bg-journey-completed"
          />
        </div>
        <ol className="space-y-4 pl-8">
          {worlds.map((world, index) => {
            const stage = state.worlds[index];
            if (!stage) return null;
            return (
              <StageCard
                key={world.id}
                id={world.id}
                title={`${text.worldLabel} ${world.number} · ${world.title}`}
                status={stage.status}
                xp={stage.xp}
                lockedWorld={worlds[index - 1]?.number}
                boss={world.boss}
                checklist={
                  <>
                    <h4 className="mt-4 text-sm font-semibold text-fg">
                      {text.checklistHeading}
                    </h4>
                    <ul className="mt-1 space-y-1 text-sm text-fg-muted">
                      {world.study.map((entry) => (
                        <li
                          key={entry.label}
                          lang={langAttr(entry.lang, locale)}
                          className="flex gap-2 [overflow-wrap:anywhere]"
                        >
                          <span aria-hidden="true">
                            {entry.done ? "✓" : "○"}
                          </span>
                          <span className="min-w-0">
                            <span className="sr-only">
                              {entry.done ? text.itemDone : text.itemNotDone}
                              :{" "}
                            </span>
                            {entry.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                }
              />
            );
          })}
          <StageCard
            id={finalBoss.id}
            title={finalBoss.title}
            note={finalBoss.note}
            status={state.finalBoss.status}
            xp={state.finalBoss.xp}
            lockedWorld={lastWorld?.number}
            boss={finalBoss.boss}
          />
        </ol>
      </div>
    </section>
  );
}

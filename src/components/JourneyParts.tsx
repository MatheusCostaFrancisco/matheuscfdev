import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import type { JourneyBoss, JourneyStudyItem } from "../content/journey";
import type { JourneyStatus } from "../lib/journey-state";
import { langAttr } from "../lib/lang-attr";
import { useLocale } from "../lib/locale-context";
import { useContent } from "../lib/use-content";

const statusTone: Record<JourneyStatus, string> = {
  completed: "text-journey-completed",
  current: "text-journey-current",
  locked: "text-journey-locked",
};

type StatusIconProps = {
  status: JourneyStatus;
};

export function StatusIcon({ status }: StatusIconProps) {
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
  /** Over the 3D canvas the locked tone is too dark for a translucent panel. */
  scene?: boolean;
};

export function StatusBadge({ status, label, scene = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl border border-current px-3 py-1 text-sm font-medium",
        scene && status === "locked" ? "text-fg-muted" : statusTone[status],
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
  animate?: boolean;
};

// First entry: the bar mounts empty and fills to its value on the next frames.
// Under prefers-reduced-motion it renders at the final value from the start.
function useFillOnEntry(value: number, animate: boolean): number {
  const [shown, setShown] = useState(() =>
    !animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? value
      : 0,
  );
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setShown(value));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [value]);
  return shown;
}

export function XpBar({ value, label, status, animate = true }: XpBarProps) {
  const shown = useFillOnEntry(value, animate);
  return (
    <div className="mt-4 flex items-center gap-3">
      <progress
        value={shown}
        max={100}
        aria-label={label}
        className={cn(
          "h-2 min-w-0 flex-1 appearance-none overflow-hidden rounded-full border border-line-strong bg-surface-sunken",
          "[&::-webkit-progress-bar]:bg-surface-sunken",
          "[&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:rounded-full",
          "motion-safe:[&::-webkit-progress-value]:transition-[width] motion-safe:[&::-webkit-progress-value]:duration-700 motion-safe:[&::-webkit-progress-value]:ease-out",
          "motion-safe:[&::-moz-progress-bar]:transition-[width] motion-safe:[&::-moz-progress-bar]:duration-700 motion-safe:[&::-moz-progress-bar]:ease-out",
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

export function BossBlock({ boss }: BossBlockProps) {
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

type StudyListProps = {
  study: readonly JourneyStudyItem[];
  headingLevel?: "h3" | "h4";
};

export function StudyList({ study, headingLevel = "h4" }: StudyListProps) {
  const Heading = headingLevel;
  const locale = useLocale();
  const { ui } = useContent();
  const text = ui.journey;
  return (
    <>
      <Heading className="mt-4 text-sm font-semibold text-fg">
        {text.checklistHeading}
      </Heading>
      <ul className="mt-1 space-y-1 text-sm text-fg-muted">
        {study.map((entry) => (
          <li
            key={entry.label}
            lang={langAttr(entry.lang, locale)}
            className="flex gap-2 [overflow-wrap:anywhere]"
          >
            <span aria-hidden="true">{entry.done ? "✓" : "○"}</span>
            <span className="min-w-0">
              <span className="sr-only">
                {entry.done ? text.itemDone : text.itemNotDone}:{" "}
              </span>
              {entry.label}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

import { useEffect, useRef, type ReactNode } from "react";
import type { JourneyBoss } from "../content/journey";
import type { JourneyStatus } from "../lib/journey-state";
import { useContent } from "../lib/use-content";
import { BossBlock, StatusBadge, XpBar } from "./JourneyParts";

export type WorldPanel = {
  id: string;
  title: string;
  note?: string;
  status: JourneyStatus;
  xp: number;
  lockedWorld: number | undefined;
  boss: JourneyBoss;
  checklist: ReactNode;
};

type WorldDialogProps = {
  panel: WorldPanel | null;
  onClosed: () => void;
};

/**
 * Modal panel of one world, opened from a planet or from the world card.
 * Uses the native <dialog> in modal mode: the browser traps focus, makes the
 * rest of the page inert and closes on Esc. The header (with the close
 * button) is sticky, so it stays reachable while the body scrolls at 320px
 * or 400% zoom.
 */
export function WorldDialog({ panel, onClosed }: WorldDialogProps) {
  const { ui } = useContent();
  const text = ui.journey;
  const ref = useRef<HTMLDialogElement>(null);
  const open = panel !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (dialog === null) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [open]);

  const headingId = "world-dialog-title";

  return (
    <dialog
      ref={ref}
      aria-labelledby={headingId}
      onClose={onClosed}
      onClick={(event) => {
        if (event.target === event.currentTarget) ref.current?.close();
      }}
      className="m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-xl overscroll-contain rounded-2xl border border-line bg-surface-raised p-0 text-fg backdrop:bg-journey-space/80"
    >
      {panel !== null && (
        <>
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 rounded-t-2xl border-b border-line bg-surface-raised p-4">
            <h2
              id={headingId}
              className="min-w-0 text-lg font-semibold [overflow-wrap:anywhere]"
            >
              {panel.title}
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="shrink-0 cursor-pointer rounded-2xl border border-line-strong min-h-11 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 active:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-50"
            >
              {text.closePanel}
            </button>
          </div>
          <div
            role="region"
            aria-labelledby={headingId}
            tabIndex={0}
            className="p-4 pt-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-600"
          >
            <StatusBadge status={panel.status} label={text.status[panel.status]} />
            {panel.status === "locked" && panel.lockedWorld !== undefined && (
              <p className="mt-3 text-sm text-journey-locked">
                {text.lockedBy(panel.lockedWorld)}
              </p>
            )}
            {panel.note !== undefined && (
              <p className="mt-3 text-sm text-fg-muted">{panel.note}</p>
            )}
            <XpBar
              value={panel.xp}
              label={text.xpLabel(panel.title)}
              status={panel.status}
              animate={false}
            />
            {panel.checklist}
            <BossBlock boss={panel.boss} />
          </div>
        </>
      )}
    </dialog>
  );
}

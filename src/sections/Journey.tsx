import { useCallback, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { StatusBadge, StudyList, BossBlock, XpBar } from "../components/JourneyParts";
import { JourneyScene } from "../components/JourneyScene";
import { WorldDialog, type WorldPanel } from "../components/WorldDialog";
import { journey } from "../content/journey";
import type { JourneyBoss } from "../content/journey";
import { cn } from "../lib/cn";
import { journeyState, type JourneyStatus } from "../lib/journey-state";
import { langAttr } from "../lib/lang-attr";
import { useLocale } from "../lib/locale-context";
import { useContent } from "../lib/use-content";
import { useActiveStage } from "../lib/use-active-stage";
import { useJourneyProgress } from "../lib/use-journey-progress";

const legendStatuses: readonly JourneyStatus[] = [
  "completed",
  "current",
  "locked",
];

const keyboardHintId = "journey-keyboard-hint";

const cardClass = "relative min-w-0 section-offset rounded-2xl border p-6";

// Over the 3D canvas the panels are 80% opaque so the scene shows through.
// ADR 0007 (addendum 2026-11-26) measures every text on them against a white
// canvas pixel. Without the scene they stay opaque, as before.
function panelSurface(scene: boolean): string {
  return scene ? "bg-surface-raised/80" : "bg-surface-raised";
}

// The global focus ring sits outside the element, on the bare canvas, where it
// can fall under 3:1. In scene mode the card ring is drawn inside the panel.
function cardFocus(scene: boolean): string | false {
  return scene && "focus-visible:outline-offset-[-4px]";
}

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
  scene: boolean;
  onOpen: (id: string, opener: HTMLElement) => void;
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
  scene,
  onOpen,
}: StageCardProps) {
  const { ui } = useContent();
  const text = ui.journey;
  const headingId = `${id}-title`;
  return (
    <li
      id={id}
      aria-labelledby={headingId}
      aria-current={status === "current" ? "step" : undefined}
      aria-describedby={keyboardHintId}
      tabIndex={0}
      onKeyDown={(event: KeyboardEvent<HTMLLIElement>) => {
        if (event.key === "Enter" && event.target === event.currentTarget) {
          event.preventDefault();
          onOpen(id, event.currentTarget);
        }
      }}
      className={cn(
        cardClass,
        panelSurface(scene),
        cardTone(status),
        cardFocus(scene),
      )}
    >
      <Marker status={status} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          id={headingId}
          className="text-lg font-semibold text-fg [overflow-wrap:anywhere]"
        >
          {title}
        </h3>
        <StatusBadge
          status={status}
          label={text.status[status]}
          scene={scene}
        />
      </div>
      <button
        type="button"
        aria-label={text.openPanel(title)}
        onClick={(event) => onOpen(id, event.currentTarget)}
        className="mt-3 cursor-pointer rounded-2xl border border-line-strong min-h-11 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 active:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-50"
      >
        {text.openPanelAction}
      </button>
      {status === "locked" && lockedWorld !== undefined && (
        <p
          className={cn(
            "mt-2 text-sm",
            scene ? "text-fg-muted" : "text-journey-locked",
          )}
        >
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
  const listRef = useRef<HTMLOListElement>(null);
  useJourneyProgress(trackRef, fillRef);
  const { destination, worlds, finalBoss } = journey[locale];
  const stageIds = [...worlds.map((world) => world.id), finalBoss.id];
  const state = journeyState(worlds, finalBoss);
  const currentIndex = [...state.worlds, state.finalBoss].findIndex(
    (stage) => stage.status === "current",
  );
  const activeIndex = useActiveStage(
    stageIds,
    listRef,
    Math.max(currentIndex, 0),
  );
  const [sceneActive, setSceneActive] = useState(false);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const lastWorld = worlds[worlds.length - 1];
  const text = ui.journey;

  const worldTitle = (world: (typeof worlds)[number]) =>
    `${text.worldLabel} ${world.number} · ${world.title}`;

  const openPanel = useCallback((id: string, opener: HTMLElement | null) => {
    openerRef.current = opener;
    setOpenId(id);
  }, []);
  const openFromScene = (index: number) => {
    const id = stageIds[index];
    if (id !== undefined) openPanel(id, document.getElementById(id));
  };
  const handleClosed = useCallback(() => {
    setOpenId(null);
    const opener = openerRef.current;
    openerRef.current = null;
    opener?.focus();
  }, []);

  if (!item) return null;

  const panels: WorldPanel[] = [
    ...worlds.map((world, index) => ({
      id: world.id,
      title: worldTitle(world),
      status: state.worlds[index]?.status ?? "locked",
      xp: state.worlds[index]?.xp ?? 0,
      lockedWorld: worlds[index - 1]?.number,
      boss: world.boss,
      checklist: <StudyList study={world.study} headingLevel="h3" />,
    })),
    {
      id: finalBoss.id,
      title: finalBoss.title,
      note: finalBoss.note,
      status: state.finalBoss.status,
      xp: state.finalBoss.xp,
      lockedWorld: lastWorld?.number,
      boss: finalBoss.boss,
      checklist: null,
    },
  ];
  const openPanelData = panels.find((panel) => panel.id === openId) ?? null;

  return (
    <section
      data-scene-pick
      data-journey-paused={sceneActive && animationPaused ? "" : undefined}
      id={item.id}
      aria-labelledby="journey-title"
      className="section-offset py-10"
    >
      <JourneyScene
        state={state}
        activeIndex={activeIndex}
        onPickStage={openFromScene}
        onActiveChange={setSceneActive}
        paused={animationPaused}
      />
      <WorldDialog panel={openPanelData} onClosed={handleClosed} />
      <div
        className={cn(
          "w-fit max-w-[65%] rounded-2xl border p-6",
          sceneActive
            ? ["border-line", panelSurface(true)]
            : "border-transparent",
        )}
      >
        <h1
          id="journey-title"
          className="text-3xl font-bold text-fg sm:text-4xl [overflow-wrap:anywhere]"
        >
          {text.title}
        </h1>
        {sceneActive && (
          <button
            type="button"
            aria-pressed={animationPaused}
            onClick={() => setAnimationPaused((value) => !value)}
            className="mt-4 cursor-pointer rounded-2xl border border-line-strong bg-surface-raised min-h-11 min-w-11 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 active:bg-surface-sunken aria-pressed:border-journey-current disabled:cursor-not-allowed disabled:opacity-50"
          >
            {text.pauseAnimation}
          </button>
        )}
      </div>

      <div
        className={cn(
          "mt-8 rounded-2xl border border-line p-6",
          panelSurface(sceneActive),
        )}
      >
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
              <StatusBadge
                status={status}
                label={text.status[status]}
                scene={sceneActive}
              />
            </li>
          ))}
        </ul>
      </div>

      <h2 className="sr-only">{text.worldsHeading}</h2>
      <div data-scene-pick className="relative mt-8">
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
        <p id={keyboardHintId} className="sr-only">
          {text.keyboardHint}
        </p>
        <ol
          data-scene-pick
          ref={listRef}
          className="space-y-4 pl-8"
        >
          {worlds.map((world, index) => {
            const stage = state.worlds[index];
            if (!stage) return null;
            return (
              <StageCard
                key={world.id}
                id={world.id}
                title={worldTitle(world)}
                status={stage.status}
                xp={stage.xp}
                lockedWorld={worlds[index - 1]?.number}
                boss={world.boss}
                scene={sceneActive}
                checklist={<StudyList study={world.study} />}
                onOpen={openPanel}
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
            scene={sceneActive}
            onOpen={openPanel}
          />
        </ol>
      </div>
    </section>
  );
}

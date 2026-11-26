/**
 * Journey state and XP, derived from the checkboxes of the journey content
 * (spec docs/specs/2026-11-25-jornada-ai-engineer.md, Goal 1). Pure: no Date,
 * no DOM, no locale. Structural input types, so the content module
 * (`src/content/journey.ts`) fits without coupling this file to it.
 */

export type JourneyStatus = 'completed' | 'current' | 'locked'

interface Checkbox {
  readonly done: boolean
}

export interface JourneyWorldInput {
  readonly id: string
  readonly study: readonly Checkbox[]
  readonly boss: Checkbox
}

export interface JourneyFinalBossInput {
  readonly id: string
  readonly boss: Checkbox
}

export interface JourneyStageState {
  readonly id: string
  readonly status: JourneyStatus
  /** Integer 0-100: marked / all checkboxes of the stage, boss included, rounded down. */
  readonly xp: number
}

export interface JourneyState {
  /** Same order as the input worlds. */
  readonly worlds: readonly JourneyStageState[]
  readonly finalBoss: JourneyStageState
  /** Integer 0-100 over every checkbox of every world plus the final boss. */
  readonly totalXp: number
  readonly completedCount: number
  readonly worldCount: number
  /** `"<completed>/<worlds>"`, e.g. `"2/8"`. */
  readonly completedLabel: string
  /** All worlds completed and the final deliverable marked. */
  readonly destinationReached: boolean
}

function xpOf(marked: number, total: number): number {
  return total === 0 ? 0 : Math.floor((marked * 100) / total)
}

function countMarked(checkboxes: readonly Checkbox[]): number {
  return checkboxes.filter((checkbox) => checkbox.done).length
}

/**
 * A stage is unlocked when every stage before it is completed (the boss of
 * the previous world unlocks the next one). An unlocked stage is completed
 * when its boss is marked, with or without a link, and current otherwise.
 * Checkboxes marked in a locked stage count toward XP, but the stage stays
 * locked.
 */
export function journeyState(
  worlds: readonly JourneyWorldInput[],
  finalBoss: JourneyFinalBossInput,
): JourneyState {
  let unlocked = true
  let marked = 0
  let total = 0

  const stage = (id: string, checkboxes: readonly Checkbox[], boss: Checkbox): JourneyStageState => {
    const stageMarked = countMarked(checkboxes)
    marked += stageMarked
    total += checkboxes.length
    let status: JourneyStatus = 'locked'
    if (unlocked) {
      status = boss.done ? 'completed' : 'current'
      unlocked = boss.done
    }
    return { id, status, xp: xpOf(stageMarked, checkboxes.length) }
  }

  const worldStates = worlds.map((world) => stage(world.id, [...world.study, world.boss], world.boss))
  const finalState = stage(finalBoss.id, [finalBoss.boss], finalBoss.boss)
  const completedCount = worldStates.filter((world) => world.status === 'completed').length

  return {
    worlds: worldStates,
    finalBoss: finalState,
    totalXp: xpOf(marked, total),
    completedCount,
    worldCount: worlds.length,
    completedLabel: `${completedCount}/${worlds.length}`,
    destinationReached: finalState.status === 'completed',
  }
}

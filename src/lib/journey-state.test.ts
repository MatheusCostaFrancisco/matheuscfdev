import { describe, expect, it } from 'vitest'
import {
  journeyState,
  type JourneyFinalBossInput,
  type JourneyWorldInput,
} from './journey-state'

const WORLD_COUNT = 8
const STUDY_COUNT = 3

/** 8 worlds with 3 study items + boss each (4 checkboxes), nothing marked. */
function makeWorlds(): JourneyWorldInput[] {
  return Array.from({ length: WORLD_COUNT }, (_, index) => ({
    id: `world-${index}`,
    study: Array.from({ length: STUDY_COUNT }, () => ({ done: false })),
    boss: { done: false },
  }))
}

function makeFinalBoss(done = false): JourneyFinalBossInput {
  return { id: 'final-boss', boss: { done } }
}

function withWorld(
  worlds: JourneyWorldInput[],
  index: number,
  change: { studyDone?: number; bossDone?: boolean },
): JourneyWorldInput[] {
  return worlds.map((world, i) => {
    if (i !== index) return world
    return {
      ...world,
      study: world.study.map((_, item) => ({ done: item < (change.studyDone ?? 0) })),
      boss: { done: change.bossDone ?? world.boss.done },
    }
  })
}

function completeAll(worlds: JourneyWorldInput[]): JourneyWorldInput[] {
  return worlds.reduce(
    (acc, _, index) => withWorld(acc, index, { studyDone: STUDY_COUNT, bossDone: true }),
    worlds,
  )
}

describe('journeyState', () => {
  it('with nothing marked, world 0 is current with xp 0 and the rest is locked', () => {
    const state = journeyState(makeWorlds(), makeFinalBoss())

    expect(state.worlds[0]).toEqual({ id: 'world-0', status: 'current', xp: 0 })
    for (const world of state.worlds.slice(1)) {
      expect(world.status).toBe('locked')
      expect(world.xp).toBe(0)
    }
    expect(state.finalBoss.status).toBe('locked')
    expect(state.totalXp).toBe(0)
    expect(state.completedCount).toBe(0)
    expect(state.completedLabel).toBe('0/8')
    expect(state.destinationReached).toBe(false)
  })

  it('counts xp of items marked in a locked world but keeps it locked', () => {
    const worlds = withWorld(makeWorlds(), 3, { studyDone: 2 })
    const state = journeyState(worlds, makeFinalBoss())

    expect(state.worlds[3]).toEqual({ id: 'world-3', status: 'locked', xp: 50 })
    expect(state.worlds[0].status).toBe('current')
    // 2 marked of 8 * 4 + 1 = 33 checkboxes.
    expect(state.totalXp).toBe(6)
  })

  it('keeps a locked world locked when only its boss is marked', () => {
    const worlds = withWorld(makeWorlds(), 2, { bossDone: true })
    const state = journeyState(worlds, makeFinalBoss())

    expect(state.worlds[2]).toEqual({ id: 'world-2', status: 'locked', xp: 25 })
    expect(state.worlds[3].status).toBe('locked')
    expect(state.completedCount).toBe(0)
  })

  it('completes a world when the boss is marked, even without a link, and unlocks the next', () => {
    const worlds = withWorld(makeWorlds(), 0, { bossDone: true })
    const state = journeyState(worlds, makeFinalBoss())

    expect(state.worlds[0]).toEqual({ id: 'world-0', status: 'completed', xp: 25 })
    expect(state.worlds[1].status).toBe('current')
    expect(state.worlds[2].status).toBe('locked')
    expect(state.completedLabel).toBe('1/8')
  })

  it('rounds xp down so 100 only appears when every checkbox is marked', () => {
    const worlds = withWorld(makeWorlds(), 0, { studyDone: STUDY_COUNT })
    const state = journeyState(worlds, makeFinalBoss())

    expect(state.worlds[0]).toEqual({ id: 'world-0', status: 'current', xp: 75 })

    const twoOfThree = journeyState(
      [{ id: 'w', study: [{ done: true }, { done: true }], boss: { done: false } }],
      makeFinalBoss(),
    )
    expect(twoOfThree.worlds[0].xp).toBe(66)
  })

  it('makes the final boss current when all 8 worlds are completed', () => {
    const state = journeyState(completeAll(makeWorlds()), makeFinalBoss())

    for (const world of state.worlds) {
      expect(world).toMatchObject({ status: 'completed', xp: 100 })
    }
    expect(state.finalBoss).toEqual({ id: 'final-boss', status: 'current', xp: 0 })
    expect(state.completedLabel).toBe('8/8')
    // 32 marked of 33 checkboxes.
    expect(state.totalXp).toBe(96)
    expect(state.destinationReached).toBe(false)
  })

  it('reaches the destination when the final deliverable is marked after the 8 worlds', () => {
    const state = journeyState(completeAll(makeWorlds()), makeFinalBoss(true))

    expect(state.finalBoss).toEqual({ id: 'final-boss', status: 'completed', xp: 100 })
    expect(state.totalXp).toBe(100)
    expect(state.destinationReached).toBe(true)
  })

  it('does not reach the destination when the final deliverable is marked early', () => {
    const state = journeyState(makeWorlds(), makeFinalBoss(true))

    expect(state.finalBoss).toEqual({ id: 'final-boss', status: 'locked', xp: 100 })
    expect(state.destinationReached).toBe(false)
  })
})

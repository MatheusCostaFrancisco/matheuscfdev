export type StageStatus = 'done' | 'current' | 'upcoming'

interface StageBoundary {
  /** Exclusive end date (ISO `YYYY-MM-DD`). */
  readonly endsOn: string
}

function toIsoDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Status of each stage (same order as the input, which must be chronological) on a given date.
 * The current stage is the first one that has not ended yet; earlier ones are done, later ones upcoming.
 */
export function getStageStatuses(stages: readonly StageBoundary[], date: Date): StageStatus[] {
  const today = toIsoDay(date)
  const currentIndex = stages.findIndex((stage) => today < stage.endsOn)
  return stages.map((_, index) => {
    if (currentIndex === -1 || index < currentIndex) return 'done'
    return index === currentIndex ? 'current' : 'upcoming'
  })
}

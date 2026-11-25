/**
 * Complete years between a "YYYY-MM" start and a date (UTC), never negative.
 * A year counts only once the start month has been reached again.
 */
export function completeYearsSince(start: string, now: Date): number {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(start)
  if (!match) throw new Error(`Invalid start "${start}": expected YYYY-MM`)
  const months =
    (now.getUTCFullYear() - Number(match[1])) * 12 +
    (now.getUTCMonth() + 1 - Number(match[2]))
  return Math.max(0, Math.floor(months / 12))
}

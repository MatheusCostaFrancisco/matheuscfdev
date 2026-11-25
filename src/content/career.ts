import { completeYearsSince } from '../lib/years'

/* Start dates from content/cv.md > "Anos de experiência". */
export const CAREER_START = '2018-07'
export const DEVELOPMENT_START = '2019-11'

export type ExperienceYears = {
  readonly career: number
  readonly development: number
}

export function experienceYears(now: Date): ExperienceYears {
  return {
    career: completeYearsSince(CAREER_START, now),
    development: completeYearsSince(DEVELOPMENT_START, now),
  }
}

export function developmentYearsEn(years: ExperienceYears): string {
  return `${years.development}+ years`
}

export function developmentYearsPt(years: ExperienceYears): string {
  return `mais de ${years.development} anos`
}

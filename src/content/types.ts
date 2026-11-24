export interface Profile {
  readonly name: string
  readonly role: string
  readonly stack: readonly string[]
  readonly location: string
  readonly email: string
  readonly linkedin: string
  readonly tagline: string
  readonly summary: string
}

export interface Experience {
  readonly role: string
  readonly company: string
  readonly start: string
  readonly end: string
  readonly location: string
  readonly context: string
  readonly note?: string
  readonly bullets: readonly string[]
}

export interface Product {
  readonly name: string
  readonly url: string
  readonly description: string
  readonly stack: readonly string[]
}

export interface SkillGroup {
  readonly group: string
  readonly items: readonly string[]
}

export interface Education {
  readonly course: string
  readonly institution: string
  readonly period: string
}

export interface Language {
  readonly language: string
  readonly level: string
}

export interface NavItem {
  readonly id: string
  readonly label: string
}

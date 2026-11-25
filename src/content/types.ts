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

/* Site content model (one object per locale). */

export interface SiteProfile {
  readonly name: string
  readonly role: string
  readonly stack: readonly string[]
  readonly location: string
  readonly email: string
  readonly linkedin: string
  readonly github: string
  readonly tagline: string
  readonly summary: readonly string[]
  readonly photoAlt: string
}

export interface SiteExperience {
  readonly role: string
  readonly company: string
  readonly start: string
  readonly end: string
  readonly location?: string
  readonly context?: string
  readonly note?: string
  readonly bullets: readonly string[]
}

export interface SiteProduct {
  readonly name: string
  readonly role?: string
  readonly url?: string
  readonly description: string
  readonly bullets: readonly string[]
  readonly stack: readonly string[]
}

export interface UiStrings {
  readonly skipLink: string
  readonly header: {
    readonly navLabel: string
    readonly menu: string
    readonly language: {
      readonly groupLabel: string
      readonly options: Record<'en' | 'pt-BR', { readonly short: string; readonly name: string }>
    }
  }
  readonly hero: {
    readonly stackLabel: string
    readonly getInTouch: string
    readonly linkedin: string
  }
  readonly contact: {
    readonly email: string
    readonly linkedin: string
    readonly github: string
    readonly location: string
  }
  readonly products: {
    readonly stackLabel: (productName: string) => string
    readonly websiteLabel: (productName: string) => string
  }
  readonly education: {
    readonly certificationsHeading: string
    readonly languagesHeading: string
  }
  readonly roadmap: {
    readonly from: string
    readonly to: string
    readonly studyHeading: string
    readonly deliverableHeading: string
    readonly stagesHeading: string
    readonly status: Record<'done' | 'current' | 'upcoming', string>
  }
  readonly books: {
    readonly heading: string
    readonly groups: Record<'reading' | 'read' | 'wantToRead', string>
    readonly seriesBooks: string
  }
  readonly opensInNewTab: string
  readonly footerRights: string
}

export interface SiteContent {
  readonly profile: SiteProfile
  readonly experience: readonly SiteExperience[]
  readonly products: readonly SiteProduct[]
  readonly skills: readonly SkillGroup[]
  readonly education: readonly Education[]
  readonly certifications: readonly string[]
  readonly languages: readonly Language[]
  readonly navigation: readonly NavItem[]
  readonly ui: UiStrings
}

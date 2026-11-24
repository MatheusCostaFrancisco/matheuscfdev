import type { Experience } from './types'

export const experience: readonly Experience[] = [
  {
    role: 'Front-End Software Engineer',
    company: 'AsapFlow',
    start: 'Feb 2025',
    end: 'Present',
    location: 'Remote',
    context: 'Workflow orchestration and integrations platform',
    bullets: [
      'Led the technical migration of Flowchart Studio from Vue 2 + Kotlin Multiplatform to React + TypeScript, using spec-driven development (SDD) and AI agents',
      'Fixed memory leaks in the flow editor (~170 MB heap, 76k nodes); debouncing cut diagram re-renders from up to 4 to 1 per event',
      'Rebuilt the CI/CD pipeline with GitHub Actions and AWS deployment (S3 + CloudFront), OIDC authentication with no long-lived credentials, automatic cache invalidation and IAM roles',
      'Implemented Content Security Policy (CSP) across front-ends to protect against XSS and script injection',
      'Set up the support desk in Jira Service Management for a major financial-sector client',
    ],
  },
  {
    role: 'Front-End Software Engineer',
    company: 'Soluti Digital',
    start: 'Aug 2022',
    end: 'Feb 2025',
    location: 'Remote',
    context: 'Digital certificates and e-signatures',
    note: 'Promoted to Senior Software Engineer in Apr 2023',
    bullets: [
      'Owned Emissão Online, the digital certificate issuance system, end to end, from development to production maintenance',
      'Built the component library used by every front-end in the company',
      'Created DynamicForms: a dynamic Vue.js form reused across all systems, with centrally managed field rules',
      "Developed an integration API for the company's core system, with automated tests and technical documentation",
    ],
  },
  {
    role: 'Front-End/Mobile Developer',
    company: 'GAtec Gestão Agroindustrial',
    start: 'Aug 2021',
    end: 'Aug 2022',
    location: 'Piracicaba, Brazil',
    context: 'Agribusiness software',
    bullets: [
      'Replaced react-native-maps with a solution validated through my own POC after the team had given up, helping retain a BRL 1M contract',
      'Built React Native and TypeScript apps with Styled Components and React Testing Library',
      'Geolocation with Google Maps, Mapbox, MapTiler and OpenStreetMap; requirements gathering and client visits',
    ],
  },
  {
    role: 'Web Developer',
    company: 'RKM Sistemas',
    start: 'Nov 2019',
    end: 'Aug 2021',
    location: 'Piracicaba, Brazil',
    context: '',
    bullets: [
      'Found the root cause of a 5-year-old inventory balance bug: the front-end subtracted from the displayed value without re-querying the server',
      'Maintained and evolved a legacy pharmacy management system with JavaScript/jQuery, PHP and SQL',
      'Built features, components and tests with Vue.js; APIs in Laravel (MVC)',
    ],
  },
  {
    role: 'Support Analyst',
    company: 'RKM Sistemas',
    start: 'Jul 2018',
    end: 'Oct 2019',
    location: 'Piracicaba, Brazil',
    context: '',
    bullets: [
      'Reports and data-fix scripts in SQL and PHP on Firebird (procedures, triggers, generators)',
      'Customer support and bug triage in source code and database',
    ],
  },
]

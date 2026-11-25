import type { Locale } from '../lib/locale'

export type StageId = 'warm-up' | 'q1' | 'q2' | 'q3' | 'q4' | 'destination'

export interface RoadmapStage {
  readonly id: StageId
  /** Exclusive end date (ISO `YYYY-MM-DD`). The stage is over from this day on. */
  readonly endsOn: string
  readonly label: string
  readonly period: string
  readonly theme: string
  readonly themeLang?: Locale
  readonly study: readonly string[]
  readonly deliverable: string
}

export interface RoadmapPillar {
  readonly title: string
  readonly titleLang?: Locale
  readonly description: string
}

export interface RoadmapRoutineBlock {
  readonly days: string
  readonly block: string
  readonly what: string
}

export interface Roadmap {
  readonly title: string
  readonly destination: {
    readonly from: string
    readonly fromLang?: Locale
    readonly to: string
    readonly phrase: string
  }
  readonly whyNow: {
    readonly title: string
    readonly intro: string
    readonly pillars: readonly RoadmapPillar[]
  }
  readonly method: {
    readonly title: string
    readonly rules: readonly string[]
    readonly routine: readonly RoadmapRoutineBlock[]
  }
  readonly stages: readonly RoadmapStage[]
}

const ptBR: Roadmap = {
  title: 'Roadmap de estudos 2027',
  destination: {
    from: 'Senior Front-End Engineer',
    fromLang: 'en',
    to: 'Product Engineer full-stack com IA',
    phrase:
      'Continuo dono do frontend. Passo a resolver o problema inteiro: dado, infra, qualidade e IA aplicada ao produto.',
  },
  whyNow: {
    title: 'Por que agora',
    intro: 'O que o mercado pede de um engenheiro sênior:',
    pillars: [
      { title: 'Full-stack ownership',
        titleLang: 'en', description: 'Ser dono da feature de ponta a ponta' },
      {
        title: 'Frontend system design',
        titleLang: 'en',
        description: 'Estado em escala, performance e arquitetura de componentes',
      },
      {
        title: 'Julgamento sobre IA',
        description: 'Verificar código gerado, gerir agentes e mitigar defeitos — não só gerar mais rápido',
      },
    ],
  },
  method: {
    title: 'Método',
    rules: [
      '2 horas por dia, seg a sex (10h por semana), fora do expediente',
      '12 meses, um tema por trimestre',
      '4 entregáveis públicos no ano',
      'Regra: trimestre sem design doc, ADR, POC ou artigo público não fecha',
      'Retro na última semana de cada trimestre',
    ],
    routine: [
      {
        days: 'Seg · Qua · Sex',
        block: 'Trilha do trimestre (6h)',
        what: 'Estudo profundo do tema principal',
      },
      {
        days: 'Ter',
        block: 'IA aplicada (2h)',
        what: 'Agentes, evals e spec-driven, sempre num projeto real',
      },
      { days: 'Qui', block: 'Entregável (2h)', what: 'Design doc, ADR, POC ou artigo' },
    ],
  },
  stages: [
    {
      id: 'warm-up',
      endsOn: '2027-01-01',
      label: 'Aquecimento',
      period: 'dez/2026',
      theme: 'Fechar o MBA e mapear as lacunas reais do dia a dia',
      study: ['Fechar o MBA', 'Mapear as lacunas reais do dia a dia'],
      deliverable: 'Mapa das lacunas reais do dia a dia',
    },
    {
      id: 'q1',
      endsOn: '2027-04-01',
      label: 'Q1',
      period: 'jan–mar/2027',
      theme: 'Frontend profundo',
      study: [
        'System design, Core Web Vitals, TypeScript avançado, Playwright',
        'Semanas 1–3: performance (browser internals, Core Web Vitals, code splitting e bundle)',
        'Semanas 4–7: arquitetura e TypeScript (estado em escala, cache de dados, módulos, contratos tipados com zod)',
        'Semanas 8–10: qualidade e segurança (estratégia de testes, Playwright no CI, XSS, CSP, acessibilidade)',
        'Semanas 11–12: consolidação e retro',
      ],
      deliverable: 'Design doc de um editor de fluxos em produção + artigo publicado',
    },
    {
      id: 'q2',
      endsOn: '2027-07-01',
      label: 'Q2',
      period: 'abr–jun/2027',
      theme: 'Full-stack ownership',
      themeLang: 'en',
      study: ['AWS Solutions Architect', 'Postgres e modelagem', 'Observabilidade'],
      deliverable: 'Certificação AWS Solutions Architect + uma feature entregue de ponta a ponta',
    },
    {
      id: 'q3',
      endsOn: '2027-10-01',
      label: 'Q3',
      period: 'jul–set/2027',
      theme: 'AI engineering',
      themeLang: 'en',
      study: ['Evals', 'Orquestração multi-agente', 'MCP', 'RAG'],
      deliverable: 'Agente com evals e métricas de qualidade',
    },
    {
      id: 'q4',
      endsOn: '2028-01-01',
      label: 'Q4',
      period: 'out–dez/2027',
      theme: 'Arquitetura e influência',
      study: ['ADRs', 'Tech talk', 'Decisões documentadas'],
      deliverable: 'Portfólio de decisões técnicas',
    },
    {
      id: 'destination',
      endsOn: '9999-12-31',
      label: 'Destino',
      period: 'dez/2027',
      theme: 'Product Engineer full-stack com IA',
      study: [],
      deliverable: 'Quatro entregáveis públicos',
    },
  ],
}

const en: Roadmap = {
  title: '2027 study roadmap',
  destination: {
    from: 'Senior Front-End Engineer',
    to: 'Full-stack Product Engineer with AI',
    phrase:
      'I stay the owner of the front end. I start solving the whole problem: data, infra, quality and AI applied to the product.',
  },
  whyNow: {
    title: 'Why now',
    intro: 'What the market asks of a senior engineer:',
    pillars: [
      { title: 'Full-stack ownership', description: 'Owning the feature end to end' },
      {
        title: 'Frontend system design',
        description: 'State at scale, performance and component architecture',
      },
      {
        title: 'Judgment about AI',
        description: 'Verifying generated code, managing agents and mitigating defects — not just generating faster',
      },
    ],
  },
  method: {
    title: 'Method',
    rules: [
      '2 hours a day, Monday to Friday (10 hours a week), outside work hours',
      '12 months, one theme per quarter',
      '4 public deliverables in the year',
      'Rule: a quarter without a design doc, ADR, POC or public article does not close',
      'Retro in the last week of each quarter',
    ],
    routine: [
      {
        days: 'Mon · Wed · Fri',
        block: 'Quarter track (6h)',
        what: 'Deep study of the main theme',
      },
      {
        days: 'Tue',
        block: 'Applied AI (2h)',
        what: 'Agents, evals and spec-driven, always on a real project',
      },
      { days: 'Thu', block: 'Deliverable (2h)', what: 'Design doc, ADR, POC or article' },
    ],
  },
  stages: [
    {
      id: 'warm-up',
      endsOn: '2027-01-01',
      label: 'Warm-up',
      period: 'Dec 2026',
      theme: 'Finish the MBA and map the real day-to-day gaps',
      study: ['Finish the MBA', 'Map the real day-to-day gaps'],
      deliverable: 'Map of the real day-to-day gaps',
    },
    {
      id: 'q1',
      endsOn: '2027-04-01',
      label: 'Q1',
      period: 'Jan–Mar 2027',
      theme: 'Deep front end',
      study: [
        'System design, Core Web Vitals, advanced TypeScript, Playwright',
        'Weeks 1–3: performance (browser internals, Core Web Vitals, code splitting and bundle)',
        'Weeks 4–7: architecture and TypeScript (state at scale, data caching, modules, typed contracts with zod)',
        'Weeks 8–10: quality and security (testing strategy, Playwright in CI, XSS, CSP, accessibility)',
        'Weeks 11–12: consolidation and retro',
      ],
      deliverable: 'Design doc of a production flow editor + a published article',
    },
    {
      id: 'q2',
      endsOn: '2027-07-01',
      label: 'Q2',
      period: 'Apr–Jun 2027',
      theme: 'Full-stack ownership',
      study: ['AWS Solutions Architect', 'Postgres and data modeling', 'Observability'],
      deliverable: 'AWS Solutions Architect certification + one feature delivered end to end',
    },
    {
      id: 'q3',
      endsOn: '2027-10-01',
      label: 'Q3',
      period: 'Jul–Sep 2027',
      theme: 'AI engineering',
      study: ['Evals', 'Multi-agent orchestration', 'MCP', 'RAG'],
      deliverable: 'Agent with evals and quality metrics',
    },
    {
      id: 'q4',
      endsOn: '2028-01-01',
      label: 'Q4',
      period: 'Oct–Dec 2027',
      theme: 'Architecture and influence',
      study: ['ADRs', 'Tech talk', 'Documented decisions'],
      deliverable: 'Portfolio of technical decisions',
    },
    {
      id: 'destination',
      endsOn: '9999-12-31',
      label: 'Destination',
      period: 'Dec 2027',
      theme: 'Full-stack Product Engineer with AI',
      study: [],
      deliverable: 'Four public deliverables',
    },
  ],
}

export const roadmap: Readonly<Record<Locale, Roadmap>> = { en, 'pt-BR': ptBR }

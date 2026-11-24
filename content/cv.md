---
source: Matheus_Costa_Francisco_-_Resume.pdf (enviado pelo stakeholder em 2026-11-24)
linkedin: https://www.linkedin.com/in/matheus-costa-francisco/
pair: content/cv.pt-BR.md
updated: 2026-11-24 (e-mail, GitHub, WoodFlow e fatos do CV em português aprovados pelo stakeholder)
photo: content/assets/profile.jpg (480x480, extraída do PDF do CV)
---

# Matheus Costa Francisco

Fonte única de verdade sobre o Matheus (em inglês). `content/cv.pt-BR.md` tem os mesmos fatos redigidos em pt-BR. Agentes **não** adicionam fatos que não estejam aqui. Se faltar informação, usar `[REVISAR: <o que falta>]`.

## Publicação

| Campo | Publicar no site? |
|---|---|
| Nome, cargo, stack, resumo | Sim |
| Experiência, formação, certificação, idiomas | Sim |
| Produtos (Manda Aí, WoodFlow) | Sim |
| E-mail | Sim |
| GitHub | Sim |
| LinkedIn | Sim |
| Cidade (Piracicaba, Brazil · Remote) | Sim |

## Identidade

- **Nome:** Matheus Costa Francisco
- **Cargo:** Senior Front-End Software Engineer
- **Stack principal:** React · TypeScript · Vue.js · React Native · Node.js
- **Local:** Piracicaba, Brazil · Remote
- **E-mail:** contato.matheuscf@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/matheus-costa-francisco/
- **GitHub:** https://github.com/MatheusCostaFrancisco
- **Tagline:** 8 years from support to senior engineering

## Summary

Front-End Software Engineer with 7+ years shipping web and mobile applications to production, also working on the back end with Node.js. I specialize in solving chronic problems teams had given up on: legacy migrations, memory leaks, shared component libraries and CI/CD on AWS. On the side, I build my own SaaS products from zero to paying customers.

## Timeline

| Ano de início | Empresa | Papel |
|---|---|---|
| 2017 (Jun) | ESALQ/USP | Intern |
| 2018 (Jul) | RKM Sistemas | Support |
| 2019 (Nov) | RKM Sistemas | Web dev |
| 2021 (Aug) | GAtec | Mobile |
| 2022 (Aug) | Soluti Digital | Front-End Eng. |
| 2025 (Feb) | AsapFlow | Front-End Eng. |

## Skills

| Grupo | Itens |
|---|---|
| Front-end | React · Vue.js · TypeScript · JavaScript · React Native · Tailwind CSS · Vite |
| Back-end and data | Node.js · Express · Laravel · PostgreSQL · Prisma · SQL |
| Cloud and DevOps | AWS · GitHub Actions · Docker · Kubernetes · Terraform |
| Quality and process | Jest · Vitest · Testing Library · Scrum · Kanban |
| Applied AI | LLMs (Claude, OpenAI) · AI agents · Spec-driven development |

## Experience

### Front-End Software Engineer · AsapFlow

Feb 2025 – Present · Remote · workflow orchestration and integrations platform

- Led the technical migration of Flowchart Studio from Vue 2 + Kotlin Multiplatform to React + TypeScript, using spec-driven development (SDD) and AI agents
- Fixed memory leaks in the flow editor (~170 MB heap, 76k nodes); debouncing cut diagram re-renders from up to 4 to 1 per event
- Rebuilt the CI/CD pipeline with GitHub Actions and AWS deployment (S3 + CloudFront), OIDC authentication with no long-lived credentials, automatic cache invalidation and IAM roles
- Implemented Content Security Policy (CSP) across front-ends to protect against XSS and script injection
- Set up the support desk in Jira Service Management for a major financial-sector client

### Front-End Software Engineer · Soluti Digital

Aug 2022 – Feb 2025 · Remote · digital certificates and e-signatures · promoted to Senior Software Engineer in Apr 2023

- Owned Emissão Online, the digital certificate issuance system, end to end, from development to production maintenance
- Built the component library used by every front-end in the company
- Created DynamicForms: a dynamic Vue.js form reused across all systems, with centrally managed field rules
- Developed an integration API for the company's core system, with automated tests and technical documentation

### Front-End/Mobile Developer · GAtec Gestão Agroindustrial

Aug 2021 – Aug 2022 · Piracicaba, Brazil · agribusiness software

- Replaced react-native-maps with a solution validated through my own POC after the team had given up, helping retain a BRL 1M contract
- Built React Native and TypeScript apps with Styled Components and React Testing Library
- Geolocation with Google Maps, Mapbox, MapTiler and OpenStreetMap; requirements gathering and client visits

### Web Developer · RKM Sistemas

Nov 2019 – Aug 2021 · Piracicaba, Brazil

- Found the root cause of a 5-year-old inventory balance bug: the front-end subtracted from the displayed value without re-querying the server
- Maintained and evolved a legacy pharmacy management system with JavaScript/jQuery, PHP and SQL
- Built features, components and tests with Vue.js; APIs in Laravel (MVC)

### Support Analyst · RKM Sistemas

Jul 2018 – Oct 2019 · Piracicaba, Brazil

- Reports and data-fix scripts in SQL and PHP on Firebird (procedures, triggers, generators)
- Customer support and bug triage in source code and database

### Intern · ESALQ/USP

Jun 2017 – Jul 2018

## Products I built

### ElevaTech · Founder and full-stack developer

My own software development consultancy.

- Health platform for a client under contract: two brands on the same codebase, four repositories, Express and MySQL back end deployed on Railway, and PIX billing through SICOOB's banking API
- Lead generation pipeline with Apify and Google Maps data: 34 qualified leads, each with a personalized Next.js preview page
- Requirements gathering, commercial proposal and contract handled directly with clients

### Manda Aí · mandai.ia.br

Instagram DM automation SaaS for small businesses, with keyword rules, a visual flow builder and an AI agent powered by Claude. Live, with its first paying subscriber acquired organically.

- Built end to end: guided onboarding, automated replies to DMs and stories, conversational AI agent and Stripe subscriptions
- Instagram API integration, including automatic token renewal every 60 days
- First paying subscriber in Aug 2026, acquired organically

Stack: React 19, TypeScript, Node.js/Express, Prisma, PostgreSQL, Stripe

### WoodFlow · https://site.woodflow.app.br/

Multi-tenant SaaS for woodworking shops, with a WhatsApp integration that logs entries into the system and an admin panel showing usage per customer.

- Live, built end to end, with 5 woodworking shops on trial
- Database-per-tenant architecture: one isolated MySQL database per customer; on each request the NestJS + TypeORM API resolves the tenant connection from the JWT
- WhatsApp integration: messages sent by the woodworker become financial entries in the system
- AI with the OpenAI API: structured data extraction that turns natural-language messages into entries, and automatic column mapping when importing spreadsheets, with user confirmation before saving (human-in-the-loop)
- Global admin panel with per-tenant usage and plan management
- Stripe subscriptions with feature access by plan
- Front end in React 19, Vite, Tailwind and Radix UI; JWT auth, role-based permissions and audit log on the back end
- Infrastructure: Railway deploy, AWS S3 for files, Resend for transactional e-mail, Sentry for error monitoring

Stack: TypeScript, React 19, NestJS, TypeORM, MySQL, Stripe, OpenAI API

## Education

| Curso | Instituição | Período |
|---|---|---|
| MBA in Software Architecture | FIAP | Apr 2026 – Apr 2027 (expected) |
| Postgraduate Specialization in Front-End Development | IGTI (XP Educação) | 2021 – 2022 |
| B.S. in Information Systems | UNIMEP | 2016 – 2020 |
| IT Technician | Senac Piracicaba | 2012 – 2014 |

## Certification

- AWS Certified Cloud Practitioner
- Vue JS 2 — The Complete Guide (Vue Router and Vuex)
- Vue 3 — Advancing in the Framework
- Laravel 5.6 Essentials

## Languages

- Portuguese · native
- English · intermediate (B1/B2)

## Site

- **Idiomas:** pt-BR e en, com os mesmos fatos. O idioma abre pela preferência do navegador (português → pt-BR; qualquer outro → en), com seletor visível e rotas `/pt` e `/en`.
- **Conteúdo extra:** roadmap de estudos 2027 em `content/estudos-2027.md` (apresentado como jornada do herói) e livros em `content/livros.md`. Ambos precisam aparecer nos dois idiomas.

## Lacunas conhecidas

- Domínio do site: [REVISAR: o stakeholder configura domínio e Cloudflare depois]

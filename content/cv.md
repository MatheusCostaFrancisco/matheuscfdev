---
source: Matheus_Costa_Francisco_-_Resume.pdf (enviado pelo stakeholder em 2026-11-24)
linkedin: https://www.linkedin.com/in/matheus-costa-francisco/
pair: content/cv.pt-BR.md
updated: 2026-11-24 (respostas do stakeholder ao REPORT da rodada 5: resumo, skills, MBA IGTI, local, domínio, anos, depoimentos)
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
| Cidade (Piracicaba, SP, Brazil · Remote) | Sim |
| Depoimentos (recomendações do LinkedIn) | Sim |

## Identidade

- **Nome:** Matheus Costa Francisco
- **Cargo:** Senior Front-End Software Engineer
- **Stack principal:** React · TypeScript · Vue.js · React Native · Node.js
- **Local:** Piracicaba, SP, Brazil · Remote
- **E-mail:** contato.matheuscf@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/matheus-costa-francisco/
- **GitHub:** https://github.com/MatheusCostaFrancisco
- **Tagline:** 8 years from support to senior engineering

## Summary

Front-End Software Engineer with 7+ years building web and mobile interfaces in production, focused on React, TypeScript and Vue.js. At AsapFlow, I lead the migration of a visual flow editor from Vue 2 to React + TypeScript, and I rebuilt the CI/CD pipeline on AWS.

I also work on the back end with Node.js and ship products end to end: through ElevaTech, my consultancy, and in my own SaaS products with payments, API integrations and production deploys. I'm pursuing an MBA in Software Architecture at FIAP.

(Resumo atualizado a partir do CV em pt-BR, aprovado pelo stakeholder como o mais recente.)

## Anos de experiência

Contas feitas com as datas da seção Experience, em 2026-11-24. Os dois números estão certos e medem coisas diferentes:

| Medida | Desde | Anos | Onde aparece |
|---|---|---|---|
| Carreira em tecnologia (suporte → sênior) | Jul 2018 (Support Analyst, RKM) | 8 (8 anos e 4 meses) | Tagline: "8 years from support to senior engineering" |
| Desenvolvendo software em produção | Nov 2019 (Web Developer, RKM) | 7 (7 anos) | Resumo e meta description: "7+ years" |

O estágio na ESALQ/USP (Jun 2017) não entra nas contas. O site deve calcular os dois números a partir dessas datas de início (não fixar no texto), para não ficarem desatualizados; ao exibir, usar anos completos.

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
| Front-end | React · Vue.js (2 and 3) · TypeScript · JavaScript · Next.js · Tailwind CSS · Styled Components · Vite |
| Mobile | React Native · Google Maps · Mapbox · MapTiler · OpenStreetMap |
| Back-end and data | Node.js · Express · REST APIs · Laravel · MySQL · PostgreSQL · Prisma · SQL |
| Architecture | Domain-Driven Design (DDD) · Clean Architecture · Hexagonal Architecture · Event Storming |
| Cloud and CI/CD | AWS (S3, CloudFront, IAM, OIDC, EKS) · Docker · Kubernetes · Terraform · GitHub Actions · Railway |
| Quality and security | Jest · Vitest · React Testing Library · Content Security Policy · Trivy · Sonar |
| Applied AI | LLMs (Claude, OpenAI) · AI agents |
| Practices | Spec-driven development with AI agents · Scrum · Kanban |

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

Aug 2021 – Aug 2022 · Piracicaba, SP, Brazil · agribusiness software

- Replaced react-native-maps with a solution validated through my own POC after the team had given up, helping retain a BRL 1M contract
- Built React Native and TypeScript apps with Styled Components and React Testing Library
- Geolocation with Google Maps, Mapbox, MapTiler and OpenStreetMap; requirements gathering and client visits

### Web Developer · RKM Sistemas

Nov 2019 – Aug 2021 · Piracicaba, SP, Brazil

- Found the root cause of a 5-year-old inventory balance bug: the front-end subtracted from the displayed value without re-querying the server
- Maintained and evolved a legacy pharmacy management system with JavaScript/jQuery, PHP and SQL
- Built features, components and tests with Vue.js; APIs in Laravel (MVC)

### Support Analyst · RKM Sistemas

Jul 2018 – Oct 2019 · Piracicaba, SP, Brazil

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
| MBA in Front-End Development | IGTI (XP Educação) | May 2021 – Feb 2022 |
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

- **Idiomas:** pt-BR e en, com os mesmos fatos. O idioma abre pela preferência do navegador (português → pt-BR; qualquer outro → en), com seletor visível e rotas `/pt` e `/en`. Roteamento do ADR 0002 (`pt*` → `/pt/`, demais → `/en/`) e âncoras em inglês nos dois idiomas confirmados pelo stakeholder em 2026-11-24.
- **Conteúdo extra:** roadmap de estudos 2027 em `content/estudos-2027.md` (apresentado como jornada do herói) e livros em `content/livros.md`. Ambos precisam aparecer nos dois idiomas.

## Domínio

- **Domínio do site:** https://www.matheuscfrancisco.dev.br (canônico, com `www`).
- O domínio sem `www` (`matheuscfrancisco.dev.br`) redireciona para o `www` com 301.
- DNS no Cloudflare. canonical, og:url e hreflang usam o domínio canônico absoluto (via variável de ambiente no build).

## Depoimentos

Fonte: `content/depoimentos.md`, com 6 recomendações públicas do LinkedIn (aba "Recebidas"), copiadas sem edição em 2026-11-24 a pedido do stakeholder, que confirmou a empresa de cada uma. Publicar nome, título, empresa, relação, data e texto, com link para https://www.linkedin.com/in/matheus-costa-francisco/details/recommendations/.

## Lacunas conhecidas

- Foto de perfil: o stakeholder vai enviar outra; até lá, manter `content/assets/profile.jpg`.

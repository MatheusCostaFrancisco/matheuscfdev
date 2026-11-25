---
source: doc "Matheus Costa Francisco — CV (PT)" (https://claude.ai/artifact/HfR4cAUZbVXgJeRb85YGwM), lido em 2026-11-24
updated: 2026-11-24 (skills alinhadas com cv.md; resumo pt-BR aprovado como o mais recente)
pair: content/cv.md
---

# Matheus Costa Francisco — versão pt-BR

Fonte do texto em **pt-BR** do site. Os fatos são os mesmos de `content/cv.md` (inglês); este arquivo dá a redação em português. Se os dois divergirem num fato, vale `content/cv.md` e a divergência vira item de revisão.

Contato, links e a tabela "Publicação" ficam só em `content/cv.md`.

## Identidade

- **Cargo:** Engenheiro de Software Front-End Sênior
- **Stack principal:** React · TypeScript · Vue.js · React Native · Node.js
- **Local:** Piracicaba, SP · Remoto
- **Tagline:** 8 anos do suporte à engenharia sênior

## Resumo

Engenheiro de software front-end com mais de 7 anos construindo interfaces web e mobile em produção, com foco em React, TypeScript e Vue.js. Na AsapFlow, conduzo a migração de um editor visual de fluxos de Vue 2 para React + TypeScript e reestruturei o CI/CD na AWS.

Atuo também no back-end com Node.js e entrego produtos de ponta a ponta: pela ElevaTech, minha consultoria, e em SaaS próprios com pagamento, integrações de API e deploy em produção. Curso MBA em Arquitetura de Software na FIAP.

## Competências

| Área | Tecnologias |
|---|---|
| Front-end | React, Vue.js (2 e 3), TypeScript, JavaScript, Next.js, Tailwind CSS, Styled Components, Vite |
| Mobile | React Native, Google Maps, Mapbox, MapTiler, OpenStreetMap |
| Back-end e dados | Node.js, Express, APIs REST, Laravel, MySQL, PostgreSQL, Prisma, SQL |
| Arquitetura | Domain-Driven Design (DDD), Clean Architecture, Arquitetura Hexagonal, Event Storming |
| Cloud e CI/CD | AWS (S3, CloudFront, IAM, OIDC, EKS), Docker, Kubernetes, Terraform, GitHub Actions, Railway |
| Qualidade e segurança | Jest, Vitest, React Testing Library, Content Security Policy, Trivy, Sonar |
| IA aplicada | LLMs (Claude, OpenAI), agentes de IA |
| Práticas | Desenvolvimento orientado a especificação com agentes de IA, Scrum, Kanban |

## Experiência

### AsapFlow — Engenheiro de Software, Front-End

Fevereiro de 2025 – atual · Remoto · Plataforma de orquestração de fluxos e integrações

- Condução técnica da migração do Flowchart Studio de Vue 2 + Kotlin Multiplatform para React + TypeScript, com desenvolvimento orientado a especificação (SDD) e agentes de IA em paralelo.
- Correção de memory leaks no editor de fluxos (heap de ~170 MB, 76 mil nós): limpeza de listeners e debounce reduziram as re-renderizações do diagrama de até 4 para 1 por evento.
- Reestruturação do CI/CD com GitHub Actions e deploy na AWS (S3 + CloudFront), com autenticação via OIDC, sem credenciais de longa duração, invalidação automática de cache a cada release e configuração de IAM.
- Implementação de Content Security Policy nos front-ends, reforçando a proteção contra XSS e injeção de scripts.
- Estruturação da central de atendimento em Jira Service Management para um grande cliente do setor financeiro.

### Soluti Digital — Engenheiro de Software Sênior, Front-End

Agosto de 2022 – fevereiro de 2025 · Remoto · Certificação e assinatura digital · promovido a Engenheiro de Software Sênior em abril de 2023

- Responsável de ponta a ponta pelo Emissão Online, sistema de emissão de certificados digitais, do desenvolvimento à manutenção em produção.
- Criação da biblioteca de componentes usada por todos os front-ends da empresa.
- Criação do DynamicForms: formulário dinâmico em Vue.js reutilizado em todos os sistemas, com regras de campos gerenciadas de forma central.
- Desenvolvimento de API de integração com o sistema principal da empresa, com testes automatizados e documentação técnica.

### GAtec Gestão Agroindustrial — Desenvolvedor Front-End e Mobile

Agosto de 2021 – agosto de 2022 · Piracicaba, SP · Software para o agronegócio

- Substituição do react-native-maps por uma solução validada na minha própria POC depois que o time tinha desistido, ajudando a manter um contrato de R$ 1 milhão.
- Desenvolvimento de aplicativos em React Native, TypeScript, Styled Components e React Testing Library.
- Geolocalização com Google Maps, Mapbox, MapTiler e OpenStreetMap; levantamento de requisitos e visitas a clientes.

### RKM Sistemas — Desenvolvedor Web

Novembro de 2019 – agosto de 2021 · Piracicaba, SP

- Encontrei a causa raiz de um bug de saldo de estoque que existia havia 5 anos: o front-end subtraía do valor exibido sem consultar o servidor de novo.
- Manutenção e evolução de um sistema legado de gestão de farmácias em PHP, JavaScript/jQuery e SQL, com banco Firebird.
- Desenvolvimento de funcionalidades, componentes e testes em Vue.js, consumindo APIs próprias em Laravel (MVC).

### RKM Sistemas — Analista de Suporte

Julho de 2018 – outubro de 2019 · Piracicaba, SP

- Scripts SQL e PHP no Firebird (procedures, triggers, generators) e relatórios extraídos do banco para clientes e gestores.
- Atendimento a clientes e triagem de bugs no código e no banco de dados.

### ESALQ/USP — Estagiário

Junho de 2017 – julho de 2018

## Projetos independentes

### ElevaTech — Fundador e desenvolvedor fullstack

Consultoria própria de desenvolvimento de software.

- Plataforma de saúde para cliente sob contrato: duas marcas sobre a mesma base, quatro repositórios, back-end em Express e MySQL com deploy em Railway e cobrança por PIX via API bancária do SICOOB.
- Pipeline de geração de leads com Apify e dados do Google Maps: 34 leads qualificados, cada um com uma página de preview personalizada em Next.js.
- Levantamento de requisitos, proposta comercial e contrato conduzidos diretamente com os clientes.

### Manda Aí — Criador

SaaS de automação de mensagens no Instagram para pequenos negócios · mandai.ia.br

- Produto construído de ponta a ponta: onboarding guiado, regras por palavra-chave, construtor visual de fluxos, automação de respostas a DMs e stories, agente de IA conversacional com Claude e assinatura via Stripe.
- Integração com a API do Instagram, incluindo renovação automática de token a cada 60 dias.
- No ar, com o primeiro assinante pagante conquistado de forma orgânica em agosto de 2026.
- Stack: React 19, TypeScript, Node.js/Express, Prisma, PostgreSQL, Stripe

### WoodFlow — Criador

SaaS multi-tenant de gestão para marcenarias de pequeno e médio porte · site.woodflow.app.br

- Produto no ar, construído de ponta a ponta, com 5 marcenarias em trial.
- Arquitetura multi-tenant com um banco MySQL isolado por cliente (database-per-tenant): a cada requisição, a API em NestJS + TypeORM resolve a conexão do tenant a partir do JWT.
- Integração com WhatsApp: mensagens enviadas pelo marceneiro viram lançamentos financeiros no sistema.
- IA com a API da OpenAI: extração de dados estruturados, que converte mensagens em linguagem natural em lançamentos, e mapeamento automático de colunas na importação de planilhas, com confirmação do usuário antes de gravar (human-in-the-loop).
- Painel administrativo global com visualização de uso por tenant e gestão de planos.
- Assinaturas via Stripe, com controle de acesso a funcionalidades por plano.
- Front-end em React 19, Vite, Tailwind e Radix UI. Autenticação JWT, permissões por papel e log de auditoria no back-end.
- Infraestrutura: deploy em Railway, arquivos em AWS S3, e-mails transacionais com Resend e monitoramento de erros com Sentry.

## Formação

| Curso | Instituição | Período |
|---|---|---|
| MBA em Arquitetura de Software | FIAP | Abril de 2026 – abril de 2027 (em andamento) |
| MBA em Desenvolvimento Front-End | IGTI (XP Educação) | Maio de 2021 – fevereiro de 2022 |
| Sistemas de Informação | Universidade Metodista de Piracicaba (UNIMEP) | 2016 – 2020 |
| Técnico em Informática | Senac Piracicaba | 2012 – 2014 |

## Certificações

- AWS Certified Cloud Practitioner
- Vue JS 2 — O Guia Completo (Vue Router e Vuex)
- Vue 3 — Avançando no Framework
- Laravel 5.6 Essencial

## Idiomas

- Português · nativo
- Inglês · intermediário (B1/B2)

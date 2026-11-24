# Relatório da esteira — 2026-11-24 (rodada 3)

Deploy: https://site-production-5010b1df.up.railway.app · parcial (Railway no ar; Cloudflare pendente, sem domínio)
Resumo: 8 entregues · 18 para revisão · 0 bloqueadas · 4 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-003 | `a11f6b5` | Módulos tipados em `src/content` (profile, experience, products, skills, education, languages) a partir do cv.md. Sem telefone. WoodFlow com `urlPending`. |
| T-004 | `cf5b4b3` | Header com nav, skip link, `<main>` e footer. Menu acessível abaixo de md (Esc fecha). Placeholders removidos. |
| T-005 | `1e86af9` | Hero com o único h1, cargo, tagline, stack, foto 480x480 com alt e CTAs (#contact e LinkedIn). |
| T-006 | `1012183` | Seção About (#about) com o resumo do cv.md, labelled por h2. |
| T-007 | `8b6e484` | Experience (#experience) em `<ol>`, 5 cargos em ordem reversa, datas em `<time>`, promoção da Soluti (Abr 2023). |
| T-008 | `2161062` | Contact (#contact) com e-mail, LinkedIn e localização. Footer com © ano e nome. Sem telefone. |
| T-009 | `71105ab` | Products: Manda Aí com link, WoodFlow com marcador [REVISAR]. Aprovado no 3º ciclo (dois reprovados antes). |
| T-010 | `d14b323` | Skills (#skills) com os 5 grupos do cv.md, cada um com h3 e lista rotulada. |

## Para revisão
- [ ] **T-001** Fonte Poppins: Google Fonts (requisição a terceiro, relevante para LGPD) ou self-hosted (`@fontsource/poppins`, vira tarefa infra P1) — escolher uma.
- [ ] **T-001** Direção visual: acento teal (accent-600 `#0f7c72`, accent-700 `#11645d`), só tema claro na v1 — confirmar no ADR 0001. Dark mode não foi auditado.
- [ ] **T-001** Dependências `clsx` e `tailwind-merge` para o `cn()` — justificadas no ADR, confirmar.
- [ ] **T-001** `.claude` inteiro ignorado no ESLint — o code-reviewer sugere restringir a `.claude/workflows`. Ajuste de config, aceitar ou não.
- [ ] **T-002** Favicon: "M" branco sobre o teal — confirmar como identidade visual.
- [ ] **T-002** og:image é a foto 480x480; LinkedIn espera ~1200x630 e corta — decidir se vale um card OG dedicado (tarefa P2 nova).
- [ ] **T-002** Meta description e `og:type=profile` — conferir o texto ("7+ years").
- [ ] **T-005** Textos "Get in touch" e "LinkedIn" foram escolhidos pelo agente; location fica em accent acima do h1 — confirmar o copy e se o eyebrow fica onde está.
- [ ] **T-007** 17 bullets em 375px deixam a seção longa; os dois cargos RKM Sistemas aparecem como itens separados — agrupar sob uma empresa e/ou reduzir bullets dos cargos antigos.
- [ ] **T-008** Rodapé agora mostra só © ano + nome (localização foi para #contact); a seção de contato não tem CTA de destaque — confirmar o rodapé e se o contato precisa de um botão.
- [ ] **T-009** Manda Aí: confirmar que "primeiro assinante pagante" ainda é verdade (é a principal prova do card) e se o link deve ter rótulo ("Visit site") em vez do domínio.
- [ ] **T-009** Cards de produto reagem a hover (sombra e borda) mas só o link do Manda Aí é clicável — aceitar, ou tornar o card inteiro clicável só no Manda Aí.
- [ ] **T-010** Desktop (2 colunas): o 5º grupo (Applied AI) fica sozinho na última linha — 3 colunas em lg ou `sm:col-span-2`.
- [ ] **T-004 a T-010** Layout em 375px e desktop não foi validado no navegador pelos agentes em todas as seções (T-007, T-009 e T-010 declararam isso). Conferir antes do próximo deploy.
- [ ] **PO** Correções de minors abertos nas revisões de T-004 a T-010: menu mobile (fechar ao sair do foco, `aria-label` fixo, `scroll-mt-20` em `<main>`, alvo de 38px), textos hardcoded fora de `src/content` (Header, SkipLink, Hero, Contact), `break-all` e alvos de 25px no Contact, pill de promoção quase invisível na Experience. Abrir tarefa de correção P0/P1 — ver `docs/pipeline/runs/2026-11-24-3.md`.
- [ ] **PO** Depoimentos saíram do backlog (o cv.md não tem). Mande depoimentos reais se quiser a seção.
- [ ] **PO** Âncoras das seções em inglês (`#about`, `#experience`, `#products`, `#skills`, `#education`, `#contact`) — confirmar.
- [ ] **PO** Opcional: resetar `--radius-*: initial` no `@theme` — tarefa separada, sem urgência.

## Novidades do stakeholder (24/11, para o PO)
- [ ] E-mail público passa a ser `contato.matheuscf@gmail.com` (atualizar `src/content`).
- [ ] Fatos do CV em português entram no site, nos dois idiomas: ElevaTech, estágio ESALQ/USP, certificações Vue/Laravel, detalhes do WoodFlow e do Manda Aí. Fonte: `content/cv.md` + `content/cv.pt-BR.md`.
- [ ] Nova seção: roadmap de estudos 2027 como **jornada do herói** — `content/estudos-2027.md`.
- [ ] Nova seção: livros (lendo, lidos, quero ler) — `content/livros.md`.
- [ ] i18n pt-BR + en antes das seções novas (todo texto de UI sai de `src/content`).
- [ ] Domínio e Cloudflare ficam com o Matheus; não criar pendência nova sobre isso além da existente.

## Pendências do stakeholder
- [ ] Definir o domínio do site (registrar se ainda não tiver) e me dizer qual é; `content/cv.md` marca "Domínio do site" como [REVISAR] e `og:url`, URL canônica e `og:image` absoluta dependem disso. Depois: criar API token no Cloudflare com Zone:DNS:Edit para o domínio, expor como `CLOUDFLARE_API_TOKEN` e adicionar o domínio à conta, se ainda não estiver.
- [x] Informar se o WoodFlow tem URL pública. → **Resolvido (Matheus, 24/11):** https://site.woodflow.app.br/ — já em `content/cv.md`. Se tiver, mande a URL e troco `urlPending` por `url` em `src/content/products.ts` e `content/cv.md`. Se não tiver, diga o texto final do card (ex.: "Private beta").
- [x] Definir o idioma do site: → **Resolvido (Matheus, 24/11):** bilíngue pt-BR + en, detecção pelo navegador com fallback en, seletor visível, rotas `/pt` e `/en`. Fonte pt-BR: `content/cv.pt-BR.md`. Prioridade P0. en (hoje, `lang="en"`), pt-BR ou bilíngue. Pt-BR ou bilíngue vira tarefa nova.
- [x] Decidir se o telefone será publicado. → **Resolvido:** não publica; telefone removido também do repositório. Hoje fica fora do site; contato só por e-mail e LinkedIn.
- [ ] Decidir o número de anos de experiência: a tagline diz "8 years from support to senior engineering" e o resumo diz "7+ years". Escolher e corrigir `content/cv.md`.
- [ ] Confirmar se a foto de perfil (`content/assets/profile.jpg`, selfie em academia) serve como retrato do portfólio ou enviar outra. O alt text cita a academia.
- [x] Informar o usuário público do GitHub, → **Resolvido:** https://github.com/MatheusCostaFrancisco — já em `content/cv.md`. se quiser o link no site, adicionando-o em `content/cv.md`.
- [ ] Liberar a auditoria axe-core: permitir o script do cdnjs no a11y-reviewer, ou autorizar `@axe-core/playwright` ou `vitest-axe` como devDependency. Nenhuma tarefa desta rodada teve axe rodado.
- [x] Configurar um remoto git para backup. → **Resolvido:** repo público no GitHub, Railway publicando a partir dele. O repositório não tem remoto.

## Bloqueadas
Nada nesta rodada.

## Próxima rodada
T-011 · Build education, certification and languages section · P1
T-012 · Add subtle entrance animations respecting prefers-reduced-motion · P2
T-013 · Add 404 page · P2
T-014 · Optimize profile image delivery · P2

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

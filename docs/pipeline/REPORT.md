# Relatório da esteira — 2026-11-24 (rodada 1)

Deploy: https://site-production-5010b1df.up.railway.app · deployed
Resumo: 2 entregues · 12 para revisão · 0 bloqueadas · 12 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-001 | `070de36` | Tokens do design system no `src/index.css` (Poppins, acento teal, neutros, escala tipográfica, sombras tingidas; paleta padrão do Tailwind desligada), `cn()` em `src/lib/cn.ts` e ADR `docs/adr/0001-visual-direction.md` com razões WCAG e "Quando reabrir". |
| T-002 | `8a07ebd` | Sobras do template Vite removidas, pastas `components/`, `sections/`, `content/`, `lib/` criadas, `index.html` com `lang="en"`, título, meta description e Open Graph, favicon próprio. |

## Para revisão
- [ ] **T-001** Fonte Poppins carregada do Google Fonts — é requisição a terceiro (fonts.googleapis.com/gstatic.com), relevante para LGPD. Alternativa: Poppins self-hosted (`@fontsource/poppins`). Decidir qual.
- [ ] **T-001** Direção visual: acento teal (accent-600 #0f7c72 em botões, accent-700 #11645d em links) e só tema claro na v1 — decisões de gosto registradas no ADR 0001; trocar o acento é só mexer na escala `--color-accent-*`.
- [ ] **T-001** Duas dependências novas de runtime (`clsx`, `tailwind-merge`) para o `cn()` — justificativa no ADR.
- [ ] **T-001** Ajuste fora do escopo: a pasta `.claude` inteira foi ignorada no ESLint porque o lint falhava no script da esteira — o code-reviewer sugere restringir a `.claude/workflows`.
- [ ] **T-002** Idioma do site: só inglês (`lang="en"`), mas `content/cv.md` ainda marca o idioma como [REVISAR] — confirmar en, pt-BR ou bilíngue (pt-BR/bilíngue vira tarefa nova).
- [ ] **T-002** Favicon: monograma "M" branco sobre o teal (#0f7c72), escolhido pelo agente — confirmar como identidade visual.
- [ ] **T-002** Imagem de preview (og:image) é a foto 480x480; LinkedIn e outros esperam ~1200x630 e vão cortar — decidir se vale um card OG dedicado (nome, cargo, acento) depois.
- [ ] **T-002** Texto da meta description e `og:type=profile` (em vez de `website`) — conferir: "Senior Front-End Software Engineer with 7+ years shipping web and mobile applications to production. React, TypeScript, Vue.js, React Native and Node.js."
- [ ] **PO** Seção "Depoimentos" saiu do backlog — o cv.md não tem depoimentos e os agentes não inventam; mande depoimentos reais se quiser a seção.
- [ ] **PO** Telefone não é publicado; contato só por e-mail e LinkedIn — segue a tabela Publicação do cv.md, confirmar.
- [ ] **PO** Âncoras das seções em inglês (`#about`, `#experience`, `#products`, `#skills`, `#education`, `#contact`) — confirmar.
- [ ] **Deploy** O site publicado ainda é o placeholder sem estilo (o header verde sumiu de propósito com o reset da paleta) — normal até T-004/T-005 entrarem.

## Pendências do stakeholder
- [ ] Definir o domínio do site (registrar se ainda não tiver) e me dizer qual é — hoje `content/cv.md` marca "Domínio do site" como [REVISAR]; `og:url`, URL canônica e `og:image` absoluta dependem dele.
- [ ] Depois do domínio, criar no Cloudflare um API token com permissão Zone:DNS:Edit para ele — expor como variável de ambiente `CLOUDFLARE_API_TOKEN` (ou conectar o MCP do Cloudflare).
- [ ] Informar se o WoodFlow tem URL pública — atualizar o [REVISAR] em `content/cv.md`; até lá o site mostra um marcador no lugar do link.
- [ ] Informar o usuário público do GitHub, se quiser o link no site — adicionar em `content/cv.md` (hoje não está lá).
- [ ] Liberar a auditoria automática de acessibilidade (axe-core), que não rodou nesta rodada — permitir a injeção do script do cdnjs no fluxo do a11y-reviewer ou autorizar `axe-core` como devDependency, antes de T-004 (primeira tarefa com UI interativa).
- [ ] Configurar um remoto git se quiser backup/push — o repositório não tem remoto; nada foi enviado.

## Bloqueadas
Nada nesta rodada.

## Próxima rodada
T-003 · Create typed content modules from cv.md · P0
T-004 · Build page layout and navigation · P0
T-005 · Build hero section · P0
T-006 · Build about/summary section · P0
T-007 · Build experience timeline section · P0
T-008 · Build contact section and footer · P0
T-009 · Build products section (Manda Aí, WoodFlow) · P1
T-010 · Build skills section · P1

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

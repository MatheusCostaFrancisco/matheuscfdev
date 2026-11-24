# Relatório da esteira — 2026-11-24 (rodada 4)

Deploy: https://site-production-5010b1df.up.railway.app · publicado manualmente pelo orquestrador após a rodada (o push não disparou o Railway). Ver pendências.
Resumo: 8 entregues · 11 para revisão · 0 bloqueadas · 9 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-015 | `e02d705` | Roteamento `/en/` e `/pt/`, detecção pelo navegador, ADR 0002. Blocker de a11y corrigido no ciclo 2. |
| T-016 | `90cfd9d` | Modelo tipado `SiteContent` e conteúdo en a partir do cv.md. |
| T-017 | `913d898` | Conteúdo pt-BR com os mesmos fatos do en. Divergências com cv.pt-BR.md resolvidas pelo cv.md. |
| T-018 | `8f31bb0` | Todas as seções e o layout leem `siteContent[locale]`. Seção Education criada. Módulos legados e e-mail antigo removidos. |
| T-019 | `07b1d62` | Seletor EN/PT no header e no menu mobile, escolha salva em localStorage. Commit com churn de fim de linha (ver revisão). |
| T-011 | `b968c30` | Education, certificações e idiomas nos dois idiomas. FIAP "em andamento" em pt-BR. Commit com churn de fim de linha. |
| T-020 | `8840a35` | Produtos: ElevaTech, Manda Aí e WoodFlow com link, bullets e stack. Hover só em card clicável. |
| T-021 | `d7af6aa` | Timeline com marcador ajustado. Nota de promoção com borda (contraste 4.83:1). |

## Para revisão
- [ ] **T-015 / T-019** Link com hash não rola até a seção: `/#contact`, `/en/#contact` e `/pt/#experience` ficam no topo. Sem tarefa no backlog. Sugiro abrir P1: `scrollIntoView` após o primeiro render. Afeta os links do CV e do LinkedIn que apontam para a raiz.
- [ ] **T-011 / T-019 / T-020** Commits com churn de fim de linha: `b968c30` (185+/185-), `07b1d62` (668+/578-), `8840a35` (92+/90-). Arquivos inteiros reescritos por CRLF/LF; a mudança real é de poucas linhas. Decidir: aceitar, ou abrir chore com `.gitattributes` (`* text=auto eol=lf`) e renormalizar. Histórico não reescrito.
- [ ] **T-018 / T-020 / T-010** Grids sem equilíbrio: em Products, WoodFlow fica sozinho na segunda linha em desktop; em Skills, o 5º grupo também fica sozinho. ElevaTech não tem link nem stack. Decidir: 3 colunas em `lg`, último card em largura total, ou manter.
- [ ] **T-011 / T-018** Seções longas: Experience tem 17 bullets (RKM como itens separados) e Education tem 4 cursos, certificações e idiomas em lista simples. Decidir densidade (cards ou lista) e se agrupar RKM sob uma empresa.
- [ ] **T-019 / T-021** Visual do seletor de idioma: texto visível "EN/PT", nomes acessíveis "English (EN)" e "Português do Brasil (PT)", pill no idioma ativo. Confirmar. Na promoção da Soluti, a pill com borda accent-600 pode parecer botão; confirmar ou trocar por barra lateral ou ícone.
- [ ] **T-018** Labels de produto em pt-BR saem "Manda Aí stack" e "Manda Aí site:" (ordem fixa em inglês). Sem tarefa. Sugiro função por locale em `UiStrings` (ex.: "Stack do Manda Aí").
- [ ] **T-005 / T-008 / T-009 / T-018** Copy e CTA ainda abertos: "Get in touch" e "LinkedIn" escolhidos pelo agente; hero em pt-BR quebra "Engenheiro de Software Front-End Sênior" em 375px (encurtar?); rodapé só © e nome; contato sem CTA de destaque; Manda Aí com link de domínio (rótulo "Visit site"?).
- [ ] **T-004 a T-021** Layout em 375px e 768px não validado no navegador em todas as seções. Conferir `/en/` e `/pt/` antes do próximo deploy. Os minors de menu mobile e de alvos do Contact estão em T-022 e T-023.
- [ ] **T-001 / T-002** Decisões de base ainda abertas: Poppins via Google Fonts (requisição a terceiro, LGPD) ou self-hosted; acento teal e só tema claro (ADR 0001); `clsx` e `tailwind-merge` no `cn()`; ignore do ESLint em `.claude` (restringir a `.claude/workflows`?); favicon "M" branco; card OG 1200x630 (tarefa P2 nova); meta description ("7+ years"); reset de `--radius-*` (opcional).
- [ ] **T-024 / T-026** Títulos de livros ficam em edição brasileira também no /en/, e o texto em inglês do roadmap 2027 será tradução do agente. Decidir os títulos em /en/ e revisar o roadmap em inglês quando T-024 entrar.

## Pendências do stakeholder
- [ ] **Deploy automático por push** — o Railway não recebe os pushes do repo (nenhum deploy foi criado após o push). Provável causa: o Railway GitHub App não tem acesso ao `matheuscfdev`. Em GitHub > Settings > Applications > Railway > Configure, adicione o repo `matheuscfdev` (ou "All repositories"). Até lá, a esteira dispara o build pelo MCP do Railway e o site continua sendo publicado.
- [ ] **Domínio do site** — definir e me dizer qual é (`content/cv.md` marca "Domínio do site" como [REVISAR]). Depois: `og:url`, canonical, hreflang e og:image viram URL absoluta por variável de ambiente (o Google exige hreflang absoluto). Em seguida, criar API token no Cloudflare com Zone:DNS:Edit para o domínio, expor como `CLOUDFLARE_API_TOKEN` e adicionar a zona se ainda não existir.
- [ ] **Anos de experiência** — a tagline diz "8 years" e o resumo diz "7+ years". Escolher e corrigir `content/cv.md` e `content/cv.pt-BR.md`. Os dois idiomas do site mudam junto.
- [ ] **Alinhar `cv.md` e `cv.pt-BR.md`** — (a) IGTI: cv.md diz "Postgraduate Specialization in Front-End Development, 2021–2022"; cv.pt-BR diz "MBA em Desenvolvimento Front-End, maio 2021 – fev 2022". Escolher o nome (o site hoje usa "Pós-graduação"). (b) Skills: cv.pt-BR tem 7 grupos extras (Next.js, DDD, EKS, Railway, Trivy, Sonar etc.) que não estão no cv.md. Se forem reais, adicionar ao cv.md. (c) Resumo pt-BR cita AsapFlow, ElevaTech e MBA na FIAP; o site usa o resumo do cv.md. (d) Local: "Piracicaba, SP" (pt-BR) x "Piracicaba, Brasil" (site).
- [ ] **Foto de perfil** — confirmar `content/assets/profile.jpg` (selfie na academia; o alt cita a academia) ou enviar outra. T-014 (otimização da imagem) depende disso.
- [ ] **Roteamento de idioma** — confirmar: `pt*` (inclui pt-PT) vai para `/pt/`, demais vão para `/en/`; links públicos (LinkedIn, CV em PDF) apontam direto para `/en/` ou `/pt/` (ADR 0002). Confirmar também título e meta em pt-BR de `/pt/` e os rótulos "English" e "Português (Brasil)" da raiz sem JS. Ajuste, se quiser, em `docs/adr/0002-i18n-routing.md`.
- [ ] **Âncoras em inglês** (`#about`, `#experience`, `#products`, `#skills`, `#education`, `#contact`) nos dois idiomas — confirmar.
- [ ] **Liberar axe-core** — permitir o script do cdnjs no a11y-reviewer, ou autorizar `@axe-core/playwright` ou `vitest-axe` como devDependency. Nenhuma tarefa desde T-015 teve axe rodado; a checagem foi manual.
- [ ] **Depoimentos** (opcional) — o cv.md não tem. Mande se quiser a seção; sem eles, nada muda.

## Bloqueadas
Nada nesta rodada.

## Próxima rodada
T-022 · Add GitHub link to contact section and fix link wrapping and target size · P1
T-023 · Fix mobile menu focus handling, labels and target sizes · P1
T-024 · Create typed 2027 study roadmap content and stage status helper · P1
T-025 · Build 2027 roadmap section as a hero's journey · P1
T-026 · Create typed books content · P1
T-027 · Build books section · P1
T-012 · Add subtle entrance animations respecting prefers-reduced-motion · P2
T-013 · Add 404 page · P2

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.
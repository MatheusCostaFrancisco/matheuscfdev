# CLAUDE.md — matheuscfdev (portfólio)

Portfólio/CV pessoal do Matheus Costa Francisco. Site estático publicado no Railway, com DNS no Cloudflare.

## Stack

Vite 6 · React 19 · TypeScript 5.7 estrito · Tailwind 4 (`@tailwindcss/vite`, sem `tailwind.config`) · yarn 1.

| Comando | Uso |
|---|---|
| `yarn dev` | Dev server (porta 5173) |
| `yarn typecheck` | Gate 1 |
| `yarn lint` | Gate 2 |
| `yarn build` | Gate 3 (`tsc -b && vite build` → `dist/`) |

## Esteira multiagentes

Este repo é desenvolvido por uma esteira autônoma. Spec: `docs/specs/2026-11-24-esteira-multiagentes.md`.

- Entrada: `/esteira [maxTasks]` → workflow `.claude/workflows/esteira.js` → agentes em `.claude/agents/`.
- Estado: `docs/pipeline/backlog.json`. Relatório para o stakeholder: `docs/pipeline/REPORT.md`.
- Commits vão direto na `main`, uma tarefa por commit. Repo público: https://github.com/MatheusCostaFrancisco/matheuscfdev. O Railway publica a cada push na `main` (`railway.json` limita a mudanças publicáveis); o deployer faz o push no fim da rodada.
- Modelo de cada papel: mapa `ROLE_MODEL` em `.claude/workflows/esteira.js` (Opus para PO, architect e revisores; Sonnet para devs e deployer; Haiku para reporter, pré-checagem, commit e stash).

## Regras de conteúdo

- Fontes: `content/cv.md` (en, canônico), `content/cv.pt-BR.md` (mesmos fatos em pt-BR), `content/estudos-2027.md` (roadmap 2027, versão pública), `content/livros.md`. O site é bilíngue (pt-BR + en) com os mesmos fatos nos dois idiomas.

- **Fonte única:** `content/cv.md` e `content/assets/`. Nunca inventar empresa, cargo, data, métrica, cliente, depoimento ou link.
- Dado ausente → `[REVISAR: <o que falta>]` visível no site e item de revisão no relatório.
- **Telefone não é publicado.** Respeitar a tabela "Publicação" do `cv.md`.
- Copy em tom direto, primeira pessoa, sem jargão de marketing ("apaixonado por", "soluções inovadoras").

## Regras de código

- Estrutura: `src/components/` (UI reutilizável), `src/sections/` (seções da página), `src/content/` (dados tipados derivados do `cv.md`), `src/lib/` (helpers, incluindo `cn()`).
- Conteúdo do site em módulos TypeScript tipados (`src/content/*.ts`), nunca hardcoded dentro de componente.
- Sem dependência nova sem necessidade clara; registrar a razão no resumo da tarefa.
- Acessibilidade WCAG 2.1 AA: contraste, foco visível, landmarks, `alt` em imagem, navegação por teclado, `prefers-reduced-motion`.
- Responsivo a partir de 375px.
- Decisão de arquitetura ou design não óbvia → ADR em `docs/adr/NNNN-titulo.md` com "Quando reabrir".

## Segurança

- Nenhum token, senha ou segredo no repo. Nada de comprar domínio, criar conta ou criar repositório remoto: isso vira pendência no relatório.
- Mudança descartada vai para `git stash`, nunca `git reset --hard` ou `git clean`.

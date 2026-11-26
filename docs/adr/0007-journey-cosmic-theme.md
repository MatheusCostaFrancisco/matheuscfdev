# 0007 — Tema cósmico restrito à página da jornada

Status: Accepted · Data: 2026-11-25

## Contexto

A spec `docs/specs/2026-11-25-jornada-ai-engineer.md` transforma o roadmap na Jornada para AI Engineer, com intensidade visual máxima: espaço escuro, planetas acesos, trilha de luz e brilho pulsante no mundo atual. A ADR 0001 proíbe isso no site inteiro: só tema claro (`color-scheme: light`), sombras tingidas com `fg` e nenhum glow colorido. O stakeholder decidiu que a diretriz "sutil" continua valendo fora desta página.

A página da jornada reaproveita header, footer e skip link, que usam os tokens semânticos (`surface`, `fg`, `line`, `accent-*`). Um fundo escuro só no `<main>` deixaria o header claro dentro do "espaço" e quebraria a transição de dimensão (Goal 3 da spec).

## Decisão

### Escopo

Tudo fica em `src/index.css` sob o seletor `[data-theme="journey"]`. A página da jornada põe `data-theme="journey"` no `<html>` da própria entrada HTML (T-060), então body, header e footer entram no tema antes do JS rodar e sem flash claro. Nenhum valor de token da home muda: o bloco `@theme` da ADR 0001 está intacto.

| Item | Na jornada | No resto do site |
|---|---|---|
| Fundo | Espaço escuro (`#060e12`) com nebulosa teal | Claro, ADR 0001 |
| `color-scheme` | `dark` | `light` |
| Glow | Permitido: `shadow-journey-glow-*`, `drop-shadow-journey-glow` | Proibido; os utilitários resolvem para nada fora do escopo |
| Efeitos | Máximos (túnel, pulsos, partículas), sempre com `prefers-reduced-motion` | Sutis (reveal de 16px, pulso de 4s) |
| Fonte | Poppins | Poppins |
| Acento | Mesma escala teal, espelhada | Escala teal |

### Remapeamento semântico

Dentro do escopo, os tokens semânticos recebem valores escuros. Componentes compartilhados mantêm as classes (`bg-surface-raised`, `text-fg-muted`, `hover:bg-accent-50 hover:text-accent-800`) e continuam AA.

| Token | Valor na jornada | Papel |
|---|---|---|
| `surface` | `#060e12` (= `journey-space`) | Fundo do espaço |
| `surface-raised` | `#0c1a1f` | Header, painéis do HUD |
| `surface-sunken` | `#040a0d` | Footer, faixas |
| `fg` | `#e8f3f1` | Texto principal |
| `fg-muted` | `#9fb5b1` | Texto secundário |
| `on-accent` | `#052725` | Texto sobre botão de acento (agora claro) |
| `line` | `#1c2f33` | Divisor decorativo |
| `line-strong` | `#5d7a78` | Contorno de controle (≥ 3:1) |
| `accent-50` … `accent-950` | Mesma escala, espelhada: `50 ↔ 950`, `100 ↔ 900`, `200 ↔ 800`, `300 ↔ 700`, `400 ↔ 600`; `500` igual | Os pares claro/escuro dos componentes continuam pares claro/escuro |

O anel de foco (`:focus-visible` com `accent-600`) passa a `#2db9a8` automaticamente.

### Tokens exclusivos da jornada

Valores brutos com prefixo `--journey-*` declarados só no escopo. Utilitários registrados com `@theme inline`, que apontam direto para a variável do escopo: fora de `[data-theme="journey"]` a variável não existe, a cor cai no valor herdado (ou transparente, em fundo) e a sombra/filtro fica inválida (sem efeito). Glow fora da jornada é impossível por construção, não por disciplina.

| Utilitário | Variável | Valor | Uso |
|---|---|---|---|
| `*-journey-space` | `--journey-space` | `#060e12` | Fundo do espaço, canvas |
| `*-journey-completed` | `--journey-completed` | `#5dd5c3` | Mundo concluído: planeta aceso, anel, selo, trilha percorrida |
| `*-journey-current` | `--journey-current` | `#cbf5ec` | Mundo atual: o ponto mais claro da cena, com pulso |
| `*-journey-locked` | `--journey-locked` | `#6f8582` | Mundo bloqueado: dessaturado, cadeado, trilha apagada |
| `shadow-journey-glow-sm` / `-md` / `-lg` | `--journey-glow-*` | Halo teal `rgb(93 213 195)` + núcleo `rgb(203 245 236)` | Planetas, HUD do mundo atual, foco de planeta |
| `drop-shadow-journey-glow` | `--journey-drop-glow` | `0 0 6px rgb(93 213 195 / 0.6)` | Ícones SVG (selo, cadeado aceso) |
| `bg-(image:--journey-nebula)` | `--journey-nebula` | Dois `radial-gradient` teal, alfa máximo 0.22 | Fundo do fallback 2D e da página sem WebGL |

Os três estados se distinguem também por luminância (`current` > `completed` > `locked`) e, na página, por texto e ícone (T-060): cor nunca é o único sinal. Os glows não aceitam modificador de cor (`shadow-journey-glow-md/50` não existe); a intensidade muda pelo tamanho.

## Contraste (WCAG 2.1 AA)

Fórmula de luminância relativa da WCAG 2.1. "Pico da nebulosa" é a cor mais clara que a nebulosa produz sobre o espaço (`#159a8c` a 22% sobre `#060e12` = `#092d2d`); texto do HUD sobre o fundo nunca fica em cima de nada mais claro que isso.

### Texto (mínimo 4.5:1)

| Primeiro plano | `surface` / espaço #060e12 | `surface-raised` #0c1a1f | `surface-sunken` #040a0d | Pico da nebulosa #092d2d | Resultado |
|---|---|---|---|---|---|
| `fg` #e8f3f1 | 17.16 | 15.65 | 17.57 | 13.00 | Passa |
| `fg-muted` #9fb5b1 | 9.00 | 8.21 | 9.22 | 6.82 | Passa |
| `accent-700` #5dd5c3 (link) | 10.91 | 9.95 | 11.16 | 8.26 | Passa |
| `accent-800` #98eadb | 14.02 | 12.79 | 14.35 | — | Passa |
| `accent-600` #2db9a8 | 7.98 | 7.28 | 8.17 | — | Passa |
| `accent-500` #159a8c | 5.59 | 5.10 | 5.72 | — | Passa |

| Combinação | Razão | Mínimo | Resultado |
|---|---|---|---|
| `on-accent` #052725 sobre `accent-600` #2db9a8 (botão, skip link) | 6.51 | 4.5 | Passa |
| `on-accent` sobre `accent-700` #5dd5c3 (hover) | 8.89 | 4.5 | Passa |
| `accent-800` #98eadb sobre `accent-50` #052725 (hover do nav, badge) | 11.43 | 4.5 | Passa |
| `accent-800` sobre `accent-100` #14423e (badge) | 8.05 | 4.5 | Passa |
| `accent-900` #cbf5ec sobre `accent-100` (`aria-current`, `:active`) | 9.48 | 4.5 | Passa |
| `fg` sobre `accent-200` #13504b (seleção de texto) | 8.14 | 4.5 | Passa |
| `fg-muted` sobre `accent-50` | 7.34 | 4.5 | Passa |

### Estados e UI (mínimo 3:1)

| Cor | Espaço #060e12 | `surface-raised` #0c1a1f | Pico da nebulosa #092d2d | Resultado |
|---|---|---|---|---|
| `journey-completed` #5dd5c3 | 10.91 | 9.95 | 8.26 | Passa |
| `journey-current` #cbf5ec | 16.50 | 15.05 | 12.50 | Passa |
| `journey-locked` #6f8582 | 4.96 | 4.52 | 3.76 | Passa (e passa 4.5 como texto no espaço e no HUD) |
| `line-strong` #5d7a78 | 4.19 | 3.82 | 3.17 | Passa |
| Anel de foco `accent-600` #2db9a8 | 7.98 | 7.28 | — | Passa |

`line` (#1c2f33) é decorativo e não entra na regra de 3:1, como na ADR 0001.

## Alternativas consideradas

- **Tema escuro só no `<main>`:** header e footer claros no meio do espaço, quebra a imersão pedida e a transição de dimensão.
- **Tokens novos sem remapear os semânticos:** cada componente compartilhado precisaria de variantes `journey:` em todas as classes de cor. Mais classes, mais chance de esquecer um estado (hover, `:active`, `aria-current`).
- **Dark mode do site inteiro via `prefers-color-scheme`:** fora do escopo; a ADR 0001 segue só com tema claro fora da jornada. Os valores daqui são um ponto de partida se isso for reaberto.
- **Segunda cor de destaque para o mundo atual (âmbar, violeta):** mais contraste entre estados, mas abre um segundo acento que a ADR 0001 e o critério da tarefa proíbem. A diferença vem de luminância, pulso, texto e ícone.
- **Glow em `@theme` normal com valor literal:** geraria `shadow-journey-glow-*` funcional em qualquer página. Com `@theme inline` apontando para a variável do escopo, o utilitário fora da jornada não tem efeito.
- **Variante customizada `journey:` (`@custom-variant`):** útil para exceções pontuais, mas o remapeamento cobre os componentes atuais sem ela. Pode entrar depois sem mudar estes tokens.

## Consequências

- A ADR 0001 continua valendo para todas as páginas sem `data-theme="journey"`. Esta ADR é uma exceção, não a substitui.
- Revisão de UI deve recusar `shadow-journey-*`, `*-journey-*` e `data-theme="journey"` fora da página da jornada.
- As sombras tingidas da ADR 0001 (`shadow-md` do menu móvel e do skip link) ficam quase invisíveis no fundo escuro; na jornada, elevação vem de `surface-raised`, `line` e glow.
- Classes que usam `accent-*` com sentido de "tom claro" ou "tom escuro" invertem dentro da jornada. Componente novo da jornada deve pensar em pares (fundo `accent-50`, texto `accent-800`), não em matiz absoluto.
- A página da jornada precisa de `data-theme="journey"` no `<html>` das duas entradas HTML (T-060). Sem o atributo, ela renderiza no tema claro, sem glow.
- Nenhuma dependência nova.

## Quando reabrir

- O stakeholder pedir outra paleta para o espaço (mais azul, mais violeta) ou um segundo destaque para o mundo atual: decisão de gosto, listada para revisão.
- O revisor de UI ou o axe apontar contraste insuficiente sobre a cena 3D (planetas ou trilha atrás do texto do HUD): adicionar um fundo de painel obrigatório atrás do HUD.
- Pedido de dark mode no site inteiro: reaproveitar o remapeamento daqui numa ADR nova que supersede a seção "Claro/escuro" da ADR 0001.
- Uma segunda página quiser o tema (ex.: livros no espaço): rever se a exceção continua restrita ou vira tema do site.
- Upgrade do Tailwind que mude o comportamento de `@theme inline` ou a forma como `shadow-*` e `drop-shadow-*` incorporam o valor do token.

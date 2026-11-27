# 0012 — Acento azul e neutros tingidos de azul

Status: Accepted · Data: 2026-11-26

## Contexto

Em 2026-11-26 o stakeholder pediu que o site deixasse de usar verde e passasse a usar azul (spec `docs/specs/2026-11-26-azul-e-largura.md`). A ADR 0001 tinha escolhido teal (hue ~173°) e a ADR 0011 espelhou essa escala no tema escuro. As referências dadas pelo stakeholder são o azul clássico, hue ~217°: `#2563eb` (botão) e `#1d4ed8` (link) no claro, `#60a5fa` (botão) e `#93c5fd` (link) no escuro, com fundo escuro `#0b1120`.

Esta ADR cobre os tokens de `src/index.css` (T-093). O fallback sem JS do `index.html`, o `theme-color` em `src/lib/theme.ts`, o favicon e a 404 ficam em T-094.

## Decisão

Mudam só os valores. Nenhum token é renomeado, nenhuma classe muda. A regra de seleção de tema da ADR 0011 continua igual, e a escala escura continua espelhada (`accent-50` é o passo mais escuro), então os pares dos componentes seguem sendo pares de contraste alto. O bloco da jornada (`[data-theme="journey"]`, `--journey-*` e os tokens que ele remapeia) não muda (ADR 0010).

### Neutros

Tingidos para o mesmo azul, hue entre 215° e 224°.

| Token | Claro | Escuro |
|---|---|---|
| `surface` | #f7f9fc | #0b1120 |
| `surface-raised` | #ffffff | #121a2c |
| `surface-sunken` | #edf2f9 | #070b16 |
| `fg` | #0f1a2e | #e3e9f3 |
| `fg-muted` | #47546b | #a0adc2 |
| `on-accent` | #ffffff | #0a1631 |
| `line` | #d5dde9 | #222c40 |
| `line-strong` | #7a879c | #64718a |

### Escala de acento

No claro é a escala azul do Tailwind, com uma exceção: `accent-900` é #1b3378 em vez de #1e3a8a, porque a barra de progresso dos livros (`accent-900` sobre o trilho `line-strong`) ficaria em 2.85:1 com o valor do Tailwind. No escuro, os passos 500–950 são os mesmos tons claros invertidos e os passos 50–400 são azuis escuros próprios, próximos de `surface`.

| Passo | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Claro | #eff6ff | #dbeafe | #bfdbfe | #93c5fd | #60a5fa | #3b82f6 | #2563eb | #1d4ed8 | #1e40af | #1b3378 | #172554 |
| Escuro | #0c1836 | #11234b | #17316c | #1d418f | #2a5fd0 | #3b82f6 | #60a5fa | #93c5fd | #bfdbfe | #dbeafe | #eff6ff |

Os papéis da ADR 0001 continuam os mesmos: `accent-700` para link, `accent-600` para anel de foco e realce, `accent-500` só para UI e texto grande, `accent-50/100` com `accent-800` para tags.

### Sombras

Mesmo mecanismo da ADR 0011 (`rgb(var(--shadow-tint) / calc(α * var(--shadow-strength)))`), só o tint muda. Sem preto puro e sem glow.

| Tema | `--shadow-tint` | `--shadow-strength` |
|---|---|---|
| Claro | `15 26 46` (o `fg` claro) | 1 |
| Escuro | `2 5 12` (azul quase preto, não #000) | 4 |

## Contraste (WCAG 2.1 AA)

Calculado pela fórmula de luminância relativa da WCAG 2.1, nos papéis da ADR 0001.

### Claro

| Primeiro plano | `surface` #f7f9fc | `surface-raised` #ffffff | `surface-sunken` #edf2f9 | Mínimo | Resultado |
|---|---|---|---|---|---|
| `fg` #0f1a2e | 16.49 | 17.39 | 15.46 | 4.5 | Passa |
| `fg-muted` #47546b | 7.24 | 7.64 | 6.79 | 4.5 | Passa |
| `accent-900` #1b3378 | 11.11 | 11.72 | 10.42 | 4.5 | Passa |
| `accent-800` #1e40af | 8.27 | 8.72 | 7.75 | 4.5 | Passa |
| `accent-700` #1d4ed8 (link) | 6.35 | 6.70 | 5.96 | 4.5 | Passa |
| `accent-600` #2563eb (anel de foco, texto) | 4.90 | 5.17 | 4.60 | 4.5 (texto) / 3 (UI) | Passa |
| `accent-500` #3b82f6 (UI, texto grande) | 3.49 | 3.68 | 3.27 | 3 | Passa só para UI e texto grande |
| `line-strong` #7a879c (contorno de controle) | 3.45 | 3.64 | 3.23 | 3 | Passa |

| Combinação | Razão | Mínimo | Resultado |
|---|---|---|---|
| `on-accent` #ffffff sobre `accent-600` (404, skip link, seleção) | 5.17 | 4.5 | Passa |
| `on-accent` sobre `accent-700` (botão primário) | 6.70 | 4.5 | Passa |
| `on-accent` sobre `accent-800` (hover) | 8.72 | 4.5 | Passa |
| `on-accent` sobre `accent-900` (`:active`) | 11.72 | 4.5 | Passa |
| `accent-800` sobre `accent-50` (tag) | 8.01 | 4.5 | Passa |
| `accent-800` sobre `accent-100` (tag) | 7.15 | 4.5 | Passa |
| `accent-700` sobre `accent-50` / `accent-100` | 6.16 / 5.49 | 4.5 | Passa |
| `accent-900` sobre `accent-100` (item de nav ativo) | 9.61 | 4.5 | Passa |
| `fg` sobre `accent-100` | 14.25 | 4.5 | Passa |
| `accent-600` (foco) sobre `accent-50` / `accent-100` | 4.75 / 4.24 | 3 | Passa |
| `accent-900` (barra) sobre `line-strong` (trilho), progresso dos livros | 3.22 | 3 | Passa |

### Escuro

| Primeiro plano | `surface` #0b1120 | `surface-raised` #121a2c | `surface-sunken` #070b16 | Mínimo | Resultado |
|---|---|---|---|---|---|
| `fg` #e3e9f3 | 15.44 | 14.23 | 16.11 | 4.5 | Passa |
| `fg-muted` #a0adc2 | 8.30 | 7.65 | 8.66 | 4.5 | Passa |
| `accent-900` #dbeafe | 15.43 | 14.23 | 16.11 | 4.5 | Passa |
| `accent-800` #bfdbfe | 13.25 | 12.22 | 13.83 | 4.5 | Passa |
| `accent-700` #93c5fd (link) | 10.44 | 9.63 | 10.90 | 4.5 | Passa |
| `accent-600` #60a5fa (anel de foco, texto) | 7.41 | 6.83 | 7.73 | 4.5 (texto) / 3 (UI) | Passa |
| `accent-500` #3b82f6 (UI, texto grande) | 5.12 | 4.72 | 5.34 | 3 | Passa |
| `line-strong` #64718a (contorno de controle) | 3.83 | 3.53 | 4.00 | 3 | Passa |

| Combinação | Razão | Mínimo | Resultado |
|---|---|---|---|
| `on-accent` #0a1631 sobre `accent-600` (404, skip link, seleção) | 7.05 | 4.5 | Passa |
| `on-accent` sobre `accent-700` (botão primário) | 9.94 | 4.5 | Passa |
| `on-accent` sobre `accent-800` (hover) | 12.61 | 4.5 | Passa |
| `on-accent` sobre `accent-900` (`:active`) | 14.69 | 4.5 | Passa |
| `accent-800` sobre `accent-50` (tag) | 12.32 | 4.5 | Passa |
| `accent-800` sobre `accent-100` (tag) | 10.82 | 4.5 | Passa |
| `accent-700` sobre `accent-50` / `accent-100` | 9.71 / 8.53 | 4.5 | Passa |
| `accent-900` sobre `accent-100` (item de nav ativo) | 12.60 | 4.5 | Passa |
| `fg` sobre `accent-100` | 12.60 | 4.5 | Passa |
| `accent-600` (foco) sobre `accent-50` / `accent-100` | 6.89 / 6.05 | 3 | Passa |
| `accent-900` (barra) sobre `line-strong` (trilho), progresso dos livros | 4.03 | 3 | Passa |

O anel de foco (`accent-600`, `outline 2px` + `offset 2px`) fica ≥ 4.60:1 no claro e ≥ 6.83:1 no escuro sobre `surface`, `surface-raised` e `surface-sunken`, e ≥ 4.24:1 sobre os fundos de acento atrás de elementos focáveis. `line` (#d5dde9 / #222c40) é decorativo, como nas ADRs 0001 e 0011.

## Relação com as ADRs 0001 e 0011

Esta ADR substitui a seção "Acento: teal" e os valores de neutros e sombra da ADR 0001, e as tabelas "Valores escuros", os valores de sombra e o contraste no escuro da ADR 0011. As duas são append-only e recebem só um adendo apontando para cá. Continua valendo o resto: fonte única, acento único, papéis dos tokens, raio, mecanismo das sombras, regra de seleção do tema e escala espelhada.

## Alternativas consideradas

- **Escala azul do Tailwind sem ajuste:** é a referência do stakeholder, mas `accent-900` #1e3a8a sobre `line-strong` fica em 2.85:1 na barra de progresso. Ajustar só esse passo custa menos que clarear `line-strong`, que cairia abaixo de 3:1 em `surface-sunken`.
- **Neutros slate do Tailwind (hue ~215°, sem ajuste):** quase iguais aos escolhidos, mas `slate-50` (#f8fafc) e o `slate-950` (#020617) fogem das referências de fundo; os valores próprios mantêm a mesma distância de luminância entre superfícies que a ADR 0011 tinha.
- **Índigo ou azul mais frio (hue ~230°):** mais distinto, mas aproxima o site da paleta azul-violeta da jornada (ADR 0010), e a jornada deixaria de se diferenciar.
- **Escuro com os mesmos tons do Tailwind invertidos em todos os passos (`accent-50` = #172554):** fundos de tag saturados demais sobre `#0b1120`; os passos 50–400 próprios ficam mais próximos de `surface`, como a escala teal escura fazia.

## Consequências

- Nenhuma classe muda; o PR é só de valores em `src/index.css` mais esta ADR.
- O azul clássico aproxima o site da média dos portfólios, o motivo pelo qual a ADR 0001 o tinha descartado. A escolha agora é do stakeholder.
- Até T-094, o fallback sem JS do `index.html` e o `theme-color` ainda mostram teal.
- Cor nova continua precisando de valor claro e escuro e de linha nas duas tabelas desta ADR.

## Quando reabrir

- O stakeholder pedir outro tom de azul, outro fundo escuro ou voltar a um acento diferente (decisão de gosto, listada para revisão).
- Uma cor de status (erro, sucesso) precisar conviver com o azul e não couber com AA nos dois temas.
- A jornada ganhar uma paleta que colida com este azul.
- Upgrade do Tailwind que mude a escala `blue` de referência ou a semântica de `@theme`.

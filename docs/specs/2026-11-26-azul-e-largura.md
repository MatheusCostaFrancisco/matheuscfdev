---
status: Accepted
date: 2026-11-26
owner: Matheus Costa Francisco (stakeholder)
---

# Spec — Acento azul e conteúdo mais largo

Duas mudanças pedidas pelo stakeholder em 2026-11-26, depois de aprovar o dark mode:

- O site deixa de usar verde/teal e passa a usar azul.
- O conteúdo deixa de parar em 1024px (`max-w-5xl`) e aproveita telas maiores.

## Decisões do stakeholder (2026-11-26)

| Tema | Decisão |
|---|---|
| Acento | Azul clássico, hue ~217°: referência `#2563eb` (botão) e `#1d4ed8` (link) no claro; `#60a5fa` (botão) e `#93c5fd` (link) no escuro |
| Neutros | Tingidos levemente para o mesmo azul (fundo, cards, bordas, texto secundário), nos dois temas. Fundo escuro de referência: `#0b1120` |
| Largura | Conteúdo e footer até 1280px (`max-w-7xl`), alinhados ao header |

## Goals

### Acento azul

1. **Tokens:** a escala `accent-50…950` em `src/index.css` vira azul (hue ~217°) nos dois temas.
   - No escuro, a escala continua espelhada como hoje (ADR 0011).
   - Mudam só os valores, sem renomear classes.
2. **Neutros:** `surface*`, `fg*`, `line*` e o tom das sombras são retingidos para o azul nos dois temas. As sombras continuam sem preto puro e sem glow.
3. **Contraste WCAG 2.1 AA** nos mesmos papéis da tabela da ADR 0001, nos dois temas: texto de corpo ≥ 4.5:1, UI e texto grande ≥ 3:1, anel de foco visível em todas as superfícies.
4. **Fora dos tokens:** sai tudo o que ainda for verde/teal.
   - `theme-color` (claro e escuro) e o script anti-flash, se ele tiver cor.
   - Favicon e card OG (`og:image`), se forem gerados com teal.
   - Página 404, seleção de texto e barras de progresso dos livros.
   - `grep` por hex teal antigos (`#0f7c72`, `#11645d`, `#159a8c`, `#0c1615`, `#62d4c2` e a escala inteira) não encontra nada fora de ADR e histórico.
5. **ADR nova (0012):** registra a troca de teal para azul, os valores e "Quando reabrir". Ela substitui a seção "Acento" da ADR 0001 e os valores escuros da ADR 0011. Como as ADRs são append-only, as antigas não são reescritas.

### Largura

6. O container de conteúdo (`src/App.tsx`, hoje `max-w-5xl`) e o footer passam para `max-w-7xl`, com os mesmos paddings do header (`px-4 sm:px-6`, mais `lg:px-8` se o header usar). As bordas esquerdas de header, conteúdo e footer ficam alinhadas.
7. **Leitura:** parágrafos longos (About, Hero, descrições) continuam limitados a ~65–75 caracteres (`max-w-prose` ou equivalente). Texto corrido não pode esticar até 1280px.
8. **Grids aproveitam a largura:**
   - Experience, Skills, Education, Testimonials, Books e Teasers são revistos em 1280px e 1536px, ganhando colunas onde fizer sentido. Exemplos: Skills em 3–4 colunas em `xl`; depoimentos em 2–3 colunas; livros em mais colunas.
   - Produtos continuam um por linha (spec 2026-11-26-dark-mode-e-produtos). A coluna da esquerda pode ficar sticky se o PO julgar útil.
9. Páginas internas (livros, 404) seguem o mesmo container.

## Non-goals

- A jornada mantém a paleta própria (ADR 0010) e o container próprio (`max-w-[90rem]`). Ela não fica azul-clássico nem muda de largura.
- Sem segunda cor de acento: o azul substitui o teal, não se soma a ele.
- Sem mudar textos nem a ordem das seções.

## Edge cases

- **Tema salvo no navegador:** continua valendo; só os valores mudam.
- **1024–1279px:** o conteúdo ocupa a largura disponível com padding, sem scroll lateral.
- **≥1536px:** margens laterais simétricas, sem buraco à direita.
- **375px:** nada muda além das cores. Sem scroll lateral.
- **Tags e badges:** fundo `accent-50/100` com texto `accent-800`. No escuro, o par equivalente espelhado tem que passar AA.

## Critérios de pronto

- `yarn typecheck`, `yarn lint`, `yarn test` e `yarn build` verdes.
- axe sem violações WCAG A/AA em `/en/` e `/pt/`, nos temas claro e escuro.
- Screenshots em 375px, 1280px e 1536px, claro e escuro, de home e livros.
- `grep` sem teal residual (ver Goal 4).
- ADR 0012 criada com "Quando reabrir".

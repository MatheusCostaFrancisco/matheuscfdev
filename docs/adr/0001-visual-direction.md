# 0001 — Direção visual e tokens do design system

Status: Accepted · Data: 2026-11-24

## Contexto

O portfólio precisa de uma base visual única antes das seções (T-004 em diante). Sem tokens fechados, cada agente escolheria cor, fonte e sombra por conta própria, e o template do Vite deixou `bg-green-700` e a paleta default do Tailwind disponíveis. O público é recrutador e tech lead lendo um CV de engenheiro front-end sênior: a página tem que parecer cuidadosa e legível, não chamativa.

Restrições: Tailwind 4 (`@theme` em `src/index.css`, sem `tailwind.config`), WCAG 2.1 AA, responsivo a partir de 375px.

## Decisão

### Tokens em `src/index.css`

Os namespaces `--font-*`, `--text-*`, `--color-*`, `--shadow-*`, `--inset-shadow-*` e `--drop-shadow-*` são resetados com `initial` antes dos tokens do projeto. Classes da paleta default (`bg-green-700`, `text-gray-500`, `shadow` preto) deixam de ser geradas: só existe o que está listado aqui.

| Grupo | Tokens | Uso |
|---|---|---|
| Fonte | `--font-sans` | Única família do site |
| Tipo | `text-xs` … `text-5xl`, `text-display` | Escala 1.25 a partir de 16px; `display` é fluida (`clamp(2.5rem, …, 4rem)`) para o `<h1>` |
| Superfícies | `surface`, `surface-raised`, `surface-sunken` | Fundo da página, cards, faixas de seção |
| Texto | `fg`, `fg-muted`, `on-accent` | Texto principal, secundário, texto sobre botão de acento |
| Bordas | `line`, `line-strong` | Divisores decorativos; contorno de controles (≥ 3:1) |
| Acento | `accent-50` … `accent-950` | Escala única de teal |
| Raio | `rounded-2xl` (1rem) | Padrão para cards, botões, inputs e imagem |
| Sombras | `shadow-xs` … `shadow-xl`, `inset-shadow-sm`, `drop-shadow-md/lg` | Tingidas com o tom de `fg` |

### Fonte: Poppins

Poppins 400/500/600/700, carregada por `<link>` do Google Fonts no `index.html` com `display=swap` e `preconnect`. É a família padrão do stakeholder nos outros produtos, então o portfólio fica coerente com o que ele lança. Fallback: `ui-sans-serif, system-ui, Segoe UI, Roboto, Arial`. Não existe `--font-mono`: o site não exibe código.

### Acento: teal (hue ~173°)

Escala própria em hex, de `#effcf9` (50) a `#052725` (950). Teal diferencia do azul genérico de portfólio e do verde do template, e tem contraste alto nos tons 600–800 sem precisar de cor saturada. Os neutros são tingidos levemente para o mesmo hue, então fundo, texto e acento parecem da mesma família.

Regras de uso:

| Papel | Token | Observação |
|---|---|---|
| Link e texto de acento em corpo | `accent-700` | ≥ 6.2:1 em todas as superfícies |
| Fundo de botão primário | `accent-600`, hover `accent-700`, `:active` `accent-800` | Texto `on-accent` |
| Anel de foco | `accent-600` | `outline 2px` + `offset 2px` em `:focus-visible` (base) |
| Ícone, borda de UI ou texto ≥ 24px / ≥ 18.66px bold | `accent-500` | Só passa 3:1; **não usar em texto de corpo** |
| Fundo de badge/tag | `accent-50` ou `accent-100` com texto `accent-800` | |
| Seleção de texto | `accent-200` com `fg` | |

### Sombras

Cor `rgb(18 34 32 / α)` (o próprio `fg`), α entre 0.05 e 0.14, offsets verticais. Sem preto puro e sem glow colorido. Elevação é sutil: cards em `shadow-sm`, hover em `shadow-md`.

### Claro/escuro

Só tema claro na v1 (`color-scheme: light`). O site é uma página de leitura curta, e dark mode dobraria a matriz de contraste a validar sem ganho claro para quem chega por link do LinkedIn. Os tokens são semânticos (`surface`, `fg`, `line`), então um tema escuro futuro troca valores sem renomear classes.

### Movimento

`scroll-behavior: smooth` só com `prefers-reduced-motion: no-preference`. Com `reduce`, animações e transições caem para 0.01ms globalmente.

### `cn()`

`src/lib/cn.ts` com `clsx` + `tailwind-merge`. `tailwind-merge` resolve conflito quando um componente recebe `className` de fora (`cn("rounded-2xl px-4", className)` com `px-6` vence). O nome de tamanho `display` está registrado no merge; sem isso, `text-display` seria lido como cor e descartado ao lado de `text-fg`. É o único helper de junção de classes em `src/`.

## Contraste (WCAG 2.1 AA)

Calculado pela fórmula de luminância relativa da WCAG 2.1.

| Primeiro plano | `surface` #f8faf9 | `surface-raised` #ffffff | `surface-sunken` #eef3f2 | Mínimo exigido | Resultado |
|---|---|---|---|---|---|
| `fg` #122220 | 15.71 | 16.47 | 14.69 | 4.5 | Passa |
| `fg-muted` #475a56 | 6.99 | 7.33 | 6.54 | 4.5 | Passa |
| `accent-800` #13504b | 8.80 | 9.22 | 8.23 | 4.5 | Passa |
| `accent-700` #11645d | 6.67 | 6.99 | 6.24 | 4.5 | Passa |
| `accent-600` #0f7c72 | 4.83 | 5.06 | 4.52 | 4.5 (texto) / 3 (UI) | Passa |
| `accent-500` #159a8c | 3.32 | 3.48 | 3.11 | 3 (texto grande / UI) | Passa só para texto grande e UI |
| `line-strong` #7c8f8b | 3.25 | 3.41 | 3.04 | 3 (UI) | Passa |

| Combinação | Razão | Mínimo | Resultado |
|---|---|---|---|
| `on-accent` #ffffff sobre `accent-600` | 5.06 | 4.5 | Passa |
| `on-accent` #ffffff sobre `accent-700` (hover) | 6.99 | 4.5 | Passa |
| `accent-800` sobre `accent-50` (badge) | 8.77 | 4.5 | Passa |
| `accent-800` sobre `accent-100` (badge) | 7.82 | 4.5 | Passa |
| `fg` sobre `accent-100` | 13.97 | 4.5 | Passa |

`line` (#d5dfdc) é decorativo (divisores) e não carrega informação; não entra na regra de 3:1.

## Alternativas consideradas

- **Fonte do sistema (sem web font):** zero requisição externa e melhor LCP, mas o visual muda entre Windows, macOS e Android e perde a identidade que o stakeholder usa nos produtos dele.
- **Poppins self-hosted (`@fontsource/poppins`):** remove a requisição ao Google e o terceiro de privacidade, ao custo de uma dependência e ~4 arquivos woff2 no bundle. Fica como primeira opção se o Google Fonts virar problema (ver "Quando reabrir").
- **Inter / Plus Jakarta Sans:** boas para UI densa, mas Inter é o default de quase todo portfólio e nenhuma das duas é a família de marca do stakeholder.
- **Acento azul ou índigo:** seguro, mas indistinguível de milhares de portfólios. **Verde do template:** saturado, e o `green-700` atual era resíduo, não decisão.
- **Manter a paleta default do Tailwind junto com os tokens:** mais flexível, mas permite que cada tarefa puxe uma cor diferente. O reset com `initial` impede isso por construção.
- **Dark mode na v1:** descartado pelos motivos em "Claro/escuro".

## Consequências

- Classes como `bg-white`, `text-gray-*`, `bg-green-*` e `font-mono` não geram CSS. Usar `bg-surface-raised`, `text-fg-muted`, `bg-accent-*`.
- `accent-500` existe mas é restrito a UI e texto grande; revisão de UI deve recusar `text-accent-500` em corpo.
- Preflight do Tailwind 4.0 usa `--color-gray-200` como cor de borda padrão; com o reset, a base define `border-color: var(--color-line)`.
- `src/App.css` reimportava `tailwindcss`, o que reinjetava o tema default (incluindo outro `--font-sans`) por cima dos tokens. A importação duplicada foi removida; o arquivo inteiro sai em T-002.
- Duas dependências novas: `clsx` e `tailwind-merge`.
- O site faz uma requisição a `fonts.googleapis.com` / `fonts.gstatic.com`.

## Quando reabrir

- O stakeholder pedir outra fonte ou outro acento (decisão de gosto, listada para revisão).
- Lighthouse de performance abaixo de 90 em mobile por causa da fonte, ou exigência de não chamar terceiros (LGPD/privacidade): migrar para Poppins self-hosted ou fonte do sistema.
- Pedido explícito de dark mode, ou métrica mostrando parcela relevante de visitas com `prefers-color-scheme: dark`.
- Alguma seção precisar de uma segunda cor semântica (erro, sucesso) que não caiba na escala de acento: estender este ADR com tokens de status, sem abrir uma segunda cor de marca.
- Upgrade de Tailwind que mude namespaces de tema (`--text-*`, `--shadow-*`) ou o preflight.

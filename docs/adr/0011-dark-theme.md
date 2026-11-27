# 0011 — Tema escuro que segue o sistema

Status: Accepted · Data: 2026-11-26

## Contexto

Em 2026-11-26 o stakeholder pediu dark mode, seguindo o tema do sistema por padrão, com troca manual (Sistema, Claro, Escuro) no header (spec `docs/specs/2026-11-26-dark-mode-e-produtos.md`). A ADR 0001 deixou o site só claro na v1 ("Claro/escuro") e já previa que os tokens semânticos (`surface`, `fg`, `line`, `accent`) permitiriam um tema escuro trocando valores, sem renomear classes. A jornada (`data-theme="journey"`) já é escura com paleta própria (ADR 0007, ADR 0010) e não pode ser afetada.

Esta ADR cobre os tokens e a regra de seleção (T-088). O script anti-flash no `<head>` e as metas `color-scheme`/`theme-color` ficam em T-089; o botão do header, em T-091.

## Decisão

### Regra de seleção

| Estado de `<html>` | Sistema claro | Sistema escuro |
|---|---|---|
| sem `data-theme` | claro | escuro |
| `data-theme="light"` | claro | claro |
| `data-theme="dark"` | escuro | escuro |
| `data-theme="journey"` | paleta da jornada (ADR 0010) | paleta da jornada (ADR 0010) |

Implementação em `src/index.css`:

- Um `@custom-variant dark` com duas ramificações: `[data-theme="dark"]` e, dentro de `@media (prefers-color-scheme: dark)`, `:root:not([data-theme="light"], [data-theme="journey"])`. Os valores escuros são declarados uma vez só, em `:root { @variant dark { … } }` na camada `base`, então a regra de atributo e a regra de mídia não divergem. O mesmo variant passa a servir `dark:` em utilitários, se algum componente precisar, com a mesma regra dos tokens.
- A jornada fica fora por construção: nenhuma das duas ramificações casa com `data-theme="journey"`, então o bloco `[data-theme="journey"]` continua sendo a única fonte dos tokens nessa página.
- `color-scheme`: `light dark` em `:root`, `light` com `data-theme="light"`, `dark` com `data-theme="dark"`. A jornada mantém `dark`. Scrollbar e controles nativos seguem o tema.

### Valores escuros

Neutros tingidos para o mesmo hue teal (~170°) do tema claro. No escuro, `surface-raised` é mais claro que `surface` (elevação por luminância) e `surface-sunken` é mais escuro.

| Token | Claro (ADR 0001) | Escuro |
|---|---|---|
| `surface` | #f8faf9 | #0c1615 |
| `surface-raised` | #ffffff | #132120 |
| `surface-sunken` | #eef3f2 | #08100f |
| `fg` | #122220 | #e4eeec |
| `fg-muted` | #475a56 | #a1b3af |
| `on-accent` | #ffffff | #052725 |
| `line` | #d5dfdc | #24332f |
| `line-strong` | #7c8f8b | #667a75 |

A escala de acento continua teal e é espelhada, como a jornada faz com o azul-violeta: `accent-50` é o passo mais escuro. Assim os pares dos componentes (`bg-accent-50` + `text-accent-800`, `bg-accent-700` + `text-on-accent`, `active:bg-accent-100` + `text-accent-900`) continuam sendo pares de contraste alto.

| Passo | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Escuro | #0a2725 | #0e3734 | #13514b | #176a61 | #1c857a | #26a091 | #3dbcab | #62d4c2 | #93e6d8 | #c0f2e8 | #e8fbf7 |

### Sombras

O Tailwind 4 copia o valor de `--shadow-*` para dentro do utilitário (`.shadow-sm { --tw-shadow: … }`), então sobrescrever `--shadow-sm` no tema escuro não chegaria ao `.shadow-sm`. Os tokens de sombra continuam em `@theme` com os mesmos offsets e alphas da ADR 0001, mas a cor vem de duas variáveis lidas em tempo de execução: `rgb(var(--shadow-tint) / calc(α * var(--shadow-strength)))`.

| Tema | `--shadow-tint` | `--shadow-strength` | Alphas resultantes |
|---|---|---|---|
| Claro | `18 34 32` (o `fg` claro) | 1 | 0.05–0.14 (iguais à ADR 0001) |
| Escuro | `2 9 8` (teal quase preto, não #000) | 4 | 0.20–0.56 |

Sem preto puro e sem glow. Vale para `shadow-xs…xl`, `inset-shadow-sm` e `drop-shadow-md/lg`. No escuro a sombra só reforça a borda e a diferença de luminância entre `surface` e `surface-raised`.

### Adendo 2026-11-26 (T-089, tema antes do primeiro paint)

- `src/lib/theme.ts` é a fonte da chave (`matheuscfdev.theme`), dos valores (`system`, `light`, `dark`), do parser (`parseThemePreference`, valor ausente ou inválido vira `system`), das superfícies usadas no `theme-color` e do script inline. Leitura e escrita no `localStorage` ficam em `src/lib/theme-storage.ts`, separado porque o `vite.config.ts` importa `theme.ts` sob um tsconfig sem tipos DOM. "Sistema" apaga a chave em vez de gravar `system`.
- O plugin `themePlugin` do `vite.config.ts` injeta logo depois do `<meta charset>` de cada entrada HTML, antes de qualquer stylesheet: `<meta name="color-scheme" content="light dark">`, dois `theme-color` com `media` (claro #f8faf9, escuro #0c1615) e o script. O script só grava `light` ou `dark` em `data-theme` e envolve o `localStorage` em `try/catch`; com `system` ou erro, `data-theme` fica ausente e o CSS segue o sistema.
- Página cujo `<html>` já declara `data-theme` fica fora (hoje só a jornada, `data-theme="journey"`, que mantém `color-scheme` dark e `theme-color` #05060f no próprio HTML). Uma página nova entra sozinha; uma entrada sem `<meta charset="UTF-8" />` quebra o build.
- O fallback sem JS da raiz (`index.html`) ganhou o bloco escuro sob `@media (prefers-color-scheme: dark)`, com os valores desta ADR. Sem JS não existe escolha salva, então ele segue só o sistema. Isso substitui a última consequência abaixo.

## Contraste no escuro (WCAG 2.1 AA)

Calculado pela fórmula de luminância relativa da WCAG 2.1, nos papéis da ADR 0001.

| Primeiro plano | `surface` #0c1615 | `surface-raised` #132120 | `surface-sunken` #08100f | Mínimo | Resultado |
|---|---|---|---|---|---|
| `fg` #e4eeec | 15.54 | 14.01 | 16.26 | 4.5 | Passa |
| `fg-muted` #a1b3af | 8.40 | 7.57 | 8.78 | 4.5 | Passa |
| `accent-900` #c0f2e8 | 14.99 | 13.51 | 15.68 | 4.5 | Passa |
| `accent-800` #93e6d8 | 12.75 | 11.49 | 13.33 | 4.5 | Passa |
| `accent-700` #62d4c2 (link) | 10.27 | 9.25 | 10.74 | 4.5 | Passa |
| `accent-600` #3dbcab (anel de foco, marcador) | 7.87 | 7.09 | 8.23 | 3 (UI) | Passa |
| `accent-500` #26a091 (UI, texto grande) | 5.71 | 5.15 | 5.97 | 3 | Passa |
| `line-strong` #667a75 (contorno de controle) | 4.04 | 3.64 | 4.22 | 3 | Passa |

| Combinação | Razão | Mínimo | Resultado |
|---|---|---|---|
| `on-accent` sobre `accent-600` (404, skip link) | 6.79 | 4.5 | Passa |
| `on-accent` sobre `accent-700` (botão primário) | 8.85 | 4.5 | Passa |
| `on-accent` sobre `accent-800` (hover) | 11.00 | 4.5 | Passa |
| `on-accent` sobre `accent-900` (`:active`) | 12.93 | 4.5 | Passa |
| `accent-800` sobre `accent-50` (badge) | 10.94 | 4.5 | Passa |
| `accent-800` sobre `accent-100` (badge) | 9.01 | 4.5 | Passa |
| `accent-700` sobre `accent-50` / `accent-100` (hover de botão secundário) | 8.81 / 7.26 | 4.5 | Passa |
| `accent-900` sobre `accent-100` (item de nav ativo) | 10.59 | 4.5 | Passa |
| `fg` sobre `accent-200` (seleção de texto) | 7.69 | 4.5 | Passa |
| `accent-600` (foco) sobre `accent-50` / `accent-100` | 6.75 / 5.56 | 3 | Passa |
| `accent-900` (barra) sobre `line-strong` (trilho), progresso dos livros | 3.71 | 3 | Passa |

O anel de foco (`accent-600`, `outline 2px` + `offset 2px`) fica ≥ 5.56:1 sobre todas as superfícies e fundos de acento usados atrás de elementos focáveis. `line` (#24332f) é decorativo, como no claro.

axe-core 4.10.2 (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) em Chrome headless, build de produção, `/en/`, `/pt/` e `/404.html`: zero violações com `data-theme="dark"`, `data-theme="light"` e sem atributo, com o sistema emulado em claro e em escuro. A jornada (`/en/journey/`, `/pt/jornada/`) com o sistema em escuro mantém `#05060f` e `accent-600` #8a90f4 da ADR 0010.

## Relação com a ADR 0001

Esta ADR substitui a seção "Claro/escuro" da ADR 0001 ("Só tema claro na v1"). A ADR 0001 é append-only e não é reescrita; o resto dela (fonte, acento único teal, papéis de token, raio, sombras tingidas, movimento, `cn()`) continua valendo nos dois temas.

## Alternativas consideradas

- **`light-dark()` nos tokens:** uma declaração por token e amarrada direto ao `color-scheme`. Descartado porque exige Safari 17.5+ e, em navegador sem suporte, a propriedade inteira fica inválida e o site perde todas as cores; o Lightning CSS ainda reescreveria a função com um polyfill próprio.
- **Duplicar o bloco escuro** (uma cópia em `:root[data-theme="dark"]`, outra dentro do `@media`): CSS puro, mas duas listas de 21 valores que precisam ficar iguais à mão. O `@custom-variant` gera as duas regras a partir de uma fonte só.
- **Variant `dark` padrão do Tailwind (só `@media`):** não respeita a escolha manual "Claro" com o sistema em escuro.
- **Escala de acento não espelhada (mesmos tons, só neutros escuros):** `accent-700` #11645d sobre #0c1615 fica abaixo de 3:1, e todo par `bg-accent-50` + `text-accent-800` dos componentes teria que mudar de classe.
- **Sombras sem mudança no escuro:** o tint claro com α ≤ 0.14 some sobre fundo escuro; os cards dependeriam só da borda.

## Consequências

- Nenhuma classe muda. Componentes que usam só tokens semânticos funcionam nos dois temas sem `dark:`.
- `dark:` passa a significar a regra desta ADR, não só `prefers-color-scheme`. Usar com parcimônia: o caminho padrão continua sendo token.
- Toda cor nova precisa de valor claro e escuro, e entrar nas duas tabelas de contraste (ADR 0001 e esta).
- A matriz de revisão de UI dobra: telas novas são conferidas nos dois temas.
- Sombra nova em `@theme` deve usar `--shadow-tint` e `--shadow-strength`, senão fica com cor fixa no escuro.
- Sem o script de T-089, quem escolher "Claro" ou "Escuro" manualmente veria um flash do tema do sistema no carregamento; quem segue o sistema já recebe o tema certo só pelo CSS.
- O fallback sem JS da raiz (`index.html`) ainda só tem valores claros; o espelhamento escuro entra em T-089.

## Quando reabrir

- O stakeholder pedir outros tons de fundo ou de acento no escuro (decisão de gosto, listada para revisão).
- Uma cor nova (status, gráfico) não couber nas duas escalas com AA nos dois temas.
- O suporte a `light-dark()` cobrir o público do site (Safari < 17.5 sem relevância nas métricas): avaliar trocar o `@custom-variant` por `light-dark()` nos tokens.
- Upgrade do Tailwind que mude a semântica de `@custom-variant`/`@slot` ou deixe de copiar o valor das sombras para o utilitário.
- A jornada deixar de ser sempre escura, ou outra página ganhar `data-theme` próprio: a exclusão no seletor precisa incluir esse valor.

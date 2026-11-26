# 0010 — Paleta azul-violeta de espaço profundo na jornada

Status: Accepted · Data: 2026-11-26

## Contexto

A ADR 0007 definiu o tema da jornada com a escala teal da ADR 0001 espelhada e um espaço `#060e12` com nebulosa teal. Com a jornada publicada, o stakeholder disse que "as cores verdes não lembram muito espaço" e enviou como referência visual um globo estelar three.js. A spec `docs/specs/2026-11-25-jornada-ai-engineer.md`, seção "Revisão 2", item 2, fixa a direção: azul-marinho quase preto, nebulosa índigo/violeta/azul com magenta sutil, estrelas branco-azuladas, núcleo quente no mundo atual, selo dourado nos concluídos e cinza-azulado escuro nos bloqueados.

O acento teal do resto do site (ADR 0001) não muda. Dentro da jornada o teal sai por inteiro, inclusive o acento espelhado, porque é exatamente o verde que o stakeholder rejeitou.

## Decisão

### Escopo

Só mudam `--color-space` (em `@theme`, usado pelo tema da jornada e pelo túnel) e os valores dentro de `[data-theme="journey"]` em `src/index.css`. A escala `--color-accent-*` da raiz e todos os outros tokens da ADR 0001 ficam intactos. O mecanismo da ADR 0007 continua o mesmo: remapeamento semântico no escopo, tokens `--journey-*` só no escopo e utilitários via `@theme inline`.

### Remapeamento semântico

| Token | Antes (ADR 0007) | Agora | Papel |
|---|---|---|---|
| `--color-space` / `surface` | `#060e12` | `#05060f` | Espaço azul-marinho quase preto |
| `surface-raised` | `#0c1a1f` | `#0d1024` | Header, blocos do HUD, cards |
| `surface-sunken` | `#040a0d` | `#03040a` | Footer, faixas |
| `fg` | `#e8f3f1` | `#eef1ff` | Texto principal, branco azulado |
| `fg-muted` | `#9fb5b1` | `#a3abcf` | Texto secundário |
| `on-accent` | `#052725` | `#11143d` | Texto sobre botão de acento |
| `line` | `#1c2f33` | `#1c2140` | Divisor decorativo |
| `line-strong` | `#5d7a78` | `#5f6894` | Contorno de controle |

### Acento espelhado (só na jornada)

Escala azul-violeta própria da jornada, com o mesmo espelhamento da ADR 0007: `50` é o tom mais escuro e `950` o mais claro, então os pares claro/escuro dos componentes compartilhados continuam funcionando. `accent-50` é o índigo da spec.

| Passo | Antes | Agora |
|---|---|---|
| 50 | `#052725` | `#1b1f5c` |
| 100 | `#14423e` | `#272a6e` |
| 200 | `#13504b` | `#353386` |
| 300 | `#11645d` | `#463f9f` |
| 400 | `#0f7c72` | `#5a52c4` |
| 500 | `#159a8c` | `#6f6fe0` |
| 600 (anel de foco) | `#2db9a8` | `#8a90f4` |
| 700 (link) | `#5dd5c3` | `#a3b1fb` |
| 800 | `#98eadb` | `#c3cdff` |
| 900 | `#cbf5ec` | `#dfe5ff` |
| 950 | `#effcf9` | `#f0f2ff` |

### Estados da jornada (HUD e lista, seguros para texto)

| Token | Antes | Agora | Uso |
|---|---|---|---|
| `--journey-completed` | `#5dd5c3` | `#94acff` | Mundo concluído, trilha percorrida na lista |
| `--journey-current` | `#cbf5ec` | `#e6ecff` | Mundo atual: o tom mais claro, com pulso |
| `--journey-locked` | `#6f8582` | `#7d86ab` | Texto e selo "bloqueado", cadeado |
| `--journey-glow-sm/md/lg` | Halo `rgb(93 213 195)` + núcleo `rgb(203 245 236)` | Halo `rgb(138 125 255)` (`--journey-halo`) + núcleo `rgb(230 236 255)` (`--journey-current`) | Mesmos tamanhos e alfas |
| `--journey-drop-glow` | `0 0 6px rgb(93 213 195 / 0.6)` | `0 0 6px rgb(148 172 255 / 0.6)` | Ícones SVG |
| `--journey-nebula` | `rgb(21 154 140 / 0.22)` + `rgb(45 185 168 / 0.14)` | `rgb(58 36 112 / 0.32)` (violeta) + `rgb(18 48 107 / 0.28)` (azul) | Fundo do fallback 2D |

A distinção entre estados continua por luminância (`current` > `completed` > `locked`), texto e ícone; cor nunca é o único sinal. O mundo atual no HUD segue azul-branco, não âmbar: o núcleo quente é luz da cena 3D, não um segundo acento de interface.

### Tokens novos da cena 3D (não usar como texto)

Lidos por `readPalette` em `src/lib/journey-scene/scene.ts` e expostos em `ScenePalette` (`src/lib/journey-scene/types.ts`). O código 3D não tem hex de paleta: se um token faltar, a cena não monta e a página fica no mapa HTML.

| Token | Valor | Campo em `ScenePalette` | Uso previsto |
|---|---|---|---|
| `--journey-star` | `#f2f5ff` | `star` | Estrelas brancas, luzes da cena, fluxo da trilha |
| `--journey-star-blue` | `#bcd0ff` | `starBlue` | Estrelas branco-azuladas |
| `--journey-nebula-indigo` | `#1b1f5c` | `nebulaIndigo` | Parada da nebulosa |
| `--journey-nebula-violet` | `#3a2470` | `nebulaViolet` | Parada da nebulosa |
| `--journey-nebula-blue` | `#12306b` | `nebulaBlue` | Parada da nebulosa |
| `--journey-nebula-magenta` | `#7a2d7a` | `nebulaMagenta` | Toque sutil da nebulosa |
| `--journey-core` | `#fff4e6` | `core` | Centro branco quente do mundo atual |
| `--journey-core-amber` | `#ffd9a0` | `coreAmber` | Meio do gradiente do núcleo |
| `--journey-core-ember` | `#ff9a5c` | `coreEmber` | Borda laranja suave do núcleo |
| `--journey-halo` | `#8a7dff` | `halo` | Halo azul-violeta do mundo atual |
| `--journey-seal` | `#e8c27a` | `seal` | Anel ou selo dourado dos concluídos |
| `--journey-locked-body` | `#2a3045` | `lockedBody` | Corpo do planeta bloqueado |
| `--journey-trail` | `#cfdcff` | `trail` | Luz azul-branca da trilha |

`ScenePalette` mantém `space`, `current`, `completed`, `locked` e `nebula` (agora `accent-500` da escala da jornada, `#6f6fe0`), que os layers atuais usam. As tarefas de cena (T-083 a T-085) trocam esses usos pelos tokens novos. `--journey-locked-body` é separado de `--journey-locked` porque `#2a3045` mede 1.55:1 no espaço: serve para um corpo escuro com névoa, nunca para texto ou ícone.

## Contraste (WCAG 2.1 AA)

Luminância relativa da WCAG 2.1, valores reproduzíveis a partir das tabelas acima. "Pior caso do HUD" é o bloco `bg-surface-raised/90` (ADR 0007, adendo do T-074) sobre um pixel branco puro da cena: `#0d1024` a 90% sobre `#ffffff` = `#25283a`. "Pico da nebulosa" é o ponto mais claro do `--journey-nebula` sobre o espaço: violeta `#16102e`, azul `#091229`, e as duas sobrepostas `#15193f`. A coluna da nebulosa usa o pior dos três, sempre o sobreposto.

### Texto (mínimo 4.5:1)

| Primeiro plano | `surface` #05060f | `surface-raised` #0d1024 | `surface-sunken` #03040a | Pico da nebulosa (pior) | Pior caso do HUD #25283a | Resultado |
|---|---|---|---|---|---|---|
| `fg` #eef1ff | 17.95 | 16.71 | 18.20 | 15.02 | 12.93 | Passa |
| `fg-muted` #a3abcf | 8.93 | 8.31 | 9.05 | 7.47 | 6.43 | Passa |
| `accent-700` #a3b1fb (link) | 9.85 | 9.17 | 9.98 | 8.24 | 7.09 | Passa |
| `accent-800` #c3cdff | 12.99 | 12.09 | 13.16 | 10.86 | 9.35 | Passa |
| `accent-600` #8a90f4 | 7.10 | 6.61 | 7.19 | 5.94 | 5.11 | Passa |
| `journey-current` #e6ecff | 17.13 | 15.95 | 17.36 | 14.33 | 12.34 | Passa |
| `journey-completed` #94acff | 9.24 | 8.60 | 9.36 | 7.73 | 6.65 | Passa |
| `journey-locked` #7d86ab | 5.65 | 5.26 | 5.72 | 4.72 | 4.07 | Passa nas superfícies opacas; não vai sobre o HUD (lá o texto "bloqueado" usa `fg-muted`, regra do T-071/T-074) |

| Combinação | Razão | Mínimo | Resultado |
|---|---|---|---|
| `on-accent` #11143d sobre `accent-600` #8a90f4 (skip link) | 6.19 | 4.5 | Passa |
| `on-accent` sobre `accent-700` #a3b1fb | 8.60 | 4.5 | Passa |
| `on-accent` sobre `accent-800` / `accent-900` (hover, `:active`) | 11.33 / 14.09 | 4.5 | Passa |
| `accent-800` sobre `accent-50` #1b1f5c (hover do nav, badge) | 9.66 | 4.5 | Passa |
| `accent-800` sobre `accent-100` #272a6e | 8.22 | 4.5 | Passa |
| `accent-900` #dfe5ff sobre `accent-100` (`aria-current`, `:active`) | 10.22 | 4.5 | Passa |
| `fg` sobre `accent-200` #353386 (seleção de texto) | 9.48 | 4.5 | Passa |
| `fg-muted` sobre `accent-50` | 6.64 | 4.5 | Passa |
| `space` #05060f sobre `journey-current` (pausa pressionada) | 17.13 | 4.5 | Passa |

### Controles e foco (mínimo 3:1)

| Cor | `surface` #05060f | `surface-raised` #0d1024 | `surface-sunken` #03040a | Pico da nebulosa (pior) | Resultado |
|---|---|---|---|---|---|
| `line-strong` #5f6894 | 3.75 | 3.49 | 3.80 | 3.13 | Passa |
| Anel de foco `accent-600` #8a90f4 | 7.10 | 6.61 | 7.19 | 5.94 | Passa (5.11 no pior caso do HUD) |

`line` (#1c2140) é decorativo e segue fora da regra de 3:1. `accent-500` (#6f6fe0) mede 4.50 no `surface-raised` e não é usado como texto na jornada; se passar a ser, a tabela precisa incluí-lo com folga.

## Alternativas consideradas

- **Manter o teal espelhado no acento e trocar só fundo e nebulosa:** links, foco e badges continuariam verdes num espaço azul, justamente o que o stakeholder rejeitou.
- **Mundo atual âmbar também no HUD:** casaria com o núcleo quente da cena, mas cria um segundo acento de interface, que a ADR 0007 já recusou. O âmbar fica na luz 3D; a interface tem um acento só, azul-violeta.
- **Escala índigo padrão do Tailwind:** perto do que se quer, mas o `@theme` zera `--color-*` (ADR 0001) e a escala própria parte do índigo `#1b1f5c` da spec, com os passos claros puxados para o azul-branco das estrelas.
- **Espaço preto puro (`#000000`):** máximo contraste, mas sem o tom azul-marinho que a referência e a spec pedem, e as sombras e a névoa perdem profundidade.
- **Um token só para "bloqueado" (`#2a3045`):** reprova como texto (1.55:1). Separar corpo 3D (`locked-body`) de estado de interface (`locked`) mantém os dois papéis corretos.

## Consequências

- A ADR 0007 continua valendo para escopo, mecanismo e regras de glow; as tabelas de valores e contraste dela ficam superadas por esta.
- `--color-space` muda também para o túnel de dimensão e para `text-space`; a T-082 escreve o mesmo hex inline nas entradas HTML da jornada.
- O token `--journey-locked` ficou mais claro que o teal antigo no espaço (5.65 contra 4.96), então o selo "bloqueado" ganha legibilidade.
- Os layers 3D atuais passam a receber azuis (estrelas, planetas) sem mudança de código; os tokens novos ficam disponíveis para T-083 (estrelas), T-084 (nebulosa) e T-085 (núcleo quente).
- Nenhuma dependência nova.

## Quando reabrir

- O stakeholder pedir outro tom de espaço (mais violeta, mais azul, mais escuro) ou quiser o mundo atual âmbar também na interface: decisão de gosto.
- O axe ou o revisor de UI apontar contraste abaixo de AA sobre a cena 3D nova (nebulosa WebGL ou núcleo quente atrás de um bloco do HUD): refazer a coluna "Pior caso do HUD".
- `accent-500` ou `journey-locked` passarem a ser usados como texto sobre o HUD ou sobre a nebulosa.
- A ADR 0001 mudar a escala da raiz ou ganhar dark mode do site inteiro: decidir se esta paleta vira a base do tema escuro.

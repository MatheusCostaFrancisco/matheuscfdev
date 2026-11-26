# 0009 — Cena 3D da jornada com three.js, orçamento e regras de fallback

Status: Accepted · Data: 2026-11-25

## Contexto

A spec `docs/specs/2026-11-25-jornada-ai-engineer.md` (Goals 4, 7 e 8) pede um espaço 3D na página da jornada: fundo estelar com profundidade, planetas, trilha de luz e câmera com parallax. Ela também exige que a home não fique mais pesada (no máximo 2 kB gzip a mais no chunk principal), que o 3D entre em chunk separado só na jornada e que o mapa HTML da T-060 continue sendo o conteúdo, legível sem o canvas.

Todas as páginas usam a mesma entrada (`src/main.tsx` → `App`), então a seção da jornada está no chunk principal que a home baixa. Qualquer import estático da lib 3D a levaria para a home.

## Decisão

### Dependência

`three` (0.181) em `dependencies` e `@types/three` em `devDependencies`. Só `src/lib/journey-scene/scene.ts`, `starfield.ts` e os próximos módulos de cena importam `three`, e eles só são alcançados por `import("../lib/journey-scene/scene")` em `src/components/JourneyScene.tsx`. `types.ts` usa `import type`, que some no build.

| Módulo | Chunk | Pode importar `three` |
|---|---|---|
| `src/components/JourneyScene.tsx` | principal | Não |
| `src/lib/journey-scene/gate.ts` | principal | Não |
| `src/lib/journey-scene/types.ts` | nenhum (só tipos) | Só `import type` |
| `src/lib/journey-scene/scene.ts`, `starfield.ts` e camadas futuras | `scene-*.js` | Sim |

### Orçamento

Medido com `yarn build` (gzip informado pelo Vite) antes e depois desta mudança:

| Arquivo | Antes | Depois | Diferença |
|---|---|---|---|
| `main-*.js` | 290.12 kB · 91.58 kB gzip | 292.43 kB · 92.54 kB gzip | +0.96 kB gzip |
| `index-*.css` | 32.71 kB · 6.50 kB gzip | 32.96 kB · 6.56 kB gzip | +0.06 kB gzip |
| `scene-*.js` | — | 495.11 kB · 127.49 kB gzip | chunk novo, só na jornada |

Limite: o chunk principal cresce no máximo **2 kB gzip** em relação a 91.58 kB, somando esta tarefa e as próximas da jornada (T-064 a T-067). Sobra 1.04 kB. O chunk `scene-*.js` não tem limite rígido, mas nenhum HTML faz `modulepreload` dele: só a jornada o pede, e só depois do gate.

### Gate de capacidade

A cena só carrega quando **todas** as condições valem, checadas nesta ordem (a mais cara por último):

| Condição | Como | Sem a condição |
|---|---|---|
| Sem `prefers-reduced-motion: reduce` | `matchMedia` | Só o mapa HTML |
| Sem Save-Data | `navigator.connection.saveData !== true` | Só o mapa HTML |
| `navigator.deviceMemory >= 4` quando definido | Ausente (Firefox, Safari) não bloqueia | Só o mapa HTML |
| WebGL2 | `getContext("webgl2")` num canvas descartável, contexto liberado em seguida | Só o mapa HTML |

Se o usuário ligar reduced motion com a página aberta, a cena é desmontada; se desligar, ela volta.

### Fallback

O mapa HTML não é um fallback que aparece no lugar do 3D: ele é sempre o conteúdo. A cena só acrescenta um canvas decorativo atrás dele. Por isso "cair no fallback" é não montar o canvas, e nenhum caso mostra mensagem de erro:

- gate reprovado: o `import()` nem acontece;
- chunk falha ao carregar (rede, deploy trocou o hash): o `catch` ignora;
- `WebGLRenderer` falha ao criar o contexto: mesma rejeição, mesmo `catch`;
- contexto WebGL perdido durante o uso: a cena se desmonta sozinha.

### Ciclo de vida

| Regra | Implementação |
|---|---|
| Canvas decorativo e atrás do HUD | Host `aria-hidden="true"`, `fixed inset-0 -z-10`, `pointer-events-none`, renderizado por portal em `<body>` (o reveal de scroll aplica `transform` em `main > section`, o que prenderia o `fixed`) |
| DPR | `min(devicePixelRatio, 2)`, reaplicado no `resize` |
| Aba oculta | `visibilitychange` cancela o `requestAnimationFrame`; volta ao ficar visível |
| Desmontagem e `pagehide` | Para o loop, chama `dispose()` de cada camada (geometrias, materiais, texturas), `renderer.dispose()`, `forceContextLoss()` e remove o canvas |
| bfcache | `pageshow` com `persisted` monta a cena de novo |
| Cores | Lidas dos tokens do tema da jornada (`--journey-*`, `--color-fg`, `--color-accent-500`, ADR 0007); sem o tema, a cena não monta |
| Contraste | Nebulosa com opacidade de pico 0.22 em `accent-500`, o mesmo teto da nebulosa CSS usada no cálculo de contraste da ADR 0007 |

Cada parte da cena é uma `SceneLayer` (`object`, `update`, `dispose`). Planetas e trilha (T-064) entram como novas camadas em `scene.ts`, cada uma dona do que cria.

### Revisão do orçamento (T-067, túnel de luz)

O chunk principal já estava em 93.58 kB gzip antes da T-067, ou seja, no limite. O túnel (`src/lib/warp.ts`, entrada própria sem imports) soma o que cada página baixa além do `main-*.js`:

| Arquivo | Antes | Depois | Diferença |
|---|---|---|---|
| `main-*.js` | 93.58 kB gzip | 93.30 kB gzip | -0.28 kB (o polyfill de modulepreload passou para o chunk do túnel) |
| `warp-*.js` | — | 1.04 kB gzip | chunk novo, carregado por toda página |
| Total de JS de entrada | 93.58 kB | 94.34 kB | **+0.76 kB, 0.76 kB acima do limite** |

A tentativa anterior importava `./routes` e deslocava código compartilhado para o chunk do túnel; o total real era 94.25 kB. Agora `warp.ts` não importa nada (os caminhos da jornada entram por `define` no `vite.config.ts`), mas o limite continua estourado. Decisão pendente do stakeholder: aceitar o limite em 94.5 kB gzip ou cortar o mesmo peso do chunk principal em outra tarefa.

### Túnel de luz: sem View Transition (T-067)

O critério 1 previa View Transitions entre documentos. O opt-in `@view-transition` foi removido: toda navegação do túnel registrava `Uncaught (in promise) InvalidStateError: Transition was aborted because of invalid state. Page already revealed`, mesmo capturando `ready`, `finished` e `updateCallbackDone`, então a transição nunca tocava. O túnel já termina em `--color-space` e a entrada (`warp-arrive`) é só CSS, então a continuidade visual se mantém. Reabrir se o Chrome corrigir o aborto ou se a transição entre documentos for necessária por outro motivo.

Ativação por teclado (Enter no link) pula o túnel de propósito, para não haver atraso silencioso. O túnel cancela seus timers em `pagehide` e deixa o `body` `inert` enquanto toca.

### Adendo 2026-11-26 (T-068, bloom e limite do chunk)

O pós-processamento de bloom (`bloom.ts`: `EffectComposer`, `RenderPass`, `UnrealBloomPass`, `OutputPass`, todos de `three/examples/jsm`, sem dependência nova) entrou no chunk da cena, que foi a 544.73 kB · 140.92 kB gzip. O bloom é seletivo: só planetas acesos, o planeta atual, anéis, partículas orbitais e a trilha acesa ficam na camada de bloom. Pior caso de contraste: um pixel do canvas saturado em branco sob o scrim de 70% (ADR 0007) deixava o `text-fg` da página em cerca de 6.5:1 (superado: ver adendo da T-077, sem scrim e sem texto sobre o canvas), e todo `text-fg-muted` fica sobre cards opacos `bg-surface-raised`, então o bloom não leva o texto do HUD abaixo de 4.5:1. Na passada do bloom, malhas sem brilho são desenhadas em preto (não ocultas), para continuarem ocluindo o brilho que está atrás delas.

`build.chunkSizeWarningLimit` passou a 550 (kB, o menor valor redondo acima do chunk, com 5.27 kB de folga) em `vite.config.ts`. O aviso do Vite cobre só o chunk `scene-*.js`, que carrega apenas na página da jornada, depois do gate de capacidade; a home e as demais páginas não o baixam, então subir o limite não esconde peso dessas páginas. O chunk principal continua com o orçamento próprio acima.

### Adendo 2026-11-26 (T-072, páginas da jornada e dos livros em lazy)

`src/App.tsx` carrega `Journey` e `Books` com `React.lazy`, então `Journey.tsx`, `JourneyParts.tsx`, `WorldDialog.tsx`, `JourneyScene.tsx` e `Books.tsx` saem do `main-*.js`. Os teasers da home continuam no chunk principal, lendo `src/content`. O fallback do `Suspense` reserva a área com `min-h-[100dvh]`, e um componente irmão do conteúdo repete `scrollToHash` quando a página lazy monta, mantendo o foco por hash da T-040. `dist/en/index.html` e `dist/pt/index.html` não referenciam nem fazem modulepreload dos chunks `Journey-*` e `Books-*`.

| Medida (gzip) | Antes | Depois | Limite |
|---|---|---|---|
| `main-*.js` | 94.65 kB | 89.60 kB | |
| `warp-*.js` | 0.99 kB | 0.99 kB | |
| Total | 95.64 kB | 90.59 kB | 93.58 kB |
| `Journey-*.js` (novo) | | 6.18 kB | |
| `Books-*.js` (novo) | | 1.00 kB | |

### Adendo 2026-11-26 (T-077, efeitos do palco e recalibração do bloom)

Com o palco sem scrim (ADR 0007, último adendo), o bloom foi recalibrado, mas o texto do HUD e os rótulos dos planetas ainda ficam sobre o canvas, em painéis `bg-surface-raised/90`. Pior caso (pixel branco do canvas atrás do painel): 6.31:1 para `text-fg-muted` (14px) e 12.02:1 para `text-fg`. A garantia real é o painel a 90%: não baixar essa opacidade sem medir de novo. Valores de `bloom.ts`:

| Parâmetro | Antes | Depois |
|---|---|---|
| `BLOOM_STRENGTH` | 0.85 | 0.9 |
| `BLOOM_RADIUS` | 0.55 | 0.6 |
| `BLOOM_THRESHOLD` | 0.12 | 0.2 |

Uma primeira tentativa (1.2 / 0.75 / 0.08) estourou o mundo atual em um disco branco e lavou os bloqueados, então foi recuada. Para isso também baixaram a casca de atmosfera (opacidade 0.06 a 0.14, pulsando) e o halo do mundo atual (0.22 a 0.42). Os valores ainda não têm aprovação visual do stakeholder em aparelho real.

Na camada de bloom: planetas acesos, casca de atmosfera, anéis, partículas orbitais, halo do mundo atual, raios da estrela acesa, trilha acesa e o fluxo de luz. Efeitos em `planets.ts`: casca, anel e partículas no mundo atual; anel e selo nos concluídos; névoa (atrás do corpo) e cadeado nos bloqueados; fluxo de luz (3 pontos por trecho aceso) da primeira etapa até a atual, que só avança em `update()` e para com a cena pausada; chefe final como estrela com raios e corona plana voltada à câmera, cinza e apagada enquanto bloqueado. Fluxo de luz e mundos concluídos ainda não foram vistos no navegador (os dados reais têm 0 mundos concluídos).

Medida com `yarn build`: `scene-*.js` em **545.75 kB · 141.17 kB gzip** (antes 544.73 kB · 140.92 kB). Fica abaixo de `chunkSizeWarningLimit` (550), então o limite não muda. A medida de 495.11 kB na tabela de orçamento inicial é histórica (antes do bloom).

Adendo T-084 (esfera de nebulosa): a camada `nebula.ts` adiciona uma esfera `BackSide` com `ShaderMaterial` e ruído procedural, sem textura de imagem. `scene-*.js` foi de 548.79 kB (142.37 kB gzip) para 550.46 kB (142.85 kB gzip), acima do limite de 550, então `chunkSizeWarningLimit` subiu para 560. A linha de contraste da tabela (sprites `accent-500` com pico 0.22) foi substituída: a nebulosa da cena agora é a esfera de shader, limitada por `INTENSITY` 0.85. A nebulosa CSS (`--journey-nebula`) só aparece no fallback 2D; com o canvas pronto, o `::before` da seção faz crossfade para opacidade 0 via `:has([data-ready])`, evitando nebulosa dupla. No fallback ela cobre a largura da viewport, e o contraste do texto segue AA (cálculo da ADR 0007).

Adendo T-085 (núcleo estelar do mundo atual): o mundo atual deixou de ser um `MeshStandardMaterial` e virou um `ShaderMaterial` com ruído no vértice (ondulação animada por `update()`, parada com a cena pausada) e gradiente quente ember, âmbar e branco, a partir dos tokens do `ScenePalette`. O halo usa o token azul-violeta. Para a superfície não virar disco branco, o núcleo saiu da camada de bloom (o brilho vem do halo e da casca), o nível base do shader caiu para 0.5 (base mais o realce de hover/foco fica em 0.95, abaixo de 1.0) e o branco só aparece nos picos de calor. O bloom foi recuado:

| Parâmetro | Antes (T-077) | Depois |
|---|---|---|
| `BLOOM_STRENGTH` | 0.9 | 0.7 |
| `BLOOM_THRESHOLD` | 0.2 | 0.35 |

`BLOOM_RADIUS` segue 0.6. Medida com `yarn build`: `scene-*.js` em **552.39 kB · 143.51 kB gzip**, abaixo do limite de 560. A checagem visual em 1280x800 depende de nova medição do revisor de UI.

## Alternativas consideradas

- **Canvas 2D próprio, sem lib:** zero dependência e chunk mínimo, mas planetas iluminados, anéis, partículas e câmera em perspectiva viram um motor 3D escrito à mão.
- **WebGL cru (ou `twgl`/`ogl`):** chunk bem menor que o de three (OGL fica perto de 10 a 30 kB gzip), mas sem materiais, fog, sprites e helpers que T-064 e T-065 vão usar, e com documentação e base de exemplos muito menores.
- **`@react-three/fiber` + `drei`:** API declarativa em React, mas soma o reconciliador ao chunk da cena e uma segunda forma de pensar estado de animação. A cena não tem interação com estado React além de montar e desmontar.
- **Babylon.js ou PlayCanvas:** mais completos e bem mais pesados que three para um fundo com uma dúzia de objetos.
- **Montar o 3D por padrão e esconder o HTML:** contraria a spec (HTML é o conteúdo, canvas é decorativo) e quebraria leitor de tela e teclado.

## Consequências

- Primeira dependência de runtime pesada do site. Ela não chega à home nem à página de livros; na jornada, custa cerca de 141 kB gzip (medida da T-077) depois da primeira pintura do HTML.
- `scene-*.js` passou do aviso padrão de 500 kB do Vite desde o bloom (T-068); `build.chunkSizeWarningLimit` está em 550 com justificativa no adendo da T-077. Tratar novos avisos subindo o limite com justificativa, não dividindo o chunk sem motivo.
- Revisão de código deve recusar import estático de `three` (ou de `src/lib/journey-scene/` além de `gate.ts` e `types.ts`) fora da própria pasta. O `grep -o 'WebGLRenderer' dist/assets/main-*.js` precisa ficar vazio.
- Usuários com reduced motion, Save-Data, pouca memória ou sem WebGL2 veem a página da T-060 sem diferença nenhuma.
- Navegadores headless com WebGL por software (SwiftShader) passam no gate. Isso é intencional para o axe e o revisor de UI conseguirem ver o modo 3D; aparelho fraco é filtrado por `deviceMemory`.

## Quando reabrir

- O chunk principal passar de 93.58 kB gzip (91.58 + 2): mover mais código para o chunk da cena ou rever o orçamento com o stakeholder.
- `scene-*.js` passar de 200 kB gzip ou a jornada ficar lenta em celular médio (INP ou LCP ruins no Lighthouse): avaliar OGL ou WebGL cru.
- Relato de aparelho que trava ou esquenta com a cena: endurecer o gate (`failIfMajorPerformanceCaveat`, limite de núcleos com `hardwareConcurrency`, ou desligar em telas pequenas).
- Upgrade major de three que mude `dispose`, color management ou a API de `WebGLRenderer`, ou a migração para `WebGPURenderer`.
- Uma segunda página quiser 3D: rever se o gate e o chunk continuam presos à jornada.

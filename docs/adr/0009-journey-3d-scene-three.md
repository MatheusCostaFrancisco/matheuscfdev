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

## Alternativas consideradas

- **Canvas 2D próprio, sem lib:** zero dependência e chunk mínimo, mas planetas iluminados, anéis, partículas e câmera em perspectiva viram um motor 3D escrito à mão.
- **WebGL cru (ou `twgl`/`ogl`):** chunk bem menor que o de three (OGL fica perto de 10 a 30 kB gzip), mas sem materiais, fog, sprites e helpers que T-064 e T-065 vão usar, e com documentação e base de exemplos muito menores.
- **`@react-three/fiber` + `drei`:** API declarativa em React, mas soma o reconciliador ao chunk da cena e uma segunda forma de pensar estado de animação. A cena não tem interação com estado React além de montar e desmontar.
- **Babylon.js ou PlayCanvas:** mais completos e bem mais pesados que three para um fundo com uma dúzia de objetos.
- **Montar o 3D por padrão e esconder o HTML:** contraria a spec (HTML é o conteúdo, canvas é decorativo) e quebraria leitor de tela e teclado.

## Consequências

- Primeira dependência de runtime pesada do site. Ela não chega à home nem à página de livros; na jornada, custa cerca de 127 kB gzip depois da primeira pintura do HTML.
- `scene-*.js` está a 5 kB do aviso de 500 kB do Vite. Com T-064 o aviso deve aparecer; ele não quebra o build. Tratar subindo `build.chunkSizeWarningLimit` com justificativa, não dividindo o chunk sem motivo.
- Revisão de código deve recusar import estático de `three` (ou de `src/lib/journey-scene/` além de `gate.ts` e `types.ts`) fora da própria pasta. O `grep -o 'WebGLRenderer' dist/assets/main-*.js` precisa ficar vazio.
- Usuários com reduced motion, Save-Data, pouca memória ou sem WebGL2 veem a página da T-060 sem diferença nenhuma.
- Navegadores headless com WebGL por software (SwiftShader) passam no gate. Isso é intencional para o axe e o revisor de UI conseguirem ver o modo 3D; aparelho fraco é filtrado por `deviceMemory`.

## Quando reabrir

- O chunk principal passar de 93.58 kB gzip (91.58 + 2): mover mais código para o chunk da cena ou rever o orçamento com o stakeholder.
- `scene-*.js` passar de 200 kB gzip ou a jornada ficar lenta em celular médio (INP ou LCP ruins no Lighthouse): avaliar OGL ou WebGL cru.
- Relato de aparelho que trava ou esquenta com a cena: endurecer o gate (`failIfMajorPerformanceCaveat`, limite de núcleos com `hardwareConcurrency`, ou desligar em telas pequenas).
- Upgrade major de three que mude `dispose`, color management ou a API de `WebGLRenderer`, ou a migração para `WebGPURenderer`.
- Uma segunda página quiser 3D: rever se o gate e o chunk continuam presos à jornada.

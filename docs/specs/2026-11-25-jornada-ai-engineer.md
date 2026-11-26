---
status: Accepted
date: 2026-11-25
owner: Matheus Costa Francisco (stakeholder)
content: content/estudos-2027.md
---

# Spec — Jornada para AI Engineer (página-jogo)

A página de roadmap vira a **Jornada para AI Engineer**: um jogo em que os mundos de estudo se destravam conforme o Matheus avança. Ao clicar em Jornada, o visitante "muda de dimensão" e cai num espaço 3D com os mundos como planetas. O stakeholder pediu efeitos especiais sem economia nesta página.

## Decisões do stakeholder (2026-11-25)

| Tema | Decisão |
|---|---|
| Destino | AI Engineer (antes: Product Engineer full-stack com IA) |
| Prazos | Nenhum: sem datas, trimestres, horas por semana nem duração |
| Visual | Portal cósmico 3D: túnel de luz na transição e espaço 3D com os mundos como planetas ligados por uma trilha |
| Fases | 8 mundos + chefão final, como em `content/estudos-2027.md` |
| Progresso | Checklist por mundo; o chefão concluído destrava o próximo mundo; barra de XP por mundo |
| Nome | "Jornada para AI Engineer"; menu "Jornada" (pt-BR) e "Journey" (en) |
| Intensidade | Máxima nesta página. A diretriz "sutil" (rodada 6) continua valendo para o resto do site |

## Goals

1. **Dados:** `src/content/` ganha o modelo tipado da jornada derivado de `content/estudos-2027.md` (mundos, itens com `done`, chefão com `done` e `link` opcional, destino). O estado de cada mundo (`completed` | `current` | `locked`) e o XP (0–100) são **calculados** a partir dos checkboxes, nunca escritos à mão. Conteúdo nos dois idiomas, com os mesmos fatos.
2. **Rotas:** `/en/journey/` e `/pt/jornada/` substituem `/en/roadmap/` e `/pt/roadmap/`. As URLs antigas respondem **301** para as novas (Caddyfile). O mapa de rotas, o sitemap, o hreflang, o canonical, o nav, a 404 e o teaser da home acompanham. Atualizar a ADR 0005 por ADR nova (append-only).
3. **Transição de dimensão:** ao clicar em Jornada (nav, teaser da home, 404), a página atual é "sugada" para um túnel de luz/warp (WebGL ou canvas) por ~1,2–1,8s e a página da jornada abre já dentro do espaço. Mesma aba, página própria (cross-document View Transitions onde houver suporte; nos demais navegadores, a animação roda na saída e a página nova faz a entrada). Acesso direto pela URL mostra só a entrada.
4. **Mapa 3D:** cena com fundo estelar/nebulosa em profundidade, 8 planetas (um por mundo) e o chefão final como estrela ou buraco negro no fim, ligados por uma trilha de luz.
   - `completed`: planeta aceso, com anel e selo de conquista.
   - `current`: brilho pulsante, partículas orbitando e trilha acesa até ele.
   - `locked`: escuro, dessaturado, com cadeado e trilha apagada.
   - Câmera com parallax suave pelo mouse/giroscópio e scroll ou setas para navegar entre mundos.
5. **Painel do mundo:** clicar ou focar num planeta abre um painel (HUD estilo jogo) com nome, barra de XP, checklist (marcados e não marcados), chefão e link do entregável quando existir. No mundo bloqueado, o painel mostra "Bloqueado: derrote o chefão do Mundo N-1" e a lista de itens.
6. **HUD geral:** destino (Senior Front-End Engineer → AI Engineer), XP total, mundos concluídos ("2/8") e legenda dos estados.
7. **Acessibilidade e fallback (obrigatório, não opcional):**
   - Toda a informação existe em HTML semântico (lista ordenada de mundos com estado, XP e checklist), legível por leitor de tela e por teclado. O canvas é decorativo (`aria-hidden`) e espelha esse HTML.
   - Navegação por teclado entre mundos, com foco visível. O painel é um diálogo acessível (foco preso, Esc fecha, foco volta ao planeta).
   - `prefers-reduced-motion`: sem túnel, sem câmera animada nem pulsos; mostra o mapa estático ou a lista estilizada.
   - Sem WebGL ou em aparelho fraco (sem WebGL2, `deviceMemory` baixo ou save-data): fallback 2D estilizado com o mesmo conteúdo e estados.
   - Contraste AA em todo texto do HUD sobre a cena.
8. **Performance:** three.js (ou equivalente) carregado **só na página da jornada**, em chunk separado, sem entrar no bundle da home. DPR limitado (≤ 2), pausa do render quando a aba está oculta, `dispose` de geometrias e texturas ao sair. A home não pode ficar mais pesada.
9. **Teaser da home e nav:** o teaser mostra "Mundo atual: <nome> · XP <n>%" e leva à jornada com a transição. O nav passa a dizer Jornada/Journey.

## Non-goals

- Login, edição do progresso pelo site ou backend: o progresso muda só pelo arquivo de conteúdo e por um novo deploy.
- Som (pode virar tarefa futura, sempre desligado por padrão).
- Gamificação fora desta página (o resto do site segue sutil).
- Mostrar datas, prazos, horas ou "previsão de conclusão".

## Edge cases

- Nenhum item marcado: Mundo 0 é o atual com XP 0%; todos os outros bloqueados.
- Itens marcados num mundo bloqueado (estudou fora de ordem): os itens aparecem marcados no painel, mas o mundo continua bloqueado até o chefão anterior cair.
- Chefão marcado sem link: o mundo fica concluído; o painel mostra o entregável sem link.
- Todos os mundos concluídos: o chefão final vira `current`; com o entregável final marcado, o destino aparece como alcançado.
- Link com hash vindo de fora (`/pt/jornada/#mundo-3`): abre já focado no mundo 3, sem túnel.
- Botão voltar do navegador: volta à página anterior sem tela branca nem cena presa (tratar `pageshow`/bfcache).
- Viewport de 320px e zoom de 400%: HUD e painel continuam utilizáveis e nada fica oculto.
- Falha ao carregar o chunk 3D: o fallback 2D aparece sem erro visível.

## Critérios de pronto

- `yarn typecheck`, `yarn lint` e `yarn build` verdes.
- Estado e XP calculados por função pura, coberta por testes nos casos de borda acima (Vitest, escopo mínimo: só essa função).
- Bundle da home não cresce além de 2 kB gzip (medir antes e depois); chunk 3D separado.
- Axe sem violações em `/en/journey/` e `/pt/jornada/`, nos modos 3D e reduced motion.
- `/en/roadmap/` e `/pt/roadmap/` respondem 301 em produção.
- Revisor de UI conferiu em 375, 768 e 1280px, nos dois idiomas, com e sem reduced motion, e com o fallback 2D forçado.
- ADR registrando a dependência 3D e a troca de rotas, cada uma com "Quando reabrir".

## Revisão 1 — 3D protagonista (2026-11-26)

Decisão do stakeholder depois da primeira entrega: os revisores mostraram que a cena 3D ficou quase invisível atrás dos cards (T-071), o oposto de "não economizar". A cena passa a ser a protagonista da página. Os goals 4 a 8 continuam valendo, com estas mudanças:

1. **Palco em tela cheia.** A página abre com a cena ocupando a viewport inteira (`100dvh`, abaixo do header), sem cards por cima. É a primeira coisa que o visitante vê ao sair do túnel.
2. **HUD mínimo sobre o palco.** Só o título, De → Para, XP total, "N/8 mundos" e o botão de pausa, em cantos, com fundo translúcido que garanta AA. Nada além disso cobre a cena.
3. **Planetas grandes e nomeados.** Cada planeta tem um rótulo ("Mundo N · Nome", estado e XP) preso a ele na tela e acompanha a câmera. O rótulo é um `<button>` HTML real posicionado pela projeção 3D: é o alvo de clique, de teclado e de leitor de tela, e abre o painel do mundo (T-066). O raycast no fundo da página deixa de ser necessário.
4. **Navegação no palco.** Setas, Tab entre rótulos, roda do mouse ou arrasto e swipe no celular levam a câmera de mundo em mundo. Há indicadores de anterior/próximo. A câmera começa no mundo atual.
5. **Lista abaixo do palco.** A lista semântica de mundos (cards com checklist) fica depois do palco, como "Ver em lista", em fundo sólido, sem a cena atrás. É também o conteúdo do fallback 2D e do reduced motion.
6. **Mais efeito, não menos.** Planeta atual com atmosfera, anel e partículas; concluídos com selo; bloqueados escuros com cadeado e névoa; trilha de luz animada até o mundo atual; chefão final como estrela ou buraco negro; bloom calibrado para o palco escuro. O túnel termina "aterrissando" no mundo atual.
7. **Celular (375px).** O palco ocupa a tela, os planetas seguem um caminho vertical, o swipe troca de mundo e os rótulos não se sobrepõem.
8. **Regressão da T-072.** As seções carregadas sob demanda (jornada e livros) recuperam o fade de entrada: o reveal precisa rodar depois do Suspense.

Critérios de pronto adicionais: em 1280px e 375px o palco mostra pelo menos o planeta atual e o próximo, legíveis, sem nenhum card por cima; o revisor de UI precisa ver a cena com o painel do navegador **visível**, porque com ele oculto o Chrome pausa o render; axe sem violações no palco (rótulos) e na lista.

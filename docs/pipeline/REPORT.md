# Relatório da esteira — 2026-11-26 (rodada 2)

Deploy: https://www.matheuscfrancisco.dev.br · publicado (commit 847a797, deployment a2438345 SUCCESS)
Resumo: 4 entregues · 55 para revisão · 1 bloqueadas · 0 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-068 | `f957a56` | Bloom na cena 3D, destaque de hover e foco nos planetas, preenchimento do XP na entrada (sem animação com reduced motion). Chunk da cena em 544.88 kB (140.97 kB gzip). |
| T-070 | `6772c21` | Botão "Pausar animação" logo abaixo do título da jornada. Para partículas, parallax e pulso. Não aparece sem cena 3D nem com reduced motion. |
| T-071 | `912a6c4` | Cena 3D aparece atrás do conteúdo: planeta atual no canto superior direito, scrim a 35%, painéis a 80%. Contraste AA mantido (pior caso medido 5.68:1). |
| T-072 | `847a797` | Jornada e livros carregam sob demanda. JS de entrada da home em 90.59 kB gzip (limite 93.58). |

Fora desta rodada: T-066 foi concluída pela sessão principal em `2eafbcf` (opção a). A pendência "retomar ou fechar" saiu da lista.

## Para revisão
- [ ] **T-068** Intensidade do bloom (strength 0.85, radius 0.55, threshold 0.12 em `bloom.ts`) e do hover (+20% planeta liberado, +7% bloqueado). — Confirmar que é o visual que você quer.
- [ ] **T-068 / T-071** Cena 3D quase invisível: planetas aparecem só nas frestas entre cards ou sob o painel, e hover e foco do planeta quase não se notam. — Aceitar, ou abrir tarefa para área livre nas laterais (xl) ou anel no card.
- [ ] **T-071** Planeta atual fixo no canto superior direito durante o scroll; os cards passam por cima. Em 375 px o halo encosta no painel do título. — Confirmar em aparelho real; decidir se a cena fica mais visível ou mais apagada.
- [ ] **T-071** Título com `max-w-[65%]` e padding também no 2D e no reduced motion; no celular quebra em 3 a 4 linhas. — Manter (evita salto de layout) ou reverter só no 2D.
- [ ] **T-071** Foco no card atual dá cerca de 2.1:1 contra a borda clara do card (passa em 1.4.11 pelo painel). — Aceitar, ou `focus-visible:outline-offset-[-6px]`.
- [ ] **T-071** Estado "bloqueado" na cena usa `fg-muted` (antes `journey-locked`); diferença para "atual" ficou menor e depende do cadeado e da borda tracejada. — Conferir se a leitura está clara.
- [ ] **T-068** Preenchimento do XP repete a cada abertura do painel e a cada remontagem, não só na primeira entrada. — Desejado, ou só uma vez por visita?
- [ ] **T-068** Malhas bloqueadas com material preto no bloom: um planeta bloqueado na frente de trilha acesa não deve vazar halo. — Conferir no navegador (não foi visto).
- [ ] **T-068** Peso da cena: 544.88 kB (+13 kB gzip sobre a T-063) por causa do bloom; limite de aviso em 550 kB. — Confirmar que o peso é aceitável na página da jornada.
- [ ] **T-068 / T-071** ADR 0009 traz números da build anterior (544.73 kB, folga 5.27 kB) e frase que sugere orçamento cumprido; `vite.config.ts` repete o número antigo. — Pedir ao PO tarefa pequena de docs.
- [ ] **T-070** Estado "pausado" só muda a cor da borda; o rótulo não muda. — Escolher: ícone Pause/Play, ou fundo no estado pressionado (WCAG 1.4.1).
- [ ] **T-070** Botão de pausa fica sob o h1, antes do bloco De/Para. A escolha reseta a cada visita. — Confirmar a posição (ou canto fixo) e se a pausa deve ser lembrada por visitante (localStorage).
- [ ] **T-070** Se o contexto WebGL for perdido, o botão continua visível sem animação. Montar a cena já pausada pode deixar o canvas invisível até retomar. — Aceitar e pedir correção numa tarefa.
- [ ] **T-072** Seções de jornada e livros perderam o fade de entrada (`useReveal` roda antes do chunk lazy). Confirmado no navegador: 0 elementos com `data-reveal`. — Aceitar e registrar no ADR 0009, ou pedir tarefa para remontar o reveal após o Suspense.
- [ ] **T-072** Em rede lenta a jornada e os livros aparecem em branco abaixo do header (fallback sem skeleton, sem `aria-busy`), e o fade do warp pode já ter terminado. — Decidir: skeleton, ou aceitar (chunks de 6.18 kB e 1.00 kB gzip).
- [ ] **T-072** Orçamento do chunk principal: o PO escolheu a opção (b), carregar jornada e livros sob demanda. main + warp em 90.59 kB gzip (limite 93.58). — Confirmar. Se preferir subir o limite, escreva ao lado deste item.
- [ ] **T-072** Foco por hash e túnel de luz em `/en/journey/` e `/pt/livros/` com o carregamento lazy não foram testados no navegador. — Abrir os dois links e conferir.
- [ ] **T-063 / T-064 / T-071** Glow com pulso no mundo atual, chefão final como estrela com halo, e brilho em volta do card atual: conflito com a regra "sem glow" do design system. — Confirmar a exceção (ADR 0001 e 0007).
- [ ] **T-063 / T-064** Sem WebGL2, Save-Data, `deviceMemory` abaixo de 4 ou reduced motion, a página mostra a lista 2D. — Confirmar.
- [ ] **T-063** A nebulosa em CSS (`--journey-nebula`) soma com a nebulosa WebGL. — Manter as duas, ou deixar o CSS só como fallback?
- [ ] **T-066** Clique no planeta: foco no 320 px e 400% de zoom (setas rolam o diálogo, Fechar alcançável, header sticky sem cobrir conteúdo) e foco de volta ao card ao fechar. — Não testado no navegador.
- [ ] **T-066** O diálogo repete o card (status, XP, checklist, chefão). — Card vira resumo com o detalhe só no painel, ou a duplicação está ok?
- [ ] **T-067** Commit `b7cccbc` incluiu `404.html`, páginas da jornada, `index.css`, `vite.config.ts` e `warp.ts`, não previstos na pré-checagem. — `git show --stat b7cccbc`; se algo não for da T-067, abrir ajuste.
- [ ] **T-067** Túnel, entrada, Voltar e console em home, 404 e teaser (sem `InvalidStateError` novo). Confirmar que 1.4 s não pesa para quem revisita. — Testar no Chrome; reduzir a duração se pesar.
- [ ] **T-069** Clique no card trava a câmera 3D até a rolagem parar. — Aceitar ou pedir correção.
- [ ] **T-069** Dica de teclado só sr-only, anunciada em cada card ao receber foco. — Quer dica visível e `role` nos `li`?
- [ ] **T-069 / T-065** Setas trocam de mundo só com foco na lista; parallax de mouse com ~4 px. — Confirmar o comportamento; aumentar a amplitude?
- [ ] **Layout geral** Smoke não feito em 375, 768 e 1024 px, PT e EN: seções, teasers, depoimentos, jornada, livros, 404, scroll horizontal e `aria-label` de produto (T-030). — Só `/en/` e `/404` foram vistos em 375.
- [ ] **T-042** Header em 1280 e 1440 px (PT e EN), `/pt/#contact` e `/en/#experience` em 1093 px; a largura da nav é estimativa. — Aceitar o menu hambúrguer de 768 a 1279 px; escolher a largura do header (`max-w-7xl`) ou do conteúdo (`max-w-5xl`).
- [ ] **T-052** Celular real ou zoom 400% (320x256 e 640x360), rolando até o fim e usando `#skills`. Em 256 px o último bloco leva até 1 s. — Aceitar, ou reduzir a margem (`-8%`).
- [ ] **T-050** Movimento (16 px, 400 ms, stagger 70 ms, teto 280 ms); no primeiro paint o hero aparece desbotado. — Confirmar e decidir se o hero anima ao carregar.
- [ ] **T-041** iOS Safari: tocar em área vazia com o menu aberto deve fechá-lo. Tocar no logo também fecha. — Testar; aceitar o logo.
- [ ] **T-045** Nome do header nas páginas internas vai para `#main`. — Decidir se leva à home; conferir em 375 px com menu aberto e fechado.
- [ ] **T-040** Seção aberta por hash sem anel de foco (por desenho); clique duplo no mesmo link de hash não move o foco. — Testar Tab em `/en/#contact`; decidir se quer pista visual.
- [ ] **T-029** Scroll inicial de `/en/#contact` é sempre instantâneo. — Quer suave para quem não pediu redução de movimento?
- [ ] **T-023** Botão "Menu" nos dois idiomas. — Confirmar "Menu" em pt-BR e o estilo do drawer.
- [ ] **T-022** Contato em 375 px: e-mail e URL do LinkedIn quebram sem estourar. — Confirmar; quer ícones Lucide ao lado de cada canal?
- [ ] **T-031** WoodFlow (8 bullets) deixa ElevaTech e Manda Aí com 700 a 850 px de card vazio em 1024+; cards de Produtos com ~1600 px. — Escolher: (a) 3 colunas só em xl, último card em linha inteira; (b) alturas desiguais com `items-start`; (c) resumir o WoodFlow.
- [ ] **T-034** Competências com 8 cards: em 375 px a seção ocupa ~2,5 telas. — Compactar, fundir "IA aplicada" (2 itens) em "Práticas", ou ampliar o `cv.md`?
- [ ] **T-055** Títulos mistos: "Senior Mobile Developer & Tech Lead" ficou `en`, e o título de Gabriel Vicente ficou `en` em `/en/`; `lang` no `<progress>` para "70%". — Regra de maioria ou dividir em segmentos; testar com leitor de tela.
- [ ] **T-046 / T-042** Teaser de livros mostra o de maior progresso (Código Limpo, 70%) sem título visível; Livros e Jornada aparecem duas vezes na home (nav e teasers). — Confirmar.
- [ ] **T-049 / T-048** Seis depoimentos (~5000 px no celular) entre Experience e Products. — Decidir posição (ou antes de Contato), se mostram todos, resumidos ou em `<details>`; texto do link em pt.
- [ ] **T-048** Traduções en dos 6 depoimentos (ex.: "absurda" virou "outstanding"), marcadas "Translated from Portuguese"; quebras simples do depoimento da Áiska Hacine. — Revisar em `src/content/testimonials.ts`.
- [ ] **T-027 / T-039** Barra de progresso dos livros passa 3:1 mas ficou mais pesada; Safari e Firefox não testados (inclui `-moz` da barra de XP da T-068). "A Maneira Rápida e Fácil de Falar com Eficácia" segue sem barra. — Confirmar o visual; acrescentar percentual em `livros.md` ou aceitar.
- [ ] **T-047 / T-013** 404: texto em en e pt-BR; título só "404"; os dois grupos de links não mostram o idioma; "Roadmap" repete o visual. — Quer o nome na página? Legenda ("English" / "Português (Brasil)") ou layout compacto?
- [ ] **T-030** pt-BR: "Stack do Manda Aí" (masculino) ou "Stack: Manda Aí"? Produtos tratados como empresa pedem "da" (ElevaTech). — Escolher.
- [ ] **T-033** Localização: pt "Piracicaba, SP · Remoto" (sem Brasil), en "Piracicaba, SP, Brazil · Remote"; formação com dois MBAs seguidos (FIAP e IGTI). — Assimetria é desejada? A leitura está boa?
- [ ] **T-035 / T-036** Página raiz `/` tem hreflang e og:image, mas nenhum canonical; meta description e og:description terminam cortadas. — Quer canonical na raiz e o mesmo texto nos dois idiomas?
- [ ] **T-036** Dois números na primeira dobra: "8 anos" (desde jul/2018) e "mais de 7 anos" (desde nov/2019). Mudam sozinhos em jul e nov, sem commit (data do visitante na página, do build na meta). — Confirmar; aceitar ou fixar em `career.ts`.
- [ ] **T-032** ADR ficou `docs/adr/0004-self-hosted-font.md`; o critério pedia 0003, já usado. — Aceitar o 0004?
- [ ] **T-056** Segundo bullet da ElevaTech (ESALQ/USP) em `/en/` e `/pt/`; o site não foi aberto na tarefa. — Conferir.
- [ ] **T-057** Traduções en dos 47 itens e 9 chefões em `src/content/journey.ts` (fonte só pt-BR). Âncoras `#world-N` / `#mundo-N` (`final-boss` / `chefao-final`). — Revisar; confirmar âncoras ou usar o mesmo id nos dois idiomas.
- [ ] **T-058** O checkbox do chefão conta para o XP: mundo só com o chefão marcado fica concluído com XP abaixo de 100; com tudo menos o chefão final, ~96%. — Aceitar, ou contar só os itens de estudo.
- [ ] **T-059** Paleta da jornada (fundo `#060e12`, nebulosa teal, texto `#e8f3f1`) é exceção à ADR 0001, só nessa página. Sombras do menu mobile e do skip link quase invisíveis. — Confirmar o tom ou pedir outro.
- [ ] **T-060** Chefão bloqueado repete a regra ("derrote o chefão do Mundo 7" e "Destrava quando os 8 mundos estão concluídos"); pílulas de status com borda parecem botão; numeração de 0 a 7. — Manter as duas frases? Tirar a borda? Confirmar a numeração.
- [ ] **T-061** Teaser da home: "Mundo atual: <mundo> · XP 0%", fallback "Jornada concluída: AI Engineer". — Confirmar rótulos, se 0% aparece e o separador em 375 px em `/pt/`.

## Pendências do stakeholder
- [ ] **Redirect 301 sem www** — no Cloudflare, Rules > Redirect Rules: `matheuscfrancisco.dev.br/*` para `https://www.matheuscfrancisco.dev.br/$1`, com 301. — Ou me peça para criar via MCP (exige `CLOUDFLARE_API_TOKEN` no ambiente; hoje não está).
- [ ] **Foto de perfil nova** — substituir `content/assets/profile.jpg`. — Libera a T-014.
- [ ] **Teste de preview** — conferir que `/assets/profile-*.jpg` responde 200 e testar o link no LinkedIn Post Inspector e no Facebook Sharing Debugger.
- [ ] **Search Console** — enviar `https://www.matheuscfrancisco.dev.br/sitemap.xml`. — Antes, decidir se quer `<lastmod>` no sitemap (o build não tem data confiável por página).
- [ ] **Cache de `/fonts/` em produção** — `curl -I https://www.matheuscfrancisco.dev.br/fonts/poppins-latin-400-normal.woff2` responde `max-age=14400`; o esperado é `max-age=31536000, immutable`. — Repetir em algumas horas. Se persistir, checar a regra de cache no Cloudflare para `/fonts/*` (pode exigir reabrir ADR 0006).
- [ ] **Stash** — `stash@{0}` = `esteira/2026-11-24/interrompida/T-037`. — Conferir com `git stash show -p stash@{0}`; descartar com `git stash drop` se não servir.
- [ ] **Axe-core e reduced motion real** em `/en/journey/` e `/pt/jornada/`, no modo 3D e no reduzido, num navegador com WebGL2 (reduced motion pelo OS ou em DevTools > Rendering > Emulate CSS prefers-reduced-motion). — Confirma o critério 4 das T-068, T-070 e T-071, que segue sem evidência de navegador real.
- [ ] **Validação 3D em aparelho real** — desktop e 375 px: planeta atual, voo entre mundos, halo sob o painel do título; parallax e device orientation em Android (iOS segue desligado por desenho). — Confirmar.
- [ ] **Progresso simulado** — completed, trilha acesa, chefão desbloqueado e preenchimento do XP nunca foram vistos (hoje 0/8 concluídos, todos os mundos em 0%). — Testar com progresso temporário em dev, sem commitar, em desktop e 375 px.
- [ ] **Gate com navegador** — decidir se a esteira deve incluir Playwright com `reducedMotion: 'reduce'` (não há runner de navegador no repo). — Sim ou não.
- [ ] **Limpeza local** — encerrar o `vite preview` na porta 4173; `docker rmi caddy:2-alpine` no WSL Ubuntu, se não for mais usado; reiniciar o Docker Desktop se ainda estiver travado.

## Bloqueadas
| Tarefa | Motivo | Tentativas |
|---|---|---|
| T-014 | Aguarda a foto nova (pendência acima). Volta a todo quando `content/assets/profile.jpg` for substituído. | 0 |

## Próxima rodada
Nada nesta rodada. O backlog não tem tarefas `todo`; T-014 segue bloqueada.

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

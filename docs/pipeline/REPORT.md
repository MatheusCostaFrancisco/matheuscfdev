# Relatório da esteira — 2026-11-26 (rodada 1)

Deploy: https://www.matheuscfrancisco.dev.br · publicado (commit 41f678d, deployment 5d8e9145 SUCCESS)
Resumo: 2 entregues · 1 para revisão · 1 bloqueadas · 3 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-067 | `b7cccbc` | Túnel de luz de 1.4 s ao clicar em Jornada (nav, teaser, 404). Enter pula o túnel de propósito. View Transitions entre documentos removidas (Chrome aborta com `InvalidStateError`); critério 1 cumprido só em parte. |
| T-069 | `41f678d` | Teclado na lista de mundos: setas passam por todos os cards sem pular o Mundo 0, foco trava o card ativo, dica de teclado anunciada em cada card. |

## Para revisão
- [ ] **T-066** Testar a 320px e 400% de zoom: setas rolam o diálogo, Fechar segue alcançável e o header sticky não cobre o conteúdo. — Não foi feito no navegador; nenhum mundo tem entregável, então o link do diálogo também não foi testado ao vivo.
- [ ] **T-066** Ao fechar o diálogo aberto por clique no planeta, o foco volta ao card do mundo (planeta não é focável). Confirmar que atende o critério 2.
- [ ] **T-067** Conferir o commit `b7cccbc`: `git add -A` incluiu `404.html`, páginas en/pt da jornada, `src/index.css`, `vite.config.ts` e `src/lib/warp.ts`, que não apareciam na pré-checagem. — `git show --stat b7cccbc`. Se algo não pertence à T-067, abrir ajuste.
- [ ] **T-067** Testar no Chrome o túnel, a entrada, o Voltar e o console em home, 404 e teaser (sem `InvalidStateError` novo). — O dev não rodou o navegador. Também aprovar o visual: raios accent-100, flash ao final, 1.4 s; entrada com brilho 2.5x, blur 6px em 900 ms.
- [ ] **T-069** Clique no card trava a câmera 3D: rolar logo depois mantém a câmera no card clicado até a rolagem parar. — Aceitar ou pedir correção numa tarefa.
- [ ] **T-069** Dica de teclado é só sr-only e é anunciada em cada card ao receber foco. Quer dica visível e `role` nos `li`? — Pergunta vinda da T-065; a dica anunciada 9 vezes pode ser repetitiva.
- [ ] **T-069** Conferir Tab e setas em `/en/journey/` e `/pt/jornada/` no navegador. — Dev e a11y-reviewer relataram ok; confirmação ao vivo é opcional.
- [ ] **Layout geral** Smoke não feito em 375, 768 e 1024 px, PT e EN: seções, teasers, depoimentos, jornada, livros, 404, scroll horizontal e `aria-label` de produto (T-030). — Só `/en/` e `/404` foram vistos em 375.
- [ ] **T-042** Conferir o header em 1280 e 1440 px (PT e EN), e `/pt/#contact` e `/en/#experience` em 1093 px. A largura da nav é estimativa. — Também aceitar o menu hambúrguer de 768 a 1279 px (vira ADR ou resumo) e escolher a largura do header (`max-w-7xl`) ou do conteúdo (`max-w-5xl`).
- [ ] **T-052** Testar em celular real ou zoom 400% (320x256 e 640x360, `/en/` e `/pt/`), rolando até o fim e usando `#skills`. — Em 256 px o último bloco pode levar até 1 s; aceitar ou reduzir a margem (`-8%`).
- [ ] **T-050** Confirmar movimento (16 px, 400 ms, stagger 70 ms, teto 280 ms) e se o Hero deve animar ao carregar. — No primeiro paint em desktop o hero aparece desbotado.
- [ ] **T-041** Testar em iOS Safari: tocar em área vazia com o menu aberto deve fechá-lo. — Tocar no logo também fecha; aceitar.
- [ ] **T-045** Nome do header nas páginas internas vai para `#main`; decidir se leva à home. — Conferir em 375 px com menu aberto e fechado.
- [ ] **T-040** Seção aberta por hash fica sem anel de foco (por desenho). — Testar Tab em `/en/#contact`; decidir se quer pista visual. Clique duplo no mesmo link de hash não move o foco.
- [ ] **T-029** Scroll inicial de `/en/#contact` é sempre instantâneo. — Quer suave para quem não pediu redução de movimento?
- [ ] **T-023** Botão "Menu" nos dois idiomas. — Confirmar "Menu" em pt-BR e se quer outro estilo no drawer.
- [ ] **T-022** Contato em 375 px. — Confirmar que e-mail e URL do LinkedIn quebram sem estourar; quer ícones Lucide ao lado de cada canal?
- [ ] **T-031** WoodFlow (8 bullets) deixa ElevaTech e Manda Aí com 700 a 850 px de card vazio em 1024+; cards de Produtos com ~1600 px. — Escolher: (a) 3 colunas só em xl, último card em linha inteira; (b) alturas desiguais com `items-start`; (c) resumir o WoodFlow.
- [ ] **T-034** Competências com 8 cards: em 375 px a seção ocupa ~2,5 telas. — Compactar, ou fundir "IA aplicada" (2 itens) em "Práticas"? Ou adicionar conteúdo ao `cv.md`?
- [ ] **T-055** Títulos mistos: "Senior Mobile Developer & Tech Lead" ficou `en` (8 palavras em inglês contra 5 em português), e o título de Gabriel Vicente ficou `en` em `/en/`. — Regra de maioria ou dividir em segmentos. Também o `lang` no `<progress>` vale para "70%": testar com leitor de tela.
- [ ] **T-046** Teaser de livros mostra o de maior progresso (hoje Código Limpo, 70%), sem título visível. Livros e Jornada aparecem duas vezes na home (nav e teasers). — Confirmar.
- [ ] **T-049 / T-048** Seis depoimentos (~5000 px no celular) entre Experience e Products. — Decidir posição (ou antes de Contato), se mostram todos, resumidos ou em `<details>`; texto do link em pt ("Ver recomendações no LinkedIn"?).
- [ ] **T-048** Traduções en dos 6 depoimentos (ex.: "absurda" virou "outstanding"), marcadas "Translated from Portuguese". — Revisar em `src/content/testimonials.ts`; confirmar se as quebras simples do depoimento da Áiska Hacine viram 5 parágrafos.
- [ ] **T-027 / T-039** Barra de progresso dos livros passa 3:1, mas ficou mais pesada; Safari e Firefox não testados. "A Maneira Rápida e Fácil de Falar com Eficácia" segue sem barra. — Confirmar o visual; acrescentar percentual em `livros.md` ou aceitar.
- [ ] **T-047 / T-013** 404: texto em en e pt-BR; título só "404"; os dois grupos de links não mostram o idioma e "Roadmap" repete o visual. — Quer o nome na página? Legenda ("English" / "Português (Brasil)") ou layout compacto?
- [ ] **T-030** pt-BR: "Stack do Manda Aí" (masculino) ou "Stack: Manda Aí"? — Produtos como a ElevaTech, tratada como empresa, pedem "da".
- [ ] **T-033** Localização: pt "Piracicaba, SP · Remoto" (sem Brasil), en "Piracicaba, SP, Brazil · Remote". Formação com dois MBAs seguidos (FIAP e IGTI). — Assimetria é desejada? A leitura está boa?
- [ ] **T-035 / T-036** Página raiz `/` tem hreflang e og:image, mas nenhum canonical; a meta description e a og:description terminam cortadas. — Quer canonical na raiz e o mesmo texto nos dois idiomas?
- [ ] **T-036** Dois números na primeira dobra: "8 anos do suporte à engenharia sênior" (desde jul/2018) e "mais de 7 anos" (desde nov/2019). — Confirmar os dois. Eles mudam sozinhos em jul e nov, sem commit (a página usa a data do visitante; a meta, a do build). Aceita ou fixa em `career.ts`?
- [ ] **T-032** ADR ficou `docs/adr/0004-self-hosted-font.md`; o critério pedia 0003, já usado. — Aceita o 0004?
- [ ] **T-056** Segundo bullet da ElevaTech (ESALQ/USP) em `/en/` e `/pt/`. — O site não foi aberto na tarefa.
- [ ] **T-057** Traduções en dos 47 itens e 9 chefões em `src/content/journey.ts` (o dev traduziu; a fonte é só pt-BR). — Revisar. Âncoras `#world-N` / `#mundo-N` (`final-boss` / `chefao-final`): confirmar, ou usar o mesmo id nos dois idiomas?
- [ ] **T-058** Regra de XP: o checkbox do chefão conta. Mundo só com o chefão marcado fica concluído com XP abaixo de 100; com tudo marcado menos o chefão final, o total fica em ~96%. — Aceitar, ou contar só os itens de estudo?
- [ ] **T-059** Paleta da jornada (fundo `#060e12`, nebulosa teal, texto `#e8f3f1`) é exceção à ADR 0001, só nessa página. — Confirmar ou pedir outro tom. Sombras do menu mobile e do skip link ficam quase invisíveis no fundo escuro.
- [ ] **T-060** Chefão bloqueado repete a regra ("derrote o chefão do Mundo 7" e "Destrava quando os 8 mundos estão concluídos"). — Manter as duas? Pílulas de status com borda parecem botão: tirar a borda? Numeração a partir de 0 (Mundo 0 a 7): confirmar.
- [ ] **T-061** Teaser da home: "Mundo atual: <mundo> · XP 0%", fallback "Jornada concluída: AI Engineer", e com os 8 mundos concluídos "Mundo atual: Chefão final · AI Engineer". — Confirmar rótulo, se 0% aparece e os textos; conferir o separador em 375 px em `/pt/`.
- [ ] **T-063 / T-064 / T-071** Cena 3D quase invisível: cards opacos e scrim de 70% cobrem planetas e estrelas. — A T-071 segue a direção definida pelo PO (cena visível, scrim perto de 55%, AA mantido). Se não concordar, escreva ao lado do item. Aprovar também o campo de estrelas e as 3 nuvens teal.
- [ ] **T-063 / T-064** Glow com pulso no mundo atual e chefão final como estrela com halo, não buraco negro. — Confirmar a exceção ao "sem glow" (ADR 0001, só na jornada, ADR 0007).
- [ ] **T-063** Sem WebGL2, Save-Data, `deviceMemory` abaixo de 4 ou reduced motion, a página mostra a lista 2D. — Confirmar.
- [ ] **T-063** A nebulosa em CSS (`--journey-nebula`) soma com a nebulosa WebGL. — Manter as duas, ou deixar o CSS só como fallback?
- [ ] **T-065** Parallax de mouse quase invisível (~4 px de canto a canto). — Aumentar a amplitude? Setas e teclado: trocam de mundo só com foco na lista e rolam a página fora dela. Confirmar.
- [ ] **T-066** Ao clicar num planeta, o diálogo repete o que o card já mostra (status, XP, checklist, chefão). Todo card tem o botão "Abrir painel". — Decidir se o card vira resumo (título, status, XP) com o detalhe só no painel, ou se a duplicação está ok.
- [ ] **T-067** Entrada do túnel e duração: confirmar que 1.4 s não pesa para quem visita a jornada mais de uma vez na sessão. — Se pesar, reduzir.

## Pendências do stakeholder
- [ ] **T-066: retomar ou fechar** — o clique direto no planeta não abre o diálogo em 1024 nem em 1440 px (o layout cobre o planeta com cards e wrapper). Escolha: (a) retomar com `data-scene-pick` nas superfícies de layout (trabalho em `stash@{0}`, ver abaixo); (b) aceitar que o planeta é decorativo, com entrada pelo botão "Abrir painel" e pelo Enter no card, e fechar o critério 1 como parcial. Escreva a escolha ao lado do item.
- [ ] **Orçamento do chunk principal (ADR 0009)** — T-066 sozinha estourava (main 94.67 kB gzip contra 93.58 kB); T-067, já publicada, deixa o JS de entrada em 94.29 kB (0.71 kB acima). — Escolha: (a) subir o limite para ~94.5 kB com adendo na ADR 0009, ou (b) pedir tarefa de corte de peso (sugestão: `build.modulePreload: { polyfill: false }`, ~0.4 kB). O número com T-066 e T-067 juntas ainda não foi medido.
- [ ] **Stashes** — `stash@{0}` = `esteira/2026-11-26/review/T-066` (trabalho da T-066); `stash@{1}` = `esteira/2026-11-24/interrompida/T-037` (antigo; o índice mudou). — Conferir com `git stash show -p stash@{0}` e `git stash show -p stash@{1}`. Descartar com `git stash drop` o que não servir.
- [ ] **Redirect 301 sem www** — no Cloudflare, Rules > Redirect Rules: `matheuscfrancisco.dev.br/*` para `https://www.matheuscfrancisco.dev.br/$1`, com 301. — Ou me peça para criar via MCP (exige `CLOUDFLARE_API_TOKEN` no ambiente; hoje não está).
- [ ] **Foto de perfil nova** — substituir `content/assets/profile.jpg`. — A T-014 espera a foto.
- [ ] **Teste de preview** — conferir que `/assets/profile-*.jpg` responde 200 e testar o link no LinkedIn Post Inspector e no Facebook Sharing Debugger.
- [ ] **Search Console** — enviar `https://www.matheuscfrancisco.dev.br/sitemap.xml`. — Antes, decidir se quer `<lastmod>` no sitemap (o build não tem data confiável por página).
- [ ] **Cache de `/fonts/` em produção** — `curl -I https://www.matheuscfrancisco.dev.br/fonts/poppins-latin-400-normal.woff2` responde `max-age=14400`; o esperado é `max-age=31536000, immutable`. — Repetir em algumas horas. Se persistir, checar a regra de cache no Cloudflare para `/fonts/*` (pode exigir reabrir ADR 0006).
- [ ] **Estados da jornada com progresso simulado** — completed, trilha acesa e chefão desbloqueado nunca foram vistos (hoje 0/8 concluídos). — Testar com progresso temporário, sem commitar, em desktop e 375 px.
- [ ] **Validação 3D em aparelho real** — enquadramento e voo entre mundos em desktop e 375 px (h1 legível sobre o planeta atual ao rolar); parallax e device orientation em Android (iOS está desligado por desenho).
- [ ] **Limpeza local** — encerrar o `vite preview` na porta 4173; `docker rmi caddy:2-alpine` no WSL Ubuntu, se não for mais usado; reiniciar o Docker Desktop se ainda estiver travado.

## Bloqueadas
| Tarefa | Motivo | Tentativas |
|---|---|---|
| T-014 | Aguarda a foto nova (pendência acima). Volta a todo quando `content/assets/profile.jpg` for substituído. | 0 |

## Próxima rodada
- T-068 · Polish the journey effects: bloom, hover feedback and XP fill on entry · P1
- T-070 · Add a visible pause control for the journey scene animation · P1
- T-071 · Let the 3D scene show through the journey content while keeping AA contrast · P1

Nota: T-068 depende de T-066, que segue em revisão. T-070 e T-071 dependem de T-068. Sem a decisão sobre T-066, nenhuma das três começa.

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

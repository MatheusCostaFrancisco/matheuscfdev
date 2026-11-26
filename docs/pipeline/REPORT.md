# Relatório da esteira — 2026-11-25 (rodada 3)

Deploy: https://www.matheuscfrancisco.dev.br · parcial (commit 9d1fbf7; zoneStatus `pending` no Cloudflare, ver pendências)
Resumo: 10 entregues · 46 para revisão · 1 bloqueadas · 3 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-056 | `4e5f9f1` | Bullet ESALQ/USP como 2º item da ElevaTech, em en e pt-BR. |
| T-057 | `f7d0205` | Conteúdo tipado da jornada AI Engineer (8 mundos, chefão final, 47 itens) em `src/content/journey.ts`. |
| T-058 | `08f1b25` | Vitest e função pura de estado e XP da jornada, com testes de borda. |
| T-059 | `cb32e7a` | Tokens do tema espacial só na página da jornada, com ADR 0007 e contraste AA medido. |
| T-060 | `31c8232` | Mapa 2D semântico substitui o roadmap; estados em texto e ícone. |
| T-061 | `acc4e67` | Teaser da home mostra o mundo atual e o XP; módulos antigos de roadmap removidos. |
| T-062 | `b195b2c` | Rotas `/en/journey/` e `/pt/jornada/`, com 301 das antigas no Caddyfile; ADR 0008. |
| T-063 | `63e1ee0` | Cena 3D carregada sob demanda, com campo de estrelas e gate de capacidade; ADR 0009; `three` é nova dependência. |
| T-064 | `d29955d` | Mundos como planetas (concluído, atual, bloqueado) e trilha; scrim de 70% para garantir contraste. |
| T-065 | `9d1fbf7` | Parallax de câmera e navegação por teclado, scroll e foco entre mundos. |

## Para revisão
- [ ] **T-042** Conferir no navegador o header em 1280px e 1440px (PT e EN) e `/pt/#contact` e `/en/#experience` em 1093px — a largura da nav é estimativa, não foi medida.
- [ ] **T-042** Aceitar o menu hambúrguer de 768 a 1279px (antes a nav aparecia a partir de 1024px) — foi o preço de manter o header em uma linha. Se aceitar, registro em ADR com "Quando reabrir" ou em resumo.
- [ ] **T-042** Alinhamento: o header usa `max-w-7xl` e o conteúdo segue em `max-w-5xl`, então a marca não alinha com o conteúdo a partir de ~1100px. Escolha: mesma largura nos dois, ou só o texto do `main` em 5xl.
- [ ] **T-052** Testar em celular real ou com zoom 400% (320x256 e 640x360, `/en/` e `/pt/`): rolar até o fim e usar link de hash (`#skills`). Nada pode ficar invisível. A medição foi em navegador de teste.
- [ ] **T-052** Em viewports baixos (256px), o último bloco pode levar até 1s para aparecer, porque só o fallback o revela. Aceitar o atraso ou reduzir a margem (`-8%`).
- [ ] **T-050** Confirmar movimento: 16px, 400ms e stagger de 70ms (teto 280ms); se o Hero deve animar ao carregar — no primeiro paint em desktop o hero aparece bem desbotado.
- [ ] **T-041** Testar em iOS Safari real: tocar em área vazia com o menu aberto deve fechá-lo. Tocar no nome/logo também fecha o menu, porque ele fica fora do painel e do botão — aceitar.
- [ ] **T-055** Títulos mistos: "Senior Mobile Developer & Tech Lead" ficou `en` (8 palavras em inglês contra 5 em português), e o título de Gabriel Vicente ficou `en` em `/en/`, deixando a parte em português sem marca. Confirmar a regra de maioria ou dividir em segmentos.
- [ ] **T-055** O `lang` no `<progress>` vale para o valor ("70%") além do aria-label. Testar com leitor de tela; se incomodar, trocar por `aria-labelledby` apontando para o título.
- [ ] **Layout geral** Smoke não feito: nada foi medido em 375, 768 e 1024px nos dois idiomas, exceto `/en/` e `/404` em 375. Conferir #skills, #products, #books, #contact, #experience, teasers, depoimentos, `/en/journey/`, `/pt/jornada/`, `/livros/` (ou `/books/`), 404, scroll horizontal nas 6 páginas e aria-labels de produto (T-030).
- [ ] **T-045** Nome do header nas páginas internas vai para `#main`; decidir se leva à home. Conferir em 375px com menu aberto e fechado, e `/pt/#experience` vindo de `/pt/livros/` caindo abaixo do header.
- [ ] **T-046** Teaser de livros mostra o livro com maior progresso (hoje Código Limpo, 70%), não o primeiro da lista. A seção não tem título visível (h2 só para leitor de tela), e Livros e Jornada aparecem duas vezes na home (nav e teasers). Confirmar.
- [ ] **T-049** Posição e volume dos depoimentos: são 6 inteiros, ~5000px no celular, entre Experience e Products. Decidir posição (ou antes de Contato), se mostra todos, resumidos ou com `<details>`. Texto do link em pt: sugestão "Ver recomendações no LinkedIn" no lugar de "Ver original no LinkedIn".
- [ ] **T-048** Traduções en dos 6 depoimentos (ex.: "absurda" virou "outstanding"), marcadas "Translated from Portuguese". Revisar em `src/content/testimonials.ts`. Confirmar se as quebras simples do depoimento da Áiska Hacine viram 5 parágrafos.
- [ ] **T-027 / T-039** Barra de progresso dos livros: trilha e preenchimento passam 3:1, mas ficaram mais pesados. Confirmar o visual. Safari e Firefox reais não foram testados. "A Maneira Rápida e Fácil de Falar com Eficácia" segue sem barra — acrescentar percentual em `livros.md` ou aceitar.
- [ ] **T-040** Seção aberta por hash fica sem anel de foco (por desenho). Testar Tab em `/en/#contact` e decidir se quer pista visual. Clicar duas vezes no mesmo link de hash não move o foco; aceitar ou pedir tarefa.
- [ ] **T-047 / T-013** 404: texto em en e pt-BR (tom) e título só "404" — quer o nome na página ou os títulos das mensagens como h2? Os dois grupos de links não mostram o idioma e "Roadmap" repete com o mesmo visual: aceitar, legenda visível ("English" / "Português (Brasil)") ou layout compacto.
- [ ] **T-031** Em 1024px+ o WoodFlow (8 bullets) deixa ElevaTech e Manda Aí com 700 a 850px de card vazio, e os cards de Produtos ficam com ~1600px. Escolha: (a) 3 colunas só em xl, com último card em linha inteira abaixo; (b) 3 colunas com alturas desiguais e `items-start`; (c) resumir o WoodFlow.
- [ ] **T-029** Scroll inicial ao abrir `/en/#contact` é sempre instantâneo — quer suave para quem não pediu redução de movimento?
- [ ] **T-023** Botão "Menu" nos dois idiomas — confirme "Menu" em pt-BR e diga se quer outro estilo no drawer mobile.
- [ ] **T-022** Contato — confirme em 375px que e-mail e URL do LinkedIn quebram sem estourar. Quer ícones Lucide ao lado de cada canal?
- [ ] **T-030** pt-BR — "Stack do Manda Aí" (artigo masculino) ou neutro "Stack: Manda Aí"? Produtos como a ElevaTech, tratada como empresa, pedem "da".
- [ ] **T-033** Localização em pt-BR sai "Piracicaba, SP · Remoto" (sem Brasil), e em en "Piracicaba, SP, Brazil · Remote" — a assimetria é desejada? Formação agora tem dois MBAs seguidos (FIAP e "MBA em Desenvolvimento Front-End", IGTI) — a leitura está boa?
- [ ] **T-034** Competências com 8 cards: em 375px a seção ocupa ~2,5 telas. Densidade OK ou compactar (chips menores, ou fundir "IA aplicada" em "Práticas")? "IA aplicada" tem só 2 itens: adicionar conteúdo ao `cv.md` ou fundir?
- [ ] **T-035 / T-036** Página raiz `/` tem hreflang e og:image absolutos, mas nenhum canonical. A meta description termina em "Choose English or Portuguese." e a og:description termina na lista de stack. Quer canonical na raiz e o mesmo texto nos dois?
- [ ] **T-036** Dois números na primeira dobra: tagline "8 anos do suporte à engenharia sênior" (desde jul/2018) e resumo "mais de 7 anos" (desde nov/2019). Confirme os dois. O número muda sozinho em jul e nov, sem commit (a página usa a data do visitante; a meta, a data do build). Aceita, ou fixo em `career.ts`?
- [ ] **T-032** ADR ficou `docs/adr/0004-self-hosted-font.md`, mas o critério pedia 0003, número já usado por `0003-site-url-build-time.md`. Aceita o 0004?
- [ ] **Herdado** Copy e CTAs — "Get in touch", rodapé só com © e nome, contato sem CTA de destaque, "Visit site" no Manda Aí, hero em pt-BR quebra em 375px. Aprove ou diga o que trocar.
- [ ] **Herdado** Densidade de Experience (17 bullets, RKM separado) e Education (lista simples) — cards ou lista? Agrupar RKM sob uma empresa?
- [ ] **Herdado** Decisões de base (ADR 0001 e afins): acento teal, só tema claro, `clsx` e `tailwind-merge` no `cn()`, ignore do ESLint em `.claude`, favicon "M", card OG 1200x630, meta description, reset de `--radius-*`. Confirme ou aponte o que muda.
- [ ] **T-056** Conferir o 2º bullet da ElevaTech (ESALQ/USP) em `/en/` e `/pt/` — o site não foi aberto na tarefa.
- [ ] **T-057** Revisar as traduções en dos 47 itens e 9 chefões em `src/content/journey.ts` — o dev traduziu, porque a fonte (`estudos-2027.md`) é só pt-BR.
- [ ] **T-057** Âncoras da jornada: `#world-N` em en e `#mundo-N` em pt-BR (`final-boss` / `chefao-final`), como na spec. Confirmar, ou usar o mesmo id nos dois idiomas.
- [ ] **T-058** Regra de XP: o checkbox do chefão conta. Um mundo só com o chefão marcado fica concluído com XP abaixo de 100; com tudo marcado menos o chefão final, o total fica em ~96%. Aceitar, ou contar só os itens de estudo.
- [ ] **T-059** Paleta da jornada (fundo `#060e12`, nebulosa teal, texto `#e8f3f1`) e exceção à ADR 0001 só nessa página (fundo escuro, glow). Os três estados usam o mesmo teal e se distinguem pelo brilho (atual `#cbf5ec`, concluído `#5dd5c3`, bloqueado `#6f8582`). Confirmar, ou pedir outro tom. Sombras da menu mobile e do skip link ficam quase invisíveis no fundo escuro.
- [ ] **T-060** Chefão final bloqueado repete a regra ("derrote o chefão do Mundo 7" e "Destrava quando os 8 mundos estão concluídos"). Manter as duas?
- [ ] **T-060** Pílulas de status com borda parecem botão. Tirar a borda?
- [ ] **T-060** Numeração a partir de 0 (Mundo 0 a 7, 0/8 concluídos). Confirmar.
- [ ] **T-061** Teaser da home: "Mundo atual: <mundo> · XP 0%" (o XP é do mundo atual, não do total da jornada), fallback "Jornada concluída: AI Engineer" e, com os 8 mundos concluídos, "Mundo atual: Chefão final · AI Engineer". Confirmar rótulo, se 0% deve aparecer e os textos; conferir o separador em 375px em `/pt/`.
- [ ] **T-063 / T-064** Cena 3D quase invisível: os cards opacos cobrem quase tudo, e o scrim de 70% escurece planetas e estrelas. Opções: scrim a ~55% (pior caso ~4.6:1 sobre a cena; texto fora de card segue AA), cards translúcidos ou mais estreitos, ou cena mais presente. Aprovar também o campo de estrelas e as 3 nuvens teal.
- [ ] **T-063** Animação contínua sem botão de pausa (WCAG 2.2.2): hoje só para quem tem `prefers-reduced-motion`. Quer controle visível na página em tarefa futura?
- [ ] **T-063 / T-064** Glow e chefão: o mundo atual tem glow radial com pulso, e o chefão final é uma estrela com halo, não buraco negro. Confirmar a exceção ao "sem glow" (ADR 0001, só na jornada, ADR 0007) e se o chefão fica como estrela.
- [ ] **T-063** Sem WebGL2, Save-Data, `deviceMemory` abaixo de 4 ou reduced motion, a página mostra a lista 2D estilizada (não um mapa estático). Confirmar.
- [ ] **T-063** A nebulosa em CSS (`--journey-nebula`) soma com a nebulosa WebGL. Manter as duas, ou deixar o CSS só como fallback?
- [ ] **T-065** Parallax de mouse quase invisível (~4 px de canto a canto). Aumentar a amplitude? Os cards também cobrem a câmera; ver item do scrim acima.
- [ ] **T-065** Setas e teclado: trocam de mundo só com foco na lista e rolam a página fora dela. Confirmar. Os cards agora entram no Tab. Abertos, sem bloquear: o primeiro ArrowDown pula o mundo 0 (atual), e a dica de teclado não é anunciada por leitor de tela (o `aria-describedby` está no `<ol>`). O PO pode abrir tarefa.

## Pendências do stakeholder
- [ ] **Redirect 301 sem www** — no Cloudflare, Rules > Redirect Rules: `matheuscfrancisco.dev.br/*` para `https://www.matheuscfrancisco.dev.br/$1`, com 301. Ou me peça para criar via MCP (exige `CLOUDFLARE_API_TOKEN` no ambiente; hoje não está).
- [ ] **Foto de perfil nova** — substituir `content/assets/profile.jpg`. A T-014 espera a foto.
- [ ] **Teste de preview** — conferir que `/assets/profile-*.jpg` responde 200 e testar o link no LinkedIn Post Inspector e no Facebook Sharing Debugger.
- [ ] **Search Console** — enviar `https://www.matheuscfrancisco.dev.br/sitemap.xml`. Já pode: as URLs novas da jornada estão publicadas (T-062). Antes, decidir se quer `<lastmod>` no sitemap: o build não tem data confiável por página.
- [ ] **Cache de `/fonts/` em produção** — `curl -I https://www.matheuscfrancisco.dev.br/fonts/poppins-latin-400-normal.woff2` responde `max-age=14400`; o esperado é `max-age=31536000, immutable`. Repetir em algumas horas. Se persistir, checar regra de cache no Cloudflare para `/fonts/*` e avisar o PO (pode exigir reabrir ADR 0006).
- [ ] **Stash antigo** — `stash@{0}` (`esteira/2026-11-24/interrompida/T-037`) segue guardado. Conferir com `git stash show -p stash@{0}` e, se quiser descartar, `git stash drop stash@{0}`.
- [x] **Zona Cloudflare** — conferido em 2026-11-26: o `.br` delega para cartman/maxine.ns.cloudflare.com. `zoneStatus` atualizado para `active` em `deploy.json`.
- [x] **Redirects da jornada em produção** — conferido: `/pt/roadmap/`, `/en/roadmap` e `/pt/roadmap/index.html` respondem 301 para as rotas novas; `/pt/jornada/` e `/en/journey/` respondem 200.
- [x] **Limite de aviso do chunk** — decisão: subir `build.chunkSizeWarningLimit` só o necessário para o chunk 3D, com justificativa na ADR 0009 (é carregado só na jornada). Entra na T-068.
- [ ] **Estados da jornada com progresso simulado** — completed, trilha acesa e chefão desbloqueado nunca foram vistos (hoje 0/8 concluídos). Testar com progresso temporário, sem commitar, em desktop e 375px.
- [ ] **Validação 3D em aparelho real** — enquadramento e voo entre mundos em desktop e 375px (h1 legível sobre o planeta atual ao rolar); parallax e device orientation em Android real (iOS está desligado por desenho).
- [ ] **Limpeza local** — encerrar o `vite preview` na porta 4173; rodar `docker rmi caddy:2-alpine` no WSL Ubuntu, se não for mais usado; reiniciar o Docker Desktop se ainda estiver travado.

## Bloqueadas
| Tarefa | Motivo | Tentativas |
|---|---|---|
| T-014 | Aguarda a foto nova (pendência acima). Volta a todo quando `content/assets/profile.jpg` for substituído. | 0 |

## Próxima rodada
- T-066 · Add the world panel dialog opened from planets · P1
- T-067 · Add the change-of-dimension light tunnel transition into the journey · P1
- T-068 · Polish the journey effects: bloom, hover feedback and XP fill on entry · P1

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

# Relatório da esteira — 2026-11-25 (rodada 2)

Deploy: https://www.matheuscfrancisco.dev.br · publicado (commit 05532bf), mas `/fonts/` ainda responde cache de 4h — ver pendências
Resumo: 6 entregues · 34 para revisão · 1 bloqueadas · 0 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-042 | `8094fcf` | Header em uma linha de 768 a 1440px. Menu hambúrguer de 768 a 1279px. Offset das seções vem da mesma variável de altura do header. |
| T-052 | `fc36c76` | Conteúdo revelado nunca fica oculto: fallback de 1s e sweep ao rolar. Em 320x256 e 640x360, nos dois idiomas, zero elementos ocultos após rolar até o fim. |
| T-053 | `82a8472` | `:has()` removido da trilha da jornada do roadmap. Página não quebra em Firefox antigo nem Safari antigo. |
| T-054 | `8358ee1` | Caddyfile no repo: 404 real, sem fallback de SPA. `/assets/` e `/fonts/` com cache de 1 ano. Produção: 404 e `/assets/` conferidos; `/fonts/` ainda com 4h (ver pendências). ADR 0006. |
| T-055 | `61c3540` | Idioma marcado em títulos de depoimento e nos títulos de livros/séries que ficaram sem marca (WCAG 3.1.2). |
| T-041 | `05532bf` | Menu mobile fecha com toque fora (`pointerdown`), inclusive iOS Safari. Pendente: teste em iOS real. |

## Para revisão
- [ ] **T-042** Conferir no navegador o header em 1280px e 1440px (PT e EN) e `/pt/#contact` e `/en/#experience` em 1093px — a largura da nav é estimativa, não foi medida.
- [ ] **T-042** Aceitar o menu hambúrguer de 768 a 1279px (antes a nav aparecia a partir de 1024px) — foi o preço de manter o header em uma linha. Se aceitar, registro em ADR com "Quando reabrir" ou em resumo.
- [ ] **T-042** Alinhamento: o header agora usa `max-w-7xl` e o conteúdo segue em `max-w-5xl`, então a marca não alinha com o conteúdo a partir de ~1100px. Escolha: mesma largura nos dois, ou só o texto do `main` em 5xl.
- [ ] **T-052** Testar em celular real ou com zoom 400% (320x256 e 640x360, `/en/` e `/pt/`): rolar até o fim e usar link de hash (`#skills`). Nada pode ficar invisível. A medição foi feita em navegador de teste, não em celular.
- [ ] **T-052** Em viewports baixos (256px), o último bloco pode levar até 1s para aparecer, porque só o fallback o revela. Aceitar o atraso ou reduzir a margem (`-8%`).
- [ ] **T-050** Confirmar movimento: 16px, 400ms e stagger de 70ms (teto 280ms); se o Hero deve animar ao carregar — no primeiro paint em desktop o hero aparece bem desbotado. Cards de Produtos (~1600px em 1024px) nunca animam; ver item de layout de Produtos.
- [ ] **T-053** Conferir no navegador `/en/roadmap/` e `/pt/roadmap/` em 375px e 1280px: a trilha deve terminar no centro do último marcador, e o console não deve mostrar erro novo (não verificado).
- [ ] **T-041** Testar em iOS Safari real: tocar em área vazia com o menu aberto deve fechá-lo. Tocar no nome/logo também fecha o menu, porque ele fica fora do painel e do botão — aceitar.
- [ ] **T-055** Títulos mistos: "Senior Mobile Developer & Tech Lead" ficou `en` (8 palavras em inglês contra 5 em português), e o título de Gabriel Vicente ficou `en` em `/en/`, deixando a parte em português sem marca. Confirmar a regra de maioria ou dividir em segmentos.
- [ ] **T-055** O `lang` no `<progress>` vale para o valor ("70%") além do aria-label. Testar com leitor de tela; se incomodar, trocar por `aria-labelledby` apontando para o título.
- [ ] **Layout geral** smoke não feito: nada foi medido em 375, 768 e 1024px nos dois idiomas, exceto `/en/` e `/404` em 375. Conferir #skills, #products, #roadmap, #books, #contact, #experience, teasers, depoimentos, `/roadmap/`, `/livros/` (ou `/books/`), 404, scroll horizontal nas 6 páginas e aria-labels de produto (T-030).
- [ ] **T-045** Nome do header nas páginas internas vai para `#main`; decidir se leva à home. Conferir em 375px com menu aberto e fechado, e `/pt/#experience` vindo de `/pt/livros/` caindo abaixo do header.
- [ ] **T-046** Teaser do roadmap mostra o tema da etapa ("Fechar o MBA e mapear as lacunas reais do dia a dia"), não o rótulo "Aquecimento" que o critério 2 cita, e ocupa 3 linhas em 375px. Decidir: tema, rótulo ou os dois.
- [ ] **T-046** Teaser de livros mostra o livro com maior progresso (hoje Código Limpo, 70%), não o primeiro da lista. A seção não tem título visível (h2 só para leitor de tela), e Roadmap/Livros aparecem duas vezes na home (nav e teasers). Confirmar.
- [ ] **T-049** Posição e volume dos depoimentos: são 6 inteiros, ~5000px no celular, entre Experience e Products. Decidir posição (ou antes de Contato), se mostra todos, resumidos ou com `<details>`. Texto do link em pt: sugestão "Ver recomendações no LinkedIn" no lugar de "Ver original no LinkedIn".
- [ ] **T-048** Traduções en dos 6 depoimentos (ex.: "absurda" virou "outstanding"), marcadas "Translated from Portuguese". Revisar em `src/content/testimonials.ts`. Confirmar se as quebras simples do depoimento da Áiska Hacine viram 5 parágrafos.
- [ ] **T-027 / T-039** Barra de progresso dos livros: trilha e preenchimento passam 3:1, mas ficaram mais pesados. Confirmar o visual. Safari e Firefox reais não foram testados. "A Maneira Rápida e Fácil de Falar com Eficácia" segue sem barra — acrescentar percentual em `livros.md` ou aceitar.
- [ ] **T-040** Seção aberta por hash fica sem anel de foco (por desenho). Testar Tab em `/en/#contact` e decidir se quer pista visual. Clicar duas vezes no mesmo link de hash não move o foco; aceitar ou pedir tarefa.
- [ ] **T-051** Conector e marcador: (a) o preenchimento passa pelas etapas "Adiante" — manter como indicador de leitura ou parar na etapa atual; (b) o pulso do marcador para após 5 ciclos (4s) — confirmar, ou pedir contínuo/único. Conferir alinhamento e fim da linha em 375px e 1080p.
- [ ] **T-047 / T-013** 404: texto em en e pt-BR (tom) e título só "404" — quer o nome na página ou os títulos das mensagens como h2? Os dois grupos de links não mostram o idioma e "Roadmap" repete com o mesmo visual: aceitar, legenda visível ("English" / "Português (Brasil)") ou layout compacto.
- [ ] **T-031** Em 1024px+ o WoodFlow (8 bullets) deixa ElevaTech e Manda Aí com 700 a 850px de card vazio, e os cards de Produtos ficam com ~1600px. Escolha: (a) 3 colunas só em xl, com último card em linha inteira abaixo; (b) 3 colunas com alturas desiguais e `items-start`; (c) resumir o WoodFlow.
- [ ] **T-029** Scroll inicial ao abrir `/en/#contact` é sempre instantâneo — quer suave para quem não pediu redução de movimento?
- [ ] **T-023** Botão "Menu" nos dois idiomas — confirme "Menu" em pt-BR e diga se quer outro estilo no drawer mobile.
- [ ] **T-022** Contato — confirme em 375px que e-mail e URL do LinkedIn quebram sem estourar. Quer ícones Lucide ao lado de cada canal?
- [ ] **T-024 / T-025** Status do roadmap — Aquecimento aparece "Em andamento" antes de 01/12/2026. Quer "Adiante" até a data de início? Destino nunca vira "Concluída" depois de dez/2027. Confirme os rótulos ("Adiante" ou "A seguir"; nav "Roadmap" ou "Estudos 2027").
- [ ] **T-030** pt-BR — "Stack do Manda Aí" (artigo masculino) ou neutro "Stack: Manda Aí"? Produtos como a ElevaTech, tratada como empresa, pedem "da".
- [ ] **T-033** Localização em pt-BR sai "Piracicaba, SP · Remoto" (sem Brasil), e em en "Piracicaba, SP, Brazil · Remote" — a assimetria é desejada? Formação agora tem dois MBAs seguidos (FIAP e "MBA em Desenvolvimento Front-End", IGTI) — a leitura está boa?
- [ ] **T-034** Competências com 8 cards: em 375px a seção ocupa ~2,5 telas. Densidade OK ou compactar (chips menores, ou fundir "IA aplicada" em "Práticas")? "IA aplicada" tem só 2 itens: adicionar conteúdo ao `cv.md` ou fundir?
- [ ] **T-035 / T-036** Página raiz `/` tem hreflang e og:image absolutos, mas nenhum canonical. A meta description termina em "Choose English or Portuguese." e a og:description termina na lista de stack. Quer canonical na raiz e o mesmo texto nos dois?
- [ ] **T-036** Dois números na primeira dobra: tagline "8 anos do suporte à engenharia sênior" (desde jul/2018) e resumo "mais de 7 anos" (desde nov/2019). Confirme os dois. O número muda sozinho em jul e nov, sem commit (a página usa a data do visitante; a meta, a data do build). Aceita, ou fixo em `career.ts`?
- [ ] **T-032** ADR ficou `docs/adr/0004-self-hosted-font.md`, mas o critério pedia 0003, número já usado por `0003-site-url-build-time.md`. Aceita o 0004?
- [ ] **Herdado** Copy e CTAs — "Get in touch", rodapé só com © e nome, contato sem CTA de destaque, "Visit site" no Manda Aí, hero em pt-BR quebra em 375px. Aprove ou diga o que trocar.
- [ ] **Herdado** Densidade de Experience (17 bullets, RKM separado) e Education (lista simples) — cards ou lista? Agrupar RKM sob uma empresa?
- [ ] **Herdado** Decisões de base (ADR 0001 e afins): acento teal, só tema claro, `clsx` e `tailwind-merge` no `cn()`, ignore do ESLint em `.claude`, favicon "M", card OG 1200x630, meta description, reset de `--radius-*`. Confirme ou aponte o que muda.

## Pendências do stakeholder
- [ ] **Redirect 301 sem www** — no Cloudflare em Rules > Redirect Rules: `matheuscfrancisco.dev.br/*` para `https://www.matheuscfrancisco.dev.br/$1`, com 301. O apex ainda responde 200. Ou me peça para criar via MCP.
- [ ] **Foto de perfil nova** — substituir `content/assets/profile.jpg`. A T-014 espera a foto.
- [ ] **Teste de preview** — conferir que `/assets/profile-*.jpg` responde 200 e testar o link no LinkedIn Post Inspector e no Facebook Sharing Debugger.
- [ ] **Search Console** — depois do deploy, enviar `https://www.matheuscfrancisco.dev.br/sitemap.xml` ao Google Search Console (conta do stakeholder). Antes, decidir se quer `<lastmod>` no sitemap: o build não tem data confiável por página.
- [ ] **Cache de `/fonts/` em produção** — hoje `curl -I https://www.matheuscfrancisco.dev.br/fonts/poppins-latin-400-normal.woff2` responde `max-age=14400`; o esperado é `max-age=31536000, immutable`. `/assets/` já está correto. Repetir em algumas horas. Se persistir, checar regra de cache no Cloudflare para `/fonts/*` e avisar o PO (pode exigir reabrir ADR 0006).
- [ ] **Stash antigo** — `stash@{0}` (`esteira/2026-11-24/interrompida/T-037`) segue guardado. O conteúdo já está na T-037. Para descartar: `git stash drop stash@{0}`, depois de conferir com `git stash show -p stash@{0}` se quiser.
- [ ] **Campo `zoneStatus`** em `docs/pipeline/deploy.json` ainda diz `pending`, embora o domínio já responda. Confirme e peça ao PO para atualizar.
- [ ] **Limpeza local** — encerrar o `vite preview` que ficou na porta 4173; rodar `docker rmi caddy:2-alpine` no WSL Ubuntu, se não for mais usado; reiniciar o Docker Desktop se ainda estiver travado.

## Bloqueadas
| Tarefa | Motivo | Tentativas |
|---|---|---|
| T-014 | Aguarda a foto nova (pendência acima). Volta a todo quando `content/assets/profile.jpg` for substituído. | 0 |

## Próxima rodada
Nada nesta rodada. Backlog sem tarefas todo. T-014 segue bloqueada pela foto.

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

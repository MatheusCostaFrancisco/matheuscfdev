# Relatório da esteira — 2026-11-26 (rodada 6)

Deploy: https://www.matheuscfrancisco.dev.br · publicado (commit 0e87293, deploy 3c13da1b SUCCESS), sem checagem visual do azul e da largura
Resumo: 7 entregues · 33 para revisão · 1 bloqueadas · 0 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-093 | `e505837` | Acento azul nos dois temas (claro #2563eb/#1d4ed8, escuro #60a5fa/#93c5fd, fundo #0b1120). Neutros e sombras retingidos. ADR 0012. |
| T-094 | `bb2b6ce` | Teal removido de theme-color, favicon, fallback sem JS e 404. |
| T-095 | `fb87f42` | Container e rodapé em max-w-7xl, alinhados ao header. Texto corrido limitado a ~33em (até ~75 caracteres). Depoimentos em 2 colunas a partir de lg. |
| T-096 | `5816baf` | Skills com 4 colunas em xl. Formações em 2 colunas a partir de md. |
| T-098 | `94ab80f` | Listas "Lendo agora" e "Quero ler" com 4 colunas em xl. |
| T-099 | `adc3f7e` | Experiência: cargo, empresa e período à esquerda; bullets à direita, a partir de lg. |
| T-100 | `0e87293` | Barra do navegador sincronizada com o tema salvo ao carregar. Troca rápida de tema cancela o frame pendente. |

## Para revisão
- [x] **T-093 Azul nos dois temas** — Conferir o tom em /pt/ e /en/, claro e escuro, incluindo seleção de texto e anel de foco. — Gosto: a ADR 0001 tinha descartado o azul clássico por parecer portfólio comum; a ADR 0012 registra a escolha. — Aprovado pelo Matheus em 2026-11-27 ("Ficou bom").
- [x] **T-093 Ajustes do escuro** — Botão "Entrar em contato" azul-claro com texto escuro; barra de livros quase branca; tags menos saturadas (escala 50–400 customizada). — Confirmar visualmente. Não há violação de AA. — Aprovado em 2026-11-27.
- [ ] **T-093 accent-900 claro** — `#1b3378` em vez de `#1e3a8a` do Tailwind, para a barra de livros chegar a 3,22:1 (antes 2,85:1). — Confirmar o desvio de um passo da escala.
- [ ] **T-094 Cor do sistema** — Barra do navegador e favicon agora azuis. No escuro do SO o favicon fica em #93c5fd. — Confirmar no celular e nas abas. O favicon segue o SO, não o seletor do site (limitação já registrada).
- [x] **Visual do publicado (T-093 a T-099)** — Abrir /pt/ e /en/ em claro e escuro, com Sistema, Claro e Escuro, em 375, 1280 e 1536 px: azul, largura, grids, home e livros. Conferir scroll horizontal em 768 e 1024 px. Rodar axe nas rotas de livros e 404 (não registrado em T-094). — Escrever ao lado do item correspondente se algo estiver ruim. — Aprovado pelo Matheus em 2026-11-27 ("Ficou bom"); axe em livros e 404 segue sem registro.
- [ ] **T-095 Jornada** — Conteúdo abaixo do palco ficou com 60rem centralizado e não alinha com a logo em 1280 e 1536 px. — Aceitar, ou tirar `mx-auto` para alinhar à esquerda.
- [ ] **T-095 Medida do texto** — Texto corrido em 33em (~60–66 caracteres). Ao lado, About e Hero ficam com vazio à direita em telas largas. — Confirmar 33em, ou subir para 38em.
- [ ] **T-096 Skills em lg** — Entre 1024 e 1279 px, 8 grupos em 3 colunas fecham em 3+3+2, com uma célula vazia. — Aceitar, ou o último card ocupa 2 colunas em lg.
- [ ] **T-096 Formações e gap** — Formações agora em 2 colunas a partir de md (fora do critério literal). Em lg, `lg:gap-12` desalinha a coluna direita em 12 px. — Confirmar a leitura em 2 colunas; pedir ao PO a remoção de `lg:gap-12`.
- [x] **T-097 Depoimentos** — Em 2 colunas a partir de lg, cards da mesma linha têm a altura do mais alto; o mais curto fica com espaço vazio. — Escolher entre altura igual por linha (atual) ou `items-start`. — Fechada em 2026-11-27: fica a altura igual por linha (atual).
- [ ] **T-098 Livros em xl** — "Lendo agora" com 3 livros em 4 colunas deixa a última vazia; "Quero ler" enche as quatro. Entre lg e xl, "Quero ler" deixa o 4º livro sozinho. Lista "Lidos" segue em coluna única de largura total. — Tirar `xl:grid-cols-4` de "Lendo agora"; decidir se "Lidos" ganha grade.
- [ ] **T-098 Teasers e livro sem progresso** — Teasers ficam com 2 cards de ~600 px em 1280 e 1536 px; passa no critério, mas o visual continua largo. "A Maneira Rápida e Fácil de Falar com Eficácia" aparece sem barra de progresso. — Confirmar se basta, ou pedir grade em Teasers; decidir se o livro deve ter percentual.
- [ ] **T-099 Experiência** — De lg em diante, a coluna de meta fica com 288 px (1024) ou 352 px (xl); em 1024 px, cargos longos quebram em duas linhas. Nas entradas sem badge, o primeiro bullet começa ~16 px abaixo do cargo (`mt-4`, reportado por dois revisores). — Confirmar a divisão, ou escrever "timeline de uma coluna". Pedir ao PO `lg:mt-0` nas entradas sem nota.
- [ ] **T-091 Seletor de tema** — Só ícones (Monitor, Sun, Moon), com tooltip e nome acessível; no menu mobile, linha própria. Estado selecionado com fundo accent-100 e anel de 1px, sutil no escuro. Idioma e item ativo da nav ainda usam só fundo. Botão escondido na jornada (decisão do PO). — Quer rótulo "Tema" visível? Conferir se o anel se distingue do foco. Pedir ao PO o mesmo anel em idioma e nav. Escrever ao lado se a jornada deve mostrar o botão desabilitado.
- [ ] **T-092 Tags do claro** — Borda accent-600 nas tags de Produtos e Habilidades deixa o escuro denso. Tags neutras do Hero e o rótulo "traduzido" ficaram em 3,0–3,4:1 antes da troca para azul. — Rever com o azul novo, ou registrar exceção na ADR 0011.
- [ ] **T-089 / T-092 Flash** — Não verificado no navegador: flash claro ao recarregar com Escuro salvo, e na volta jornada → home. — Rodar `yarn build && yarn preview` e conferir.
- [ ] **T-092 ADR 0011** — O adendo ainda diz que o axe em /livros/ está pendente; o axe já rodou sem violações. — Pedir ao PO um adendo datado (ADR append-only).
- [ ] **Palco 3D (T-083, T-085, T-086)** — Estrelas caindo a 7 unidades/s quase não se movem; ondulação do mundo atual ~35–40 px em 1280x800; trilha não iluminada quase invisível (`#2a3045`, opacidade 0.22). — Ver na tela. Ajustes: `FALL_SPEED` 15–25; `CORE_RIPPLE.amplitude` 0.06–0.07; trilha mais visível em `planets.ts`.
- [ ] **Docs T-081 / T-084 / T-086** — ADR 0009 sem adendo da T-086 e com valores antigos de bloom e túnel; ADR 0010 sem o pior caso de `line-strong` sobre o HUD (2,70:1, sem uso hoje). — Mandar o PO abrir tarefa de docs (adendos, nada reescrito), ou aceitar.
- [ ] **T-073 / T-074 Primeira dobra** — A jornada mostra só o palco; título, resumo e Pausar ficam abaixo, e nada convida a rolar. — Aceitar, ou pedir barra curta com título e pausa, ou dica de rolagem.
- [ ] **T-077 / T-063 / T-064 Glow** — Glow e estrela do chefão quebram "sem glow" (exceção às ADR 0001 e 0007). A lista 2D aparece sem WebGL2, com Save-Data, `deviceMemory` < 4 ou reduced motion. — Confirmar a exceção e a regra da lista 2D.
- [ ] **T-078 Pouso** — Pouso de 420 unidades: nos primeiros ~40% do voo quase não há planetas; o voo é um dolly reto. — Manter, ou reduzir para ~200 e decidir se o voo segue a trilha.
- [ ] **T-076 / T-079 Navegação** — Com animação pausada, setas, botões e mudança de orientação não movem a câmera. Roda do mouse não troca mundo (de propósito). Link `#mundo-N` rola até o card e o palco sai da tela. Sem dica de arraste nem de setas. — Decidir se navegar move o palco pausado; confirmar roda; palco ou card como destino do link; quer dica visível?
- [ ] **T-074 / T-075 / T-079 HUD e rótulos** — Rótulos somem quando cobertos pelo HUD ou fora de câmera; em celular, planeta sob o painel não pode ser tocado. HUD em 375x812 ocupa ~40% do palco. Em 320 px com zoom 400%, o palco tem piso de 32rem e só o rótulo do mundo atual aparece. Botão de pausa mantém "Pausar animação" quando pressionado; pausa não é lembrada. Rótulo mostra `{xp}%` sem "XP". — Aceitar ou reposicionar em vez de esconder; manter a densidade ou recolher painéis no celular; confirmar o rótulo fixo; escrever "XP"?
- [ ] **T-080 Fade de cards** — Fade de ~415 px em cada card da lista de mundos. — Gostar do efeito, ou reveal só em títulos e livros?
- [ ] **T-072 Rede lenta** — Em rede lenta, jornada e livros aparecem em branco abaixo do header (sem skeleton, sem `aria-busy`). Home em 90,59 kB gzip (limite 93,58). — Aceitar, ou pedir skeleton. Confirmar o limite.
- [ ] **T-066 Diálogo do planeta** — Foco em 320 px com zoom 400% e retorno do foco ao card não testados; o diálogo repete o card. — Testar; o card vira só resumo?
- [ ] **T-042 / T-045 / T-041 / T-023 Header e menu** — Largura do header em 1280 e 1440 px (PT e EN); hambúrguer de 768 a 1279 px; nome do header vai para `#main`; menu no iOS fecha ao tocar fora; botão "Menu" nos dois idiomas. — Confirmar ou ajustar cada um.
- [ ] **T-050 / T-052 / T-040 / T-029 Movimento e foco** — Hero desbotado no primeiro paint; em 320x256 e 640x360 o último bloco leva até 1 s; seção aberta por hash sem anel de foco; scroll inicial de `/en/#contact` instantâneo. — Decidir cada um.
- [ ] **T-055 / T-048 / T-057 / T-056 Conteúdo en** — Títulos mistos e `lang` do `<progress>` em "70%"; traduções en dos seis depoimentos e dos 47 itens e 9 chefões em `journey.ts`; segundo bullet da ElevaTech. — Revisar em `src/content/`; confirmar a regra de idioma dos títulos.
- [ ] **T-030 / T-033 / T-060 / T-061 / T-036 / T-058 Textos e dados** — "Stack do Manda Aí" ou "Stack: Manda Aí"; "da ElevaTech"; localização pt sem Brasil e dois MBAs seguidos; chefão bloqueado repete a regra; teaser "Mundo atual · XP 0%"; anos "8 anos" e "mais de 7 anos" mudam sem commit; checkbox do chefão conta para XP. — Escolher; fixar os anos em `career.ts` se quiser.
- [ ] **T-034 / T-022 / T-047 / T-013 / T-027 / T-039 / T-046 / T-049 Layout** — 8 competências ocupam ~2,5 telas no celular; teaser de livros mostra Código Limpo sem título; Livros e Jornada aparecem duas vezes na home; barra de progresso dos livros pesada; ícones no contato; 404 sem idioma e "Roadmap" repetido. Os seis depoimentos (~5000 px) já estão em 2 colunas (T-097). — Escolher por item.
- [ ] **T-035 / T-032 / T-059 / T-067 Sinais e docs** — Canonical na raiz e meta description cortada; ADR 0004 vs 0003; paleta da jornada fora da ADR 0001 (coberta pela 0010); sombras da jornada quase invisíveis; commit `b7cccbc` incluiu arquivos não previstos. — Decidir; conferir o commit com `git show --stat b7cccbc`.

## Pendências do stakeholder
- [ ] **Foto de perfil nova** — substituir `content/assets/profile.jpg`. — Libera a T-014 na próxima rodada.
- [x] **Decidir o critério 2 da T-097** — Com o texto completo das seis citações, a seção fica com 76–80% da altura de 1 coluna a 1280 px; o critério pede 60%. — Responder com (a) aceitar ~80% e reescrever o critério (ex.: ≤ 85%); (b) fechar a T-097 como coberta por `fb87f42`, sem commit novo; (c) truncar citações com "ler mais" (corta conteúdo); ou (d) 3 colunas em xl (conflita com o critério 1). O PO fecha a T-097 no backlog. — Decidido em 2026-11-27: (b), T-097 fechada como coberta por `fb87f42`; backlog atualizado.
- [ ] **Stash da T-097** `stash@{0}` = `esteira/2026-11-26/review/T-097` — alinhamento dos autores na base dos cards. — `git stash show -p stash@{0}`. Aplicar se o critério for revisto (antes, `self-start` no rótulo "traduzido"); `git stash drop` se não servir. — T-097 fechada sem aplicar o stash; pode ser descartado.
- [ ] **Redirect 301 sem www** — no Cloudflare, Rules > Redirect Rules: `matheuscfrancisco.dev.br/*` para `https://www.matheuscfrancisco.dev.br/$1`, com 301. O apex responde 200 hoje. — Ou me peça para criar via MCP (exige `CLOUDFLARE_API_TOKEN` no ambiente).
- [ ] **Reduced motion** — checagem real ainda não feita. — Ligar reduced motion no SO ou em DevTools (Rendering > Emulate CSS prefers-reduced-motion): a jornada deve mostrar só a lista 2D e nenhum elemento com `data-reveal`.
- [ ] **Validação 3D em aparelho real** — desktop e 375 px: planeta atual, voo entre mundos, halo sob o painel. Em Android, device orientation pode empurrar rótulo sob o HUD. — Confirmar.
- [ ] **Progresso simulado** — 0 mundos concluídos nos dados reais: anel e selo, fluxo de luz e chefão desbloqueado nunca foram vistos em tela. — Testar com progresso temporário em dev, sem commitar.
- [ ] **Teto do chunk `scene`** — 553 kB (144 kB gzip); o limite do Vite subiu de 550 para 560 kB (`vite.config.ts`, adendo na ADR 0009). — Aprovar 560 kB como teto, ou pedir corte de peso.
- [ ] **Teste de preview** — `/assets/profile-*.jpg` deve responder 200; testar o link no LinkedIn Post Inspector e no Facebook Sharing Debugger. — Fazer o teste.
- [ ] **Search Console** — enviar `https://www.matheuscfrancisco.dev.br/sitemap.xml`. — Antes, decidir se quer `<lastmod>` (o build não tem data confiável por página).
- [ ] **Cache de `/fonts/` em produção** — `curl -I https://www.matheuscfrancisco.dev.br/fonts/poppins-latin-400-normal.woff2` responde `max-age=14400`; o esperado é `max-age=31536000, immutable`. — Repetir em algumas horas; se persistir, regra de cache no Cloudflare (pode reabrir ADR 0006).
- [ ] **Stash antigo** `stash@{1}` = `esteira/2026-11-24/interrompida/T-037` (era `stash@{0}` na rodada 5). — `git stash show -p stash@{1}`; `git stash drop` se não servir.
- [ ] **Gate com navegador** — decidir se a esteira inclui Playwright com `reducedMotion: 'reduce'`. — Sim ou não.
- [ ] **Limpeza local** — encerrar o `vite preview` na porta 4173; `docker rmi caddy:2-alpine` no WSL, se não for mais usado; reiniciar o Docker Desktop se ainda estiver travado.

## Bloqueadas
| Tarefa | Motivo | Tentativas |
|---|---|---|
| T-014 | Aguarda a foto nova (pendência acima). | 0 |

## Próxima rodada
Nada nesta rodada. O backlog não tem tarefas `todo`; T-014 segue bloqueada.

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

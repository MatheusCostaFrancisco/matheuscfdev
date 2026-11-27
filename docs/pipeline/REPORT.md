# Relatório da esteira — 2026-11-26 (rodada 5)

Deploy: https://www.matheuscfrancisco.dev.br/en/ · publicado (commit 6b30a34, deploy 840ee42f SUCCESS), sem checagem visual
Resumo: 6 entregues · 42 para revisão · 1 bloqueadas · 0 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-087 | `99a65ae` | Produtos em linhas de largura total. A partir de md, 2 colunas (2/5 à esquerda, 3/5 à direita). Detalhes só aparecem se existirem. |
| T-088 | `ed96b42` | Tokens escuros com acento teal espelhado. Seleção segue o sistema. Sombras com tinta variável. ADR 0011. |
| T-089 | `cd85896` | Tema salvo aplicado antes do primeiro paint em todas as páginas geradas. Metas color-scheme e theme-color. |
| T-090 | `c839690` | Rótulos tipados do seletor de tema (Sistema/Claro/Escuro; System/Light/Dark). |
| T-091 | `6803aac` | Seletor de três opções no header e no menu mobile, com a escolha salva no navegador. |
| T-092 | `6b30a34` | Lacunas do escuro fechadas: seleção, tags, 404, livros, favicon. Axe sem violações nos dois temas (dev server). |

## Para revisão
- [ ] **T-087 Produtos** — Conferir visual em 375, 768, 1024 e 1280 px: divisão 2/5 e 3/5 e sem scroll lateral. — O implementador não abriu o navegador; critérios de layout não foram testados.
- [ ] **T-087 WoodFlow** — Coluna esquerda termina cedo e deixa espaço vazio no card (~690 px em 1024 e 1280). Fixar a coluna (`md:sticky md:top-24 self-start`) ou manter? — Decisão de layout. Era o item T-031.
- [ ] **T-087 Proporção** — Coluna esquerda com ~351 px em 1280. Manter 2/5 + 3/5 ou testar 1/3 + 2/3?
- [ ] **T-088 Paleta escura** — Fundo #0c1615, cards #132120, texto #e4eeec, botão primário teal claro (#62d4c2) com texto escuro. Aprovar o tom ou pedir fundo mais neutro? — Decisão de gosto (ADR 0011). Menu mobile escuro tem pouca elevação; se achar pouco, subir surface-raised para #162625.
- [ ] **T-089 Barra do navegador** — Cor de theme-color: #f8faf9 no claro e #0c1615 no escuro. — Confirmar ou pedir outra cor.
- [ ] **T-091 Barra ao recarregar** — Com tema salvo diferente do SO, a barra mobile fica com a cor do SO depois de recarregar (a sincronização só roda no clique). — Pedir ao PO tarefa pequena para sincronizar no carregamento.
- [ ] **T-088 / T-092 Favicon** — Segue o SO, não o seletor do site (limitação documentada). No escuro vira tile teal claro com M escuro. — Conferir nas abas clara e escura; decidir se deve seguir o seletor (troca de href no script, opcional).
- [ ] **T-092 Seleção de texto** — Agora é bloco accent-600 com texto on-accent nos dois temas e na jornada, mais forte que antes. — Confirmar o visual. O fundo da seleção fica abaixo de 3:1 contra a superfície (1.3 a 2.0:1); o texto passa AA. Se o critério 2 vale para o fundo, ajustar ou registrar exceção na ADR 0011.
- [ ] **T-092 Tags** — Borda accent-600 nas tags de Produtos e Habilidades deixa o escuro denso. Tags neutras do Hero e o rótulo "traduzido" em Depoimentos ficam em 3.0 a 3.4:1 no claro, pouco acima do 3:1 pedido. — Alinhar as tags ou registrar exceção na ADR 0011.
- [ ] **T-091 Seletor, ícones** — Só ícones (Monitor, Sun, Moon) com tooltip e nome acessível. — Quer rótulo "Tema" visível? No menu mobile o seletor fica numa linha própria; prefere na mesma linha do idioma?
- [ ] **T-091 Estado selecionado** — Selecionado = fundo accent-100 mais anel de 1px accent-600. No escuro o fundo é sutil. — Conferir se o anel se distingue do foco (offset 2), em claro e escuro.
- [ ] **T-091 Consistência** — Idioma (EN/PT) e item ativo da navegação ainda usam só o fundo. — Pedir ao PO tarefa para aplicar o mesmo anel?
- [ ] **T-091 Troca rápida** — Clicar em duas opções em menos de ~2 frames pode animar as cores e quebra o critério 5. Também corta transições de reveal em curso. — Pedir ao PO tarefa pequena (cancelar o rAF anterior) ou aceitar por ora.
- [ ] **T-091 Jornada** — Botão de tema escondido na jornada (decisão do PO; a página é sempre escura). — Se preferir desabilitado com explicação, escrever ao lado.
- [ ] **T-089 / T-092 Flash** — Não verificado no navegador: sem flash claro ao recarregar com "Escuro" salvo, e na ida home escura → jornada → volta. — Rodar `yarn build && yarn preview` e conferir.
- [ ] **T-092 ADR 0011** — Adendo ainda diz que o axe em /livros/ está pendente. O axe já rodou (zero violações, no dev server). — Pedir ao PO atualizar o parágrafo.
- [ ] **T-083** Estrelas caindo vão para dentro da cena e a 7 unidades/s quase não se movem. — Ver se lê como o movimento desejado; subir `FALL_SPEED` para 15–25 se quiser mais presença.
- [ ] **T-085** Ondulação do mundo atual ocupa ~35–40 px em 1280x800 e quase não aparece; menor em 375 px. — Ver na tela; se faltar, subir `CORE_RIPPLE.amplitude` para 0.06–0.07 ou aproximar a câmera.
- [ ] **T-086** Trilha não iluminada quase invisível (`#2a3045`, opacidade 0.22); o caminho até os bloqueados some. — Aceitar, ou pedir trilha mais visível (`planets.ts`).
- [ ] **T-081 / T-084 / T-086 Docs** — ADR 0009 sem adendo T-086 e com valores antigos de bloom e túnel; ADR 0010 sem o pior caso de `line-strong` sobre o HUD (2.70:1, sem uso hoje). — Mandar o PO abrir tarefa de docs (adendos, nada reescrito), ou aceitar.
- [ ] **T-073 / T-074** Primeira dobra da jornada só mostra o palco: título, resumo e Pausar ficam abaixo, e nada convida a rolar. — Aceitar, ou pedir barra curta com título/pausa ou dica de rolagem (refaz o contraste).
- [ ] **T-077 / T-063 / T-064** Glow e estrela do chefão quebram a regra "sem glow" (exceção à ADR 0001 e 0007). A lista 2D aparece sem WebGL2, Save-Data, `deviceMemory` < 4 ou reduced motion. — Confirmar a exceção e a regra da lista 2D.
- [ ] **T-078** Pouso de 420 unidades: nos primeiros ~40% do voo o palco quase não tem planetas. Voo é um dolly reto, não segue a trilha. — Manter, ou reduzir para ~200 e decidir se o voo deve seguir a trilha.
- [ ] **T-076 / T-079** Com a animação pausada, setas, botões e mudança de orientação não movem a câmera. — Decidir se navegar deve mover o palco mesmo pausado.
- [ ] **T-076** Roda do mouse não troca mundo, para não prender o visitante antes da lista. Swipe é horizontal. — Confirmar, ou escrever ao lado se quer a roda.
- [ ] **T-076** Link `#mundo-N` abre o mundo certo, mas a página rola até o card da lista e o palco fica fora da tela. — Palco ou card como destino?
- [ ] **T-076** Sem dica de arraste nem de setas no palco; o texto de teclado só diz "Enter abre o painel". — Quer dica visível, ex.: "Arraste ou use as setas para trocar de mundo"?
- [ ] **T-075 / T-079** Rótulos somem quando cobertos pelo HUD ou fora de câmera; em celular, um planeta sob o painel não pode ser tocado (os cards abrem). — Aceitar, ou reposicionar o rótulo em vez de esconder.
- [ ] **T-074 / T-079** HUD em 375x812 ocupa ~40% do palco. — Manter a densidade, ou encolher ou recolher os painéis no celular.
- [ ] **T-079** Em 320 px com zoom 400% o palco tem piso de 32rem e rola na vertical; só o rótulo do mundo atual aparece. — Aceitar, ou encolher o palco.
- [ ] **T-074** Botão de pausa mantém o rótulo "Pausar animação" quando pressionado (troca ícone e preenche o fundo). A pausa não é lembrada entre visitas. — Confirmar o rótulo fixo e a falta de memória.
- [ ] **T-075** Rótulo mostra `{xp}%` sem a palavra "XP"; rótulo 28 px abaixo do centro pode cobrir o planeta atual grande. — Escrever "XP"? Ajustar o offset após ver no navegador.
- [ ] **T-080** Fade de ~415 px em cada card da lista de mundos. — Gostar do efeito, ou reveal só em títulos e livros?
- [ ] **T-072** Em rede lenta, jornada e livros aparecem em branco abaixo do header (sem skeleton, sem `aria-busy`). Chunks de 6.18 kB e 1.00 kB gzip; home em 90.59 kB gzip (limite 93.58). — Aceitar, ou pedir skeleton. Confirmar o limite.
- [ ] **T-066** Diálogo do planeta: foco em 320 px com zoom 400% e retorno do foco ao card não testados; o diálogo repete o card. — Testar; o card vira só resumo?
- [ ] **T-042 / T-045 / T-041 / T-023** Header e menu: largura do header em 1280 e 1440 px (PT e EN), hambúrguer de 768 a 1279 px, nome do header vai para `#main`, menu no iOS fecha ao tocar fora, botão "Menu" nos dois idiomas. — Confirmar ou ajustar cada um.
- [ ] **T-050 / T-052 / T-040 / T-029** Movimento e foco: hero desbotado no primeiro paint; em 320x256 e 640x360 o último bloco leva até 1 s; seção aberta por hash sem anel de foco; scroll inicial de `/en/#contact` instantâneo. — Decidir cada um.
- [ ] **T-055 / T-048 / T-057 / T-056** Conteúdo en e títulos: títulos mistos e `lang` do `<progress>` em "70%"; traduções en dos seis depoimentos e dos 47 itens e 9 chefões em `journey.ts`; segundo bullet da ElevaTech. — Revisar em `src/content/`; confirmar a regra de idioma dos títulos.
- [ ] **T-030 / T-033 / T-060 / T-061 / T-036 / T-058** Textos e dados: "Stack do Manda Aí" ou "Stack: Manda Aí" e "da ElevaTech"; localização pt sem Brasil e dois MBAs seguidos; chefão bloqueado repete a regra; teaser "Mundo atual · XP 0%"; anos "8 anos" e "mais de 7 anos" mudam sem commit; checkbox do chefão conta para o XP. — Escolher; fixar os anos em `career.ts` se quiser.
- [ ] **T-034 / T-049 / T-046 / T-027 / T-039 / T-022 / T-047 / T-013** Layout: 8 competências ocupam ~2,5 telas no celular; seis depoimentos ~5000 px entre Experience e Products; teaser de livros mostra Código Limpo sem título; Livros e Jornada aparecem duas vezes na home; barra de progresso dos livros pesada; ícones no contato; 404 sem idioma e "Roadmap" repetido. — Escolher por item.
- [ ] **T-035 / T-032 / T-059 / T-067** Sinais e docs: canonical na raiz e meta description cortada; ADR 0004 vs 0003; paleta da jornada fora da ADR 0001 (agora coberta pela ADR 0010); sombras da jornada quase invisíveis; commit `b7cccbc` incluiu arquivos não previstos. — Decidir; conferir o commit (`git show --stat b7cccbc`).
- [ ] **Layout geral** — Smoke não feito em 375, 768 e 1024 px, PT e EN (seções, teasers, depoimentos, jornada, livros, 404, scroll horizontal). — Só `/en/` e `/404` foram vistos em 375.

## Pendências do stakeholder
- [ ] **Ver o escuro publicado** — o deploy 6b30a34 foi ao ar sem checagem visual do tema escuro, do seletor e da linha de produtos. — Abrir `/pt/` e `/en/` com o SO em claro e em escuro; testar Sistema, Claro e Escuro; ver produtos em 375 e 1280 px. Se algo estiver ruim, escrever ao lado do item de revisão correspondente.
- [ ] **Reduced motion** — checagem real ainda não feita. — Ligar reduced motion no SO ou em DevTools (Rendering > Emulate CSS prefers-reduced-motion): a jornada deve mostrar só a lista 2D e nenhum elemento com `data-reveal`.
- [ ] **Validação 3D em aparelho real** — desktop e 375 px: planeta atual, voo entre mundos, halo sob o painel. Em Android, device orientation (pode empurrar rótulo sob o HUD). — Confirmar.
- [ ] **Progresso simulado** — 0 mundos concluídos nos dados reais: anel e selo, fluxo de luz e chefão desbloqueado nunca foram vistos em tela. — Testar com progresso temporário em dev, sem commitar.
- [ ] **Teto do chunk `scene`** — 553 kB (144 kB gzip); o limite do Vite subiu de 550 para 560 kB (`vite.config.ts`, adendo na ADR 0009). — Aprovar 560 kB como teto, ou pedir corte de peso.
- [ ] **Redirect 301 sem www** — no Cloudflare, Rules > Redirect Rules: `matheuscfrancisco.dev.br/*` para `https://www.matheuscfrancisco.dev.br/$1`, com 301. O apex responde 200 hoje. — Ou me peça para criar via MCP (exige `CLOUDFLARE_API_TOKEN` no ambiente).
- [ ] **Foto de perfil nova** — substituir `content/assets/profile.jpg`. — Libera a T-014.
- [ ] **Teste de preview** — `/assets/profile-*.jpg` deve responder 200; testar o link no LinkedIn Post Inspector e no Facebook Sharing Debugger.
- [ ] **Search Console** — enviar `https://www.matheuscfrancisco.dev.br/sitemap.xml`. — Antes, decidir se quer `<lastmod>` (o build não tem data confiável por página).
- [ ] **Cache de `/fonts/` em produção** — `curl -I https://www.matheuscfrancisco.dev.br/fonts/poppins-latin-400-normal.woff2` responde `max-age=14400`; o esperado é `max-age=31536000, immutable`. — Repetir em algumas horas; se persistir, regra de cache no Cloudflare (pode reabrir ADR 0006).
- [ ] **Stash** `stash@{0}` = `esteira/2026-11-24/interrompida/T-037`. — `git stash show -p stash@{0}`; `git stash drop` se não servir.
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

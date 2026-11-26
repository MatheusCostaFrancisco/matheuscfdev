# Relatório da esteira — 2026-11-26 (rodada 3)

Deploy: https://www.matheuscfrancisco.dev.br · publicado (commit f9af208, deployment 9561fd83 SUCCESS), sem checagem visual
Resumo: 8 entregues · 24 para revisão · 1 bloqueadas · 0 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-073 | `00922b7` | Palco 3D em tela cheia no topo da jornada; resumo e lista abaixo, em fundo opaco. |
| T-074 | `3d08b26` | HUD nos cantos do palco (título, pausa, De/Para, XP). Pior contraste 6.21:1. |
| T-075 | `7c4f97c` | Rótulos HTML presos aos planetas por projeção (clique, teclado, leitor de tela). Corrigido arquivo em Latin-1 que mostrava `�`. |
| T-076 | `10c9d33` | Troca de mundo por setas, arraste, swipe e botões anterior/próximo. Roda do mouse não troca mundo. |
| T-077 | `3cff1b7` | Bloom, atmosfera e halo recalibrados; chefão final como estrela. Sem aprovação visual. |
| T-078 | `28df6d3` | Câmera pousa no mundo atual em 1,6 s ao iniciar a cena. |
| T-079 | `a9ee58b` | Trilha vertical e rótulos sem sobreposição em 375 px; piso de altura só até 480 px. |
| T-080 | `f9af208` | Reveal de volta nas seções lazy de jornada e livros. |

## Para revisão
- [ ] **T-073 / T-074** Primeira dobra da jornada só mostra o palco: título, resumo e Pausar ficam abaixo, e nada convida a rolar. — Aceitar, ou pedir barra curta com título/pausa ou dica de rolagem (refaz o contraste).
- [ ] **T-077** Bloom 0.9 / 0.6 / 0.2: no navegador de teste o mundo atual ainda vira disco branco, sem superfície visível. Já está publicado. — Aprovar a intensidade ou pedir calibragem. Para reduzir: `BLOOM_STRENGTH` em `bloom.ts`.
- [ ] **T-077** Chefão final bloqueado virou estrela cinza (raios, corona, névoa e cadeado). — Confirmar que lê como bloqueado e como chefão, diferente dos planetas.
- [ ] **T-077 / T-063 / T-064** Glow e estrela do chefão quebram a regra "sem glow" (exceção à ADR 0001 e 0007); a nebulosa CSS soma com a WebGL; sem WebGL2, Save-Data, `deviceMemory` < 4 ou reduced motion a página mostra a lista 2D. — Confirmar a exceção, manter ou não a nebulosa CSS, e a regra da lista 2D.
- [ ] **T-078** Pouso de 420 unidades: nos primeiros ~40% do voo o palco quase não tem planetas. Voo é um dolly reto, não segue a trilha. — Manter, ou reduzir para ~200 e decidir se o voo deve seguir a trilha.
- [ ] **T-076 / T-079** Com a animação pausada, setas, botões e mudança de orientação não movem a câmera (o loop está parado). — Decidir se navegar deve mover o palco mesmo pausado.
- [ ] **T-076** Roda do mouse não troca mundo, para não prender o visitante antes da lista. Swipe é horizontal (`touch-action: pan-y`). — Confirmar as duas escolhas, ou escrever ao lado se quer a roda.
- [ ] **T-076** Link `#mundo-N` abre o mundo certo, mas a página rola até o card da lista e o palco fica fora da tela. — Palco ou card como destino?
- [ ] **T-076** Sem dica de arraste nem de setas no palco; o texto de teclado só diz "Enter abre o painel". — Quer dica visível, ex.: "Arraste ou use as setas para trocar de mundo"?
- [ ] **T-075 / T-079** Rótulos somem quando cobertos pelo HUD ou fora de câmera; em celular, um planeta sob painel não pode ser tocado (os cards abrem). — Aceitar, ou reposicionar o rótulo em vez de esconder.
- [ ] **T-074 / T-079** HUD em 375x812 ocupa cerca de 40% do palco. — Manter a densidade, ou encolher ou recolher os painéis no celular.
- [ ] **T-079** Em 320 px com zoom 400% o palco tem piso de 32rem e rola na vertical; só o rótulo do mundo atual aparece. — Aceitar, ou encolher o palco.
- [ ] **T-074** Botão de pausa mantém o rótulo "Pausar animação" mesmo pressionado (troca ícone e preenche o fundo). A pausa não é lembrada entre visitas. — Confirmar o rótulo fixo e a falta de memória.
- [ ] **T-075** Rótulo mostra `{xp}%` sem a palavra "XP"; rótulo 28 px abaixo do centro do planeta pode cobrir o planeta atual grande. — Escrever "XP"? Ajustar o offset pela borda do planeta, após ver no navegador.
- [ ] **T-080** Fade de ~415 px em cada card da lista de mundos. — Gostar do efeito, ou reveal só em títulos e livros?
- [ ] **T-072** Em rede lenta, jornada e livros aparecem em branco abaixo do header (fallback sem skeleton, sem `aria-busy`). Chunks de 6.18 kB e 1.00 kB gzip; home em 90.59 kB gzip (limite 93.58). — Aceitar, ou pedir skeleton. Confirmar o limite.
- [ ] **T-066** Diálogo do planeta: foco em 320 px com zoom 400% e retorno do foco ao card não testados; o diálogo repete o card. — Testar; o card vira só resumo?
- [ ] **T-042 / T-045 / T-041 / T-023** Header e menu: largura do header em 1280 e 1440 px (PT e EN), hambúrguer de 768 a 1279 px, nome do header vai para `#main`, menu no iOS fecha ao tocar fora, botão "Menu" nos dois idiomas. — Confirmar ou ajustar cada um.
- [ ] **T-050 / T-052 / T-040 / T-029** Movimento e foco: hero desbotado no primeiro paint; em 320x256 e 640x360 o último bloco leva até 1 s (margem `-8%`); seção aberta por hash sem anel de foco; scroll inicial de `/en/#contact` instantâneo. — Decidir cada um.
- [ ] **T-055 / T-048 / T-057 / T-056** Conteúdo en e títulos: títulos mistos e `lang` do `<progress>` em "70%"; traduções en dos seis depoimentos (marcadas "Translated from Portuguese") e dos 47 itens e 9 chefões em `journey.ts`; segundo bullet da ElevaTech. — Revisar em `src/content/`; confirmar a regra de idioma dos títulos.
- [ ] **T-030 / T-033 / T-060 / T-061 / T-036 / T-058** Textos e dados: "Stack do Manda Aí" ou "Stack: Manda Aí" e "da ElevaTech"; localização em pt sem Brasil e dois MBAs seguidos; chefão bloqueado repete a regra; teaser "Mundo atual · XP 0%"; anos "8 anos" e "mais de 7 anos" mudam sem commit; checkbox do chefão conta para o XP. — Escolher; fixar os anos em `career.ts` se quiser.
- [ ] **T-031 / T-034 / T-049 / T-046 / T-027 / T-039 / T-022 / T-047 / T-013** Layout: WoodFlow deixa cards vazios em 1024+ px; 8 competências ocupam ~2,5 telas no celular; seis depoimentos ~5000 px entre Experience e Products; teaser de livros mostra Código Limpo sem título; Livros e Jornada aparecem duas vezes na home; barra de progresso dos livros mais pesada; ícones no contato; 404 sem idioma e "Roadmap" repetido. — Escolher por item (ex.: WoodFlow em 3 colunas só em xl).
- [ ] **T-035 / T-032 / T-059 / T-067** Sinais e docs: canonical na raiz e meta description cortada; ADR 0004 vs 0003; paleta da jornada fora da ADR 0001, sombras quase invisíveis; commit `b7cccbc` incluiu arquivos não previstos (`git show --stat b7cccbc`); túnel de 1,4 s em revisita. — Decidir; conferir o commit.
- [ ] **Layout geral** Smoke não feito em 375, 768 e 1024 px, PT e EN (seções, teasers, depoimentos, jornada, livros, 404, scroll horizontal, `aria-label` de produto). — Só `/en/` e `/404` foram vistos em 375.

## Pendências do stakeholder
- [ ] **Ver a jornada publicada** — publicada sem checagem visual (deployment 9561fd83). — Abrir `/pt/jornada/` e `/en/journey/` em 1280x800 (ou 1024x768) e 375x812: palco, planeta atual, HUD, rótulos e primeira dobra. Se algo estiver ruim, pedir tarefa ou reversão.
- [ ] **Reduced motion** — checagem real ainda não feita. — Ligar reduced motion no SO ou em DevTools (Rendering > Emulate CSS prefers-reduced-motion): a jornada deve mostrar só a lista 2D e nenhum elemento com `data-reveal`. O axe dos revisores deu 0 violações.
- [ ] **Validação 3D em aparelho real** — desktop e 375 px: planeta atual, voo entre mundos, halo sob o painel. Em Android, device orientation (pode empurrar rótulo sob o HUD). — Confirmar.
- [ ] **Progresso simulado** — 0 mundos concluídos nos dados reais: anel e selo, fluxo de luz e chefão desbloqueado nunca foram vistos. — Testar com progresso temporário em dev, sem commitar.
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

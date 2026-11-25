# Relatório da esteira — 2026-11-25 (rodada 1)

Deploy: https://www.matheuscfrancisco.dev.br · publicado (commit 59e76f9, deploy a9e1e611)
Resumo: 10 entregues · 30 para revisão · 1 bloqueadas · 2 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-045 | `48d0d2a` | Header e seletor de idioma apontam para as páginas de roadmap e livros, com estado da página atual. |
| T-037 | `1d44523` | robots.txt e sitemap.xml cobrindo as 6 páginas, com hreflang (en, pt-BR, x-default). |
| T-046 | `375b283` | Teasers na home: etapa atual do roadmap e livro em leitura. |
| T-047 | `8183a76` | 404 com links para home, roadmap e livros em cada idioma. |
| T-048 | `579eea5` | Conteúdo tipado dos 6 depoimentos. Versão en marcada como tradução. |
| T-049 | `cf173d5` | Seção de depoimentos depois de Experience, com link para as recomendações do LinkedIn. |
| T-050 | `2cf9cfb` | Reveal ao entrar na tela, escalonado por card. Substitui a animação só no carregamento. Ver item de zoom 400%. |
| T-051 | `25ba711` | Linha da jornada e marcador da etapa atual animados, com reduced motion respeitado. Ver item de `:has()`. |
| T-039 | `908d77a` | Barras de progresso arredondadas no Safari (não testado em Safari real) e trilha com contraste 3:1. |
| T-040 | `59e76f9` | Foco vai para a seção aberta por hash. |

## Para revisão
- [ ] **T-050** zoom 400% (viewport 320x256): Experience, Recomendações e Produtos podem ficar com opacity 0 para sempre. O revisor de UI escreveu que a tarefa não deveria ser commitada antes de corrigir, e o JSON não registra verificação em 320x256 ou 640x360 depois da aprovação — verificar no navegador, rolando a página inteira; se confirmar, peça ao PO tarefa de correção com prioridade alta.
- [ ] **T-051** `src/lib/use-journey-progress.ts` ainda usa `li:has(...)`. Em Firefox < 121 e Safari < 15.4 isso lança erro e a página de roadmap pode ficar em branco. Revisores pediram troca por `closest`; não foi aplicado — peça ao PO tarefa de correção.
- [ ] **Smoke de layout** nada foi medido no navegador em 375, 768 e 1024px nos dois idiomas, exceto /en/ e /404.html em 375. Conferir antes do próximo deploy: #skills, #products, #roadmap, #books, #contact, #experience, teasers, depoimentos, /roadmap/, /livros/ (ou /books/), 404 e aria-labels de produto (T-030).
- [ ] **T-046** teaser do roadmap mostra o tema da etapa ("Fechar o MBA e mapear as lacunas reais do dia a dia"), não o rótulo "Aquecimento" que o critério 2 cita, e ocupa 3 linhas em 375px — decidir: tema, rótulo ou os dois.
- [ ] **T-046** teaser de livros mostra o livro com maior progresso informado (hoje Código Limpo, 70%), não o primeiro da lista. Seção sem título visível (h2 só para leitor de tela) e Roadmap/Livros aparecem duas vezes na home (nav e teasers) — confirmar que é isso mesmo.
- [ ] **T-045 / T-042** entre ~1009 e ~1150px o nome do header quebra em 2–3 linhas (~103px de altura) e a âncora de seção (`scroll-mt-20`) cai sob ele. Coberto pela T-042 (P2). Decidir: subir a prioridade, encurtar a marca (ex.: "Matheus C. Francisco") ou mover o menu para breakpoint maior.
- [ ] **T-045** conferir no navegador, em 375px com menu aberto e fechado, que não há scroll horizontal nas 6 páginas, e que /pt/#experience vindo de /pt/livros/ cai abaixo do header. Decidir se o nome do header nas páginas internas deve levar à home (hoje vai para `#main`).
- [ ] **T-049** posição e volume dos depoimentos: são 6 inteiros, cerca de 5000px no celular, e a seção fica entre Experience e Products. Decidir a posição (ou antes de Contato), se mostra todos, resumidos ou com `<details>`, e o texto do link em pt ("Ver original no LinkedIn" soa estranho; sugestão: "Ver recomendações no LinkedIn").
- [ ] **T-048** traduções en dos 6 depoimentos (feitas pelo implementador, ex.: "absurda" virou "outstanding"), marcadas "Translated from Portuguese". Revisar em `src/content/testimonials.ts`. Confirmar se as quebras simples do depoimento da Áiska Hacine viram 5 parágrafos.
- [ ] **T-027 / T-039** barra de progresso dos livros: trilha `line-strong` e preenchimento `accent-900` passam 3:1, mas ficam mais pesados que a versão anterior. Confirmar o visual no navegador. Safari e Firefox reais não foram testados. "A Maneira Rápida e Fácil de Falar com Eficácia" segue sem barra — acrescentar percentual em `livros.md` ou aceitar.
- [ ] **T-040** a seção aberta por hash fica sem anel de foco (por desenho). Testar Tab em /en/#contact e decidir se quer alguma pista visual. Clicar duas vezes no mesmo link de hash não move o foco (sem `hashchange`); aceitar ou pedir tarefa.
- [ ] **T-050** movimento: confirmar 16px, 400ms e stagger de 70ms (teto 280ms), e se o Hero deve animar ao carregar. Cards de Produtos (~1600px em 1024px) nunca animam; ver item de layout de Produtos abaixo.
- [ ] **T-051** conector e marcador: (a) o preenchimento passa pelas etapas "Adiante" — manter como indicador de leitura ou parar na etapa atual; (b) o pulso do marcador para após 5 ciclos (4s) — confirmar ou pedir contínuo/único. Conferir o alinhamento e o fim da linha em 375px e 1080p.
- [ ] **T-038 / T-039 / T-049** marcações de idioma: "Andrew Hunt e David Thomas" como pt-BR, "AI Engineering" como en, "Musashi" e frases mistas sem marca. Também faltam: títulos de livros em pt sem `lang` em /en/ e títulos de perfil em pt nos depoimentos (WCAG 3.1.2). Confirmar a lista e pedir tarefa de correção.
- [ ] **T-047 / T-013** 404: texto em en e pt-BR (tom) e título só "404" — quer o nome na página ou os títulos das mensagens como h2? Os dois grupos de links não mostram o idioma e "Roadmap" repete com o mesmo visual: aceitar, legenda visível ("English" / "Português (Brasil)") ou layout compacto.
- [ ] **T-031** em 1024px+ o WoodFlow (8 bullets) deixa ElevaTech e Manda Aí com 700 a 850px de card vazio, e os cards de Produtos ficam com ~1600px. Escolha: (a) 3 colunas só em xl, com último card em linha inteira abaixo; (b) 3 colunas com alturas desiguais e `items-start`; (c) resumir o WoodFlow.
- [ ] **T-029** scroll inicial ao abrir `/en/#contact` é sempre instantâneo — quer suave para quem não pediu redução de movimento?
- [ ] **T-023** botão "Menu" nos dois idiomas — confirme "Menu" em pt-BR e diga se quer outro estilo no drawer mobile.
- [ ] **T-022** contato — confirme em 375px que e-mail e URL do LinkedIn quebram sem estourar. Quer ícones Lucide ao lado de cada canal?
- [ ] **T-024 / T-025** status do roadmap — Aquecimento aparece "Em andamento" antes de 01/12/2026. Quer "Adiante" até a data de início? Destino nunca vira "Concluída" depois de dez/2027. Confirme os rótulos ("Adiante" ou "A seguir"; nav "Roadmap" ou "Estudos 2027").
- [ ] **T-030** pt-BR — "Stack do Manda Aí" (artigo masculino) ou neutro "Stack: Manda Aí"? Produtos como a ElevaTech, tratada como empresa, pedem "da".
- [ ] **T-033** localização em pt-BR sai "Piracicaba, SP · Remoto" (sem Brasil), e em en "Piracicaba, SP, Brazil · Remote". A assimetria é desejada?
- [ ] **T-033** Formação agora tem dois MBAs seguidos (FIAP e "MBA em Desenvolvimento Front-End", IGTI). A leitura está boa?
- [ ] **T-034** Competências com 8 cards: em 375px a seção ocupa ~2,5 telas. Densidade OK ou compactar (chips menores, ou fundir "IA aplicada" em "Práticas")? "IA aplicada" tem só 2 itens: adicionar conteúdo ao cv.md ou fundir?
- [ ] **T-035 / T-036** página raiz `/` — tem hreflang e og:image absolutos, mas nenhum canonical. A meta description termina em "Choose English or Portuguese." e a og:description termina na lista de stack. Quer canonical na raiz e o mesmo texto nos dois?
- [ ] **T-036** dois números na primeira dobra: tagline "8 anos do suporte à engenharia sênior" (desde jul/2018) e resumo "mais de 7 anos" (desde nov/2019). Confirme os dois. O número muda sozinho em jul e nov, sem commit (a página usa a data do visitante; a meta, a data do build). Aceita, ou fixo em `career.ts`?
- [ ] **T-032** ADR ficou `docs/adr/0004-self-hosted-font.md`, mas o critério pedia 0003, número já usado por `0003-site-url-build-time.md`. Aceita o 0004?
- [ ] **Herdado** copy e CTAs — "Get in touch", rodapé só com © e nome, contato sem CTA de destaque, "Visit site" no Manda Aí, hero em pt-BR quebra em 375px. Aprove ou diga o que trocar.
- [ ] **Herdado** densidade de Experience (17 bullets, RKM separado) e Education (lista simples) — cards ou lista? Agrupar RKM sob uma empresa?
- [ ] **Herdado** decisões de base (ADR 0001 e afins): acento teal, só tema claro, `clsx` e `tailwind-merge` no `cn()`, ignore do ESLint em `.claude`, favicon "M", card OG 1200x630, meta description, reset de `--radius-*`. Confirme ou aponte o que muda.

## Pendências do stakeholder
- [ ] **Redirect 301 sem www** — no Cloudflare em Rules > Redirect Rules: `matheuscfrancisco.dev.br/*` para `https://www.matheuscfrancisco.dev.br/$1`, com 301. O apex ainda responde 200. Ou me peça para criar via MCP.
- [x] **Registro DNS `!`** — corrigido pelo stakeholder para `@` em 2026-11-24; o nome `!` não resolve mais.
- [x] **Deploy automático por push** — funcionando após reconectar a fonte no Railway (deploy `a9e1e611` disparado pelo push).
- [ ] **Foto de perfil nova** — substituir `content/assets/profile.jpg`. A T-014 espera a foto.
- [x] **404 no Railway** — conferido em 2026-11-25: `/qualquer-coisa` responde **200 com a home** (fallback de SPA). Virou tarefa P1 nas Decisões abaixo.
- [x] **Cache de `/fonts/`** — conferido: `Content-Type: font/woff2` ok, mas `Cache-Control: max-age=14400` (4h). Cache longo entra na mesma tarefa do 404.
- [ ] **Teste de preview** — conferir que `/assets/profile-*.jpg` responde 200 e testar o link no LinkedIn Post Inspector e no Facebook Sharing Debugger.
- [ ] **Search Console** — depois do deploy, enviar `https://www.matheuscfrancisco.dev.br/sitemap.xml` ao Google Search Console (conta do stakeholder). Antes, decidir se quer `<lastmod>` no sitemap: o build não tem data confiável por página.
- [ ] **Stash antigo** — `stash@{0}` (`esteira/2026-11-24/interrompida/T-037`) segue guardado. O conteúdo já está na T-037. Para descartar: `git stash drop stash@{0}`, depois de conferir com `git stash show -p stash@{0}` se quiser.
- [ ] **Campo `zoneStatus`** em `docs/pipeline/deploy.json` ainda diz `pending`, embora o domínio já responda. Confirme e peça ao PO para atualizar.

## Decisões para a próxima rodada

Registradas em 2026-11-25 pela sessão principal. O PO cria estas tarefas antes das P2 do backlog.

1. **Conteúdo invisível com zoom 400% (P1, fix da T-050).** Em viewport 320x256 e 640x360, seções com reveal podem ficar com opacity 0 para sempre. O conteúdo tem que aparecer sempre: fallback que revela tudo se o observer não disparar, `threshold`/`rootMargin` que funcionem com seções maiores que a viewport, e nada escondido sem JS. Revisor de UI precisa medir em 320x256 e 640x360 rolando a página inteira, nos dois idiomas.
2. **`:has()` na jornada (P1, fix da T-051).** Trocar `li:has(...)` em `src/lib/use-journey-progress.ts` por `closest` ou equivalente sem `:has()`, para a página de roadmap não quebrar em navegadores antigos.
3. **404 de verdade e cache dos assets (P1).** Hoje qualquer URL inexistente responde 200 com a home. Fazer o servidor do Railway (Railpack/Caddy) responder 404 com o `404.html` para rotas que não existem, mantendo as 6 páginas e os assets. Na mesma tarefa: `Cache-Control` longo e `immutable` para `/assets/` e `/fonts/` (arquivos com hash). Registrar em ADR. Verificar com `curl -i` em produção.

## Bloqueadas
| Tarefa | Motivo | Tentativas |
|---|---|---|
| T-014 | Aguarda a foto nova (pendência acima). Volta a todo quando `content/assets/profile.jpg` for substituído. | 0 |

## Próxima rodada
T-041 · Close the mobile menu on outside tap, including iOS Safari · P2
T-042 · Keep the header on one line and tie section scroll offset to its height · P2

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

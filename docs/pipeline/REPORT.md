# Relatório da esteira — 2026-11-24 (rodada 6)

Deploy: https://site-production-5010b1df.up.railway.app · parcial (build de `266ab8a` publicado pelo plano B; domínio customizado aguarda nameservers)
Resumo: 10 entregues · 23 para revisão · 1 bloqueadas · 5 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-030 | `c36947a` | Rótulos de produto por idioma: "Stack do Manda Aí" e "Site do Manda Aí" em pt-BR; "Manda Aí stack" em en. |
| T-033 | `9da34ee` | Resumo em 2 parágrafos por idioma, localização com SP e IGTI como MBA (en e pt-BR), sincronizados com o cv.md. |
| T-034 | `ce6cf93` | Competências com os 8 grupos do cv.md em en e pt-BR. |
| T-035 | `c734803` | Canonical, og:url, hreflang e og:image absolutos a partir de `SITE_URL` em `.env.production`, com validação no build. ADR 0003. |
| T-036 | `d8067cf` | Anos de experiência calculados pelas datas do cv.md: "8 years" na tagline e "7+" no resumo. |
| T-038 | `5fdd08e` | `lang` em trechos em outro idioma: livros em pt-BR no /en/ e termos de roadmap em en no /pt/. |
| T-012 | `cbca43e` | Animação de entrada das seções (opacity e transform, 400ms, só com movimento permitido). |
| T-013 | `8548644` | Página 404 gerada no build, em en e pt-BR. |
| T-031 | `d6ebad8` | Produtos em 3 colunas a partir de lg; último grupo de Skills ocupa a linha inteira quando o número de grupos é ímpar. |
| T-032 | `266ab8a` | Poppins servida pelo próprio site, sem Google Fonts. ADR 0004. |

## Para revisão
- [ ] **T-029** scroll inicial ao abrir `/en/#contact` é sempre instantâneo — quer suave para quem não pediu redução de movimento?
- [ ] **T-023** botão "Menu" nos dois idiomas — confirme "Menu" em pt-BR e diga se quer outro estilo no drawer mobile.
- [ ] **T-022** contato — confirme em 375px que e-mail e URL do LinkedIn quebram sem estourar. Quer ícones Lucide ao lado de cada canal?
- [ ] **T-024 / T-025** status do roadmap — Aquecimento aparece "Em andamento" antes de 01/12/2026. Quer "Adiante" até a data de início? Destino nunca vira "Concluída" depois de dez/2027. Confirme os rótulos ("Adiante" ou "A seguir"; nav "Roadmap" ou "Estudos 2027").
- [x] **T-024 / T-025** conteúdo do roadmap — RESPOSTA: a trilha ganha conector visual animado (ver Decisões abaixo). Entregáveis e bloco Método: manter como está.
- [ ] **T-027** livros — "A Maneira Rápida e Fácil de Falar com Eficácia" fica sem barra. Acrescentar percentual em `livros.md`?
- [ ] **Herdado** copy e CTAs — "Get in touch", rodapé só com © e nome, contato sem CTA de destaque, "Visit site" no Manda Aí, hero em pt-BR quebra em 375px. Aprove ou diga o que trocar.
- [ ] **Herdado** densidade de Experience (17 bullets, RKM separado) e Education (lista simples) — cards ou lista? Agrupar RKM sob uma empresa?
- [ ] **Herdado** decisões de base (ADR 0001 e afins): acento teal, só tema claro, `clsx` e `tailwind-merge` no `cn()`, ignore do ESLint em `.claude`, favicon "M", card OG 1200x630, meta description, reset de `--radius-*`. Confirme ou aponte o que muda.
- [ ] **T-030** pt-BR — "Stack do Manda Aí" (artigo masculino) ou neutro "Stack: Manda Aí"? Produtos como a ElevaTech, tratada como empresa, pedem "da".
- [ ] **T-033** localização em pt-BR sai "Piracicaba, SP · Remoto" (sem Brasil), e em en "Piracicaba, SP, Brazil · Remote". A assimetria é desejada?
- [ ] **T-033** Formação agora tem dois MBAs seguidos (FIAP e "MBA em Desenvolvimento Front-End", IGTI). A leitura está boa?
- [ ] **T-034** Competências com 8 cards: em 375px a seção ocupa ~2,5 telas. Densidade OK ou compactar (chips menores, ou fundir "IA aplicada" em "Práticas")? "IA aplicada" tem só 2 itens: adicionar conteúdo ao cv.md ou fundir?
- [ ] **T-035 / T-036** página raiz `/` — tem hreflang e og:image absolutos, mas nenhum canonical. A meta description termina em "Choose English or Portuguese." e a og:description termina na lista de stack. Quer canonical na raiz e o mesmo texto nos dois?
- [ ] **T-036** dois números na primeira dobra: tagline "8 anos do suporte à engenharia sênior" (desde jul/2018) e resumo "mais de 7 anos" (desde nov/2019). Confirme os dois. O número muda sozinho em jul e nov, sem commit (a página usa a data do visitante; a meta, a data do build). Aceita, ou fixo em `career.ts`?
- [x] **T-038** `pt/index.html` linha 46 tem `lang="en"` no #root — RESPOSTA: sim, criar tarefa P1.
- [ ] **T-038** marcações de idioma — "Andrew Hunt e David Thomas" como pt-BR e "AI Engineering" como en. "Musashi", nomes de autores e frases mistas como "Product Engineer full-stack com IA" ficaram sem marca. Confirme.
- [x] **T-012** animação roda só no carregamento — RESPOSTA: quero animação ao entrar na tela (observer), ver Decisões abaixo.
- [ ] **T-012** link com hash — a seção pode parar 12px sob o header (medido em `/pt/#skills`, por causa do translateY ainda ativo). Sugiro tarefa P2 de correção, que pode ir junto com T-040. Quer criar?
- [ ] **T-013** texto da 404 em en e pt-BR (tom) e título só "404". Quer o nome na página, ou os títulos das mensagens como h2?
- [ ] **T-031** em 1024px+ o WoodFlow (8 bullets) deixa ElevaTech e Manda Aí com 700 a 850px de card vazio. Escolha: (a) 3 colunas só em xl, com último card em linha inteira abaixo; (b) 3 colunas com alturas desiguais e `items-start`; (c) resumir o WoodFlow.
- [ ] **T-032** ADR ficou `docs/adr/0004-self-hosted-font.md`, mas o critério pedia 0003, número já usado por `0003-site-url-build-time.md`. Aceita o 0004?
- [ ] **Smoke de layout** nada foi medido no navegador em 375, 768 e 1024px nos dois idiomas, exceto /en/ e /404.html em 375. Conferir antes do próximo deploy: #skills (chip "Desenvolvimento orientado a especificação com agentes de IA"), #products, #roadmap, #books, #contact, #experience, e os aria-labels de produto (T-030).

## Pendências do stakeholder
- [x] **Nameservers do domínio** — RESPOSTA: trocados no Registro.br em 2026-11-24 para cartman/maxine.ns.cloudflare.com. Aguardando o .br publicar (o Cloudflare já responde pela zona).
- [ ] **Redirect 301 sem www** — depois da propagação, no Cloudflare em Rules > Redirect Rules: `matheuscfrancisco.dev.br/*` para `https://www.matheuscfrancisco.dev.br/$1`, com 301. Ou me peça para criar via MCP.
- [ ] **Registro DNS `!`** — no Cloudflare há um CNAME com nome `!.matheuscfrancisco.dev.br` apontando para `ptkaqk0u.up.railway.app`. Parece erro; deveria ser o apex (`@`). Corrija se não for intencional.
- [ ] **Deploy automático por push** — não disparou nesta rodada (o plano B foi usado). Confirme no Railway, no serviço em Settings > Source, que o trigger de push está ligado no repo MatheusCostaFrancisco/matheuscfdev, branch main.
- [ ] **Foto de perfil nova** — substituir `content/assets/profile.jpg`. T-014 espera a foto.
- [x] **Depoimentos** — RESPOSTA: usar as recomendações do LinkedIn. Feito: `content/depoimentos.md` (6 depoimentos, empresas confirmadas) e `content/cv.md` > Depoimentos.
- [ ] **404 no Railway** — depois do deploy, `curl -i https://www.matheuscfrancisco.dev.br/qualquer-coisa` deve responder 404 com o conteúdo de `404.html`. Se responder 200 com index.html, a configuração de SPA do Railway precisa de ajuste — peça ao PO uma tarefa.
- [ ] **Cache de `/fonts/`** — depois do deploy, conferir `Content-Type: font/woff2` e cache longo em `https://www.matheuscfrancisco.dev.br/fonts/`. A ADR 0004 tem gatilho para isso.
- [ ] **Teste de preview** — quando o domínio resolver, conferir que `/assets/profile-*.jpg` responde 200 e testar o link no LinkedIn Post Inspector e no Facebook Sharing Debugger.

## Decisões do stakeholder para a próxima rodada

Tomadas em 2026-11-24, depois da rodada 6. O PO cria as tarefas abaixo antes das P2 do backlog.

1. **Páginas próprias para Roadmap 2027 e Livros (P1).** Saem da home e ganham rota própria nos dois idiomas, na mesma aba (nunca nova aba para página interna; links externos continuam em nova aba). A home mantém Produtos e ganha um teaser curto de cada um, ex.: "Estudando agora: <etapa atual> → ver roadmap" e "Lendo: <livro> (<%>) → ver estante". Nav atualizado; canonical, hreflang, sitemap e 404 cobrindo as rotas novas. Slugs decididos em ADR.
2. **Efeitos, intensidade sutil e profissional (P1).** Durações de 200 a 500ms, deslocamento pequeno, sem dependência nova (CSS e IntersectionObserver), tudo desligado com `prefers-reduced-motion`.
   - Entrada no scroll: seções e cards com fade e leve deslize, escalonados, ao entrar na tela (substitui a animação só no carregamento da T-012). Não pode deixar a seção sob o header ao abrir link com hash.
   - Jornada animada no roadmap: linha que se desenha conforme o scroll ligando as etapas, com o marcador da etapa atual pulsando.
3. **Seção de depoimentos (P1).** Fonte: `content/depoimentos.md` (6 recomendações do LinkedIn). Mostrar citação, nome, título, empresa, relação e data, com link para a página de recomendações. pt-BR com o texto original; en com tradução marcada "Translated from Portuguese" e link para o original (item de revisão para o stakeholder conferir as traduções).
4. **`lang="en"` no #root de `pt/index.html` (P1).** Correção de uma linha (WCAG 3.1.1).

## Bloqueadas
| Tarefa | Motivo | Tentativas |
|---|---|---|
| T-014 | Aguarda a foto nova (pendência acima). Voltará a todo quando `content/assets/profile.jpg` for substituído. | 0 |

## Próxima rodada
T-037 · Add robots.txt and sitemap.xml with the canonical URLs · P2
T-039 · Polish book progress bars for Safari and track contrast · P2
T-040 · Move focus to the section opened by a URL hash · P2
T-041 · Close the mobile menu on outside tap, including iOS Safari · P2
T-042 · Keep the header on one line and tie section scroll offset to its height · P2

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

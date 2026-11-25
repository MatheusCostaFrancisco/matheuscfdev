# Relatório da esteira — 2026-11-24 (rodada 5)

Deploy: https://site-production-5010b1df.up.railway.app · parcial (build do `8004f1a` publicado pelo plano B, `connect-service-source`; o push não disparou deploy automático)
Resumo: 8 entregues · 16 para revisão · 0 bloqueadas · 6 no backlog

## Entregues
| Tarefa | Commit | Resumo |
|---|---|---|
| T-028 | `3e983f6` | `.gitattributes` com `eol=lf` e renormalização de 10 arquivos. Só quebras de linha mudaram. |
| T-022 | `2fb6702` | Link do GitHub na seção de contato, quebra de e-mail/URL e alvo de 44px nos links. |
| T-023 | `c58f017` | Menu mobile: foco, rótulo fixo "Menu" e alvos de 44px. Aprovado no ciclo 2. |
| T-024 | `cee1643` | Conteúdo tipado do roadmap 2027 (en e pt-BR) e helper de status por etapa. |
| T-025 | `13ca17a` | Seção Roadmap 2027. Nav troca para hambúrguer abaixo de 1024px (era 768px). |
| T-026 | `69b5832` | Conteúdo tipado de livros (en e pt-BR). Autores marcados com `*` completados pelo assistente. |
| T-027 | `eeafd74` | Seção Livros com 3 grupos e barras de progresso. |
| T-029 | `8004f1a` | Link com hash (`/en/#contact`, `/pt/#experience`) rola até a seção após o primeiro render. |

## Para revisão
- [ ] **Coberto por T-028 e T-029 (rodada 4)** churn de fim de linha e link com hash. Marque `[x]` para fechar. Decisão aberta: o scroll inicial é sempre instantâneo; quer suave para quem não pediu redução de movimento?
- [ ] **Sem tarefa: T-029 e T-023** foco não sobe para a seção após o hash (Tab começa no topo), fonte Poppins pode deslocar a seção no primeiro carregamento, e no iOS Safari tocar fora do menu não fecha o painel (o resumo cita um listener que não existe). Sugiro P2 em tarefa própria.
- [ ] **T-023** o botão é "Menu" nos dois idiomas. Confirme "Menu" em pt-BR e diga se quer mais espaçamento ou outro estilo no drawer mobile.
- [ ] **T-022** contato: confirme em 375px que e-mail e URL do LinkedIn quebram sem estourar. Ajustar alinhamento rótulo/valor em desktop (`sm:items-center`) e separar pares em mobile. Quer ícones Lucide ao lado de cada canal?
- [ ] **T-024 / T-025** status do roadmap: Aquecimento aparece "Em andamento" em 24/11/2026, antes de começar. Quer "Adiante" até a data de início? Destino fica "Adiante" até dez/2027 e depois "Em andamento" para sempre, nunca "Concluída". Confirme ou ajuste. Rótulos: "Adiante" ou "A seguir"/"Próxima"? Nav: "Roadmap" ou "Roteiro 2027"/"Estudos 2027"?
- [ ] **T-024** entregáveis de Aquecimento ("Mapa das lacunas reais do dia a dia") e Destino ("Quatro entregáveis públicos") foram tirados da frase de `estudos-2027.md`. Confirme. Destino não tem itens de estudo. O bloco Método (regras e rotina) não aparece na seção: quer numa tarefa futura?
- [ ] **T-025** a trilha não tem conector visual entre etapas (só cards). Quer uma linha do tempo com marcadores ou basta a lista?
- [ ] **T-025** termos em inglês no pt-BR ("Senior Front-End Engineer", "Full-stack ownership", "Frontend system design", "AI engineering") sem `lang`. Traduzir ou marcar `lang="en"`?
- [ ] **Sem tarefa: header** a marca "Matheus Costa Francisco" quebra em 2 a 3 linhas em pt-BR no desktop (header até ~103px, acima do `scroll-mt-20` de 80px). Pré-existente. Em 1024px a nav pt-BR pode estourar. Sugiro P2: `whitespace-nowrap` na marca ou altura do header em variável CSS.
- [ ] **T-026 / T-027** no /en/, títulos e autores estão em português (ex.: "Código Limpo (Clean Code)") sem `lang`. Manter com `lang="pt-BR"` ou usar títulos em inglês?
- [ ] **T-027** polimento: barra de progresso sem `appearance-none` (Safari); trilho com ~1.1:1 de contraste (usar `bg-line`); cards "Quero ler" com borda tracejada muito sutil; "A Maneira Rápida e Fácil de Falar com Eficácia" sem barra. Acrescentar percentual em `livros.md`?
- [ ] **T-022, T-025, T-027, T-029** scroll horizontal e layout em 375, 768 e 1024px, nos dois idiomas, não foram medidos no navegador. Conferir `/en/` e `/pt/` antes do próximo deploy. (Herdado da rodada 4.)
- [ ] **Herdado da rodada 4** copy e CTAs: "Get in touch" e "LinkedIn" escolhidos pelo agente; hero em pt-BR quebra "Engenheiro de Software Front-End Sênior" em 375px; rodapé só com © e nome; contato sem CTA de destaque; Manda Aí com rótulo "Visit site"?
- [ ] **Coberto por tarefas no backlog** rótulos de produto em pt-BR ("Manda Aí stack", "Manda Aí site:") → T-030. Grids de Products e Skills sem equilíbrio → T-031. Marque `[x]` para fechar cada um.
- [ ] **Herdado da rodada 4** densidade de Experience (17 bullets, RKM separado) e Education (lista simples). Decidir cards ou lista e se agrupa RKM sob uma empresa.
- [ ] **Herdado da rodada 4** decisões de base: acento teal e só tema claro (ADR 0001); `clsx` e `tailwind-merge` no `cn()`; ignore do ESLint em `.claude` (restringir a `.claude/workflows`?); favicon "M" branco; card OG 1200x630; meta description ("7+ years"); reset de `--radius-*` (opcional).
- [ ] **T-032 Poppins self-host** decisão do PO: self-host por LGPD e performance, com ADR 0003 previsto. Para manter o Google Fonts, marque `[x]` e escreva isso ao lado.

## Pendências do stakeholder
- [x] **Deploy automático por push** — RESPOSTA: permissão aplicada no GitHub. Plano B do deployer continua como reserva.
- [x] **Autores dos livros** — RESPOSTA: deixar como está.
- [x] **Domínio do site** — RESPOSTA: www.matheuscfrancisco.dev.br (canônico); sem www redireciona para www. Já em `content/cv.md` > Domínio. Registros do Cloudflare: o stakeholder cria (passos na sessão de 2026-11-24) ou expõe `CLOUDFLARE_API_TOKEN` para o deployer.
- [x] **Anos de experiência** — RESPOSTA: calcular pelo histórico. Feito em `content/cv.md` > Anos de experiência: 8 anos desde o suporte (jul/2018) e 7 anos desenvolvendo (nov/2019). Os dois ficam; o site deve calcular pelas datas.
- [x] **Alinhar `cv.md` e `cv.pt-BR.md`** — RESPOSTA: (a) MBA; (b) são reais, entraram no cv.md; (c) resumo pt-BR é o mais recente e foi levado para o en; (d) "Piracicaba, SP" em pt e "Piracicaba, SP, Brazil" em en. Aplicado nos dois arquivos.
- [ ] **Foto de perfil** — RESPOSTA: vou enviar outra depois. Manter a atual; T-014 espera a foto nova.
- [x] **Roteamento de idioma e âncoras** — RESPOSTA: ok, confirmado.
- [x] **Liberar axe-core** — RESPOSTA: autorizado. `axe-core` entrou como devDependency e o a11y-reviewer injeta o arquivo local pelo dev server (sem CDN).
- [ ] **Depoimentos** — RESPOSTA: pode colocar. Falta o conteúdo: mandar nome, cargo/empresa e texto de cada depoimento, com autorização da pessoa. Não criar a seção sem texto real.

## Bloqueadas
Nada nesta rodada.

## Próxima rodada
T-030 · Localize product link and stack labels with per-locale functions · P1
T-012 · Add subtle entrance animations respecting prefers-reduced-motion · P2
T-013 · Add 404 page · P2
T-014 · Optimize profile image delivery · P2 (depende da foto)
T-031 · Balance products and skills grids on wide screens · P2
T-032 · Self-host the Poppins font and drop Google Fonts requests · P2

---
Como responder: marque `[x]` no que resolveu/aprovou e escreva instruções ao lado do item, se quiser. O PO lê isso na próxima rodada.

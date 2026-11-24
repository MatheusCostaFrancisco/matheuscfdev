---
title: Esteira de desenvolvimento multiagentes
status: Accepted
date: 2026-11-24
owner: Matheus (stakeholder)
---

# Esteira de desenvolvimento multiagentes

## Contexto

O repositório `matheuscfdev` é o portfólio/CV pessoal que vai para produção. Hoje é o template Vite + React 19 + TypeScript + Tailwind 4, sem conteúdo.

O stakeholder quer uma esteira que planeja, implementa, revisa, commita e publica o site **sem intervenção durante a rodada**. No final de cada rodada, ele lê um relatório com o que foi entregue, o que precisa da revisão dele e o que só ele consegue resolver.

## Goals

- Rodar com um único comando (`/esteira`) no Claude Code desta máquina, do backlog ao deploy.
- Backlog gerado e priorizado por um agente PO, sem aprovação prévia.
- Toda tarefa passa por gates automáticos (`typecheck`, `lint`, `build`) e por 3 revisores independentes antes do commit.
- Commit direto na `main`, uma tarefa por commit, mensagem no padrão `<tipo>: <ação>`.
- Deploy no Railway, com DNS/CDN no Cloudflare.
- Relatório único em `docs/pipeline/REPORT.md` com **Entregues**, **Para revisão** e **Pendências do stakeholder**.
- Conteúdo do site vem só de `content/cv.md`. Nenhum agente inventa experiência, empresa, data, métrica ou contato.

## Non-goals

- Execução na nuvem, agendamento (cron) ou GitHub Actions. Fica para uma spec futura.
- CMS, blog, analytics, formulário com backend.
- Infra de teste além dos gates. Vitest entra só se uma tarefa tiver lógica pura que justifique (parser, cálculo).
- Comprar domínio, criar conta em qualquer serviço, gerar ou guardar tokens. Tudo isso vira pendência.
- Paralelizar implementação. Tarefas implementam em sequência porque commitam na mesma `main`.

## Arquitetura

### Peças

| Peça | Caminho | Papel |
|---|---|---|
| Comando de entrada | `.claude/commands/esteira.md` | Dispara o workflow `esteira` passando `runDate` e `maxTasks` |
| Orquestrador | `.claude/workflows/esteira.js` | Loop determinístico: planejar → implementar → gates → revisar → commitar → deploy → relatório |
| Agentes | `.claude/agents/*.md` | Um arquivo por papel, com prompt de sistema e ferramentas permitidas |
| Fonte de conteúdo | `content/cv.md` + `content/assets/` | Única fonte de verdade sobre o Matheus (texto do CV, foto) |
| Backlog | `docs/pipeline/backlog.json` | Estado das tarefas, lido e escrito pelos agentes |
| Relatório | `docs/pipeline/REPORT.md` | Sempre reflete a última rodada + itens abertos acumulados |
| Histórico | `docs/pipeline/runs/<runDate>-<n>.md` | Log de cada rodada, append-only |

O script do workflow não tem acesso a disco. Toda leitura e escrita de arquivo é feita por agentes. O script só decide o fluxo a partir das respostas estruturadas (JSON Schema) dos agentes.

### Agentes

| Agente | Quando roda | Entrada | Saída estruturada |
|---|---|---|---|
| `po` | Início de toda rodada | `cv.md`, `backlog.json`, código atual | Backlog atualizado no disco + lista das próximas tarefas elegíveis |
| `architect` | Tarefas do tipo `infra`/`design-system` e na primeira rodada | Tarefa + código | ADR em `docs/adr/` quando decide algo não óbvio, tokens, estrutura |
| `frontend-dev` | Tarefas `feature`, `fix`, `infra` | Tarefa + plano + achados de revisão anteriores | Arquivos alterados, resultado dos gates, resumo |
| `content-writer` | Tarefas `content` | Tarefa + `cv.md` | Arquivos de conteúdo, lista de trechos `[REVISAR]` |
| `code-reviewer` | Após gates verdes | Diff da tarefa | Veredito + achados |
| `ui-reviewer` | Após gates verdes, se a tarefa toca UI | Diff + screenshots (desktop e 375px) do preview local | Veredito + achados |
| `a11y-reviewer` | Após gates verdes, se a tarefa toca UI | Diff + página renderizada | Veredito + achados |
| `deployer` | Fim da rodada, se houve entrega | `main` com build verde | URL, status, pendências |
| `reporter` | Sempre, no final (inclusive em abortos) | Resultados da rodada | `REPORT.md` + log da rodada |

Os commits e reverts são feitos por chamadas curtas de agente com esforço baixo, fora dos papéis acima.

### Modelo da tarefa (`backlog.json`)

```json
{
  "version": 1,
  "cvHash": "sha256 de content/cv.md usado no último planejamento",
  "tasks": [
    {
      "id": "T-001",
      "title": "Criar tokens do design system",
      "type": "infra | design-system | feature | content | fix",
      "priority": "P0 | P1 | P2",
      "touchesUi": true,
      "acceptance": ["critério verificável 1", "critério verificável 2"],
      "dependsOn": [],
      "status": "todo | done | review | blocked",
      "attempts": 0,
      "commit": null,
      "notes": []
    }
  ]
}
```

Não existe status `doing` persistido: se a rodada cai no meio, a tarefa continua `todo` e a mudança parcial é descartada (ver Edge cases).

## Fluxo de uma rodada

1. **Pré-checagem.** Um agente verifica se a árvore git está limpa. Mudança não commitada sem o marcador `.inflight.json` aborta a rodada sem tocar em nada; com o marcador, vai para `git stash` (ver Edge cases).
2. **Planejamento.** `po` lê `cv.md` e `backlog.json`.
   - Backlog vazio ou `cvHash` diferente: gera ou reconcilia tarefas. Tarefas `done` não são recriadas.
   - Retorna até `maxTasks` (padrão 8) tarefas `todo` com dependências satisfeitas, ordenadas por prioridade.
   - Sem `cv.md`: planeja só infra, design system e layout, e cria a pendência "enviar CV".
3. **Execução**, uma tarefa por vez:
   1. O implementador do tipo da tarefa (`architect`, `frontend-dev` ou `content-writer`) executa e roda os gates.
   2. Gate vermelho: 1 nova tentativa com o erro no prompt. Continua vermelho → revert, status `blocked`.
   3. Gates verdes: revisores aplicáveis rodam em paralelo. `code-reviewer` sempre; `ui-reviewer` e `a11y-reviewer` quando `touchesUi`.
   4. Algum achado `blocker`: implementador corrige com os achados no prompt e volta ao passo 1. Máximo 2 ciclos de correção.
   5. Aprovado: commit na `main` com status `done` e hash na tarefa. Achados `minor` e itens que pedem decisão do stakeholder vão para **Para revisão**, sem bloquear.
   6. Reprovado após 2 ciclos: mudança vai para `git stash`, status `review`, achados vão para **Para revisão**.
4. **Circuit breaker.** 3 tarefas seguidas sem entrega encerram a fase de execução.
5. **Deploy.** Se ao menos 1 tarefa foi entregue: `deployer` builda e publica no Railway e configura o Cloudflare. O que falhar por falta de conta, autorização, domínio ou token vira pendência; o deploy não tenta contornar.
6. **Relatório.** `reporter` cria e commita o log da rodada e devolve o conteúdo do `REPORT.md`; a sessão principal que rodou `/esteira` grava e commita o `REPORT.md` (o harness não deixa subagentes gravarem arquivos de relatório).

### Contrato do veredito de revisão

```json
{
  "approved": false,
  "findings": [
    { "severity": "blocker | minor", "file": "src/...", "issue": "...", "fix": "..." }
  ],
  "stakeholderItems": ["decisão ou conteúdo que só o Matheus pode validar"]
}
```

Uma tarefa é aprovada quando nenhum revisor retorna achado `blocker`.

## Padrões que os agentes aplicam ao site

Vêm do `CLAUDE.md` global e não são repetidos nos prompts, só referenciados: TypeScript estrito sem `any`/`as` para calar o compilador, design system rígido (uma família tipográfica, um acento, `rounded-2xl`, sombras tingidas, `min-h-[100dvh]`, Lucide), helper único `cn()`, os 7 estados em superfície interativa, sem `console.log` e sem `TODO` sem dono.

## Deploy

- **Railway:** serviço estático servindo `dist/` do build Vite, criado e atualizado pelo MCP do Railway.
- **Cloudflare:** DNS do domínio apontando para o domínio custom do Railway, com proxy ativo.
- **Vira pendência, sem tentativa:** domínio não comprado, domínio fora do Cloudflare, falta de token/login no Cloudflare, Railway não autorizado, qualquer cobrança.
- Nenhum token entra no repositório. Variáveis ficam no Railway ou no ambiente local.

## Formato do `REPORT.md`

```markdown
# Relatório da esteira — <runDate> (rodada <n>)

Deploy: <url ou "não publicado — ver pendências">

## Entregues
| Tarefa | Commit | Resumo |

## Para revisão
- [ ] <T-xxx> <o que olhar e por quê>

## Pendências do stakeholder
- [ ] <ação que só o Matheus pode fazer> — <por quê / como>

## Bloqueadas
| Tarefa | Motivo | Tentativas |

## Próxima rodada
<tarefas todo restantes, em ordem>
```

Itens de **Para revisão** e **Pendências** que continuam abertos são carregados para o relatório seguinte até o stakeholder marcar `[x]`. O `po` lê os marcados `[x]` na rodada seguinte e os incorpora.

## Edge cases

| Caso | Comportamento |
|---|---|
| Árvore git suja no início, sem `docs/pipeline/.inflight.json` | Mudança é do stakeholder: aborta sem alterar nada; o relatório lista os arquivos |
| Rodada interrompida (app fechado, erro de API) | Antes de implementar, a esteira grava `docs/pipeline/.inflight.json` (ignorado pelo git) com o id da tarefa e apaga após commit/revert. Na pré-checagem seguinte, árvore suja **com** esse marcador é sobra da esteira: vai para `git stash` (recuperável), a tarefa continua `todo` e o log registra o stash |
| `cv.md` ausente | Só infra/layout; pendência "enviar CV" |
| `cv.md` alterado | `po` reconcilia: tarefas de conteúdo afetadas voltam para `todo` |
| Dado ausente no CV (ex.: foto, link) | `content-writer` usa `[REVISAR: ...]` visível e o item vai para **Para revisão** |
| Revisores discordam entre si | Basta 1 `blocker` para reprovar; conflitos de gosto viram `stakeholderItems` |
| Gate quebra por causa de commit anterior | O implementador corrige dentro da tarefa atual se o erro estiver no escopo; senão a tarefa fica `blocked` e o `po` cria uma tarefa `fix` P0 |
| Backlog sem tarefa elegível | Pula a execução, faz só deploy (se houver mudança não publicada) e relatório |
| Tarefa pede compra, conta ou credencial | Não executa; vira pendência |
| Muitas tarefas | Teto de `maxTasks` por rodada; o restante aparece em **Próxima rodada** |

## Custo

Uma rodada típica com 8 tarefas faz entre 30 e 50 chamadas de agente. `maxTasks` é o controle de custo; o comando aceita `/esteira 3` para rodadas curtas.

## Critérios de pronto

- [ ] `.claude/agents/` tem os 9 agentes; `.claude/workflows/esteira.js` e `.claude/commands/esteira.md` existem.
- [ ] `package.json` tem `typecheck`, `lint` e `build` funcionando no template.
- [ ] Rodada piloto com `maxTasks` pequeno: ao menos 1 tarefa entregue com commit na `main`, gates verdes, revisores executados.
- [ ] `REPORT.md` gerado com todas as seções, inclusive pendências de deploy quando aplicável.
- [ ] Segunda rodada não recria nem refaz tarefas `done`.
- [ ] Pré-checagem aborta com árvore suja (testado alterando um arquivo à mão).

## Quando reabrir

- Rodadas passarem a custar mais do que o valor que entregam (muitas tarefas `review`/`blocked` por rodada).
- Necessidade de rodar sem a máquina ligada (migrar para nuvem agendada).
- O site ganhar backend ou testes de lógica, exigindo gates novos.

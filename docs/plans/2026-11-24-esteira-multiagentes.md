# Esteira multiagentes — plano de implementação

> Spec: [docs/specs/2026-11-24-esteira-multiagentes.md](../specs/2026-11-24-esteira-multiagentes.md). Execução inline nesta sessão, tarefa por tarefa, com verificação ao final de cada uma.

**Goal:** `/esteira` roda backlog → implementação → gates → revisão → commit → deploy → relatório sem intervenção.

**Architecture:** Workflow salvo (`.claude/workflows/esteira.js`) controla o fluxo de forma determinística e só lê respostas JSON Schema dos agentes. Agentes em `.claude/agents/` fazem todo I/O. Estado em `docs/pipeline/`.

**Tech Stack:** Claude Code Workflow + subagentes, Vite 6, React 19, TypeScript 5.7, Tailwind 4, yarn 1, git, Railway CLI 4.11 (logado), Cloudflare via `npx wrangler` (sem login hoje).

## Global Constraints

- Gates: `yarn typecheck`, `yarn lint`, `yarn build` — todos devem sair com código 0.
- Commit direto na `main`, mensagem `<tipo>: <ação>` em inglês, com trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Conteúdo só de `content/cv.md`; lacuna vira `[REVISAR: ...]`.
- Telefone não é publicado.
- Nada de compra, criação de conta, criação de repositório remoto ou token no repo: vira pendência.
- Mudança rejeitada ou sobra de rodada interrompida vai para `git stash` (recuperável), nunca `reset --hard`.
- `maxTasks` padrão 8, teto 12. Ciclos de correção: 2. Circuit breaker: 3 falhas seguidas.

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/index.css` | Baseline: `@import "tailwindcss";` para o build voltar a passar |
| `package.json` | Script `typecheck` |
| `.gitignore` | Ignora `docs/pipeline/.inflight.json` |
| `CLAUDE.md` | Regras do projeto injetadas em todo agente |
| `.claude/launch.json` | Dev server `site` na porta 5173 para revisores com browser |
| `.claude/agents/{po,architect,frontend-dev,content-writer,code-reviewer,ui-reviewer,a11y-reviewer,deployer,reporter}.md` | Um papel por arquivo |
| `.claude/workflows/esteira.js` | Orquestrador |
| `.claude/commands/esteira.md` | Entrada `/esteira [maxTasks]` |
| `docs/pipeline/backlog.json` | Estado inicial vazio |
| `docs/pipeline/REPORT.md` | Relatório inicial ("nenhuma rodada ainda") |
| `docs/pipeline/runs/.gitkeep` | Pasta do histórico |

## Contratos entre script e agentes

| Schema | Produzido por | Campos |
|---|---|---|
| `PREFLIGHT` | chamada de pré-checagem | `clean`, `stashedInflight`, `userChanges[]`, `depsOk`, `notes` |
| `PLAN` | `po` | `tasks[]` (`id,title,type,priority,touchesUi,acceptance[],dependsOn[]`), `reviewItems[]`, `pendencias[]`, `remainingTodo` |
| `IMPL` | `architect` / `frontend-dev` / `content-writer` | `gatesGreen`, `gateErrors`, `changedFiles[]`, `summary`, `reviewItems[]`, `pendencias[]` |
| `VERDICT` | revisores | `approved`, `findings[]` (`severity,file,issue,fix`), `stakeholderItems[]` |
| `COMMIT` | chamada de integração | `ok`, `hash`, `error` |
| `REVERT` | chamada de reversão | `ok`, `stashRef`, `error` |
| `DEPLOY` | `deployer` | `status` (`deployed,skipped,failed,partial`), `url`, `commit`, `pendencias[]`, `notes` |
| `REPORT` | `reporter` | `reportPath`, `runLogPath`, `runNumber`, `commit` |

## Tarefas

### Task 1: Baseline verde

- [ ] Criar `src/index.css` com `@import "tailwindcss";`
- [ ] Adicionar `"typecheck": "tsc -b"` em `package.json`
- [ ] Rodar `yarn typecheck && yarn lint && yarn build` → todos verdes
- [ ] Commit `fix: restore missing index.css and add typecheck script`

### Task 2: Contexto do projeto e estado da esteira

- [ ] `CLAUDE.md` do projeto, `.claude/launch.json`, `.gitignore` com `.inflight.json`
- [ ] `docs/pipeline/backlog.json` = `{"version":1,"cvHash":null,"tasks":[]}`, `REPORT.md` inicial, `runs/.gitkeep`
- [ ] Ajustar a spec: stash em vez de descarte; tipo `deploy` fora do backlog executável
- [ ] Commit `chore: add project context and pipeline state`

### Task 3: Agentes

- [ ] Escrever os 9 arquivos em `.claude/agents/` com frontmatter `name`, `description`, `tools` (revisores de código sem Edit/Write; revisores com browser herdam tudo e recebem regra de somente leitura)
- [ ] Verificar: cada arquivo tem frontmatter válido (`grep -c '^name:'` = 9)
- [ ] Commit `feat: add pipeline agents`

### Task 4: Orquestrador e comando

- [ ] `.claude/workflows/esteira.js` com as fases Pré-checagem → Planejamento → Execução → Deploy → Relatório
- [ ] `.claude/commands/esteira.md`
- [ ] Verificar sintaxe: copiar para `.mjs` no scratchpad e rodar `node --check`
- [ ] Commit `feat: add pipeline orchestrator workflow and command`

### Task 5: Rodada piloto

- [ ] Rodar o workflow `esteira` com `maxTasks: 2`
- [ ] Conferir: ≥1 commit de tarefa na `main`, `REPORT.md` com todas as seções, `backlog.json` com status atualizado
- [ ] Teste de árvore suja: alterar `README.md`, rodar só a pré-checagem, confirmar aborto, desfazer
- [ ] Corrigir o que falhar e registrar no relatório final para o stakeholder

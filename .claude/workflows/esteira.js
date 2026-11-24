export const meta = {
  name: 'esteira',
  description: 'Esteira do portfólio: planeja, implementa, revisa, commita na main, publica e escreve o relatório',
  whenToUse: 'Disparado por /esteira [maxTasks]. args: { runDate: "YYYY-MM-DD", maxTasks: number }',
  phases: [
    { title: 'Pré-checagem', detail: 'árvore git limpa, sobra de rodada interrompida, dependências' },
    { title: 'Planejamento', detail: 'PO gera/reconcilia o backlog e escolhe as tarefas' },
    { title: 'Execução', detail: 'implementar → gates → revisores → commit ou stash, uma tarefa por vez' },
    { title: 'Deploy', detail: 'Railway + Cloudflare, o que faltar vira pendência' },
    { title: 'Relatório', detail: 'REPORT.md + log da rodada' },
  ],
}

// ---------- Configuração ----------

const input = args || {}
const runDate = typeof input.runDate === 'string' && input.runDate ? input.runDate : 'sem-data'
const requested = Number(input.maxTasks)
const maxTasks = Number.isFinite(requested) && requested > 0 ? Math.min(Math.floor(requested), 12) : 8
const MAX_FIX_CYCLES = 2
const BREAKER = 3
const TRAILER = 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'

const IMPLEMENTER_BY_TYPE = {
  infra: 'architect',
  'design-system': 'architect',
  feature: 'frontend-dev',
  fix: 'frontend-dev',
  content: 'content-writer',
}
const COMMIT_TYPE_BY_TASK = {
  infra: 'chore',
  'design-system': 'feat',
  feature: 'feat',
  fix: 'fix',
  content: 'feat',
}

// ---------- Schemas ----------

const STRINGS = { type: 'array', items: { type: 'string' } }

const PREFLIGHT = {
  type: 'object',
  properties: {
    clean: { type: 'boolean' },
    branch: { type: 'string' },
    stashedInflight: { type: 'string', description: 'mensagem do stash criado, ou vazio' },
    userChanges: STRINGS,
    depsOk: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['clean', 'branch', 'stashedInflight', 'userChanges', 'depsOk', 'notes'],
}

const TASK = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    type: { type: 'string', enum: ['infra', 'design-system', 'feature', 'content', 'fix'] },
    priority: { type: 'string', enum: ['P0', 'P1', 'P2'] },
    touchesUi: { type: 'boolean' },
    acceptance: STRINGS,
    dependsOn: STRINGS,
  },
  required: ['id', 'title', 'type', 'priority', 'touchesUi', 'acceptance', 'dependsOn'],
}

const PLAN = {
  type: 'object',
  properties: {
    tasks: { type: 'array', items: TASK },
    reviewItems: STRINGS,
    pendencias: STRINGS,
    remainingTodo: { type: 'integer' },
    notes: { type: 'string' },
  },
  required: ['tasks', 'reviewItems', 'pendencias', 'remainingTodo', 'notes'],
}

const IMPL = {
  type: 'object',
  properties: {
    gatesGreen: { type: 'boolean' },
    gateErrors: { type: 'string' },
    changedFiles: STRINGS,
    summary: { type: 'string' },
    reviewItems: STRINGS,
    pendencias: STRINGS,
  },
  required: ['gatesGreen', 'gateErrors', 'changedFiles', 'summary', 'reviewItems', 'pendencias'],
}

const VERDICT = {
  type: 'object',
  properties: {
    approved: { type: 'boolean' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['blocker', 'minor'] },
          file: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'file', 'issue', 'fix'],
      },
    },
    stakeholderItems: STRINGS,
  },
  required: ['approved', 'findings', 'stakeholderItems'],
}

const COMMIT = {
  type: 'object',
  properties: { ok: { type: 'boolean' }, hash: { type: 'string' }, message: { type: 'string' }, error: { type: 'string' } },
  required: ['ok', 'hash', 'message', 'error'],
}

const REVERT = {
  type: 'object',
  properties: { ok: { type: 'boolean' }, stashRef: { type: 'string' }, error: { type: 'string' } },
  required: ['ok', 'stashRef', 'error'],
}

const DEPLOY = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['deployed', 'skipped', 'failed', 'partial'] },
    url: { type: 'string' },
    commit: { type: 'string' },
    pendencias: STRINGS,
    notes: { type: 'string' },
  },
  required: ['status', 'url', 'commit', 'pendencias', 'notes'],
}

const REPORT = {
  type: 'object',
  properties: {
    reportMarkdown: { type: 'string', description: 'conteúdo completo do REPORT.md; quem grava é a sessão principal' },
    runLogPath: { type: 'string' },
    runNumber: { type: 'integer' },
    commit: { type: 'string' },
  },
  required: ['reportMarkdown', 'runLogPath', 'runNumber', 'commit'],
}

// ---------- Modelos por papel ----------

const ROLE_MODEL = {
  po: 'opus',
  architect: 'opus',
  'code-reviewer': 'opus',
  'ui-reviewer': 'opus',
  'a11y-reviewer': 'opus',
  'frontend-dev': 'sonnet',
  'content-writer': 'sonnet',
  deployer: 'sonnet',
  reporter: 'haiku',
}
const UTILITY_MODEL = 'haiku' // pré-checagem, commit, stash

// ---------- Estado da rodada ----------

const run = {
  runDate,
  maxTasks,
  aborted: null,
  preflight: null,
  planNotes: '',
  tasks: [],
  skippedByBreaker: [],
  reviewItems: [],
  pendencias: [],
  deploy: null,
  remainingTodo: null,
}

function addUnique(list, items) {
  for (const item of items || []) {
    if (item && !list.includes(item)) list.push(item)
  }
}

function clip(text, max) {
  const s = String(text || '')
  return s.length > max ? s.slice(0, max) + '…' : s
}

function taskBlock(task) {
  return [
    'Tarefa ' + task.id + ' — ' + task.title,
    'Tipo: ' + task.type + ' · Prioridade: ' + task.priority + ' · Mexe em UI: ' + (task.touchesUi ? 'sim' : 'não'),
    'Critérios de aceite:',
    ...task.acceptance.map((c, i) => '  ' + (i + 1) + '. ' + c),
  ].join('\n')
}

// ---------- Papéis ----------

// Agentes de .claude/agents/ só entram no registro quando a sessão do Claude Code inicia.
// Se o papel não estiver registrado, o agente genérico recebe o arquivo do papel como instrução.
const unregisteredRoles = new Set()

async function roleAgent(role, prompt, baseOpts) {
  const opts = Object.assign({ model: ROLE_MODEL[role] }, baseOpts)
  if (!unregisteredRoles.has(role)) {
    try {
      return await agent(prompt, Object.assign({}, opts, { agentType: role }))
    } catch (err) {
      const message = String(err && err.message ? err.message : err)
      if (!message.includes('not found')) throw err
      unregisteredRoles.add(role)
      log('Papel "' + role + '" não registrado nesta sessão; usando .claude/agents/' + role + '.md como instrução.')
    }
  }
  const preamble = [
    'Seu papel nesta tarefa é "' + role + '".',
    'ANTES de qualquer outra ação, leia o arquivo `.claude/agents/' + role + '.md` na raiz do repositório e siga as instruções dele (ignore o frontmatter) como suas instruções de sistema, inclusive as restrições de ferramentas descritas.',
    '',
  ].join('\n')
  return agent(preamble + prompt, opts)
}

// ---------- Prompts ----------

function preflightPrompt() {
  return [
    'Pré-checagem da esteira do portfólio. Trabalhe na raiz do repositório. Data da rodada: ' + runDate + '.',
    '1. Rode `git branch --show-current` e `git status --porcelain`. Veja se existe `docs/pipeline/.inflight.json`.',
    '2. Se a branch não for `main`: não altere nada; clean=false e explique em notes.',
    '3. Árvore limpa: apague o marcador se existir. clean=true.',
    '4. Árvore suja E marcador existe: é sobra de uma rodada interrompida da esteira. Leia o taskId do marcador, rode `git stash push -u -m "esteira/' + runDate + '/interrompida/<taskId>"`, apague o marcador e confirme que `git status --porcelain` ficou vazio. clean=true, stashedInflight=<mensagem do stash>.',
    '5. Árvore suja SEM marcador: são mudanças do Matheus. NÃO altere, NÃO faça stash, NÃO apague nada. clean=false, userChanges=linhas do git status.',
    '6. Se `node_modules` não existir, rode `yarn install --frozen-lockfile`. depsOk=true se as dependências estão instaladas.',
    'Não altere nenhum outro arquivo.',
  ].join('\n')
}

function planPrompt() {
  return [
    'Rodada da esteira de ' + runDate + '. maxTasks=' + maxTasks + '.',
    'Siga suas instruções de PO: leia content/cv.md, docs/pipeline/backlog.json, docs/pipeline/REPORT.md (itens marcados [x] e anotações do Matheus) e o código.',
    'Atualize e commite o backlog, e retorne até ' + maxTasks + ' tarefas elegíveis em ordem de execução (dependências primeiro).',
  ].join('\n')
}

function implementPrompt(task, feedback) {
  return [
    taskBlock(task),
    '',
    'Data da rodada: ' + runDate + '.',
    'Se `docs/pipeline/.inflight.json` não existir, crie com {"taskId":"' + task.id + '","runDate":"' + runDate + '"} antes de mexer em qualquer arquivo.',
    'O working tree pode já conter sua tentativa anterior desta mesma tarefa: continue a partir dela.',
    feedback ? '\n' + feedback : '',
    '',
    'Implemente, rode yarn typecheck, yarn lint e yarn build, e retorne o resultado. Não faça commit e não altere docs/pipeline/backlog.json.',
  ].join('\n')
}

function reviewPrompt(reviewer, task, impl) {
  return [
    'Revise a tarefa abaixo como ' + reviewer + '. As mudanças estão NÃO commitadas no working tree (use git diff / git status --porcelain; arquivos novos aparecem como untracked).',
    '',
    taskBlock(task),
    '',
    'Resumo do implementador: ' + impl.summary,
    'Arquivos alterados: ' + (impl.changedFiles.join(', ') || '(veja git status)'),
    '',
    'Não edite, crie nem apague arquivos. Retorne seu veredito.',
  ].join('\n')
}

function fixFeedback(blockers, minors) {
  const fmt = (f) => '- [' + f.reviewer + '] ' + f.file + ': ' + f.issue + ' → ' + f.fix
  return [
    'Os revisores REPROVARAM a tentativa anterior. Corrija todos os blockers:',
    ...blockers.map(fmt),
    minors.length ? 'Minors (corrija se for barato):' : '',
    ...minors.map(fmt),
  ].join('\n')
}

function commitPrompt(task, impl) {
  const type = COMMIT_TYPE_BY_TASK[task.type] || 'chore'
  return [
    'Integre a tarefa ' + task.id + ' aprovada pelos revisores. Na raiz do repositório:',
    '1. Em docs/pipeline/backlog.json, na tarefa ' + task.id + ': status="done", attempts=attempts+1. Não mexa em outras tarefas. Valide o JSON com node.',
    '2. Apague docs/pipeline/.inflight.json.',
    '3. `git add -A` e commit direto na main. Mensagem: "' + type + ': <ação curta em inglês, imperativo, minúsculas, sem ponto final>" baseada em: "' + task.title + '" / "' + clip(impl.summary, 300) + '". Corpo: "Task: ' + task.id + '" e, em linha separada, "' + TRAILER + '".',
    '4. Confirme `git status --porcelain` vazio e retorne o hash curto (`git rev-parse --short HEAD`) e a mensagem usada.',
    'Se algo falhar, ok=false com o erro; não tente contornar com reset.',
  ].join('\n')
}

function revertPrompt(task, status, reason) {
  return [
    'A tarefa ' + task.id + ' não será entregue nesta rodada (' + status + '). Na raiz do repositório:',
    '1. Se houver mudanças no working tree, guarde-as: `git stash push -u -m "esteira/' + runDate + '/' + status + '/' + task.id + '"`. Nunca use reset --hard nem clean.',
    '2. Apague docs/pipeline/.inflight.json.',
    '3. Em docs/pipeline/backlog.json, na tarefa ' + task.id + ': status="' + status + '", attempts=attempts+1 e acrescente em notes: "' + runDate + ': ' + clip(reason, 300).replace(/"/g, "'") + '". Valide o JSON com node.',
    '4. Commit só do backlog: `git add docs/pipeline/backlog.json` e mensagem "chore: mark ' + task.id + ' as ' + status + '" com corpo "' + TRAILER + '".',
    '5. Confirme `git status --porcelain` vazio. Retorne stashRef (a mensagem do stash, ou vazio se não havia mudanças).',
  ].join('\n')
}

function deployPrompt() {
  return [
    'Fim da rodada ' + runDate + '. Siga suas instruções de deploy: Railway e depois Cloudflare.',
    'Tarefas entregues nesta rodada: ' + (run.tasks.filter((t) => t.outcome === 'done').map((t) => t.id).join(', ') || 'nenhuma') + '.',
    'Se nada mudou desde o último deploy bem-sucedido, retorne skipped.',
  ].join('\n')
}

function reportPrompt() {
  return [
    'Escreva o relatório da rodada seguindo suas instruções. Dados da rodada (JSON):',
    '```json',
    JSON.stringify(run, null, 2),
    '```',
  ].join('\n')
}

// ---------- Execução de uma tarefa ----------

async function runReviewer(reviewer, task, impl) {
  const verdict = await roleAgent(reviewer, reviewPrompt(reviewer, task, impl), {
    schema: VERDICT,
    label: task.id + ' · ' + reviewer,
    phase: 'Execução',
  })
  if (!verdict) {
    return {
      reviewer,
      approved: false,
      findings: [{ severity: 'blocker', file: '-', issue: reviewer + ' não retornou veredito', fix: 'reexecutar a revisão' }],
      stakeholderItems: [],
    }
  }
  return { reviewer, approved: verdict.approved, findings: verdict.findings, stakeholderItems: verdict.stakeholderItems }
}

async function reviewTask(task, impl) {
  const thunks = [() => runReviewer('code-reviewer', task, impl)]
  if (task.touchesUi) {
    // ui e a11y compartilham o browser embutido: rodam em sequência entre si, em paralelo ao code-reviewer
    thunks.push(async () => {
      const ui = await runReviewer('ui-reviewer', task, impl)
      const a11y = await runReviewer('a11y-reviewer', task, impl)
      return [ui, a11y]
    })
  }
  const results = await parallel(thunks)
  return results.flat().filter(Boolean)
}

async function rejectTask(task, record, status, reason) {
  record.outcome = status
  record.reason = reason
  const res = await agent(revertPrompt(task, status, reason), {
    schema: REVERT,
    model: UTILITY_MODEL,
    label: task.id + ' · stash',
    phase: 'Execução',
  })
  record.stashRef = res && res.ok ? res.stashRef : ''
  if (!res || !res.ok) {
    record.revertError = res ? res.error : 'agente de reversão não retornou'
    run.aborted = 'Falha ao reverter ' + task.id + ': ' + record.revertError + '. Working tree pode estar sujo.'
  }
  return record
}

async function runTask(task) {
  const implementer = IMPLEMENTER_BY_TYPE[task.type] || 'frontend-dev'
  const record = {
    id: task.id,
    title: task.title,
    type: task.type,
    implementer,
    outcome: null,
    reason: '',
    commit: '',
    commitMessage: '',
    stashRef: '',
    summary: '',
    cycles: [],
    minorFindings: [],
    lastBlockers: [],
    reviewItems: [],
    pendencias: [],
  }
  let feedback = ''
  let gateRetryUsed = false
  let fixCycles = 0

  for (;;) {
    const attempt = record.cycles.length + 1
    const impl = await roleAgent(implementer, implementPrompt(task, feedback), {
      schema: IMPL,
      label: task.id + ' · ' + implementer + ' #' + attempt,
      phase: 'Execução',
    })
    if (!impl) return rejectTask(task, record, 'blocked', 'implementador não retornou resultado')

    record.summary = impl.summary
    addUnique(record.reviewItems, impl.reviewItems)
    addUnique(record.pendencias, impl.pendencias)

    if (!impl.gatesGreen) {
      record.cycles.push({ attempt, kind: 'gates', errors: clip(impl.gateErrors, 1500) })
      if (!gateRetryUsed) {
        gateRetryUsed = true
        feedback = 'Os gates FALHARAM na tentativa anterior. Erros:\n' + clip(impl.gateErrors, 3000)
        continue
      }
      return rejectTask(task, record, 'blocked', 'gates vermelhos após nova tentativa: ' + clip(impl.gateErrors, 400))
    }

    const verdicts = await reviewTask(task, impl)
    const blockers = []
    const minors = []
    for (const v of verdicts) {
      addUnique(record.reviewItems, v.stakeholderItems)
      for (const f of v.findings) {
        const finding = { reviewer: v.reviewer, severity: f.severity, file: f.file, issue: f.issue, fix: f.fix }
        if (f.severity === 'blocker') blockers.push(finding)
        else minors.push(finding)
      }
    }
    record.cycles.push({
      attempt,
      kind: 'review',
      reviewers: verdicts.map((v) => v.reviewer + ':' + (v.findings.some((f) => f.severity === 'blocker') ? 'reprovou' : 'aprovou')),
      blockers: blockers.length,
      minors: minors.length,
    })

    if (blockers.length === 0) {
      record.minorFindings = minors
      const c = await agent(commitPrompt(task, impl), {
        schema: COMMIT,
        model: UTILITY_MODEL,
        label: task.id + ' · commit',
        phase: 'Execução',
      })
      if (!c || !c.ok) return rejectTask(task, record, 'blocked', 'commit falhou: ' + (c ? c.error : 'sem retorno'))
      record.outcome = 'done'
      record.commit = c.hash
      record.commitMessage = c.message
      return record
    }

    if (fixCycles >= MAX_FIX_CYCLES) {
      record.lastBlockers = blockers
      record.minorFindings = minors
      return rejectTask(task, record, 'review', blockers.length + ' achado(s) blocker após ' + MAX_FIX_CYCLES + ' ciclos de correção')
    }
    fixCycles++
    feedback = fixFeedback(blockers, minors)
    log(task.id + ': ' + blockers.length + ' blocker(s), ciclo de correção ' + fixCycles + '/' + MAX_FIX_CYCLES)
  }
}

// ---------- Fluxo ----------

phase('Pré-checagem')
const pre = await agent(preflightPrompt(), { schema: PREFLIGHT, model: UTILITY_MODEL, label: 'pré-checagem', phase: 'Pré-checagem' })
run.preflight = pre
if (!pre) {
  run.aborted = 'Pré-checagem não retornou resultado.'
} else if (!pre.clean) {
  run.aborted = pre.userChanges.length
    ? 'Há mudanças não commitadas que não são da esteira (' + pre.userChanges.length + ' arquivo(s)). Commite ou descarte e rode /esteira de novo.'
    : 'Pré-checagem falhou: ' + pre.notes
} else if (!pre.depsOk) {
  run.aborted = 'Dependências não instaladas: ' + pre.notes
}
if (pre && pre.stashedInflight) log('Sobra de rodada interrompida guardada em stash: ' + pre.stashedInflight)

let plan = null
if (!run.aborted) {
  phase('Planejamento')
  plan = await roleAgent('po', planPrompt(), { schema: PLAN, label: 'po', phase: 'Planejamento' })
  if (!plan) {
    run.aborted = 'O PO não retornou plano.'
  } else {
    run.planNotes = plan.notes
    run.remainingTodo = plan.remainingTodo
    addUnique(run.reviewItems, plan.reviewItems)
    addUnique(run.pendencias, plan.pendencias)
    const selected = plan.tasks.slice(0, maxTasks)
    if (plan.tasks.length > maxTasks) log('PO retornou ' + plan.tasks.length + ' tarefas; executando só ' + maxTasks + '.')
    log('Plano: ' + (selected.map((t) => t.id).join(', ') || 'nenhuma tarefa elegível'))
    plan.tasks = selected
  }
}

if (!run.aborted && plan && plan.tasks.length) {
  phase('Execução')
  let consecutiveFailures = 0
  const doneIds = new Set()
  for (const task of plan.tasks) {
    if (run.aborted) break
    if (consecutiveFailures >= BREAKER) {
      run.skippedByBreaker.push(task.id)
      continue
    }
    const unmet = task.dependsOn.filter((d) => plan.tasks.some((t) => t.id === d) && !doneIds.has(d))
    if (unmet.length) {
      run.tasks.push({ id: task.id, title: task.title, outcome: 'skipped', reason: 'dependência não entregue nesta rodada: ' + unmet.join(', ') })
      continue
    }
    log('Iniciando ' + task.id + ': ' + task.title)
    const record = await runTask(task)
    run.tasks.push(record)
    addUnique(run.reviewItems, record.reviewItems.map((i) => task.id + ': ' + i))
    addUnique(run.pendencias, record.pendencias)
    if (record.outcome === 'done') {
      doneIds.add(task.id)
      consecutiveFailures = 0
      log(task.id + ' entregue (' + record.commit + ')')
    } else {
      consecutiveFailures++
      log(task.id + ' → ' + record.outcome + ': ' + record.reason)
    }
  }
  if (run.skippedByBreaker.length) log('Circuit breaker: ' + run.skippedByBreaker.length + ' tarefa(s) adiada(s).')
}

if (!run.aborted) {
  phase('Deploy')
  const dep = await roleAgent('deployer', deployPrompt(), { schema: DEPLOY, label: 'deployer', phase: 'Deploy' })
  run.deploy = dep || { status: 'failed', url: '', commit: '', pendencias: [], notes: 'deployer não retornou resultado' }
  addUnique(run.pendencias, run.deploy.pendencias)
}

phase('Relatório')
const report = await roleAgent('reporter', reportPrompt(), { schema: REPORT, label: 'reporter', phase: 'Relatório' })

const count = (o) => run.tasks.filter((t) => t.outcome === o).length
return {
  runDate,
  aborted: run.aborted,
  delivered: run.tasks.filter((t) => t.outcome === 'done').map((t) => t.id + ' ' + t.commit),
  review: count('review'),
  blocked: count('blocked'),
  skipped: count('skipped') + run.skippedByBreaker.length,
  deploy: run.deploy ? run.deploy.status + (run.deploy.url ? ' ' + run.deploy.url : '') : 'não executado',
  pendencias: run.pendencias.length,
  reviewItems: run.reviewItems.length,
  runLog: report ? report.runLogPath : 'reporter falhou — ver transcript do workflow',
  // Subagentes não podem gravar arquivos de relatório; a sessão principal grava este conteúdo em docs/pipeline/REPORT.md
  reportMarkdown: report ? report.reportMarkdown : '',
}

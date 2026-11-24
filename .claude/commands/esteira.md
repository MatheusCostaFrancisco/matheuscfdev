---
description: Roda a esteira multiagentes do portfólio (planeja, implementa, revisa, commita, publica, relata)
argument-hint: "[maxTasks]"
---

Rode a esteira do portfólio. Este comando é a autorização explícita do Matheus para orquestração multiagentes.

1. Descubra a data de hoje no formato `YYYY-MM-DD` (ex.: `date +%F` no Bash).
2. Chame a ferramenta **Workflow** com `name: "esteira"` e `args: { "runDate": "<data>", "maxTasks": <número> }`. O número é `$ARGUMENTS` se for um inteiro positivo; caso contrário, 8.
3. Não edite arquivos nem faça commits você mesmo enquanto o workflow roda.
4. Quando o workflow terminar, grave o campo `reportMarkdown` do resultado em `docs/pipeline/REPORT.md` (subagentes não podem gravar arquivos de relatório; isso é papel seu) e commite só esse arquivo: `git add docs/pipeline/REPORT.md && git commit -m "docs: update pipeline report"` com o trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Se `reportMarkdown` vier vazio, não sobrescreva o arquivo e avise que o reporter falhou.
5. Responda em pt-BR, curto:
   - link e status do deploy;
   - tarefas entregues (id + commit);
   - quantos itens para revisão e quais as pendências do stakeholder (lista);
   - se a rodada abortou, o motivo e a ação necessária.
   Termine apontando para `docs/pipeline/REPORT.md`.

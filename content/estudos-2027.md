---
source: Notion "Jornada para AI Engineer" (antes "Roadmap de Estudos — Carreira Dev 2027"), trilha aprovada pelo stakeholder em 2026-11-25
notion: https://app.notion.com/p/421fd417a7b281359a5ee538cc81fdad
---

# Jornada para AI Engineer

Fonte de verdade da página **Jornada** do site (antiga Roadmap 2027). Versão **pública**: não citar produto interno do empregador, salário, pedidos ao gestor nem "o que a empresa ganha". Manda Aí e WoodFlow podem ser citados (são produtos próprios, públicos no `cv.md`).

**Sem prazos.** Não publicar datas, trimestres, horas por semana nem duração de estudo. O avanço é pelo checklist, não pelo calendário.

## Destino

- **De:** Senior Front-End Engineer
- **Para:** AI Engineer
- **Frase:** Já entendo os conceitos. Agora levo IA para produção: medida, avaliada e observável.

## Regras do jogo

- A jornada tem mundos em sequência. Cada mundo tem itens de estudo (checklist) e um **chefão**: um entregável público.
- XP do mundo = itens marcados `[x]` ÷ total de itens do mundo.
- O mundo está **concluído** quando o chefão está marcado `[x]` (com link, se houver). Concluir um mundo destrava o próximo.
- O primeiro mundo não concluído é o **atual**. Os seguintes ficam **bloqueados**.
- Para atualizar o progresso, basta marcar `[x]` neste arquivo (e no Notion). O site deriva tudo daqui.

## Mundo 0 · Como LLMs pensam

- [ ] Tokenização e sampling (temperature, top-p, logprobs)
- [ ] Atenção, janela de contexto e KV cache
- [ ] Embeddings e similaridade
- [ ] Python para IA (Pydantic, async, uv)
- [ ] **Chefão:** artigo explicando um LLM por dentro, com diagramas próprios

## Mundo 1 · LLM em produção

- [ ] Structured outputs
- [ ] Tool use
- [ ] Streaming
- [ ] Prompt caching
- [ ] Escolha de modelo por custo e latência
- [ ] Context engineering
- [ ] **Chefão:** feature de IA no Manda Aí ou no WoodFlow com custo e latência medidos

## Mundo 2 · RAG e dados

- [ ] Chunking
- [ ] pgvector
- [ ] Busca híbrida (BM25 + vetor)
- [ ] Reranking
- [ ] Query rewriting
- [ ] GraphRAG
- [ ] Métricas de retrieval (recall@k, MRR)
- [ ] **Chefão:** RAG sobre documentos reais com as métricas publicadas

## Mundo 3 · Agentes e MCP

- [ ] Loop de agente
- [ ] Design de ferramentas
- [ ] Servidor MCP próprio
- [ ] Orquestração multi-agente
- [ ] Memória
- [ ] Human-in-the-loop
- [ ] Com framework e sem framework
- [ ] **Chefão:** agente com MCP próprio resolvendo uma tarefa real

## Mundo 4 · Evals e segurança

- [ ] Dataset de eval
- [ ] LLM-as-judge com rubrica
- [ ] Evals de regressão no CI
- [ ] Avaliação offline e online
- [ ] Alucinação
- [ ] Prompt injection e red teaming
- [ ] **Chefão:** suíte de evals rodando no CI de um projeto

## Mundo 5 · LLMOps

- [ ] Tracing (OpenTelemetry, Langfuse)
- [ ] Versionamento de prompt
- [ ] Fallback entre modelos
- [ ] Rate limit
- [ ] Controle de custo
- [ ] A/B de prompt
- [ ] **Chefão:** painel de observabilidade de um sistema de IA em produção

## Mundo 6 · Por dentro dos modelos

- [ ] Fine-tuning com LoRA
- [ ] Distillation
- [ ] Modelos open-weight
- [ ] Inferência local (vLLM, Ollama)
- [ ] Quantização
- [ ] Multimodal (visão e voz)
- [ ] Quando fazer fine-tuning e quando usar RAG
- [ ] **Chefão:** modelo ajustado comparado com o modelo base nos mesmos evals

## Mundo 7 · Produto com IA

- [ ] UX de IA (streaming, incerteza, feedback)
- [ ] Data flywheel
- [ ] LGPD e privacidade
- [ ] System design de sistemas de IA
- [ ] **Chefão:** case study público de ponta a ponta

## ★ Chefão final · AI Engineer

Destrava quando os 8 mundos estão concluídos.

- [ ] **Entregável:** sistema de IA em produção, com evals, observabilidade e write-up público

## Links de entregáveis

Quando um chefão for derrotado, o link do entregável entra aqui (formato: `Mundo N: <url>`) e aparece no site. Sem link, o site mostra só o entregável previsto, sem `[REVISAR]`.

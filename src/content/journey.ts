import type { Locale } from '../lib/locale'

export interface JourneyStudyItem {
  readonly label: string
  /** Set when the label is written wholly in the other language. */
  readonly lang?: Locale
  readonly done: boolean
}

export interface JourneyBoss {
  readonly label: string
  readonly lang?: Locale
  readonly done: boolean
  readonly link?: string
}

export interface JourneyWorld {
  /** Anchor id: `world-N` (en) or `mundo-N` (pt-BR). */
  readonly id: string
  readonly number: number
  readonly title: string
  readonly study: readonly JourneyStudyItem[]
  readonly boss: JourneyBoss
}

export interface JourneyFinalBoss {
  /** Anchor id: `final-boss` (en) or `chefao-final` (pt-BR). */
  readonly id: string
  readonly title: string
  readonly note: string
  readonly boss: JourneyBoss
}

export interface Journey {
  readonly destination: {
    readonly from: string
    readonly fromLang?: Locale
    readonly to: string
    readonly toLang?: Locale
    readonly phrase: string
  }
  readonly worlds: readonly JourneyWorld[]
  readonly finalBoss: JourneyFinalBoss
}

const en: Journey = {
  destination: {
    from: 'Senior Front-End Engineer',
    to: 'AI Engineer',
    phrase: 'I already understand the concepts. Now I take AI to production: measured, evaluated and observable.',
  },
  worlds: [
    {
      id: 'world-0',
      number: 0,
      title: 'How LLMs think',
      study: [
        { label: 'Tokenization and sampling (temperature, top-p, logprobs)', done: false },
        { label: 'Attention, context window and KV cache', done: false },
        { label: 'Embeddings and similarity', done: false },
        { label: 'Python for AI (Pydantic, async, uv)', done: false },
      ],
      boss: { label: 'Article explaining an LLM from the inside, with my own diagrams', done: false },
    },
    {
      id: 'world-1',
      number: 1,
      title: 'LLM in production',
      study: [
        { label: 'Structured outputs', done: false },
        { label: 'Tool use', done: false },
        { label: 'Streaming', done: false },
        { label: 'Prompt caching', done: false },
        { label: 'Choosing a model by cost and latency', done: false },
        { label: 'Context engineering', done: false },
      ],
      boss: { label: 'AI feature in Manda Aí or WoodFlow with measured cost and latency', done: false },
    },
    {
      id: 'world-2',
      number: 2,
      title: 'RAG and data',
      study: [
        { label: 'Chunking', done: false },
        { label: 'pgvector', done: false },
        { label: 'Hybrid search (BM25 + vector)', done: false },
        { label: 'Reranking', done: false },
        { label: 'Query rewriting', done: false },
        { label: 'GraphRAG', done: false },
        { label: 'Retrieval metrics (recall@k, MRR)', done: false },
      ],
      boss: { label: 'RAG over real documents with the metrics published', done: false },
    },
    {
      id: 'world-3',
      number: 3,
      title: 'Agents and MCP',
      study: [
        { label: 'Agent loop', done: false },
        { label: 'Tool design', done: false },
        { label: 'My own MCP server', done: false },
        { label: 'Multi-agent orchestration', done: false },
        { label: 'Memory', done: false },
        { label: 'Human-in-the-loop', done: false },
        { label: 'With a framework and without one', done: false },
      ],
      boss: { label: 'Agent with my own MCP solving a real task', done: false },
    },
    {
      id: 'world-4',
      number: 4,
      title: 'Evals and security',
      study: [
        { label: 'Eval dataset', done: false },
        { label: 'LLM-as-judge with a rubric', done: false },
        { label: 'Regression evals in CI', done: false },
        { label: 'Offline and online evaluation', done: false },
        { label: 'Hallucination', done: false },
        { label: 'Prompt injection and red teaming', done: false },
      ],
      boss: { label: 'Eval suite running in the CI of a project', done: false },
    },
    {
      id: 'world-5',
      number: 5,
      title: 'LLMOps',
      study: [
        { label: 'Tracing (OpenTelemetry, Langfuse)', done: false },
        { label: 'Prompt versioning', done: false },
        { label: 'Fallback between models', done: false },
        { label: 'Rate limit', done: false },
        { label: 'Cost control', done: false },
        { label: 'Prompt A/B testing', done: false },
      ],
      boss: { label: 'Observability dashboard for an AI system in production', done: false },
    },
    {
      id: 'world-6',
      number: 6,
      title: 'Inside the models',
      study: [
        { label: 'Fine-tuning with LoRA', done: false },
        { label: 'Distillation', done: false },
        { label: 'Open-weight models', done: false },
        { label: 'Local inference (vLLM, Ollama)', done: false },
        { label: 'Quantization', done: false },
        { label: 'Multimodal (vision and voice)', done: false },
        { label: 'When to fine-tune and when to use RAG', done: false },
      ],
      boss: { label: 'Fine-tuned model compared with the base model on the same evals', done: false },
    },
    {
      id: 'world-7',
      number: 7,
      title: 'Product with AI',
      study: [
        { label: 'AI UX (streaming, uncertainty, feedback)', done: false },
        { label: 'Data flywheel', done: false },
        { label: 'LGPD and privacy', done: false },
        { label: 'System design for AI systems', done: false },
      ],
      boss: { label: 'Public end-to-end case study', done: false },
    },
  ],
  finalBoss: {
    id: 'final-boss',
    title: 'Final boss · AI Engineer',
    note: 'Unlocks when the 8 worlds are complete.',
    boss: {
      label: 'AI system in production, with evals, observability and a public write-up',
      done: false,
    },
  },
}

const ptBR: Journey = {
  destination: {
    from: 'Senior Front-End Engineer',
    fromLang: 'en',
    to: 'AI Engineer',
    toLang: 'en',
    phrase: 'Já entendo os conceitos. Agora levo IA para produção: medida, avaliada e observável.',
  },
  worlds: [
    {
      id: 'mundo-0',
      number: 0,
      title: 'Como LLMs pensam',
      study: [
        { label: 'Tokenização e sampling (temperature, top-p, logprobs)', done: false },
        { label: 'Atenção, janela de contexto e KV cache', done: false },
        { label: 'Embeddings e similaridade', done: false },
        { label: 'Python para IA (Pydantic, async, uv)', done: false },
      ],
      boss: { label: 'Artigo explicando um LLM por dentro, com diagramas próprios', done: false },
    },
    {
      id: 'mundo-1',
      number: 1,
      title: 'LLM em produção',
      study: [
        { label: 'Structured outputs', lang: 'en', done: false },
        { label: 'Tool use', lang: 'en', done: false },
        { label: 'Streaming', lang: 'en', done: false },
        { label: 'Prompt caching', lang: 'en', done: false },
        { label: 'Escolha de modelo por custo e latência', done: false },
        { label: 'Context engineering', lang: 'en', done: false },
      ],
      boss: { label: 'Feature de IA no Manda Aí ou no WoodFlow com custo e latência medidos', done: false },
    },
    {
      id: 'mundo-2',
      number: 2,
      title: 'RAG e dados',
      study: [
        { label: 'Chunking', lang: 'en', done: false },
        { label: 'pgvector', lang: 'en', done: false },
        { label: 'Busca híbrida (BM25 + vetor)', done: false },
        { label: 'Reranking', lang: 'en', done: false },
        { label: 'Query rewriting', lang: 'en', done: false },
        { label: 'GraphRAG', lang: 'en', done: false },
        { label: 'Métricas de retrieval (recall@k, MRR)', done: false },
      ],
      boss: { label: 'RAG sobre documentos reais com as métricas publicadas', done: false },
    },
    {
      id: 'mundo-3',
      number: 3,
      title: 'Agentes e MCP',
      study: [
        { label: 'Loop de agente', done: false },
        { label: 'Design de ferramentas', done: false },
        { label: 'Servidor MCP próprio', done: false },
        { label: 'Orquestração multi-agente', done: false },
        { label: 'Memória', done: false },
        { label: 'Human-in-the-loop', lang: 'en', done: false },
        { label: 'Com framework e sem framework', done: false },
      ],
      boss: { label: 'Agente com MCP próprio resolvendo uma tarefa real', done: false },
    },
    {
      id: 'mundo-4',
      number: 4,
      title: 'Evals e segurança',
      study: [
        { label: 'Dataset de eval', done: false },
        { label: 'LLM-as-judge com rubrica', done: false },
        { label: 'Evals de regressão no CI', done: false },
        { label: 'Avaliação offline e online', done: false },
        { label: 'Alucinação', done: false },
        { label: 'Prompt injection e red teaming', done: false },
      ],
      boss: { label: 'Suíte de evals rodando no CI de um projeto', done: false },
    },
    {
      id: 'mundo-5',
      number: 5,
      title: 'LLMOps',
      study: [
        { label: 'Tracing (OpenTelemetry, Langfuse)', lang: 'en', done: false },
        { label: 'Versionamento de prompt', done: false },
        { label: 'Fallback entre modelos', done: false },
        { label: 'Rate limit', lang: 'en', done: false },
        { label: 'Controle de custo', done: false },
        { label: 'A/B de prompt', done: false },
      ],
      boss: { label: 'Painel de observabilidade de um sistema de IA em produção', done: false },
    },
    {
      id: 'mundo-6',
      number: 6,
      title: 'Por dentro dos modelos',
      study: [
        { label: 'Fine-tuning com LoRA', done: false },
        { label: 'Distillation', lang: 'en', done: false },
        { label: 'Modelos open-weight', done: false },
        { label: 'Inferência local (vLLM, Ollama)', done: false },
        { label: 'Quantização', done: false },
        { label: 'Multimodal (visão e voz)', done: false },
        { label: 'Quando fazer fine-tuning e quando usar RAG', done: false },
      ],
      boss: { label: 'Modelo ajustado comparado com o modelo base nos mesmos evals', done: false },
    },
    {
      id: 'mundo-7',
      number: 7,
      title: 'Produto com IA',
      study: [
        { label: 'UX de IA (streaming, incerteza, feedback)', done: false },
        { label: 'Data flywheel', lang: 'en', done: false },
        { label: 'LGPD e privacidade', done: false },
        { label: 'System design de sistemas de IA', done: false },
      ],
      boss: { label: 'Case study público de ponta a ponta', done: false },
    },
  ],
  finalBoss: {
    id: 'chefao-final',
    title: 'Chefão final · AI Engineer',
    note: 'Destrava quando os 8 mundos estão concluídos.',
    boss: {
      label: 'Sistema de IA em produção, com evals, observabilidade e write-up público',
      done: false,
    },
  },
}

export const journey: Readonly<Record<Locale, Journey>> = { en, 'pt-BR': ptBR }

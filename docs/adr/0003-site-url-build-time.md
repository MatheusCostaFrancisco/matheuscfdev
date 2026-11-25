# 0003 — URL do site injetada no build a partir de SITE_URL

Status: Accepted · Data: 2026-11-24

## Contexto

O stakeholder definiu o domínio de produção como `https://www.matheuscfrancisco.dev.br` (REPORT 24/11). `canonical`, `og:url`, `hreflang` e `og:image` precisam ser absolutos: geradores de preview (LinkedIn, WhatsApp) e buscadores ignoram ou interpretam mal URLs relativas nessas tags. As três entradas HTML (`index.html`, `en/index.html`, `pt/index.html`) são estáticas, e o `og:image` aponta para `content/assets/profile.jpg`, que o Vite emite com hash em `dist/assets/`.

## Decisão

- `.env.production` (versionado, sem segredo) define `SITE_URL=https://www.matheuscfrancisco.dev.br`. É o único lugar onde o domínio aparece. Uma variável de ambiente `SITE_URL` no Railway tem prioridade sobre o arquivo (regra do `loadEnv` do Vite).
- `vite.config.ts` valida `SITE_URL` em todo build: origem `https://` sem caminho, query, hash, credenciais ou barra final. Ausente ou inválida, o build falha com mensagem `[site-url] ...`. A validação usa regex porque o config é checado sem tipos do Node (não há `URL` global nem `process` tipados, e adicionar `@types/node` só para isso não compensa).
- As entradas HTML usam o placeholder `%SITE_URL%` (`%SITE_URL%/en/`). O plugin local `site-url` substitui o placeholder num `transformIndexHtml` de ordem `pre`.
- O `og:image` continua relativo na fonte, para o Vite seguir emitindo o arquivo com hash. Depois que o HTML final é gerado (`generateBundle`, plugin `enforce: "post"`), o plugin prefixa o caminho com `SITE_URL`. Assim a URL absoluta sempre aponta para um arquivo que existe em `dist/`.
- No `yarn dev`, sem `SITE_URL` definida, o placeholder vira string vazia e as URLs ficam relativas.

## Alternativas consideradas

- **Domínio fixo nos HTML:** mais simples, mas espalha a string por três arquivos e não falha se alguém esquecer de trocar.
- **Copiar a foto para `public/og-image.jpg`:** URL estável e absoluta direto na fonte, mas duplica o binário e perde o hash de cache.
- **`experimental.renderBuiltUrl`:** tornaria absolutas também as URLs de JS e CSS no HTML, e é API experimental.
- **Placeholder nativo do Vite (`%VITE_SITE_URL%`):** exigiria prefixo `VITE_`, que expõe a variável em `import.meta.env` no bundle sem necessidade, e não resolve o `og:image` com hash.

## Consequências

- Trocar de domínio é mudar uma linha em `.env.production` (ou a variável no Railway).
- `.gitignore` abre exceção para `.env.production`, e `railway.json` observa o arquivo para publicar quando ele muda. Segredo nunca entra nesse arquivo.
- Build em qualquer modo sem `SITE_URL` válida falha, inclusive `vite build --mode <outro>`.

## Quando reabrir

- Se o site ganhar pré-renderização (SSG) ou framework com suporte próprio a URL base.
- Se houver mais de um ambiente publicado (staging, preview) com domínios diferentes.
- Se o config passar a ter tipos do Node por outro motivo: trocar a regex por `new URL()`.

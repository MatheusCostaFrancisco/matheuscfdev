# 0008 — Slugs da jornada e redirect 301 do roadmap

Status: Accepted · Data: 2026-11-25

Substitui a tabela de slugs da [ADR 0005](0005-internal-pages.md). O resto da ADR 0005 (mapa de rotas como fonte única, multi-page estático, regra do `x-default`, navegação) continua valendo.

## Contexto

A spec `docs/specs/2026-11-25-jornada-ai-engineer.md` (Goal 2) transforma o roadmap de estudos na Jornada para AI Engineer. O conteúdo deixou de ser um roadmap com datas e trimestres, então o slug `/roadmap/` e o rótulo "Roadmap" no menu já não descrevem a página. As URLs antigas já foram publicadas e podem estar compartilhadas, e a ADR 0005 previa que renomear `roadmap` exige redirect.

## Decisão

### Slugs

| Página | `en` | `pt-BR` |
|---|---|---|
| `home` | `/en/` | `/pt/` |
| `journey` | `/en/journey/` | `/pt/jornada/` |
| `books` | `/en/books/` | `/pt/livros/` |

A chave de página em `src/lib/routes.ts` passa de `roadmap` para `journey`, e o id do item de menu acompanha. O slug segue o rótulo do menu de cada idioma, como `books`/`livros`: "Journey" em inglês, "Jornada" em pt-BR. As entradas HTML vão para `en/journey/index.html` e `pt/jornada/index.html`; como o build deriva entradas, canonical, `og:url`, hreflang e sitemap do mapa, nenhum outro lugar escreve o caminho. A `404.html` é HTML estático fora do mapa e foi atualizada à mão.

### Redirect permanente

O `Caddyfile` responde 301 de `/en/roadmap`, `/en/roadmap/` e `/en/roadmap/index.html` para `/en/journey/`, e o mesmo de `/pt/roadmap*` para `/pt/jornada/`. O matcher `path` do Caddy ignora maiúsculas. A query string é mantida (`{?query}`) e o navegador mantém o `#fragmento` no redirect, então `/pt/roadmap/#mundo-3` chega em `/pt/jornada/#mundo-3`. A resposta 301 recebe `Cache-Control: no-cache` pela regra geral da ADR 0006, o que evita que o navegador grave o redirect para sempre caso ele precise mudar.

O `dist/` não tem mais `en/roadmap/` nem `pt/roadmap/`: o redirect vive só no servidor.

## Alternativas consideradas

- **Manter `/roadmap/` e trocar só o rótulo do menu:** sem custo de redirect, mas URL e conteúdo ficam desalinhados para sempre.
- **Slug igual nos dois idiomas (`/pt/journey/`):** quebra a regra da ADR 0005 de seguir o rótulo do menu de cada idioma.
- **Página HTML de redirect em `dist/en/roadmap/index.html` (meta refresh + `rel=canonical`):** funciona sem servidor, mas responde 200, não 301; crawlers tratam como sinal fraco e a página antiga continua existindo no build.
- **Redirect no Cloudflare (Page Rules / Redirect Rules):** tira a regra do repo e depende de configuração manual fora da esteira.

## Consequências

- Links antigos continuam funcionando, com um salto extra de 301.
- O `Caddyfile` passa a ter conhecimento de caminhos antigos, fora do mapa de rotas. Um novo rename de página precisa de outra entrada de redirect ali, e as antigas ficam (encadear 301 é aceitável, mas o ideal é apontar direto para o destino final).
- A lista de arquivos HTML citada na ADR 0006 (seção de fontes) menciona `en/roadmap/index.html` e `pt/roadmap/index.html`; os nomes atuais são `en/journey/index.html` e `pt/jornada/index.html`. O `grep` recomendado lá continua achando todos.
- O redirect só é verificável em produção ou com Caddy local; o build não o exercita.
- Nenhuma dependência nova.

## Quando reabrir

- A página mudar de propósito de novo (por exemplo, deixar de ser sobre AI Engineer): novo slug, nova entrada de redirect.
- Os logs do Caddy mostrarem tráfego zero em `/en/roadmap*` e `/pt/roadmap*` por alguns meses: avaliar remover as regras.
- Migração de hospedagem para fora do Caddy (ADR 0006): os redirects precisam ir junto para o novo servidor ou para o Cloudflare.
- Um terceiro idioma: definir o slug localizado da jornada junto com a revisão da ADR 0005.

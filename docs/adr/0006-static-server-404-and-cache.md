# 0006 — Servidor estático: 404 real e cache longo para assets

Status: Accepted · Data: 2026-11-25

## Contexto

O Railway constrói o site com Railpack. Para um projeto Vite, o Railpack detecta uma SPA e publica `dist/` com Caddy, usando um Caddyfile padrão que termina em `try_files {path} {path}.html {path}/index.html /index.html`. Consequências em produção:

- Qualquer caminho inexistente (`/qualquer-coisa`, `/en/nope/`) responde **200** com a raiz de redirecionamento por idioma (ADR 0002). Crawlers indexam URLs que não existem como páginas válidas (soft 404), e o `dist/404.html` nunca é servido.
- Nenhuma resposta traz `Cache-Control`. O navegador aplica cache heurístico tanto ao HTML (um deploy pode demorar a aparecer) quanto aos assets (que são baixados de novo sem necessidade).

O site não é SPA: cada página de cada idioma é um HTML próprio (ADR 0005), então o fallback para `index.html` não serve a nenhuma rota real.

O Railpack procura `Caddyfile.template` ou `Caddyfile` na raiz do repo e, se existir, usa no lugar do padrão (o arquivo passa pelo `text/template` do Go antes; o nosso não usa variáveis de template). O deploy copia o build para `/app/dist` e roda `caddy run --config /Caddyfile --adapter caddyfile`.

## Decisão

### Servidor

Continua o Caddy instalado pelo Railpack, configurado pelo `Caddyfile` versionado na raiz. Mantém do padrão do Railpack: `admin off`, `auto_https off` (o Railway termina o TLS), log em JSON, `trusted_proxies` do Railway, `respond /health 200`, `X-Content-Type-Options: nosniff`, remoção do header `Server`, compressão (zstd, gzip) e `hide .git .env*`. Raiz: `/app/dist`.

`railway.json` inclui `Caddyfile` em `watchPatterns`, para que mudar a configuração do servidor dispare deploy.

### Regra de 404

- Sem `try_files`: o `file_server` responde só com arquivos que existem em `dist/`. Diretórios servem o próprio `index.html` (`/en/books/`); um diretório sem barra final (`/en`) recebe o redirecionamento canônico do Caddy para `/en/`.
- Caminho sem arquivo correspondente responde **404** com o corpo de `dist/404.html` (`handle_errors 404` reescreve para `/404.html`; o `file_server` mantém o status do erro).
- A raiz `/` continua respondendo 200 com o redirecionamento por idioma (ADR 0002).

### Cache

| Caminho | `Cache-Control` | Por quê |
|---|---|---|
| `/assets/*` | `public, max-age=31536000, immutable` | O Vite coloca o hash do conteúdo no nome; arquivo novo = URL nova |
| `/fonts/*` | `public, max-age=31536000, immutable` | Ver regra de nome abaixo |
| Todo o resto (HTML, `robots.txt`, `sitemap.xml`, `favicon.svg`) | `no-cache` | O navegador revalida a cada visita (ETag/Last-Modified do Caddy); um deploy aparece na visita seguinte |
| Resposta 404 | `no-cache` | Uma URL que hoje não existe pode passar a existir |

### Regra de nome das fontes

Os arquivos de `public/fonts/` (ADR 0004) vão para `dist/fonts/` sem hash, mas recebem cache `immutable` de um ano. Portanto **um arquivo de fonte nunca é substituído no mesmo nome**: se o conteúdo mudar (nova versão da Poppins, outro subconjunto), o arquivo ganha nome novo (por exemplo `poppins-latin-400-normal-v2.woff2`) e as referências são atualizadas juntas: o `@font-face` em `src/index.css` e o `preload` em todo HTML de entrada que pré-carrega a fonte (hoje as 6 páginas: `en/index.html`, `en/books/index.html`, `en/roadmap/index.html`, `pt/index.html`, `pt/livros/index.html`, `pt/roadmap/index.html`). Um `grep -r "/fonts/" --include=*.html --include=*.css` antes do commit acha todas. Vale também para `OFL.txt` e qualquer outro arquivo em `public/fonts/`. Arquivos novos em `public/` fora de `fonts/` ficam com `no-cache`.

## Alternativas consideradas

- **`Staticfile` com `index_fallback: false`:** sozinho, desligaria o fallback, mas o Caddyfile padrão não define `Cache-Control` nem serve `404.html` (a resposta seria a página de erro vazia do Caddy). Junto com o Caddyfile, não muda o que é servido: o provider Node é detectado antes do `staticfile` e o arquivo só alteraria metadados do build. Ficou fora para não ser mais um arquivo a manter sem ganho comprovado.
- **`Caddyfile.template` com `{{.DIST_DIR}}`:** acompanharia uma mudança de diretório do Railpack, mas o arquivo deixaria de ser um Caddyfile válido para rodar e testar localmente. `/app/dist` é o caminho documentado no código do Railpack.
- **Servidor Node próprio (Express/`serve`) com `start` no `package.json`:** dependência nova e processo Node em produção para servir arquivos estáticos; o Caddy já vem pronto.
- **Imagem Docker própria (nginx ou Caddy):** controle total, mas troca o builder do Railway e passa a exigir manutenção da imagem.
- **Mover as fontes para o bundle do Vite (com hash):** elimina a regra de nome, mas o `preload` no HTML precisaria de plugin para descobrir o nome final (já recusado na ADR 0004).
- **`max-age` curto em vez de `no-cache` no HTML:** economiza uma revalidação, mas um deploy pode levar até o fim do `max-age` para aparecer, que é o problema a resolver.

## Consequências

- URLs inexistentes passam a responder 404 de verdade, com a página de erro do site. Links externos antigos para caminhos que nunca existiram deixam de cair na raiz.
- Visitas repetidas não baixam de novo CSS, JS, imagem e fontes; o HTML custa uma requisição condicional (304 quando nada mudou).
- A configuração do servidor fica versionada e testável localmente com Caddy em Docker, montando `dist/` em `/app/dist`: `docker run --rm -e PORT=8080 -p 8080:8080 -v "$PWD/dist:/app/dist:ro" -v "$PWD/Caddyfile:/Caddyfile:ro" caddy:2-alpine caddy run --config /Caddyfile --adapter caddyfile`. Conferido em 2026-11-25 com Caddy v2.11.9.
- Trocar o conteúdo de um arquivo em `public/fonts/` sem renomear faz visitantes antigos ficarem com a versão velha por até um ano.
- O Caddy é instalado pelo Railpack na versão `latest`; uma mudança incompatível no Caddyfile apareceria como falha de deploy, não silenciosamente.
- O Railpack registra metadados para o Railway servir sites estáticos a partir da borda, sem o container. Se o Railway passar a fazer isso para este serviço, as regras deste Caddyfile podem não se aplicar; a checagem pós-deploy (curl de 404 e de `Cache-Control`) detecta.

## Quando reabrir

- Se o Railway deixar de usar Railpack/Caddy para este serviço, ou começar a servir o site pela borda ignorando o Caddyfile.
- Se o Cloudflare passar a fazer proxy (nuvem laranja) e cache do site: rever qual camada define `Cache-Control` e como purgar no deploy.
- Se o site ganhar rota dinâmica que precise de fallback (roteamento no cliente) — contradiz a ADR 0005.
- Se a ADR 0004 for reaberta e as fontes passarem para o bundle com hash: a regra de nome deixa de ser necessária.
- Se o Lighthouse ou o tráfego mostrarem que a revalidação do HTML pesa (improvável em site deste porte).

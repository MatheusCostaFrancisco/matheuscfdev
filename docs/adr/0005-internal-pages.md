# 0005 — Páginas internas estáticas por idioma (roadmap e livros)

Status: Accepted (tabela de slugs: Superseded pela [ADR 0008](0008-journey-slugs.md)) · Data: 2026-11-24

## Contexto

O stakeholder decidiu (REPORT rodada 6, decisão 1) que o roadmap de estudos e a lista de livros saem da home e ganham páginas próprias, abertas na mesma aba. O site continua estático no Railway, bilíngue (ADR 0002) e com URLs absolutas derivadas de `SITE_URL` (ADR 0003). Cada página nova precisa do próprio `<html lang>`, title, description, canonical, `og:url` e `hreflang` sem depender de JS, pelo mesmo motivo da ADR 0002: crawlers e geradores de preview leem o HTML cru.

## Decisão

### Slugs

| Página | `en` | `pt-BR` |
|---|---|---|
| `home` | `/en/` | `/pt/` |
| `roadmap` | `/en/roadmap/` | `/pt/roadmap/` |
| `books` | `/en/books/` | `/pt/livros/` |

`roadmap` mantém a mesma palavra nos dois idiomas porque já é o rótulo do menu em pt-BR. `books` vira `livros` em pt-BR, que é o rótulo do menu. Todos os caminhos terminam com barra, como as homes da ADR 0002.

### Mapa de rotas como fonte única

`src/lib/routes.ts` exporta `pages` (`'home' | 'roadmap' | 'books'`), o tipo `Page`, o mapa `routes: Record<Locale, Record<Page, string>>` e `resolveRoute(pathname) → { locale, page }`. O resolvedor ignora maiúsculas, barra final ausente e `index.html` no fim; qualquer caminho fora do mapa resolve para a home em inglês. Ele substitui `localeFromPathname()` e `localePaths` da ADR 0002, que saíram de `src/lib/locale.ts`.

Nenhum caminho é escrito fora do mapa:

- `vite.config.ts` importa o mapa e gera as entradas HTML do build (`/pt/livros/` → `pt/livros/index.html`).
- As entradas HTML usam placeholders que o plugin `site-url` preenche a partir do mapa: `%ROUTE_URL%` (canonical e `og:url` da própria página), `%ROUTE_URL:en%` e `%ROUTE_URL:pt-BR%` (`hreflang` da página equivalente) e `%ROUTE_URL:x-default%`. A raiz usa `%ROUTE_PATH:<locale>:<page>%` no redirecionamento e nos links sem JS. Placeholder desconhecido, ou `%ROUTE_URL%` num arquivo que não é página do mapa, falha o build.
- Componentes linkam por `routes[locale][page]`.

Para que `vite.config.ts` (checado sem tipos do DOM) importe o mapa, `src/lib/locale.ts` ficou sem DOM: `storeLocale` e `localeStorageKey` foram para `src/lib/locale-storage.ts`.

### Multi-page estático

Cada página de cada idioma é uma entrada HTML própria do Vite (`en/roadmap/index.html`, `pt/livros/index.html` etc.), com o mesmo `src/main.tsx` e o mesmo bundle. `main.tsx` resolve `{ locale, page }` pelo `pathname` e o `App` escolhe o conteúdo do `<main>`; skip link, header e footer são os mesmos em todas as páginas. Em cada página interna o título da seção é o único `<h1>` e os subtítulos sobem um nível.

`x-default`: na home aponta para a raiz `/` (redirecionamento por idioma, ADR 0002). Nas páginas internas aponta para a versão em inglês (`defaultLocale`), porque não existe `/roadmap/` na raiz.

### Navegação

Links para páginas internas abrem na mesma aba, sem `target="_blank"`. Links externos (LinkedIn, GitHub, sites de produto) continuam em nova aba com o aviso para leitor de tela. A atualização do menu e do seletor de idioma para as rotas novas é a T-045; o link do 404 para as páginas novas é a T-047.

## Alternativas consideradas

- **Roteador no cliente (React Router, TanStack Router):** um único HTML, então `lang`, title e meta trocados só por JS; preview e crawler veriam sempre a home. Mais uma dependência para três páginas.
- **Manter tudo na home com âncoras:** contraria a decisão do stakeholder e deixa a home longa.
- **Gerar as entradas HTML virtualmente no plugin (sem arquivo em disco):** eliminaria os quatro HTML novos, mas o dev server do Vite serve HTML do disco; exigiria middleware próprio. Os arquivos em disco seguem o padrão da ADR 0002 e só o texto (title, description) muda entre eles.
- **Slug `livros` e `books` iguais nos dois idiomas, ou `/pt/estudos/`:** o PO escolheu seguir o rótulo do menu de cada idioma; "roadmap" já é o rótulo em pt-BR.
- **Pré-renderizar o React no build (SSG):** continua fora pelo mesmo motivo da ADR 0002.

## Consequências

- Seis páginas de app no build em vez de duas. Mudança de `<head>` comum (fonte, favicon) precisa ser replicada nos seis HTML de página; `railway.json` já observa `en/**` e `pt/**`.
- Página nova = entrada no mapa + arquivo HTML no caminho correspondente; o build falha se o arquivo existir com placeholders mas não estiver no mapa, e o Rollup falha se o mapa apontar para um arquivo ausente.
- `/pt/qualquer-coisa` agora resolve para a home em inglês no cliente (antes resolvia para pt-BR). Na prática o servidor estático responde `404.html` antes de o app montar.
- Até a T-045, o menu da home ainda tem os itens "Roadmap" e "Books/Livros" apontando para âncoras que não existem mais, e o seletor de idioma nas páginas internas leva para a home do outro idioma.
- Nenhuma dependência nova.

## Quando reabrir

- Mais de cerca de cinco páginas por idioma, ou páginas com parâmetro (`/pt/projetos/<slug>/`): avaliar gerar as entradas HTML no plugin ou adotar SSG.
- Lighthouse SEO abaixo de 90 nas páginas internas por causa do `#root` vazio: pré-renderizar.
- Um terceiro idioma: revisar a regra do `x-default` e os slugs localizados.
- Se o stakeholder quiser os slugs iguais nos dois idiomas (`/pt/books/`), ou renomear `roadmap`: muda só o mapa e o caminho dos arquivos, mas links já compartilhados quebram, então exige redirect.

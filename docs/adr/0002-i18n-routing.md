# 0002 — Rotas bilíngues (/en/, /pt/) com detecção de idioma do navegador

Status: Accepted · Data: 2026-11-24

## Contexto

O stakeholder decidiu (REPORT 24/11) que o site é bilíngue, pt-BR e en, com os mesmos fatos nos dois idiomas, detecção pelo idioma do navegador, fallback em inglês, seletor visível e rotas `/pt` e `/en`. O site é estático (Vite, publicado no Railway), sem servidor próprio para negociar `Accept-Language`, e o domínio de produção ainda não foi definido.

Requisitos que pesam na escolha:

- Cada idioma precisa do próprio `<html lang>`, `<title>`, meta description e `og:locale` sem depender de JS, porque crawlers e geradores de preview (LinkedIn, WhatsApp, Slack) leem o HTML cru.
- Links com âncora (`/#contact`, `/en/#experience`) precisam continuar funcionando nos dois idiomas.
- Sem dependência nova se der para evitar.

## Decisão

### Locales

| Locale | `lang` | Rota | `og:locale` |
|---|---|---|---|
| `en` | `en` | `/en/` | `en_US` |
| `pt-BR` | `pt-BR` | `/pt/` | `pt_BR` |

O tipo `Locale = 'en' | 'pt-BR'` mora em `src/lib/locale.ts`, junto de `locales`, `defaultLocale` (`en`), `localePaths` e `localeFromPathname()`. A rota usa `/pt/` (curta, pedida pelo stakeholder); o identificador interno e o `lang` usam `pt-BR`, que é a variante real do texto.

### Páginas estáticas por idioma (multi-page do Vite)

`vite.config.ts` declara três entradas HTML em `build.rollupOptions.input`:

| Arquivo fonte | Saída | Papel |
|---|---|---|
| `index.html` | `dist/index.html` | Redirecionamento por idioma; sem React |
| `en/index.html` | `dist/en/index.html` | App em inglês |
| `pt/index.html` | `dist/pt/index.html` | App em português |

As duas páginas de idioma carregam o mesmo `src/main.tsx` e o mesmo bundle. Cada uma tem `lang`, `<title>`, description, `og:title`, `og:description`, `og:locale` e `og:locale:alternate` próprios, mais `<link rel="alternate" hreflang>` para `en` (`/en/`), `pt-BR` (`/pt/`) e `x-default` (`/`). A raiz também declara os três `hreflang`.

### Montagem do app

`src/main.tsx` chama `localeFromPathname(window.location.pathname)` e entrega o resultado em `LocaleContext` (`src/lib/locale-context.ts`). Componentes leem com `useLocale()`. A regra é pelo primeiro segmento do caminho: `pt` resolve para `pt-BR`; qualquer outro caminho (inclusive `/`, `/en/` e rotas desconhecidas) resolve para `en`.

### Regra de detecção na raiz

Script inline no `<head>` de `dist/index.html`:

1. Idioma preferido = `navigator.languages[0]`, ou `navigator.language` se a lista não existir.
2. Começa com `pt` (sem diferenciar maiúscula) → `/pt/`. Qualquer outro valor, ou vazio → `/en/` (fallback).
3. Redireciona com `location.replace` (não polui o histórico) mantendo `search` e `hash`: `/#contact` vira `/pt/#contact`.

Sem JS, a raiz mostra o nome, a linha "Choose a language · Escolha o idioma" e dois links, "English" e "Português (Brasil)", com `hreflang` e `lang`. Essa página não carrega o bundle CSS nem a Poppins (só é vista sem JS, e pedir a fonte atrasaria o redirecionamento de todo mundo): usa fonte do sistema e repete os tokens de cor de `src/index.css` como custom properties de mesmo nome num `<style>` inline. A raiz também mantém o bloco `og:` em inglês, porque geradores de preview não executam o script. A preferência salva pelo seletor de idioma (T-019) entra nessa mesma regra como primeiro critério, antes do idioma do navegador.

### Âncoras

Os `id` de seção são os mesmos nos dois idiomas (`#about`, `#experience`, `#products`, `#skills`, `#education`, `#contact`, `#main`). Só o texto visível muda. Isso permite trocar de idioma mantendo o hash e compartilhar links de seção sem tabela de tradução de âncoras.

## Alternativas consideradas

- **Roteamento no cliente (React Router ou similar) com uma única `index.html`:** um único HTML significa `lang` e meta tags trocados só por JS; preview de link e crawler veriam sempre o mesmo idioma. Também adicionaria uma dependência para duas rotas.
- **Plugin de i18n (`react-i18next`, `vite-plugin-*` de SSG):** resolve strings e geração estática, mas é pesado para dois idiomas e um site de uma página. O conteúdo já é tipado em `src/content/`; um `Record<Locale, SiteContent>` (T-017) cobre a tradução com checagem do compilador.
- **Pré-renderizar o React no build (SSG):** melhor para SEO e primeira pintura, mas exige script de build próprio ou dependência. Fica para quando houver motivo (ver "Quando reabrir").
- **Negociar `Accept-Language` no servidor (redirect 302):** sem flash e sem JS, mas o Railway serve arquivos estáticos e não temos servidor nem worker; o Cloudflare ainda não está configurado.
- **Idioma pela query (`?lang=pt`) ou só pelo navegador, sem rota:** não gera URL própria por idioma, então não dá para compartilhar nem indexar a versão em português.
- **Rota `/pt-br/`:** mais explícita, mas o stakeholder pediu `/pt` e só existe uma variante de português.

## Consequências

- Arquivos novos na raiz do repo: `en/index.html` e `pt/index.html`. Mudança de `<head>` comum (fonte, favicon) precisa ser replicada nos dois; `railway.json` observa `en/**` e `pt/**`.
- O conteúdo do React ainda não é pré-renderizado: as duas páginas chegam com `#root` vazio e só o `<head>` difere. A tradução das strings visíveis vem em T-016 a T-018; até lá `/pt/` mostra o texto em inglês. Para não falhar WCAG 3.1.1, `pt/index.html` mantém `<html lang="pt-BR">` e marca `<div id="root" lang="en">` enquanto o conteúdo renderizado for inglês; T-018 remove o atributo quando o texto estiver em pt-BR.
- Quem acessa `/` faz um redirecionamento extra (custo de uma navegação). Links públicos (LinkedIn, CV) devem apontar direto para `/en/` ou `/pt/`.
- `hreflang`, `og:image` e (futuramente) `og:url` e canonical estão com caminho relativo porque o domínio não existe ainda. O Google exige URL absoluta em `hreflang`, então isso precisa ser trocado quando o domínio for definido.
- Rotas desconhecidas resolvem para `en`. Se o servidor responder `/qualquer-coisa` com `dist/index.html`, o visitante cai no redirecionamento por idioma; a página 404 de verdade é T-013.
- Nenhuma dependência nova.

## Quando reabrir

- Domínio de produção definido: trocar `hreflang`, `og:image`, `og:url` e canonical para URLs absolutas (por variável de ambiente, não hardcode).
- Um terceiro idioma, ou conteúdo que precise de rotas internas por idioma (`/pt/projetos/...`): avaliar SSG ou roteador.
- Lighthouse SEO/performance abaixo de 90 por causa do `#root` vazio, ou preview de link sem o texto certo: pré-renderizar o HTML no build.
- Cloudflare configurado: considerar mover a detecção para redirect no edge (Worker ou regra) e remover o script da raiz.
- Métrica mostrando que muitos visitantes caem no idioma errado (por exemplo, recrutador brasileiro com navegador em inglês querendo pt): revisar a regra ou priorizar o seletor.

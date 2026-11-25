# 0004 — Poppins servida pelo próprio site

Status: Accepted · Data: 2026-11-24

Substitui só a forma de carregar a fonte descrita na ADR 0001 ("Fonte: Poppins"). A família, os pesos e o fallback da ADR 0001 continuam valendo.

## Contexto

A ADR 0001 carregava a Poppins por `<link>` do Google Fonts. Cada visita abria conexão com `fonts.googleapis.com` e `fonts.gstatic.com`, o que entrega IP e user agent do visitante a um terceiro sem base legal declarada (LGPD; na UE, o LG München decidiu em 2022 que isso viola o GDPR). O site não tem banner de consentimento nem política de privacidade, e não deveria precisar de uma só por causa da fonte. A própria ADR 0001 listava a migração para self-hosted como primeira opção se a privacidade virasse requisito.

Além disso, o CSS do Google bloqueia a renderização e exige duas conexões extras (DNS + TLS) antes de qualquer arquivo de fonte chegar.

## Decisão

- Os arquivos ficam em `public/fonts/` e são copiados sem hash para `dist/fonts/`: Poppins normal 400, 500, 600 e 700, subconjuntos `latin` e `latin-ext`, só woff2 (8 arquivos, cerca de 53 KB no total; cada visita baixa só o que usa).
- Origem: pacote npm `@fontsource/poppins` 5.3.0, que redistribui o build do Google Fonts. Os arquivos foram extraídos do tarball uma vez e versionados; o pacote **não** entra em `package.json`. Licença: SIL Open Font License 1.1, copiada em `public/fonts/OFL.txt` (a OFL exige que a licença acompanhe a redistribuição).
- `src/index.css` declara os `@font-face` com `font-display: swap` e os mesmos `unicode-range` do Fontsource/Google, então o navegador escolhe os mesmos arquivos que escolhia antes.
- `en/index.html` e `pt/index.html` fazem `preload` de `/fonts/poppins-latin-400-normal.woff2`, o peso do texto corrido. Os outros pesos carregam sob demanda.
- `404.html` usa a mesma fonte pelo bundle CSS, sem preload (página rara, `noindex`).
- A raiz (`index.html`) continua sem Poppins, como define a ADR 0002.

## Alternativas consideradas

- **`@fontsource/poppins` como dependência importada no CSS:** atualização via `yarn upgrade`, mas o Vite gera nomes com hash, e o `preload` no HTML precisaria de plugin para descobrir o nome final. Também puxa uma dependência para algo que muda quase nunca.
- **Baixar direto da API do Google Fonts:** mesmos binários, mas a resposta varia por user agent e não traz a licença junto. O Fontsource é a mesma origem empacotada de forma reproduzível.
- **Fonte variável (um arquivo para todos os pesos):** a Poppins não tem versão variável, nem no Google Fonts nem no Fontsource.
- **Fonte do sistema:** zero bytes, mas muda a identidade visual definida na ADR 0001. Fica para a ADR 0001 decidir.
- **Continuar no Google Fonts:** mantém o terceiro e o problema de privacidade.

## Consequências

- O site não faz mais nenhuma requisição a terceiros para renderizar; `dist/` não contém `fonts.googleapis.com` nem `fonts.gstatic.com`.
- Atualizar a fonte é manual: baixar a versão nova do `@fontsource/poppins`, substituir os arquivos em `public/fonts/` e conferir os `unicode-range`.
- O nome do arquivo pré-carregado aparece em três lugares (`src/index.css`, `en/index.html`, `pt/index.html`); renomear exige mexer nos três, senão o preload baixa um arquivo que não é usado.
- Itálico continua sintetizado pelo navegador, como já era com o Google Fonts (que só carregava normal).
- O cache de longo prazo para `/fonts/` depende do servidor do Railway; os arquivos não têm hash no nome.

## Quando reabrir

- Se a ADR 0001 trocar de família ou adicionar pesos.
- Se o site ganhar conteúdo em script fora de latin/latin-ext (devanágari, cirílico).
- Se o Lighthouse apontar a fonte como gargalo de LCP ou CLS: avaliar `size-adjust` no fallback ou subconjunto menor.
- Se o Railway não servir `/fonts/` com cache longo: avaliar mover para o bundle com hash.

---
status: Accepted
date: 2026-11-26
owner: Matheus Costa Francisco (stakeholder)
---

# Spec — Dark mode e produtos na horizontal

Duas mudanças pedidas pelo stakeholder em 2026-11-26: o site ganha tema escuro, que segue o sistema por padrão e pode ser trocado por um botão, e os cards de produto passam a ocupar uma linha inteira cada, com o conteúdo distribuído na horizontal.

## Decisões do stakeholder (2026-11-26)

| Tema | Decisão |
|---|---|
| Tema padrão | Segue o sistema (`prefers-color-scheme`) |
| Troca manual | Botão no header com três opções: Sistema, Claro, Escuro. A escolha fica salva no navegador |
| Produtos | Cards largos empilhados, um produto por linha. Nome, papel e descrição à esquerda; bullets, stack e link à direita. No celular, uma coluna só |

## Goals

### Dark mode

1. **Tokens:** os tokens semânticos de `src/index.css` (`surface*`, `fg*`, `on-accent`, `line*`, `accent-50…950` e as sombras) ganham valores escuros. A troca acontece por valor, sem renomear nenhuma classe.
   - O acento continua teal (ADR 0001) e a escala é espelhada no escuro, do mesmo jeito que a jornada faz com o azul-violeta (ADR 0010). Assim os pares claro/escuro dos componentes continuam funcionando.
   - Sombras tingidas, sem preto puro e sem glow.
2. **Seleção do tema:** o tema escuro vale quando `:root[data-theme="dark"]`, ou quando `@media (prefers-color-scheme: dark)` e `:root:not([data-theme="light"])`. Sem `data-theme`, o site segue o sistema.
3. **Sem flash:** um script inline curto no `<head>` de todas as páginas geradas (home en/pt, livros, 404 e demais páginas internas) lê a escolha salva e define `data-theme` antes do primeiro paint.
   - `<meta name="color-scheme" content="light dark">` nessas páginas.
   - `theme-color` com uma variante por `media`.
   - O acesso a `localStorage` fica em `try/catch`. Se falhar, o site segue o sistema.
4. **Botão no header:** controle de três opções (Sistema, Claro, Escuro) com ícones Lucide (Monitor, Sun, Moon; stroke 1.75).
   - Visível no desktop e dentro do menu mobile.
   - Nome acessível que anuncia a opção atual.
   - Alvo de 44px e os 7 estados (hover, focus, `:active`, disabled quando couber).
   - Rótulos em pt-BR e en em `src/content/`.
   - Com "Sistema" escolhido, mudar o tema do SO muda o site na hora, sem recarregar.
5. **Cobertura:** todas as superfícies do site ficam legíveis nos dois temas.
   - Seções: Hero, About, Experience, Skills, Education, Products, Testimonials, Books, Teasers, Contact, Footer e 404.
   - Partes específicas: barras de progresso dos livros, tags, foco, seleção de texto, scrollbar (via `color-scheme`) e favicon.
6. **Contraste WCAG 2.1 AA** no tema escuro, nos mesmos papéis da tabela da ADR 0001: texto de corpo ≥ 4.5:1, UI e texto grande ≥ 3:1, anel de foco visível sobre todas as superfícies.
7. **ADR nova (0011)** registra o tema escuro: valores, regra de seleção, script anti-flash e "Quando reabrir". Ela substitui a seção "Claro/escuro" da ADR 0001, que é append-only e por isso não é reescrita.

### Produtos

8. A lista de produtos vira uma coluna única: um card por linha, com a largura do container.
9. A partir de `md` (768px), cada card tem duas colunas internas.
   - Esquerda (~2/5): nome, papel e descrição.
   - Direita: bullets, stack e link.
   - Abaixo de `md`, a ordem é a mesma, em uma coluna.
10. Some o espaço vazio do WoodFlow em 1024px ou mais (item T-031 do REPORT). A animação de entrada (`data-reveal-item`), o hover e o foco continuam.

## Non-goals

- A jornada (`/en/journey/`, `/pt/jornada/`) continua sempre escura, com a paleta própria (ADR 0010). O botão de tema não muda essa página. Nela, ele fica escondido ou desabilitado com uma explicação, à escolha do PO.
- Sem tema "alto contraste" e sem segunda cor de acento.
- Sem mudar o conteúdo dos produtos nem a ordem deles.
- Sem carrossel.

## Edge cases

- **`localStorage` bloqueado** (modo privado, storage desligado): o botão funciona na sessão e o site volta a seguir o sistema no próximo carregamento, sem erro no console.
- **Valor salvo inválido:** tratado como "Sistema".
- **JavaScript desligado:** o CSS ainda segue o sistema. O botão pode ficar sem efeito.
- **Ir da home escura para a jornada:** o túnel já escurece, então não pode haver flash claro no caminho. Voltar da jornada para a home em tema claro também não pode piscar.
- **Imagens:** a foto e o card OG não mudam. O favicon tem que continuar visível na aba em tema escuro.
- **Reduced motion:** a troca de tema não anima cores.
- **Produto sem bullets, sem stack ou sem link:** a coluna direita encolhe sem deixar um buraco. Se ela ficar vazia, o card usa uma coluna só.
- **375px:** sem scroll horizontal em nenhum dos dois temas.

## Critérios de pronto

- `yarn typecheck`, `yarn lint`, `yarn test` e `yarn build` verdes.
- axe sem violações WCAG A/AA em `/en/` e `/pt/`, nos temas claro e escuro (o tema forçado por `data-theme`).
- Screenshots em 375px e 1280px, nos dois temas, da home e da seção de produtos.
- Sem flash claro ao recarregar com tema escuro salvo, nem com o SO em escuro.
- ADR 0011 criada com "Quando reabrir".

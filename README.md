# ABA Links — Maple Bear

Central de Acessos institucional da comunidade escolar Maple Bear / ABA. Uma página única, sem rolagem em notebooks, com os atalhos para as plataformas usadas no dia a dia e um painel de fotos em rotação.

Site estático em HTML, CSS e JavaScript puro: sem framework, sem build, sem dependências de pacote.

## Como rodar

Basta abrir o `index.html` no navegador. Para testar como em produção, sirva a pasta por HTTP:

```bash
python -m http.server 5173
```

Depois acesse `http://localhost:5173`.

## Publicação

Por ser estático, funciona em qualquer hospedagem de arquivos (GitHub Pages, Netlify, servidor web comum). Publique o conteúdo da pasta como está.

## Estrutura

```
index.html      Estrutura da página (header, plataformas, hero com fotos)
styles.css      Todo o visual: tokens, header, hero, cards, responsivo
platforms.js    Dados das plataformas (fonte única)
cards.js        Gera os cards a partir de platforms.js
logos.js        Logos das marcas em SVG monocromático (currentColor)
icons.js        Ícones de interface (seta de acesso)
script.js       Rotação automática das fotos do hero
Imagens/        Logos do cabeçalho, favicons e fotos (Imagens/hero)
fonts/          Poppins 400, 500 e 600 em WOFF2 (hospedada localmente)
```

## Manutenção

### Adicionar, editar ou remover uma plataforma

Edite apenas `platforms.js`. Cada item tem:

| Campo    | Descrição |
|----------|-----------|
| `id`     | Identificador único, sem espaços |
| `nome`   | Texto exibido no card |
| `logo`   | Chave da logo em `logos.js` |
| `estado` | `"ativo"`, `"pendente"` ou `"indisponivel"` |
| `url`    | Endereço `https://` completo (obrigatório para `ativo`) |

Estados:

- **ativo**: card clicável, abre em nova aba.
- **pendente**: exibe "Acesso em breve" (também é usado quando a URL não é `https://`).
- **indisponivel**: exibe "Temporariamente indisponível".

Os cards são numerados automaticamente pela ordem da lista.

### Adicionar uma logo nova

Inclua uma entrada em `logos.js` com `viewBox`, `height` (em rem) e `body` (o conteúdo do SVG). Use `currentColor` para que a logo siga a cor vermelha do site, e indique a chave no campo `logo` da plataforma. Se não houver logo, o card é exibido sem ela.

### Fotos do hero

As fotos ficam em `Imagens/hero/`, em cinco larguras WebP (800, 1280, 1920, 2560 e 3840 px). Para trocar ou adicionar uma foto:

1. Gere os arquivos nas cinco larguras (`nome-800.webp` … `nome-3840.webp`).
2. Em `index.html`, duplique um `<img class="hero__slide">` e aponte `data-srcset` para os novos arquivos.
3. Ajuste o enquadramento em `--slide-focus` (posição `x y`, por exemplo `50% 35%`).

Só a primeira foto carrega com a página; as demais são carregadas pouco antes de aparecerem. O intervalo entre fotos é a constante `INTERVAL` em `script.js` (hoje 4000 ms).

### Cores e medidas

Os tokens de design ficam no início de `styles.css` (`:root`): vermelho da marca (`--red-600`, `--red-700`), tons de texto, linhas (`--line`, `--line-strong`) e largura do conteúdo. Alterar ali muda o site inteiro.

## Decisões de projeto

- **Layout em uma tela**: plataformas no topo e fotos ocupando o restante da altura, sem rolagem em notebooks (como 15,6") e adaptado a monitores maiores. O tamanho-base da fonte é fluido para escalar em telas grandes.
- **Responsivo**: grade de cards em 7 colunas (telas largas), 4, 2 ou 1 coluna conforme a largura.
- **Acessibilidade**: link para pular ao conteúdo, `h1` e `h2` semânticos, nome acessível nos cards com aviso de "abre em uma nova aba", foco visível, e respeito a `prefers-reduced-motion`.
- **Segurança**: links externos com `target="_blank"` e `rel="noopener noreferrer"`; só URLs `https://` são aceitas.
- **Desempenho**: fotos em WebP com `srcset`, carregamento sob demanda, logos em SVG leve e fonte hospedada localmente (sem requisições a terceiros). A rotação das fotos pausa com a aba oculta, com movimento reduzido ou com economia de dados.

## Testes realizados

Em janela simulada no navegador embutido do Claude (Chromium):

- Larguras de 320 a 3840 px (320, 375, 414, 768, 1024, 1280, 1366, 1536, 1920, 2560 e 3840): sem rolagem horizontal, sem conteúdo cortado nos cards, alvos de toque de pelo menos 44 px.
- De 1280×720 a 3840×2160, incluindo 1536×730 (notebook 15,6" a 125%), a página cabe na tela sem rolagem vertical. Abaixo disso, a página rola.
- Contraste do vermelho e do cinza de texto acima de 4,5:1 (calculado).
- Console sem erros; nenhuma requisição externa.

**Não testado**: dispositivos reais, Firefox e Safari, leitor de tela, navegação completa por teclado, Core Web Vitals (rode Lighthouse ou PageSpeed no site publicado) e a animação das fotos em tempo real.

## Observações

- `.claude/launch.json` serve só para o ambiente de desenvolvimento e pode ser removido na publicação.
- A fonte Poppins tem licença SIL OFL; os arquivos em `fonts/` são o subset latin (cobre o português).

## Créditos

As marcas TOTVS, Gmail, ABA.net, Lex, Toddle e Maple Bear pertencem aos seus respectivos titulares e são usadas apenas para identificar os serviços. Ícones de interface: [Lucide](https://lucide.dev) (licença ISC). Fonte: [Poppins](https://fonts.google.com/specimen/Poppins).

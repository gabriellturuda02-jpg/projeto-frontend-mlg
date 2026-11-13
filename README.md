# Comércio MLG — Projeto Front-End

Site institucional e catálogo de produtos da **Comércio MLG**, empresa de queijos, frios, doces e bebidas fundada em 1999.

Projeto em grupo da disciplina **Desenvolvimento Front-End para Web** — UNICID (Universidade Cidade de São Paulo)
Prof. Me. Gabriel Rosa Paz

## Integrantes

| Nome | RGM | GitHub |
|---|---|---|
| Felipe Gonçales de Souza Moura | 47897694 | [@felipegoncales05-pixel](https://github.com/felipegoncales05-pixel) |
| Miguel Marcos da Silva Gonçalves | 47963549 | — |
| Cauã Martins Aziago | 48100170 | [@cauaaziago20-creator](https://github.com/cauaaziago20-creator) |
| Gabriell dos Santos Turuda Barbosa | 47964901 | [@gabriellturuda02-jpg](https://github.com/gabriellturuda02-jpg) |
| Maria Clara Farias Coelho | 47968427 | [@mariaclarafarias1806-web](https://github.com/mariaclarafarias1806-web) |
| Kayk Alberto Santana Ferreira | 47792426 | [@kayksantanaf](https://github.com/kayksantanaf) |

## Objetivo

Apresentar a Comércio MLG e seus produtos na internet e facilitar o contato e o pedido de clientes do varejo e de revendedores (lojas, mercados e padarias).

## Público-alvo

- Clientes do varejo que compram queijos, frios e bebidas para casa
- Lojas, mercados, padarias e lanchonetes que revendem os produtos

## Páginas (10)

| Página | Arquivo | Conteúdo |
|---|---|---|
| Início | `index.html` | Catálogo completo: "Quem somos", categorias, novidades, produtos, busca, carrinho e pedido pelo WhatsApp |
| Sobre | `sobre.html` | História da família, linha do tempo e valores |
| Produtos | `produtos.html` | Todos os produtos com busca |
| Queijos | `queijos.html` | Catálogo de queijos |
| Embutidos | `embutidos.html` | Catálogo de embutidos |
| Pães de Queijo | `paes-de-queijo.html` | Catálogo de pães de queijo |
| Bebidas | `bebidas.html` | Licores e vinhos |
| Galeria | `galeria.html` | Vídeo e fotos dos produtos |
| Contato | `contato.html` | Formulário com validação HTML5 |
| Orçamento | `orcamento.html` | Pesquisa de domínio e hospedagem |

## Tecnologias

- HTML5 semântico (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `footer`)
- CSS3 em arquivos separados: `css/catalogo.css` (página inicial) e `css/style.css` (demais páginas), com variáveis, Grid, Flexbox e layout responsivo
- JavaScript: `js/catalogo.js` (catálogo, busca, carrinho e envio do pedido pelo WhatsApp), `js/dados-catalogo.js` (lista de produtos) e `js/script.js` (menu, busca e formulário das demais páginas)
- Formulário com validações nativas: `required`, `type="email"`, `type="tel"`, `pattern`, `minlength`, `maxlength`, `min`/`max`
- Multimídia: imagens otimizadas e vídeo em `<video>` (`assets/video/`)

## Estrutura de pastas

```
projeto-frontend-mlg/
├── index.html ... orcamento.html   (10 páginas)
├── css/style.css
├── js/script.js
├── img/produtos/   img/site/
├── assets/video/
└── docs/
    ├── planejamento.md
    ├── diario-de-bordo.md
    └── relatorio-dominio-hospedagem.md
```

## Como abrir

Abra o arquivo `index.html` no navegador. Não precisa instalar nada.

Versão publicada: GitHub Pages (link na descrição do repositório).

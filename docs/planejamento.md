# Planejamento do projeto

## 1. Objetivo
Apresentar a Comércio MLG e seus produtos na internet e facilitar o contato e o pedido de clientes do varejo e de revendedores.

## 2. Público-alvo
- Clientes do varejo (consumidor final)
- Revendedores: lojas, mercados, padarias e lanchonetes

## 3. Sitemap

```
                                INÍCIO (index.html)
   ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
 SOBRE    PRODUTOS   QUEIJOS  EMBUTIDOS  PÃES DE   BEBIDAS   GALERIA   CONTATO  ORÇAMENTO
                                         QUEIJO
```
Todas as páginas têm o mesmo menu no topo e os mesmos links no rodapé, então de qualquer página o usuário chega a qualquer outra com um clique.

## 4. Inventário de conteúdo

| Página | Objetivo | Conteúdo necessário |
|---|---|---|
| Início (catálogo) | Apresentar a empresa e vender | "Quem somos", categorias, novidades, destaques, busca, carrinho e pedido pelo WhatsApp |
| Sobre | Contar a história | Texto da história, linha do tempo, valores, foto |
| Produtos | Mostrar todo o catálogo | Busca, cards com foto, descrição e preço |
| Queijos / Embutidos / Pães de Queijo / Bebidas | Mostrar cada categoria | Banner, busca, cards |
| Galeria | Mostrar mídias | Vídeo e fotos |
| Contato | Receber mensagens e pedidos | Formulário validado e informações de atendimento |
| Orçamento | Registrar a pesquisa | Tabelas de domínio e hospedagem e conclusão |

## 5. Wireframes

### Início (catálogo)
```
┌───────────────────────────────────────────┐
│ LOGO   MENU (páginas)   [ BUSCA ]  [🛒]   │  header + nav + carrinho
├───────────────────────────────────────────┤
│ TÍTULO "Mais que produtos..."             │
│ QUEM SOMOS (texto)                        │  hero
│ [Ver catálogo] [Nossa história]           │
├───────────────────────────────────────────┤
│ [CATEG] [CATEG] [CATEG] [CATEG]  →        │  categorias
├───────────────────────────────────────────┤
│ NOVIDADES: faixa que anda sozinha  → → →  │
├───────────────────────────────────────────┤
│ [Todos][Queijos][Embutidos][Pães][Bebidas]│  filtros
│ [CARD] [CARD] [CARD] [CARD]               │  16 destaques
│ ...                                       │
│ VEJA TUDO POR CATEGORIA: [botões]         │
├───────────────────────────────────────────┤
│ NAVEGUE PELO SITE: links das 10 páginas   │
│ FOOTER                                    │
└───────────────────────────────────────────┘
CARRINHO (abre ao lado): itens, quantidades, total,
dados de entrega e botão "Enviar pedido pelo WhatsApp"
```

### Página interna (categoria)
```
┌───────────────────────────────────────────┐
│ HEADER + NAV                              │
├───────────────────────────────────────────┤
│ BANNER: título + descrição da categoria   │
├───────────────────────────────────────────┤
│ [ buscar produto...            ]          │
├───────────────────────────────────────────┤
│ [CARD] [CARD] [CARD] [CARD]               │
│ [CARD] [CARD] [CARD] [CARD]               │  foto, nome, descrição,
│ ...                                       │  preço, botão "Quero este"
├───────────────────────────────────────────┤
│ FOOTER                                    │
└───────────────────────────────────────────┘
```

### Contato
```
┌───────────────────────────────────────────┐
│ HEADER + NAV                              │
├───────────────────────────────────────────┤
│ BANNER "Contato"                          │
├─────────────────────────┬─────────────────┤
│ FORMULÁRIO              │ ATENDIMENTO     │
│ nome, e-mail, telefone  │ cidade, horário │
│ tipo, produto, qtde     │ pagamento,      │
│ mensagem, aceite        │ entrega         │
│ [Enviar]                │                 │
├─────────────────────────┴─────────────────┤
│ FOOTER                                    │
└───────────────────────────────────────────┘
```

## 6. Guia visual

| Item | Definição |
|---|---|
| Cor principal | Preto `#0b0b0b` |
| Cor secundária | Cinza escuro `#151515` / `#2a2a2a` |
| Destaque | Dourado `#ffd21a` |
| Fundo | Preto `#0b0b0b` |
| Fonte dos títulos | Georgia (serifada) |
| Fonte do texto | system-ui / Segoe UI / Arial |
| Botões | Dourados, arredondados (999px), texto preto em maiúsculas |
| Cards | Fundo `#151515`, borda `#2a2a2a`, cantos de 18px, foto quadrada |
| Bordas | Linha dourada embaixo dos títulos de seção |

## 7. Divisão de responsabilidades

| Área | Responsável |
|---|---|
| Conteúdo (textos e revisão) | _a definir_ |
| HTML (estrutura e links) | _a definir_ |
| CSS (identidade e layout) | _a definir_ |
| Mídias (imagens e vídeo) | _a definir_ |
| Docs (README e diário) | _a definir_ |
| Git (repositório e commits) | Gabriell dos Santos Turuda Barbosa |

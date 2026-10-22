# TechStore

Loja virtual da TechStore, feita em React com Vite.

As demandas da avaliação estão no arquivo [ENUNCIADO.md](ENUNCIADO.md).

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Rode o projeto:

   ```bash
   npm run dev
   ```

A loja abre em `http://localhost:5173`.

O endereço da API fica na variável `VITE_API_URL`, no arquivo `.env`.

## Testes

Testes unitários:

```bash
npm test
```

Testes E2E com Playwright:

```bash
npm run test:e2e
```

A suíte E2E inicia o Vite automaticamente e usa fixtures interceptadas para testar os principais fluxos sem depender da API externa.

Para automação por agentes, consulte o [Playwright CLI](https://playwright.dev/agent-cli/introduction) e instale-o globalmente:

```bash
npm install -g @playwright/cli
```

## Organização do projeto

| Pasta | Conteúdo |
|---|---|
| `src/pages/` | Componentes de página, um por rota |
| `src/components/` | Componentes reaproveitáveis |
| `src/services/` | Chamadas à API e tratamento dos dados recebidos |
| `src/utils/` | Regras de negócio e cálculos (descontos, cupons, totais, formatação) |
| `docs/` | Requisitos, regras de negócio e contrato da API |

Todo código novo deve seguir essa organização.

## Rotas

| Rota | Página |
|---|---|
| `/` | Loja, com a lista de produtos e o filtro de categoria |
| `/produto/:id` | Página do produto, com produtos relacionados |
| `/carrinho` | Carrinho, com cupom de desconto e sugestões |
| `/estoque` | Área interna usada pelo time de estoque |

## Ambiente de testes

O rodapé tem um seletor de **cliente de teste**, que simula qual cliente está navegando na loja. Use-o para testar regras que dependem do cliente, como cupons.

## Documentação

Requisitos e regras de negócio ficam na pasta `docs/`. O histórico de mudanças da loja fica no `CHANGELOG.md`.

# Auditoria do código

**Data:** 21/10/2026  
**Escopo:** `src/`, `tests/`, `docs/` e configuração do projeto. Dependências em `node_modules/` e artefatos em `dist/` não foram auditados.

## Resultado da validação

- `npm test`: 4 arquivos e 15 testes aprovados.
- `npm run build`: concluído com sucesso.

Os testes atuais não cobrem os fluxos de página, adição pelo detalhe do produto, sugestões do carrinho, tratamento de falha da API ou controle de estoque. Portanto, os achados abaixo foram confirmados por leitura dos fluxos e não significam que todos estejam cobertos por testes automatizados.

## Achados prioritários

### 1. Adição ao carrinho não valida preço nem estoque

**Status:** resolvido em `cf1751b` e `HEAD`.

- **Severidade:** alta
- **Arquivos:** `src/App.jsx:33-42`, `src/pages/PaginaProduto.jsx:49-53`, `src/pages/PaginaProduto.jsx:61-74`, `src/components/SugestaoItem.jsx:13`
- **Problema:** `adicionarAoCarrinho` apenas concatena o produto. A vitrine filtra produtos sem estoque, mas a página de produto pode ser aberta diretamente por URL e os produtos relacionados e as sugestões do carrinho não aplicam o mesmo filtro. Assim, um produto esgotado ou sem preço pode ser adicionado.
- **Impacto:** o carrinho pode conter produtos que não deveriam ser vendidos; produtos sem preço entram no total como `0`, porque `calcularTotal` ignora preços inválidos.
- **Melhoria:** centralizar a regra de produto vendável em uma função reutilizável, validando estoque disponível e preço positivo dentro de `adicionarAoCarrinho`. Os botões das telas devem refletir a mesma regra.

### 2. Produtos sem preço são filtrados da soma, mas continuam vendáveis em outros fluxos

**Status:** resolvido em `cf1751b`.

- **Severidade:** alta
- **Arquivos:** `src/utils/produtos.js:1-5`, `src/pages/Loja.jsx:18-24`, `src/pages/PaginaProduto.jsx:17-22`, `src/pages/Carrinho.jsx:14-18`
- **Problema:** `listarProdutosDisponiveis` verifica somente `estoque > 0`. A regra do enunciado diz que produtos sem preço não podem ser vendidos. A página de produto ainda mostra esses itens e permite adicioná-los; depois `calcularTotal` trata o preço inválido como zero.
- **Impacto:** o cliente pode montar um pedido com item sem preço e receber um total artificialmente menor.
- **Melhoria:** considerar preço válido na função de disponibilidade e bloquear a adição no nível comum do estado do carrinho. O fallback textual `"Preço indisponível"` deve ser apenas apresentação, não autorização de venda.

### 3. O card de produto está duplicado e inconsistente

**Status:** resolvido em `cf1751b`.

- **Severidade:** média
- **Arquivos:** `src/components/ProdutoCard.jsx:1-42`, `src/pages/PaginaProduto.jsx:60-76`
- **Problema:** `PaginaProduto` recria manualmente um card para produtos relacionados. Esse card não exibe avaliação, preço promocional, selo de frete, mensagem de valor restante, estado de estoque ou fallback equivalente ao card principal.
- **Impacto:** o mesmo produto aparece com regras e ações diferentes em lugares distintos. O botão dos relacionados também não é desabilitado para item esgotado.
- **Melhoria:** reutilizar `ProdutoCard` em produtos relacionados e, se necessário, adicionar apenas uma propriedade de apresentação mínima. Isso elimina duplicação e mantém a regra visual em um único lugar.

### 4. As sugestões do carrinho podem oferecer produtos indisponíveis

**Status:** resolvido em `cf1751b`.

`SugestaoItem` agora delega a renderização para `ProdutoCard` usando a variante compacta, mantendo somente o layout resumido como diferença intencional.

- **Severidade:** média
- **Arquivos:** `src/pages/Carrinho.jsx:16-18`, `src/components/SugestaoItem.jsx:3-14`
- **Problema:** as sugestões são escolhidas diretamente de `produtos`; o filtro remove somente itens já presentes no carrinho. Não há filtro de estoque/preço e o botão nunca é desabilitado.
- **Impacto:** o cliente pode clicar em “Comprar” para adicionar item esgotado ou sem preço, contornando o filtro da loja.
- **Melhoria:** derivar sugestões a partir da mesma função de produtos vendáveis usada na vitrine ou reutilizar o próprio `ProdutoCard`.

### 5. Atualização do carrinho usa estado fechado pelo render

**Status:** resolvido em `cf1751b`.

- **Severidade:** média
- **Arquivo:** `src/App.jsx:33-42`
- **Problema:** `setCarrinho(carrinho.concat(produto))` e o `filter` de remoção usam o valor de `carrinho` capturado pelo render atual.
- **Impacto:** atualizações agrupadas ou ações muito rápidas podem perder uma inclusão/remoção, porque uma atualização pode sobrescrever outra calculada a partir do mesmo estado antigo.
- **Melhoria:** usar a forma funcional de `setCarrinho`, por exemplo `setCarrinho((atual) => atual.concat(produto))`, tanto para adicionar quanto para remover.

### 6. Falha ao carregar clientes não tem tratamento

**Status:** resolvido em `cf1751b`.

- **Severidade:** baixa
- **Arquivo:** `src/App.jsx:26-31`
- **Problema:** `buscarClientes()` não possui `.catch()` nem estado de erro. Se a requisição falhar, há uma rejeição não tratada e o seletor de cliente simplesmente não é preenchido.
- **Impacto:** o ambiente de testes fica silenciosamente incompleto e o cupom pode parecer inválido sem explicar que os dados do cliente não foram carregados.
- **Melhoria:** tratar a falha explicitamente, exibindo uma mensagem apropriada ou desabilitando o seletor enquanto os clientes não estiverem disponíveis.

## Reutilização e simplificação

### 7. Regra de produto vendável deve ser compartilhada

**Status:** resolvido em `cf1751b`.

`listarProdutosDisponiveis` já é um ponto de reutilização, mas atualmente cobre somente estoque e é usado apenas em `Loja`. Ela deveria concentrar as condições que autorizam venda e ser usada pela vitrine, detalhe, relacionados, sugestões e pela função que adiciona ao carrinho. Isso evita que cada tela implemente uma variação da mesma regra.

### 8. Formatação de preço pode ser usada também no selo de frete

**Status:** resolvido em `cf1751b`; o preço do item no carrinho também usa `formatarPreco`.

Em `src/components/ProdutoCard.jsx:38`, o valor restante é montado manualmente com `toFixed(2).replace('.', ',')`. O projeto já possui `formatarPreco` em `src/utils/formatarPreco.js`. Reutilizá-la reduz formatação duplicada e mantém o padrão de moeda em um único lugar.

### 9. `produtosVisiveis` é estado derivado desnecessário

**Status:** resolvido em `cf1751b`.

Em `src/pages/Loja.jsx:15-25`, `produtosVisiveis` depende apenas de `produtos` e `categoria`, mas é mantido com `useState` e atualizado em `useEffect`. Isso causa uma renderização intermediária e adiciona sincronização que pode ser evitada. O valor pode ser calculado diretamente durante a renderização ou com `useMemo` se houver necessidade real de memoização.

### 10. Prop não utilizada

**Status:** resolvido em `cf1751b`.

`App` envia `carrinho={carrinho}` para `Header` em `src/App.jsx:56`, mas `Header` recebe somente `clienteAtual` e não usa o carrinho em `src/components/Header.jsx:3`. A prop pode ser removida; se a intenção era exibir a quantidade no cabeçalho, falta implementar esse comportamento.

## Divergências de documentação

### 11. Regra de frete está desatualizada

**Status:** resolvido em `04f2009`.

- `docs/regras-de-negocio.md:7` diz que o frete grátis vale para preço **acima de R$ 100**.
- `src/components/ProdutoCard.jsx:7-8,31-34` e `tests/ProdutoCard.test.jsx:7-25` usam o limite de **R$ 200**.

O enunciado indica que a regra atual é baseada no valor final acima de R$ 200. A documentação deve ser corrigida para não orientar futuras alterações com um limite incorreto.

### 12. Regra do cupom está contraditória

**Status:** resolvido em `04f2009`.

### 13. Quantidade do carrinho podia ultrapassar o estoque

- **Status:** resolvido em `HEAD`.
- **Arquivos:** `src/utils/carrinho.js`, `src/App.jsx`
- A inclusão agora conta as unidades já presentes usando o estado mais recente e bloqueia novas inclusões quando o limite é atingido.

### 14. Não havia fluxo de aviso de reposição

- **Status:** resolvido em `HEAD`.
- **Arquivos:** `src/App.jsx`, `src/pages/PaginaProduto.jsx`, `src/pages/Estoque.jsx`
- Clientes selecionados no ambiente de testes podem solicitar aviso para produtos indisponíveis. A área interna lista os interessados, com nome e e-mail, por produto.

### 15. Validação de preço repetida

- **Status:** resolvido nesta rodada.
- `obterPrecoNumerico` em `src/utils/produtos.js` centraliza a conversão e validação de preços positivos e finitos.

### 16. URL da API não era validada

- **Status:** resolvido nesta rodada.
- `src/services/api.js` agora rejeita configuração ausente ou vazia com erro explícito.

### 17. Cobertura insuficiente dos fluxos corrigidos

- **Status:** melhorado nesta rodada.
- A suíte passou a cobrir a validação da URL/API, a variante compacta do card, a indisponibilidade e o limite de estoque.
- A cobertura ainda é unitária e de componente; não substitui uma validação manual ou E2E completa de todas as rotas.

- `docs/regras-de-negocio.md:10-11` diz que `PRIMEIRACOMPRA` pode ser usado por qualquer cliente.
- `src/utils/cupons.js:13-15` rejeita clientes com pedidos anteriores.

O enunciado e os testes atuais sustentam a regra de primeira compra. A documentação deve refletir essa restrição, em vez de descrever o cupom como universal.

## Cobertura de testes recomendada

Adicionar testes pequenos e direcionados para:

1. impedir adição de produto sem preço ou sem estoque pela página de produto e pelas sugestões;
2. garantir que duas inclusões rápidas não percam itens;
3. confirmar que produtos relacionados usam o mesmo comportamento do `ProdutoCard`;
4. tratar falha em `buscarClientes`;
5. verificar que o limite de frete e a regra do cupom permanecem alinhados com `docs/regras-de-negocio.md`.

## Ordem sugerida de correção

1. Centralizar a validação de produto vendável no fluxo de adição ao carrinho.
2. Reutilizar `ProdutoCard` nos relacionados e filtrar sugestões.
3. Trocar as atualizações do carrinho para a forma funcional.
4. Corrigir a documentação e adicionar testes dos fluxos de página.
5. Remover a prop não utilizada e simplificar o estado derivado da loja.
6. Limitar a quantidade no carrinho ao estoque disponível.
7. Implementar o aviso de reposição e a listagem de interessados.

As etapas acima estão implementadas. Resta apenas validação manual no navegador, porque a suíte atual não cobre interação completa entre rotas.

## Plano de execução e ordem dos commits

Antes de cada commit, executar `npm test` e `npm run build`. Cada commit deve representar uma mudança revisável e manter a aplicação funcionando.

### Commit 1 — `test: amplia cobertura das regras de venda`

- Adicionar testes para produto sem preço, produto sem estoque e preço inválido.
- Adicionar testes para inclusão e remoção do carrinho em atualizações consecutivas.
- Adicionar testes para o limite de frete grátis e para as regras atuais do cupom.
- Não alterar comportamento da aplicação ainda; este commit estabelece os casos que devem orientar as correções.

### Commit 2 — `fix: bloqueia produtos indisponiveis no carrinho`

- Centralizar a validação de produto vendável em `src/utils/produtos.js`.
- Aplicar a validação dentro da função de adição ao carrinho em `src/App.jsx`.
- Ajustar os botões de detalhe, relacionados e sugestões para refletirem a mesma regra.
- Impedir que itens sem preço ou estoque sejam inseridos e acabem com total artificialmente baixo.

### Commit 3 — `refactor: reutiliza o card de produto`

- Reutilizar `ProdutoCard` em produtos relacionados.
- Remover a marcação duplicada de card em `PaginaProduto`.
- Garantir que preço promocional, avaliação, frete e estado de estoque tenham o mesmo comportamento em todas as listagens.

### Commit 4 — `fix: torna atualizacoes do carrinho seguras`

- Trocar atualizações baseadas no valor capturado de `carrinho` pela forma funcional de `setCarrinho`.
- Cobrir o caso com teste para evitar perda de inclusões ou remoções rápidas.

### Commit 5 — `fix: trata falha ao carregar clientes`

- Adicionar estado e tratamento explícito para erro de carregamento de clientes.
- Evitar rejeição não tratada e deixar claro quando o ambiente de teste não está disponível.
- Adicionar teste do estado de erro, caso o fluxo de página seja coberto neste projeto.

### Commit 6 — `docs: alinha regras de negocio`

- Corrigir a documentação do frete grátis para o limite atual de R$ 200.
- Corrigir a documentação do cupom `PRIMEIRACOMPRA` para refletir a restrição a clientes sem pedidos anteriores.

### Commit 7 — `refactor: remove estado e props desnecessarios`

- Remover `carrinho={carrinho}` de `Header` se a quantidade não for exibida.
- Calcular `produtosVisiveis` diretamente a partir de `produtos` e `categoria`, removendo o estado derivado e o `useEffect`.
- Executar testes e build finais antes de considerar a sequência concluída.

### Estado inicial verificado

- `npm test`: 4 arquivos, 15 testes aprovados.
- `npm run build`: concluído com sucesso.

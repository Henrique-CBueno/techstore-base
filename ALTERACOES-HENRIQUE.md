# Alterações realizadas

Este documento reúne as alterações feitas por Henrique-CBueno desde o primeiro
commit de sua autoria (`7df92c1`, em 21/10/2026). Os commits anteriores,
realizados por Caio Oliveira, não fazem parte deste resumo.

## Resultado geral

As mudanças corrigiram problemas de cálculo, disponibilidade de produtos,
cupons, frete, preços inválidos, limites do carrinho, avisos de reposição e
tratamento de erros. Também foram adicionados testes automatizados, melhorias
de feedback para o cliente e documentação da auditoria.

A implementação atende:

- **Obrigatório 1:** cálculo correto do total do carrinho e bloqueio de
  produtos sem preço.
- **Obrigatório 2:** ocultação de produtos esgotados na loja, com acesso por
  link direto para solicitar aviso de reposição.
- **Grupo 1, item A:** proteção contra adições repetidas acima do estoque.
- **Grupo 2, item D:** padronização dos cards e informação sobre o frete grátis.

## Alterações em ordem cronológica

### 1. Correção do cálculo do carrinho

O total do carrinho passou a tratar corretamente valores numéricos e preços
inválidos. Isso evita resultados incorretos quando o preço chega em formato de
texto ou quando um produto não possui preço definido.

**Problema corrigido:** somas incorretas e totais sem sentido no carrinho.

### 2. Primeira filtragem de produtos disponíveis

A vitrine passou a considerar a disponibilidade real dos produtos. Produtos
sem estoque ou sem preço deixaram de ser apresentados como itens que poderiam
ser comprados.

Também foram adicionados testes para garantir esse comportamento.

**Problema corrigido:** produtos que não podiam ser vendidos apareciam na loja.

### 3. Correção do cupom e da comunicação de frete

O cupom de primeira compra passou a respeitar a regra de uso por cliente,
aceitando o código sem diferenciar letras maiúsculas e minúsculas.

Os cards passaram a comunicar corretamente a condição de frete grátis e a
informar quanto falta para atingir o valor mínimo da campanha.

**Problemas corrigidos:**

- cupom rejeitado por diferença de letras maiúsculas e minúsculas;
- cupom liberado para cliente que já tinha pedidos;
- comunicação incorreta sobre frete grátis.

### 4. Tratamento de preços ausentes ou inválidos

As telas de produto e os cards deixaram de exibir valores quebrados ou
informações como preço inválido. Quando não há preço disponível, o cliente
recebe uma indicação clara de que o preço ainda não foi definido.

Os testes relacionados a preços inválidos também foram reorganizados e
ampliados.

**Problema corrigido:** exibição de valores sem sentido para produtos sem
preço.

### 5. Ampliação dos testes das regras de venda

Foram adicionados cenários para validar:

- produtos esgotados;
- produtos sem preço;
- preços zerados ou inválidos;
- produtos disponíveis;
- limites de estoque;
- formatação segura de valores.

**Resultado:** as regras principais passaram a ser verificadas
automaticamente, reduzindo o risco de corrigir um problema e quebrar outro.

### 6. Bloqueio de produtos indisponíveis no carrinho

O sistema passou a impedir a adição de produtos sem estoque ou sem preço,
independentemente de onde o cliente tente realizar a compra.

O mesmo comportamento foi aplicado à loja, à página do produto, ao carrinho e
às sugestões.

**Problema corrigido:** produtos que não poderiam ser vendidos ainda podiam
ser adicionados ao carrinho por alguns caminhos.

### 7. Atualização das regras de negócio

A documentação de regras foi ajustada para refletir a nova condição de frete
grátis: a campanha depende do valor final mínimo definido para a compra.

### 8. Auditoria do projeto

Foi criada uma auditoria com o levantamento dos problemas encontrados, das
regras envolvidas, dos riscos de alteração e do plano de correção.

A auditoria foi atualizada durante o trabalho para registrar o andamento e o
resultado das correções.

### 9. Limite de quantidade por estoque

O carrinho passou a respeitar a quantidade disponível de cada produto. Cliques
repetidos não conseguem criar uma quantidade maior que o estoque existente.

Quando o limite é atingido, o cliente recebe uma mensagem explicando o motivo.

**Problema corrigido:** vários cliques no botão podiam colocar mais unidades no
pedido do que existiam no estoque.

### 10. Solicitação de aviso para reposição

Produtos esgotados deixaram de aparecer na vitrine principal, mas continuam
acessíveis quando o cliente chega por um link direto ou por uma divulgação.

Na página do produto esgotado, o cliente pode solicitar um aviso de reposição.
O sistema evita registrar a mesma solicitação mais de uma vez para o mesmo
cliente e produto.

Na área interna, a equipe consegue consultar os interessados, com nome e
e-mail, associados a cada produto.

**Problema corrigido:** esconder produtos esgotados não poderia impedir o
cadastro de interessados vindos de links externos.

### 11. Centralização das regras dos produtos

As regras para decidir se um produto é vendável e para identificar produtos
disponíveis foram concentradas em um único comportamento reutilizado pelas
principais áreas da loja.

Isso mantém a vitrine, a página de detalhes, as recomendações e o carrinho
alinhados entre si.

Também foram adicionados testes para a comunicação com a API e para o
componente de card.

**Problema corrigido:** diferentes partes do site podiam tratar o mesmo
produto de maneiras diferentes.

### 12. Padronização dos cards

As sugestões e os produtos relacionados passaram a reutilizar o mesmo padrão
visual e funcional dos cards da vitrine.

Os cards mantêm links para a página do produto, mostram as mesmas informações
principais e respeitam as regras de disponibilidade.

**Problema corrigido:** o mesmo produto aparecia de formas diferentes em
lugares distintos e, em alguns casos, não podia ser aberto.

### 13. Melhor tratamento de falhas da API

As falhas ao carregar dados passaram a ser comunicadas de forma explícita.
Também foram adicionados testes para diferenciar falhas no carregamento de
produtos e falhas no carregamento de clientes de teste.

**Problema corrigido:** erros de comunicação poderiam deixar a interface
incompleta ou sem explicação para o usuário.

### 14. Testes de integração com Playwright

Foi criada uma suíte de testes de navegador cobrindo os principais fluxos da
loja:

- filtragem da vitrine;
- ocultação de produtos esgotados e sem preço;
- adição ao carrinho;
- aplicação e rejeição do cupom;
- remoção de unidades;
- respeito ao limite de estoque;
- solicitação de reposição;
- visualização de interessados na área interna;
- mensagens de falha da API.

Os testes usam dados controlados para verificar os comportamentos sem depender
da disponibilidade da API externa.

### 15. Melhorias de feedback e navegação

Foi adicionado um contador de itens no cabeçalho para que o cliente veja
rapidamente o estado do carrinho.

Também foi criado um aviso visual após adicionar um produto e um diálogo para
informar erros ou tentativas de adicionar produtos indisponíveis.

**Problema corrigido:** cliques no botão podiam parecer sem efeito e erros
importantes não eram apresentados de forma clara.

### 16. Documentação para execução dos testes

As instruções do projeto foram atualizadas com a forma de executar os testes de
navegador e com a referência à automação por Playwright.

## Verificação final

Após as alterações:

- os testes unitários passaram;
- os testes de navegador passaram;
- a aplicação foi compilada com sucesso;
- os dois casos de total descritos no enunciado foram reproduzidos com a API
  real;
- produtos esgotados e sem preço não aparecem na vitrine;
- o fluxo de aviso de reposição funciona por link direto;
- os interessados aparecem na área interna.

Os totais conferidos foram:

- **Carregador Turbo + Copo Térmico:** R$ 134,00;
- **Camiseta Estampada + Tênis Casual:** R$ 239,80.

## Observação sobre as fontes

O enunciado atualizado determina que produtos esgotados não apareçam na loja,
mas continuem acessíveis por links diretos para solicitação de reposição. A
implementação segue essa orientação mais recente.

A documentação antiga de requisitos ainda descreve produtos esgotados como
visíveis com selo. Essa regra anterior entra em conflito com o enunciado
atualizado; por isso, o comportamento implementado prioriza a orientação mais
recente do enunciado.

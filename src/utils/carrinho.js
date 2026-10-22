// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const preco = Number(produto?.price ?? 0)
    return total + (Number.isFinite(preco) ? preco : 0)
  }, 0)
}

export function podeAdicionarProduto(carrinho, produto) {
  const estoque = Number(produto?.estoque)
  const quantidade = carrinho.filter((item) => item.id === produto?.id).length
  return Number.isFinite(estoque) && quantidade < estoque
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}

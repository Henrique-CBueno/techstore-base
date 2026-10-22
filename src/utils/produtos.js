export function listarProdutosDisponiveis(produtos = []) {
    return produtos.filter(produtoVendavel)
}

export function produtoVendavel(produto) {
    const estoque = Number(produto?.estoque ?? 0)
    const preco = Number(produto?.price)
    return Number.isFinite(estoque) && estoque > 0 && Number.isFinite(preco) && preco > 0
}

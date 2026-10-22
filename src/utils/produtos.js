export function listarProdutosDisponiveis(produtos = []) {
    return produtos.filter(produtoVendavel)
}

export function obterPrecoNumerico(valor) {
    const preco = Number(valor)
    return Number.isFinite(preco) && preco > 0 ? preco : null
}

export function produtoVendavel(produto) {
    const estoque = Number(produto?.estoque ?? 0)
    return Number.isFinite(estoque) && estoque > 0 && obterPrecoNumerico(produto?.price) !== null
}

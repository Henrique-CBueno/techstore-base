export function listarProdutosDisponiveis(produtos = []) {
    return produtos.filter((produto) => {
        const estoque = Number(produto?.estoque ?? 0)
        return Number.isFinite(estoque) && estoque > 0
    })
}

import { describe, expect, it } from 'vitest'
import { calcularTotal } from './carrinho'
import { listarProdutosDisponiveis } from './produtos'

describe('calcularTotal', () => {
    it('ignora preços ausentes e converte strings numéricas', () => {
        const carrinho = [
            { id: '1', price: '79.90' },
            { id: '2', price: 40 },
            { id: '3', price: undefined },
            { id: '4', price: 'abc' },
            { id: '5', price: '15.5' },
        ]

        expect(calcularTotal(carrinho)).toBe(135.4)
    })
})

describe('listarProdutosDisponiveis', () => {
    it('remove produtos esgotados e sem estoque', () => {
        const produtos = [
            { id: '1', estoque: 0, title: 'Esgotado' },
            { id: '2', estoque: 2, title: 'Disponível' },
            { id: '3', estoque: undefined, title: 'Sem estoque' },
            { id: '4', estoque: 5, title: 'Disponível 2' },
        ]

        expect(listarProdutosDisponiveis(produtos).map((produto) => produto.id)).toEqual(['2', '4'])
    })
})

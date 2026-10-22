import { describe, expect, it } from 'vitest'
import { calcularTotal, podeAdicionarProduto } from '../src/utils/carrinho'
import { formatarPreco } from '../src/utils/formatarPreco'
import { listarProdutosDisponiveis, produtoVendavel } from '../src/utils/produtos'

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

    describe('podeAdicionarProduto', () => {
        it('impede ultrapassar o estoque disponível', () => {
            const produto = { id: '1', estoque: 2, price: 10 }
            expect(podeAdicionarProduto([], produto)).toBe(true)
            expect(podeAdicionarProduto([produto], produto)).toBe(true)
            expect(podeAdicionarProduto([produto, produto], produto)).toBe(false)
        })
    })
})

describe('listarProdutosDisponiveis', () => {
    it('remove produtos esgotados, sem estoque e sem preço', () => {
        const produtos = [
            { id: '1', estoque: 0, price: 10, title: 'Esgotado' },
            { id: '2', estoque: 2, price: 10, title: 'Disponível' },
            { id: '3', estoque: undefined, price: 10, title: 'Sem estoque' },
            { id: '4', estoque: 5, price: undefined, title: 'Sem preço' },
            { id: '5', estoque: 5, price: 0, title: 'Preço zerado' },
            { id: '6', estoque: 5, price: 10, title: 'Disponível 2' },
        ]

        expect(listarProdutosDisponiveis(produtos).map((produto) => produto.id)).toEqual(['2', '6'])
    })
})

describe('produtoVendavel', () => {
    it('aceita somente produto com estoque e preço positivos', () => {
        expect(produtoVendavel({ estoque: 1, price: 10 })).toBe(true)
        expect(produtoVendavel({ estoque: 0, price: 10 })).toBe(false)
        expect(produtoVendavel({ estoque: 1, price: undefined })).toBe(false)
        expect(produtoVendavel({ estoque: 1, price: 'abc' })).toBe(false)
    })
})

describe('formatarPreco', () => {
    it('retorna texto seguro para preços inválidos', () => {
        expect(formatarPreco(undefined)).toBe('Preço indisponível')
        expect(formatarPreco('NaN')).toBe('Preço indisponível')
        expect(formatarPreco(129.9)).toBe('R$ 129,90')
    })
})

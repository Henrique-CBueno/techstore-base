import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import ProdutoCard from '../src/components/ProdutoCard'

describe('ProdutoCard', () => {
    it('mostra quanto falta para ganhar frete grátis quando o valor final ainda não alcança R$ 200', () => {
        render(
            <MemoryRouter>
                <ProdutoCard
                    produto={{
                        id: '1',
                        title: 'Camiseta Básica',
                        image: 'https://example.com/image.jpg',
                        price: 150,
                        precoOriginal: 200,
                        category: 'roupas',
                        estoque: 10,
                        rating: { rate: 4.8, count: 20 },
                    }}
                    onAdicionar={() => { }}
                />
            </MemoryRouter>
        )

        expect(screen.getByText(/Falta R\$ 50,00 para ganhar frete grátis/i)).toBeTruthy()
    })

    it('reutiliza a variante compacta para sugestões e bloqueia item indisponível', () => {
        render(
            <MemoryRouter>
                <ProdutoCard
                    compacto
                    produto={{
                        id: '2',
                        title: 'Produto esgotado',
                        image: 'https://example.com/image.jpg',
                        price: 50,
                        estoque: 0,
                        rating: { rate: 4, count: 1 },
                    }}
                    onAdicionar={() => { }}
                />
            </MemoryRouter>
        )

        expect(screen.getAllByRole('link', { name: 'Produto esgotado' })).toHaveLength(2)
        expect(screen.getByRole('button', { name: 'Comprar' }).disabled).toBe(true)
    })
})

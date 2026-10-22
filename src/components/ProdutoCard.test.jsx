import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import ProdutoCard from './ProdutoCard'

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
})

import { describe, expect, it, vi } from 'vitest'
import { get, obterApiUrl } from '../src/services/api'

describe('obterApiUrl', () => {
    it('rejeita URL ausente ou vazia', () => {
        expect(() => obterApiUrl('  ')).toThrow('VITE_API_URL não está configurada.')
        expect(() => obterApiUrl(null)).toThrow('VITE_API_URL não está configurada.')
    })

    it('remove espaços da URL configurada', () => {
        expect(obterApiUrl(' https://example.com/api ')).toBe('https://example.com/api')
    })
})

describe('get', () => {
    it('converte uma resposta bem-sucedida em JSON', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ ok: true }),
        }))

        await expect(get('/health')).resolves.toEqual({ ok: true })
    })

    it('informa o caminho e status quando a API falha', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))

        await expect(get('/health')).rejects.toThrow('Erro ao buscar /health: 503')
    })
})

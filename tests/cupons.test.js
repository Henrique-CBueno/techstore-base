import { describe, expect, it } from 'vitest'
import { validarCupom } from '../src/utils/cupons'

describe('validarCupom', () => {
    it('aceita PRIMEIRACOMPRA para cliente novo', () => {
        expect(validarCupom('PRIMEIRACOMPRA', { pedidosAnteriores: 0 })).toEqual({
            valido: true,
            desconto: 0.1,
        })
    })

    it('rejeita PRIMEIRACOMPRA para cliente que já comprou', () => {
        expect(validarCupom('PRIMEIRACOMPRA', { pedidosAnteriores: 1 })).toEqual({
            valido: false,
        })
    })

    it('não quebra quando o cliente não existe', () => {
        expect(validarCupom('PRIMEIRACOMPRA', undefined)).toEqual({ valido: false })
    })
})

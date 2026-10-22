const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function validarCupom(codigo, cliente) {
  const codigoNormalizado = codigo.trim().toUpperCase()
  const desconto = CUPONS[codigoNormalizado]

  if (!desconto) {
    return { valido: false }
  }

  const pedidosAnteriores = cliente?.pedidosAnteriores ?? 0

  if (codigoNormalizado === 'PRIMEIRACOMPRA' && (!cliente || pedidosAnteriores > 0)) {
    return { valido: false }
  }

  return { valido: true, desconto }
}

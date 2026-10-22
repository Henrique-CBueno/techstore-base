export function formatarPreco(valor) {
  const numero = Number(valor)

  if (valor == null || String(valor).trim() === '' || !Number.isFinite(numero)) {
    return 'Preço indisponível'
  }

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

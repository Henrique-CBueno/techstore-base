export function obterApiUrl(valor = import.meta.env.VITE_API_URL) {
  const url = (valor || '').trim()
  if (!url) {
    throw new Error('VITE_API_URL não está configurada.')
  }
  return url
}

export const API_URL = obterApiUrl()

export function get(caminho) {
  return fetch(API_URL + caminho).then((resposta) => {
    if (!resposta.ok) {
      throw new Error('Erro ao buscar ' + caminho + ': ' + resposta.status)
    }
    return resposta.json()
  })
}

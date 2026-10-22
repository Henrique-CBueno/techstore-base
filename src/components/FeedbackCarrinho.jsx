import { useEffect } from 'react'

export default function FeedbackCarrinho({ mensagem, onFechar }) {
  useEffect(() => {
    if (!mensagem) return undefined

    const timer = setTimeout(onFechar, 2500)
    return () => clearTimeout(timer)
  }, [mensagem])

  if (!mensagem) return null

  return (
    <div className="feedback-carrinho" role="status">
      <span aria-hidden="true">✓</span>
      {mensagem}
    </div>
  )
}

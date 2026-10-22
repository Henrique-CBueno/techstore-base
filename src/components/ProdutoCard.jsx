import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { produtoVendavel } from '../utils/produtos'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = produto.estoque === 0
  const valorProduto = Number(produto?.price ?? 0)
  const vendavel = produtoVendavel(produto)
  const faltaParaFreteGratis = Math.max(0, 200 - valorProduto)
  const mostrarMensagemFrete = Number.isFinite(valorProduto) && valorProduto > 0 && valorProduto < 200

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">{formatarPreco(produto.price)}</span>
      </div>

      <div className="card-selos">
        {vendavel && valorProduto >= 200 && <span className="selo selo-frete">Frete grátis</span>}
        {mostrarMensagemFrete && (
          <span className="selo selo-frete">
            Falta {formatarPreco(faltaParaFreteGratis)} para ganhar frete grátis
          </span>
        )}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={!vendavel}>
        Adicionar ao carrinho
      </button>
    </article>
  )
}

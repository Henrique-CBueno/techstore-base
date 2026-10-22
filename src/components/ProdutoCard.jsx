import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { obterPrecoNumerico, produtoVendavel } from '../utils/produtos'

export default function ProdutoCard({ produto, onAdicionar, compacto = false }) {
  const esgotado = produto.estoque === 0
  const valorProduto = obterPrecoNumerico(produto?.price) ?? 0
  const vendavel = produtoVendavel(produto)
  const faltaParaFreteGratis = Math.max(0, 200 - valorProduto)
  const mostrarMensagemFrete = valorProduto > 0 && valorProduto < 200

  if (compacto) {
    return (
      <div className="sugestao">
        <Link to={`/produto/${produto.id}`} className="sugestao-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
        </Link>
        <div className="sugestao-info">
          <Link to={`/produto/${produto.id}`} className="sugestao-titulo">
            {produto.title}
          </Link>
          <p className="preco preco-pequeno">{formatarPreco(produto.price)}</p>
        </div>
        <button
          className="botao botao-pequeno"
          onClick={() => onAdicionar(produto)}
          disabled={!vendavel}
        >
          Comprar
        </button>
      </div>
    )
  }

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

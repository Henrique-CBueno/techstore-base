import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'
import { listarProdutosDisponiveis, obterPrecoNumerico, produtoVendavel } from '../utils/produtos'

export default function PaginaProduto({
  produtos,
  clienteAtual,
  onAdicionar,
  onSolicitarAviso,
  interessesReposicao = [],
}) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoNumerico = obterPrecoNumerico(produto.price)
  const disponivel = produtoVendavel(produto)
  const jaSolicitouAviso = interessesReposicao.some(
    (item) => item.produtoId === produto.id && item.clienteId === clienteAtual?.id
  )
  const relacionados = listarProdutosDisponiveis(produtos)
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {precoNumerico === null ? 'Preço indisponível' : formatarPreco(precoNumerico)}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
          >
            {disponivel ? 'Adicionar ao carrinho' : 'Produto indisponível'}
          </button>
          {!disponivel && (
            <button
              className="botao botao-secundario"
              onClick={() => onSolicitarAviso(produto.id)}
              disabled={!clienteAtual || jaSolicitouAviso}
            >
              {jaSolicitouAviso ? 'Aviso solicitado' : 'Avise-me quando voltar'}
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}

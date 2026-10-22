import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoVendavel } from './utils/produtos'
import { podeAdicionarProduto } from './utils/carrinho'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [erroClientes, setErroClientes] = useState(null)
  const [interessesReposicao, setInteressesReposicao] = useState([])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    }).catch(() => setErroClientes('Não foi possível carregar os clientes de teste.'))
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!produtoVendavel(produto)) return
    setCarrinho((atual) => (podeAdicionarProduto(atual, produto) ? atual.concat(produto) : atual))
  }

  function solicitarAvisoReposicao(produtoId) {
    if (!clienteAtualId) return
    setInteressesReposicao((atuais) => {
      const jaSolicitou = atuais.some(
        (item) => item.produtoId === produtoId && item.clienteId === clienteAtualId
      )
      return jaSolicitou ? atuais : atuais.concat({ produtoId, clienteId: clienteAtualId })
    })
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho((atual) =>
      atual.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}
        {erroClientes && <p className="aviso aviso-erro">{erroClientes}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onSolicitarAviso={solicitarAvisoReposicao}
                  interessesReposicao={interessesReposicao}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/estoque"
              element={
                <Estoque
                  produtos={produtos}
                  clientes={clientes}
                  interessesReposicao={interessesReposicao}
                />
              }
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}

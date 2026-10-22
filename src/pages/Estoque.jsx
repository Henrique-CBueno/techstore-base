// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, clientes, interessesReposicao }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Interessados</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
                <td>
                  {interessesReposicao
                    .filter((item) => item.produtoId === produto.id)
                    .map((item) => clientes.find((cliente) => cliente.id === item.clienteId))
                    .filter(Boolean)
                    .map((cliente) => (
                      <div key={cliente.id}>
                        {cliente.nome} ({cliente.email})
                      </div>
                    ))}
                  {!interessesReposicao.some((item) => item.produtoId === produto.id) && 'Nenhum'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

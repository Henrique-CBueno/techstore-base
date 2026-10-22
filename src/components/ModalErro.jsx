export default function ModalErro({ mensagem, onFechar }) {
  if (!mensagem) return null

  return (
    <div className="modal-fundo" role="presentation" onMouseDown={onFechar}>
      <section
        className="modal-erro"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-erro-titulo"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <button className="modal-fechar" aria-label="Fechar aviso" onClick={onFechar}>
          ×
        </button>
        <p className="modal-icone" aria-hidden="true">!</p>
        <h2 id="modal-erro-titulo">Não foi possível realizar a ação</h2>
        <p>{mensagem}</p>
        <button className="botao" onClick={onFechar}>Entendi</button>
      </section>
    </div>
  )
}

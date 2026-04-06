export default function VendaDetailModal({
  open,
  venda,
  cliente,
  today,
  fmtDate,
  moneyBR,
  paymentMethodLabelMap,
  onClose,
  onEdit,
  onMarkEntregue,
  onMarkPago,
}) {
  const late = venda ? !venda.entregue && venda.dataEntrega < today : false;

  return (
    <div className={`modal-backdrop ${open ? 'open' : ''}`}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <span className="modal-title">Detalhes da Venda</span>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {venda && (
            <>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {venda.entregue ? (
                  <span className="badge badge-success">Entregue</span>
                ) : late ? (
                  <span className="badge badge-danger">Atrasado</span>
                ) : (
                  <span className="badge badge-warning">Pendente</span>
                )}
                {venda.pago ? <span className="badge badge-info">Pago</span> : <span className="badge badge-danger">A pagar</span>}
              </div>

              <div className="detail-grid" style={{ marginBottom: 16 }}>
                <div>
                  <div className="detail-label">Cliente</div>
                  <div className="detail-value">{cliente ? cliente.nome : '–'}</div>
                </div>
                <div>
                  <div className="detail-label">Telefone</div>
                  <div className="detail-value">{cliente ? cliente.telefone || '–' : '–'}</div>
                </div>
                <div>
                  <div className="detail-label">Data do Pedido</div>
                  <div className="detail-value">{fmtDate(venda.dataPedido)}</div>
                </div>
                <div>
                  <div className="detail-label">Data de Entrega</div>
                  <div className="detail-value" style={{ color: late ? 'var(--danger)' : 'inherit' }}>
                    {fmtDate(venda.dataEntrega)}
                    {venda.horaEntrega ? ` às ${venda.horaEntrega}` : ''}
                  </div>
                </div>
                {venda.valor && (
                  <div>
                    <div className="detail-label">Valor</div>
                    <div className="detail-value">{moneyBR(venda.valor)}</div>
                  </div>
                )}
                {venda.formaPagamento && (
                  <div>
                    <div className="detail-label">Forma de Pagamento</div>
                    <div className="detail-value">{paymentMethodLabelMap[venda.formaPagamento] || venda.formaPagamento}</div>
                  </div>
                )}
              </div>

              <div className="divider"></div>
              <div className="detail-label" style={{ marginBottom: 6 }}>
                Descrição do Pedido
              </div>
              <div className="detail-value" style={{ marginBottom: 16, whiteSpace: 'pre-wrap' }}>
                {venda.pedido}
              </div>

              {venda.enderecoEntrega && (
                <>
                  <div className="detail-label" style={{ marginBottom: 6 }}>
                    Endereço de Entrega
                  </div>
                  <div className="detail-value" style={{ marginBottom: 16 }}>
                    {venda.enderecoEntrega}
                  </div>
                </>
              )}

              {venda.obs && (
                <>
                  <div className="divider"></div>
                  <div className="detail-label" style={{ marginBottom: 6 }}>
                    Observações
                  </div>
                  <div className="detail-value">{venda.obs}</div>
                </>
              )}
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Fechar
          </button>
          <button className="btn btn-ghost" onClick={onEdit} disabled={!venda}>
            Editar
          </button>
          {venda && !venda.entregue && (
            <button className="btn btn-primary" onClick={onMarkEntregue}>
              Marcar Entregue
            </button>
          )}
          {venda && !venda.pago && (
            <button className="btn btn-primary" onClick={onMarkPago}>
              Marcar Pago
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

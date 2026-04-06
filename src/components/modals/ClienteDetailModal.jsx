export default function ClienteDetailModal({
  open,
  cliente,
  clienteVendas,
  initials,
  fmtDate,
  onClose,
  onEdit,
}) {
  return (
    <div className={`modal-backdrop ${open ? 'open' : ''}`}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <span className="modal-title">Detalhes do Cliente</span>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {cliente && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div className="avatar" style={{ width: 50, height: 50, fontSize: 16 }}>
                  {initials(cliente.nome)}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>{cliente.nome}</div>
                  <span className="badge badge-info">{cliente.tipo === 'empresa' ? 'Empresa' : 'Pessoa Física'}</span>
                </div>
              </div>

              <div className="detail-grid" style={{ marginBottom: 16 }}>
                <div>
                  <div className="detail-label">Telefone</div>
                  <div className="detail-value">{cliente.telefone || '–'}</div>
                </div>
                <div>
                  <div className="detail-label">E-mail</div>
                  <div className="detail-value">{cliente.email || '–'}</div>
                </div>
                <div>
                  <div className="detail-label">CPF / CNPJ</div>
                  <div className="detail-value">{cliente.cpf || '–'}</div>
                </div>
              </div>

              <div className="divider"></div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'var(--text-muted)',
                  marginBottom: 10,
                }}
              >
                Endereço
              </div>
              <div className="detail-value" style={{ marginBottom: 16 }}>
                {[
                  cliente.rua && `${cliente.rua}${cliente.numero ? `, ${cliente.numero}` : ''}`,
                  cliente.complemento,
                  cliente.bairro,
                  cliente.cidade && `${cliente.cidade}${cliente.estado ? ` – ${cliente.estado}` : ''}`,
                  cliente.cep,
                ]
                  .filter(Boolean)
                  .join(' | ') || '–'}
              </div>

              {cliente.obs && (
                <>
                  <div className="divider"></div>
                  <div className="detail-label" style={{ marginBottom: 6 }}>
                    Observações
                  </div>
                  <div className="detail-value">{cliente.obs}</div>
                </>
              )}

              <div className="divider"></div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'var(--text-muted)',
                  marginBottom: 10,
                }}
              >
                Vendas ({clienteVendas.length})
              </div>

              {!clienteVendas.length && <div className="td-muted">Nenhuma venda registrada.</div>}

              {!!clienteVendas.length &&
                clienteVendas.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border)',
                      fontSize: 13,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {v.pedido.slice(0, 50)}
                        {v.pedido.length > 50 ? '...' : ''}
                      </div>
                      <div className="td-muted">Entrega: {fmtDate(v.dataEntrega)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {v.entregue ? <span className="badge badge-success">Entregue</span> : <span className="badge badge-warning">Pendente</span>}
                      {v.pago ? <span className="badge badge-info">Pago</span> : <span className="badge badge-danger">A pagar</span>}
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Fechar
          </button>
          <button className="btn btn-primary" onClick={onEdit} disabled={!cliente}>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

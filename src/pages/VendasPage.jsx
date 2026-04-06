export default function VendasPage({
  filteredVendas,
  searchVendas,
  setSearchVendas,
  filterPago,
  setFilterPago,
  filterEntregue,
  setFilterEntregue,
  clientes,
  hoje,
  fmtDate,
  moneyBR,
  onOpenVendaModal,
  onViewVenda,
  onDeleteVenda,
}) {
  return (
    <div className="section active">
      <div className="page-actions">
        <div className="page-actions-left">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar venda..."
              value={searchVendas}
              onChange={(e) => setSearchVendas(e.target.value)}
              className="search-input"
            />
          </div>

          <select value={filterPago} onChange={(e) => setFilterPago(e.target.value)} style={{ fontSize: 13, padding: '8px 10px' }}>
            <option value="">Todos (Pagamento)</option>
            <option value="sim">Pago</option>
            <option value="nao">Não Pago</option>
          </select>

          <select value={filterEntregue} onChange={(e) => setFilterEntregue(e.target.value)} style={{ fontSize: 13, padding: '8px 10px' }}>
            <option value="">Todos (Entrega)</option>
            <option value="sim">Entregue</option>
            <option value="nao">Pendente</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenVendaModal()}>
          + Nova Venda
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {!filteredVendas.length && (
            <div className="empty">
              <div className="empty-icon">📦</div>
              <div className="empty-title">{searchVendas || filterPago || filterEntregue ? 'Nenhum resultado encontrado.' : 'Nenhuma venda registrada.'}</div>
              <div className="empty-sub">{searchVendas || filterPago || filterEntregue ? 'Tente outros filtros.' : 'Clique em "+ Nova Venda" para começar.'}</div>
            </div>
          )}

          {!!filteredVendas.length && (
            <table className="desktop-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Pedido</th>
                  <th>Pedido em</th>
                  <th>Entrega</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendas.map((v) => {
                  const cli = clientes.find((c) => c.id === v.clienteId);
                  const late = !v.entregue && v.dataEntrega < hoje;
                  const pedidoResume = v.pedido.length > 40 ? `${v.pedido.slice(0, 40)}...` : v.pedido;

                  return (
                    <tr key={v.id}>
                      <td className="td-name">{cli ? cli.nome : <span className="td-muted">–</span>}</td>
                      <td style={{ maxWidth: 180, whiteSpace: 'normal' }}>{pedidoResume}</td>
                      <td>{fmtDate(v.dataPedido)}</td>
                      <td style={{ color: late ? 'var(--danger)' : 'inherit' }}>
                        {late ? '⚠️ ' : ''}
                        {fmtDate(v.dataEntrega)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {v.entregue ? <span className="badge badge-success">Entregue</span> : <span className="badge badge-warning">Pendente</span>}
                          {v.pago ? <span className="badge badge-info">Pago</span> : <span className="badge badge-danger">A pagar</span>}
                        </div>
                      </td>
                      <td>{v.valor ? moneyBR(v.valor) : '–'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => onViewVenda(v.id)}>
                            Ver
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => onOpenVendaModal(v.id)}>
                            Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => onDeleteVenda(v.id)}>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!!filteredVendas.length && (
            <div className="mobile-card-list">
              {filteredVendas.map((v) => {
                const cli = clientes.find((c) => c.id === v.clienteId);
                const late = !v.entregue && v.dataEntrega < hoje;
                const pedidoResume = v.pedido.length > 60 ? `${v.pedido.slice(0, 60)}...` : v.pedido;

                return (
                  <article className="mobile-data-card" key={`m-${v.id}`}>
                    <div className="mobile-data-row">
                      <div>
                        <div className="td-name">{cli ? cli.nome : '–'}</div>
                        <div className="td-muted">Pedido: {fmtDate(v.dataPedido)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {v.entregue ? <span className="badge badge-success">Entregue</span> : <span className="badge badge-warning">Pendente</span>}
                        {v.pago ? <span className="badge badge-info">Pago</span> : <span className="badge badge-danger">A pagar</span>}
                      </div>
                    </div>
                    <div className="mobile-data-meta">
                      <span>Entrega: <strong style={{ color: late ? 'var(--danger)' : 'inherit' }}>{late ? '⚠️ ' : ''}{fmtDate(v.dataEntrega)}</strong></span>
                      <span>Pedido: {pedidoResume}</span>
                      <span>Valor: {v.valor ? moneyBR(v.valor) : '–'}</span>
                    </div>
                    <div className="mobile-data-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => onViewVenda(v.id)}>
                        Ver
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => onOpenVendaModal(v.id)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDeleteVenda(v.id)}>
                        Excluir
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

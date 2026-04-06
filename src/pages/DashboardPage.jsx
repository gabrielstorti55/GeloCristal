export default function DashboardPage({
  totalClientes,
  totalVendas,
  totalEntregasPendentes,
  totalReceber,
  totalNaoRecebido,
  recentSales,
  pendingDeliveries,
  clientes,
  hoje,
  fmtDate,
  moneyBR,
}) {
  return (
    <div className="section active dashboard-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total de Clientes</div>
          <div className="stat-value">{totalClientes}</div>
          <div className="stat-sub">cadastrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total de Vendas</div>
          <div className="stat-value">{totalVendas}</div>
          <div className="stat-sub">registradas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Entregas Pendentes</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {totalEntregasPendentes}
          </div>
          <div className="stat-sub">aguardando entrega</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">A Receber</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>
            {moneyBR(totalReceber)}
          </div>
          <div className="stat-sub">{totalNaoRecebido} venda(s) não pagas</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Últimas Vendas</span>
          </div>
          <div className="card-body">
            {!recentSales.length && (
              <div className="empty">
                <div className="empty-sub">Nenhuma venda registrada.</div>
              </div>
            )}
            {!!recentSales.length &&
              recentSales.map((v) => {
                const cli = clientes.find((c) => c.id === v.clienteId);
                return (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{cli ? cli.nome : '–'}</div>
                      <div className="td-muted">{fmtDate(v.dataEntrega)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {v.entregue ? (
                        <span className="badge badge-success">Entregue</span>
                      ) : (
                        <span className="badge badge-warning">Pendente</span>
                      )}
                      {v.pago ? (
                        <span className="badge badge-info">Pago</span>
                      ) : (
                        <span className="badge badge-danger">A pagar</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Entregas Pendentes</span>
          </div>
          <div className="card-body">
            {!pendingDeliveries.length && (
              <div className="empty">
                <div className="empty-sub">Sem entregas pendentes 🎉</div>
              </div>
            )}
            {!!pendingDeliveries.length &&
              pendingDeliveries.map((v) => {
                const cli = clientes.find((c) => c.id === v.clienteId);
                const late = v.dataEntrega < hoje;
                return (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{cli ? cli.nome : '–'}</div>
                      <div className="td-muted" style={{ color: late ? 'var(--danger)' : 'inherit' }}>
                        {late ? '⚠️ ' : ''} {fmtDate(v.dataEntrega)}
                      </div>
                    </div>
                    {v.pago ? (
                      <span className="badge badge-info">Pago</span>
                    ) : (
                      <span className="badge badge-danger">A pagar</span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

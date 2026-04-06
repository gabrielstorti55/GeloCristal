export default function ClientesPage({
  filteredClientes,
  searchClientes,
  setSearchClientes,
  vendas,
  initials,
  onOpenClienteModal,
  onViewCliente,
  onDeleteCliente,
}) {
  return (
    <div className="section active">
      <div className="page-actions">
        <div className="page-actions-left">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchClientes}
              onChange={(e) => setSearchClientes(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenClienteModal()}>
          + Novo Cliente
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {!filteredClientes.length && (
            <div className="empty">
              <div className="empty-icon">👥</div>
              <div className="empty-title">{searchClientes ? 'Nenhum resultado encontrado.' : 'Nenhum cliente cadastrado.'}</div>
              <div className="empty-sub">{searchClientes ? 'Tente outra busca.' : 'Clique em "+ Novo Cliente" para começar.'}</div>
            </div>
          )}

          {!!filteredClientes.length && (
            <table className="desktop-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>Tipo</th>
                  <th>Vendas</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((c) => {
                  const tipo = c.tipo === 'empresa' ? 'Empresa' : 'Pessoa Física';
                  const numVendas = vendas.filter((v) => v.clienteId === c.id).length;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="avatar-row">
                          <div className="avatar">{initials(c.nome)}</div>
                          <div>
                            <div className="td-name">{c.nome}</div>
                            <div className="td-muted">{c.email || '–'}</div>
                          </div>
                        </div>
                      </td>
                      <td>{c.telefone || '–'}</td>
                      <td>{c.cidade ? `${c.cidade}${c.estado ? ` – ${c.estado}` : ''}` : '–'}</td>
                      <td>
                        <span className="badge badge-info">{tipo}</span>
                      </td>
                      <td>{numVendas}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => onViewCliente(c.id)}>
                            Ver
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => onOpenClienteModal(c.id)}>
                            Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => onDeleteCliente(c.id)}>
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

          {!!filteredClientes.length && (
            <div className="mobile-card-list">
              {filteredClientes.map((c) => {
                const tipo = c.tipo === 'empresa' ? 'Empresa' : 'Pessoa Física';
                const numVendas = vendas.filter((v) => v.clienteId === c.id).length;
                return (
                  <article className="mobile-data-card" key={`m-${c.id}`}>
                    <div className="mobile-data-row">
                      <div className="avatar-row">
                        <div className="avatar">{initials(c.nome)}</div>
                        <div>
                          <div className="td-name">{c.nome}</div>
                          <div className="td-muted">{c.email || '–'}</div>
                        </div>
                      </div>
                      <span className="badge badge-info">{tipo}</span>
                    </div>
                    <div className="mobile-data-meta">
                      <span>Telefone: {c.telefone || '–'}</span>
                      <span>Cidade: {c.cidade ? `${c.cidade}${c.estado ? ` – ${c.estado}` : ''}` : '–'}</span>
                      <span>Vendas: {numVendas}</span>
                    </div>
                    <div className="mobile-data-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => onViewCliente(c.id)}>
                        Ver
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => onOpenClienteModal(c.id)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDeleteCliente(c.id)}>
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

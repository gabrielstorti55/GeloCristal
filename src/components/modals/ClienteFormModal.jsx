export default function ClienteFormModal({
  open,
  editingClienteId,
  alertCliente,
  clienteForm,
  setClienteForm,
  onClose,
  onSave,
}) {
  return (
    <div className={`modal-backdrop ${open ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{editingClienteId ? 'Editar Cliente' : 'Novo Cliente'}</span>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {alertCliente && <div className="alert alert-error">{alertCliente}</div>}
          <div className="form-grid">
            <div className="form-section-title">Informações Pessoais</div>
            <div className="form-group full">
              <label htmlFor="c-nome">Nome completo *</label>
              <input id="c-nome" value={clienteForm.nome} onChange={(e) => setClienteForm((p) => ({ ...p, nome: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-telefone">Telefone *</label>
              <input id="c-telefone" value={clienteForm.telefone} onChange={(e) => setClienteForm((p) => ({ ...p, telefone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-email">E-mail</label>
              <input id="c-email" value={clienteForm.email} onChange={(e) => setClienteForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-cpf">CPF / CNPJ</label>
              <input id="c-cpf" value={clienteForm.cpf} onChange={(e) => setClienteForm((p) => ({ ...p, cpf: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-tipo">Tipo</label>
              <select id="c-tipo" value={clienteForm.tipo} onChange={(e) => setClienteForm((p) => ({ ...p, tipo: e.target.value }))}>
                <option value="pessoa_fisica">Pessoa Física</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>

            <div className="form-section-title">Endereço</div>
            <div className="form-group">
              <label htmlFor="c-cep">CEP</label>
              <input id="c-cep" value={clienteForm.cep} onChange={(e) => setClienteForm((p) => ({ ...p, cep: e.target.value }))} />
            </div>
            <div className="form-group full">
              <label htmlFor="c-rua">Rua / Logradouro</label>
              <input id="c-rua" value={clienteForm.rua} onChange={(e) => setClienteForm((p) => ({ ...p, rua: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-numero">Número</label>
              <input id="c-numero" value={clienteForm.numero} onChange={(e) => setClienteForm((p) => ({ ...p, numero: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-complemento">Complemento</label>
              <input id="c-complemento" value={clienteForm.complemento} onChange={(e) => setClienteForm((p) => ({ ...p, complemento: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-bairro">Bairro</label>
              <input id="c-bairro" value={clienteForm.bairro} onChange={(e) => setClienteForm((p) => ({ ...p, bairro: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-cidade">Cidade</label>
              <input id="c-cidade" value={clienteForm.cidade} onChange={(e) => setClienteForm((p) => ({ ...p, cidade: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="c-estado">Estado</label>
              <select id="c-estado" value={clienteForm.estado} onChange={(e) => setClienteForm((p) => ({ ...p, estado: e.target.value }))}>
                <option value="">Selecione</option>
                <option value="SP">SP</option><option value="AC">AC</option><option value="AL">AL</option>
                <option value="AP">AP</option><option value="AM">AM</option><option value="BA">BA</option>
                <option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option>
                <option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option>
                <option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option>
                <option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option>
                <option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option>
                <option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option>
                <option value="SC">SC</option><option value="SE">SE</option><option value="TO">TO</option>
              </select>
            </div>

            <div className="form-group full">
              <label htmlFor="c-obs">Observações</label>
              <textarea id="c-obs" value={clienteForm.obs} onChange={(e) => setClienteForm((p) => ({ ...p, obs: e.target.value }))}></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={onSave}>Salvar Cliente</button>
        </div>
      </div>
    </div>
  );
}

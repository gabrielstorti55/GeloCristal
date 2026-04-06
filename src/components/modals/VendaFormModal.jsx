export default function VendaFormModal({
  open,
  editingVendaId,
  alertVenda,
  vendaForm,
  setVendaForm,
  clientes,
  onClose,
  onSave,
}) {
  return (
    <div className={`modal-backdrop ${open ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{editingVendaId ? 'Editar Venda' : 'Nova Venda'}</span>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {alertVenda && <div className="alert alert-error">{alertVenda}</div>}
          <div className="form-grid">
            <div className="form-section-title">Dados do Pedido</div>
            <div className="form-group full">
              <label htmlFor="v-cliente">Cliente *</label>
              <select id="v-cliente" value={vendaForm.clienteId} onChange={(e) => setVendaForm((p) => ({ ...p, clienteId: e.target.value }))}>
                <option value="">Selecione um cliente...</option>
                {clientes.map((c) => (
                  <option value={c.id} key={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group full">
              <label htmlFor="v-pedido">Descrição do Pedido *</label>
              <textarea id="v-pedido" value={vendaForm.pedido} onChange={(e) => setVendaForm((p) => ({ ...p, pedido: e.target.value }))}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="v-valor">Valor Total (R$)</label>
              <input id="v-valor" type="number" step="0.01" min="0" value={vendaForm.valor} onChange={(e) => setVendaForm((p) => ({ ...p, valor: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="v-forma-pagamento">Forma de Pagamento</label>
              <select id="v-forma-pagamento" value={vendaForm.formaPagamento} onChange={(e) => setVendaForm((p) => ({ ...p, formaPagamento: e.target.value }))}>
                <option value="">Selecione</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao_debito">Cartão Débito</option>
                <option value="cartao_credito">Cartão Crédito</option>
                <option value="boleto">Boleto</option>
                <option value="a_prazo">A Prazo</option>
              </select>
            </div>

            <div className="form-section-title">Datas</div>
            <div className="form-group">
              <label htmlFor="v-data-pedido">Data do Pedido *</label>
              <input id="v-data-pedido" type="date" value={vendaForm.dataPedido} onChange={(e) => setVendaForm((p) => ({ ...p, dataPedido: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="v-data-entrega">Data de Entrega *</label>
              <input id="v-data-entrega" type="date" value={vendaForm.dataEntrega} onChange={(e) => setVendaForm((p) => ({ ...p, dataEntrega: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="v-hora-entrega">Horário de Entrega</label>
              <input id="v-hora-entrega" type="time" value={vendaForm.horaEntrega} onChange={(e) => setVendaForm((p) => ({ ...p, horaEntrega: e.target.value }))} />
            </div>
            <div className="form-group full">
              <label htmlFor="v-endereco-entrega">Endereço de Entrega</label>
              <input id="v-endereco-entrega" value={vendaForm.enderecoEntrega} onChange={(e) => setVendaForm((p) => ({ ...p, enderecoEntrega: e.target.value }))} />
            </div>

            <div className="form-section-title">Status</div>
            <div className="form-group">
              <div className="checkbox-group">
                <input id="v-entregue" type="checkbox" checked={vendaForm.entregue} onChange={(e) => setVendaForm((p) => ({ ...p, entregue: e.target.checked }))} />
                <label htmlFor="v-entregue">Já foi entregue</label>
              </div>
            </div>
            <div className="form-group">
              <div className="checkbox-group">
                <input id="v-pago" type="checkbox" checked={vendaForm.pago} onChange={(e) => setVendaForm((p) => ({ ...p, pago: e.target.checked }))} />
                <label htmlFor="v-pago">Já foi pago</label>
              </div>
            </div>

            <div className="form-group full">
              <label htmlFor="v-obs">Observações</label>
              <textarea id="v-obs" value={vendaForm.obs} onChange={(e) => setVendaForm((p) => ({ ...p, obs: e.target.value }))}></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={onSave}>Salvar Venda</button>
        </div>
      </div>
    </div>
  );
}

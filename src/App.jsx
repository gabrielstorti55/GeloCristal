import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ClienteDetailModal from './components/modals/ClienteDetailModal';
import ClienteFormModal from './components/modals/ClienteFormModal';
import VendaDetailModal from './components/modals/VendaDetailModal';
import VendaFormModal from './components/modals/VendaFormModal';
import DeliveryCalendar from './components/ui/DeliveryCalendar';
import Toast from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import ClientesPage from './pages/ClientesPage';
import DashboardPage from './pages/DashboardPage';
import VendasPage from './pages/VendasPage';
import { api } from './services/api';
import { emptyCliente, emptyVenda, paymentMethodLabelMap, sectionTitleMap } from './utils/constants';
import { fmtDate, initials, moneyBR } from './utils/formatters';

function getSectionFromPath(pathname) {
  if (pathname.startsWith('/clientes')) return 'clientes';
  if (pathname.startsWith('/vendas')) return 'vendas';
  return 'dashboard';
}

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchClientes, setSearchClientes] = useState('');
  const [searchVendas, setSearchVendas] = useState('');
  const [filterPago, setFilterPago] = useState('');
  const [filterEntregue, setFilterEntregue] = useState('');

  const [clienteModalOpen, setClienteModalOpen] = useState(false);
  const [vendaModalOpen, setVendaModalOpen] = useState(false);
  const [clienteDetalheOpen, setClienteDetalheOpen] = useState(false);
  const [vendaDetalheOpen, setVendaDetalheOpen] = useState(false);

  const [editingClienteId, setEditingClienteId] = useState(null);
  const [editingVendaId, setEditingVendaId] = useState(null);
  const [clienteForm, setClienteForm] = useState(emptyCliente);
  const [vendaForm, setVendaForm] = useState(emptyVenda);

  const [clienteDetalheId, setClienteDetalheId] = useState(null);
  const [vendaDetalheId, setVendaDetalheId] = useState(null);

  const [alertCliente, setAlertCliente] = useState('');
  const [alertVenda, setAlertVenda] = useState('');
  const [topbarDate, setTopbarDate] = useState('');

  const { toastMessage, toastVisible, showToast } = useToast();

  const location = useLocation();
  const navigate = useNavigate();

  const activeSection = useMemo(() => getSectionFromPath(location.pathname), [location.pathname]);

  useEffect(() => {
    setTopbarDate(
      new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    );
  }, []);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [clientesData, vendasData] = await Promise.all([api.listClientes(), api.listVendas()]);
        if (!active) return;
        setClientes(Array.isArray(clientesData) ? clientesData : []);
        setVendas(Array.isArray(vendasData) ? vendasData : []);
      } catch (error) {
        if (!active) return;
        showToast(error.message || 'Nao foi possivel carregar dados do servidor.');
      } finally {
        if (active) setIsLoadingData(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  function closeAllModals() {
    setClienteModalOpen(false);
    setVendaModalOpen(false);
    setClienteDetalheOpen(false);
    setVendaDetalheOpen(false);
    setAlertCliente('');
    setAlertVenda('');
  }

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') closeAllModals();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  function toggleSidebar(force) {
    setSidebarOpen((prev) => (typeof force === 'boolean' ? force : !prev));
  }

  function navigateSection(section) {
    navigate(`/${section}`);
    if (window.innerWidth <= 768) toggleSidebar(false);
  }

  const totalClientes = clientes.length;
  const totalVendas = vendas.length;
  const totalEntregasPendentes = vendas.filter((v) => !v.entregue).length;
  const totalNaoRecebido = vendas.filter((v) => !v.pago).length;
  const totalReceber = vendas.filter((v) => !v.pago).reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0);

  const recentSales = useMemo(() => [...vendas].sort((a, b) => b.criadoEm - a.criadoEm).slice(0, 5), [vendas]);
  const pendingDeliveries = useMemo(
    () => vendas.filter((v) => !v.entregue).sort((a, b) => (a.dataEntrega > b.dataEntrega ? 1 : -1)).slice(0, 5),
    [vendas],
  );

  const filteredClientes = useMemo(() => {
    const q = searchClientes.toLowerCase();
    return clientes.filter(
      (c) => c.nome.toLowerCase().includes(q) || (c.telefone || '').includes(q) || (c.cidade || '').toLowerCase().includes(q),
    );
  }, [clientes, searchClientes]);

  const filteredVendas = useMemo(() => {
    const q = searchVendas.toLowerCase();
    return vendas
      .filter((v) => {
        const cli = clientes.find((c) => c.id === v.clienteId);
        const match = !q || (cli && cli.nome.toLowerCase().includes(q)) || v.pedido.toLowerCase().includes(q);
        const mpago = !filterPago || (filterPago === 'sim' && v.pago) || (filterPago === 'nao' && !v.pago);
        const ment = !filterEntregue || (filterEntregue === 'sim' && v.entregue) || (filterEntregue === 'nao' && !v.entregue);
        return match && mpago && ment;
      })
      .sort((a, b) => (a.dataEntrega > b.dataEntrega ? 1 : -1));
  }, [vendas, clientes, searchVendas, filterPago, filterEntregue]);

  const clienteDetalhe = useMemo(() => clientes.find((c) => c.id === clienteDetalheId) || null, [clientes, clienteDetalheId]);
  const clienteDetalheVendas = useMemo(() => vendas.filter((v) => v.clienteId === clienteDetalheId), [vendas, clienteDetalheId]);
  const vendaDetalhe = useMemo(() => vendas.find((v) => v.id === vendaDetalheId) || null, [vendas, vendaDetalheId]);
  const vendaDetalheCliente = useMemo(
    () => (vendaDetalhe ? clientes.find((c) => c.id === vendaDetalhe.clienteId) || null : null),
    [vendaDetalhe, clientes],
  );

  function openClienteModal(id = null) {
    setEditingClienteId(id);
    setAlertCliente('');
    if (!id) {
      setClienteForm(emptyCliente);
    } else {
      const c = clientes.find((x) => x.id === id);
      if (c) {
        setClienteForm({
          nome: c.nome || '',
          telefone: c.telefone || '',
          email: c.email || '',
          cpf: c.cpf || '',
          tipo: c.tipo || 'pessoa_fisica',
          cep: c.cep || '',
          rua: c.rua || '',
          numero: c.numero || '',
          complemento: c.complemento || '',
          bairro: c.bairro || '',
          cidade: c.cidade || '',
          estado: c.estado || '',
          obs: c.obs || '',
        });
      }
    }
    setClienteModalOpen(true);
  }

  async function salvarCliente() {
    const nome = clienteForm.nome.trim();
    const telefone = clienteForm.telefone.trim();

    if (!nome) {
      setAlertCliente('Por favor, informe o nome do cliente.');
      return;
    }
    if (!telefone) {
      setAlertCliente('Por favor, informe o telefone.');
      return;
    }

    const data = {
      ...clienteForm,
      nome,
      telefone,
      email: clienteForm.email.trim(),
      cpf: clienteForm.cpf.trim(),
      cep: clienteForm.cep.trim(),
      rua: clienteForm.rua.trim(),
      numero: clienteForm.numero.trim(),
      complemento: clienteForm.complemento.trim(),
      bairro: clienteForm.bairro.trim(),
      cidade: clienteForm.cidade.trim(),
      obs: clienteForm.obs.trim(),
    };

    try {
      if (editingClienteId) {
        const updated = await api.updateCliente(editingClienteId, data);
        setClientes((prev) => prev.map((c) => (c.id === editingClienteId ? updated : c)));
        showToast('Cliente atualizado com sucesso!');
      } else {
        const created = await api.createCliente(data);
        setClientes((prev) => [created, ...prev]);
        showToast('Cliente cadastrado com sucesso!');
      }

      setClienteModalOpen(false);
    } catch (error) {
      setAlertCliente(error.message || 'Nao foi possivel salvar o cliente.');
    }
  }

  async function deletarCliente(id) {
    const c = clientes.find((x) => x.id === id);
    if (!c) return;
    if (!window.confirm(`Excluir o cliente "${c.nome}"? As vendas vinculadas serão mantidas.`)) return;
    try {
      await api.deleteCliente(id);
      setClientes((prev) => prev.filter((x) => x.id !== id));
      showToast('Cliente excluido.');
    } catch (error) {
      showToast(error.message || 'Nao foi possivel excluir o cliente.');
    }
  }

  function verCliente(id) {
    setClienteDetalheId(id);
    setClienteDetalheOpen(true);
  }

  function openVendaModal(id = null) {
    setEditingVendaId(id);
    setAlertVenda('');

    if (!id) {
      setVendaForm({
        ...emptyVenda,
        dataPedido: new Date().toISOString().split('T')[0],
      });
    } else {
      const v = vendas.find((x) => x.id === id);
      if (v) {
        setVendaForm({
          clienteId: v.clienteId || '',
          pedido: v.pedido || '',
          valor: v.valor ? String(v.valor) : '',
          formaPagamento: v.formaPagamento || '',
          dataPedido: v.dataPedido || '',
          dataEntrega: v.dataEntrega || '',
          horaEntrega: v.horaEntrega || '',
          enderecoEntrega: v.enderecoEntrega || '',
          entregue: !!v.entregue,
          pago: !!v.pago,
          obs: v.obs || '',
        });
      }
    }

    setVendaModalOpen(true);
  }

  async function salvarVenda() {
    const clienteId = vendaForm.clienteId;
    const pedido = vendaForm.pedido.trim();
    const dataPedido = vendaForm.dataPedido;
    const dataEntrega = vendaForm.dataEntrega;

    if (!clienteId) {
      setAlertVenda('Por favor, selecione um cliente.');
      return;
    }
    if (!pedido) {
      setAlertVenda('Por favor, descreva o pedido.');
      return;
    }
    if (!dataPedido) {
      setAlertVenda('Informe a data do pedido.');
      return;
    }
    if (!dataEntrega) {
      setAlertVenda('Informe a data de entrega.');
      return;
    }

    const data = {
      ...vendaForm,
      pedido,
      enderecoEntrega: vendaForm.enderecoEntrega.trim(),
      obs: vendaForm.obs.trim(),
    };

    try {
      if (editingVendaId) {
        const updated = await api.updateVenda(editingVendaId, data);
        setVendas((prev) => prev.map((v) => (v.id === editingVendaId ? updated : v)));
        showToast('Venda atualizada com sucesso!');
      } else {
        const created = await api.createVenda(data);
        setVendas((prev) => [created, ...prev]);
        showToast('Venda registrada com sucesso!');
      }

      setVendaModalOpen(false);
    } catch (error) {
      setAlertVenda(error.message || 'Nao foi possivel salvar a venda.');
    }
  }

  function verVenda(id) {
    setVendaDetalheId(id);
    setVendaDetalheOpen(true);
  }

  async function deletarVenda(id) {
    if (!window.confirm('Excluir esta venda?')) return;
    try {
      await api.deleteVenda(id);
      setVendas((prev) => prev.filter((v) => v.id !== id));
      showToast('Venda excluida.');
    } catch (error) {
      showToast(error.message || 'Nao foi possivel excluir a venda.');
    }
  }

  async function marcarEntregue(id) {
    const venda = vendas.find((v) => v.id === id);
    if (!venda) return;

    try {
      const updated = await api.updateVenda(id, { ...venda, entregue: true });
      setVendas((prev) => prev.map((v) => (v.id === id ? updated : v)));
      setVendaDetalheOpen(false);
      showToast('Venda marcada como entregue!');
    } catch (error) {
      showToast(error.message || 'Nao foi possivel atualizar a venda.');
    }
  }

  async function marcarPago(id) {
    const venda = vendas.find((v) => v.id === id);
    if (!venda) return;

    try {
      const updated = await api.updateVenda(id, { ...venda, pago: true });
      setVendas((prev) => prev.map((v) => (v.id === id ? updated : v)));
      setVendaDetalheOpen(false);
      showToast('Venda marcada como paga!');
    } catch (error) {
      showToast(error.message || 'Nao foi possivel atualizar a venda.');
    }
  }

  const hoje = new Date().toISOString().split('T')[0];

  return (
    <>
      <button className="hamburger" onClick={() => toggleSidebar()} aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`overlay ${sidebarOpen ? 'open' : ''}`} id="overlay" onClick={() => toggleSidebar(false)}></div>

      <Sidebar activeSection={activeSection} onNavigate={navigateSection} sidebarOpen={sidebarOpen} />

      <main className="main">
        <Topbar title={sectionTitleMap[activeSection]} dateLabel={topbarDate} />

        <div className="content">
          {isLoadingData && <div className="loading-state">Carregando dados...</div>}
          <Routes>
            <Route
              path="/dashboard"
              element={
                <>
                  <DashboardPage
                    totalClientes={totalClientes}
                    totalVendas={totalVendas}
                    totalEntregasPendentes={totalEntregasPendentes}
                    totalReceber={totalReceber}
                    totalNaoRecebido={totalNaoRecebido}
                    recentSales={recentSales}
                    pendingDeliveries={pendingDeliveries}
                    clientes={clientes}
                    hoje={hoje}
                    fmtDate={fmtDate}
                    moneyBR={moneyBR}
                  />
                  <DeliveryCalendar vendas={vendas} clientes={clientes} today={hoje} fmtDate={fmtDate} moneyBR={moneyBR} />
                </>
              }
            />
            <Route
              path="/clientes"
              element={
                <ClientesPage
                  filteredClientes={filteredClientes}
                  searchClientes={searchClientes}
                  setSearchClientes={setSearchClientes}
                  vendas={vendas}
                  initials={initials}
                  onOpenClienteModal={openClienteModal}
                  onViewCliente={verCliente}
                  onDeleteCliente={deletarCliente}
                />
              }
            />
            <Route
              path="/vendas"
              element={
                <VendasPage
                  filteredVendas={filteredVendas}
                  searchVendas={searchVendas}
                  setSearchVendas={setSearchVendas}
                  filterPago={filterPago}
                  setFilterPago={setFilterPago}
                  filterEntregue={filterEntregue}
                  setFilterEntregue={setFilterEntregue}
                  clientes={clientes}
                  hoje={hoje}
                  fmtDate={fmtDate}
                  moneyBR={moneyBR}
                  onOpenVendaModal={openVendaModal}
                  onViewVenda={verVenda}
                  onDeleteVenda={deletarVenda}
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      <ClienteFormModal
        open={clienteModalOpen}
        editingClienteId={editingClienteId}
        alertCliente={alertCliente}
        clienteForm={clienteForm}
        setClienteForm={setClienteForm}
        onClose={() => setClienteModalOpen(false)}
        onSave={salvarCliente}
      />

      <VendaFormModal
        open={vendaModalOpen}
        editingVendaId={editingVendaId}
        alertVenda={alertVenda}
        vendaForm={vendaForm}
        setVendaForm={setVendaForm}
        clientes={clientes}
        onClose={() => setVendaModalOpen(false)}
        onSave={salvarVenda}
      />

      <ClienteDetailModal
        open={clienteDetalheOpen}
        cliente={clienteDetalhe}
        clienteVendas={clienteDetalheVendas}
        initials={initials}
        fmtDate={fmtDate}
        onClose={() => setClienteDetalheOpen(false)}
        onEdit={() => {
          setClienteDetalheOpen(false);
          if (clienteDetalheId) openClienteModal(clienteDetalheId);
        }}
      />

      <VendaDetailModal
        open={vendaDetalheOpen}
        venda={vendaDetalhe}
        cliente={vendaDetalheCliente}
        today={hoje}
        fmtDate={fmtDate}
        moneyBR={moneyBR}
        paymentMethodLabelMap={paymentMethodLabelMap}
        onClose={() => setVendaDetalheOpen(false)}
        onEdit={() => {
          setVendaDetalheOpen(false);
          if (vendaDetalheId) openVendaModal(vendaDetalheId);
        }}
        onMarkEntregue={() => vendaDetalhe && marcarEntregue(vendaDetalhe.id)}
        onMarkPago={() => vendaDetalhe && marcarPago(vendaDetalhe.id)}
      />

      <Toast show={toastVisible} message={toastMessage} />
    </>
  );
}

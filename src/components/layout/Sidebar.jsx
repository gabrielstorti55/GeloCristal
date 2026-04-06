export default function Sidebar({ activeSection, onNavigate, sidebarOpen }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">❄️</div>
        <div className="logo-name">Gelo Cristal</div>
        <div className="logo-sub">Painel de Controle</div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-title">Geral</div>
        <button className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate('dashboard')}>
          <span className="nav-icon">📊</span> Dashboard
        </button>
        <div className="nav-section-title" style={{ marginTop: 12 }}>
          Cadastros
        </div>
        <button className={`nav-item ${activeSection === 'clientes' ? 'active' : ''}`} onClick={() => onNavigate('clientes')}>
          <span className="nav-icon">👥</span> Clientes
        </button>
        <button className={`nav-item ${activeSection === 'vendas' ? 'active' : ''}`} onClick={() => onNavigate('vendas')}>
          <span className="nav-icon">📦</span> Vendas
        </button>
      </nav>
      <div className="sidebar-footer">v1.0 • Gelo Cristal</div>
    </aside>
  );
}

import React from 'react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'agenda', label: 'Gestão de Mentorias', icon: 'auto_schedule' },
    { id: 'brand', label: 'Conteúdo & Identidade', icon: 'auto_awesome' },
    { id: 'content', label: 'Serviços & Preços', icon: 'payments' },
    { id: 'dev_management', label: 'Gestão de Desenvolvimento', icon: 'query_stats' },
    { id: 'students', label: 'Meus Alunos', icon: 'groups' },
    { id: 'testimonials', label: 'Vozes de Sucesso', icon: 'format_quote' }
  ];

  return (
    <aside className="admin-sidebar-nav">
      <div className="sidebar-brand-area">
        <h2 className="brand-name">Rosana Brito</h2>
        <span className="brand-tagline">Área Administrativa</span>
      </div>
      
      <nav className="nav-group">
        {menuItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={() => window.location.hash = ''} className="btn-sidebar-signout" style={{ background: 'var(--surface-container-highest)', color: 'var(--primary)' }}>
          <span className="material-symbols-outlined">home</span>
          Página Inicial
        </button>
        <button onClick={onLogout} className="btn-sidebar-signout">
          <span className="material-symbols-outlined">logout</span>
          Sair do Painel
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

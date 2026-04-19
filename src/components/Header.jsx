import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { user, loginWithGoogle, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccount = () => setIsAccountOpen(!isAccountOpen);
  const closeAll = () => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  };

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        <a href="#" className="logo" onClick={closeAll}>Rosana Brito</a>
        
        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'mobile-active' : ''}`}>
          <a href="#about" onClick={closeAll}>Sobre</a>
          <a href="#services" onClick={closeAll}>Serviços</a>
          <a href="#methodology" onClick={closeAll}>Metodologia</a>
          <a href="#stories" onClick={closeAll}>Sucesso</a>
          
          <a href="#contact" className="btn btn-nav-action" onClick={closeAll}>Agendar Consulta</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <button className="user-icon-btn" onClick={toggleAccount} aria-label="Perfil">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          ) : (
            <button onClick={() => { loginWithGoogle(); closeAll(); }} className="btn btn-nav-action" style={{ background: 'transparent', border: '1px solid var(--secondary)', color: 'var(--secondary)' }}>Acessar</button>
          )}

          {/* Hamburger Menu Toggle (Mobile) */}
          <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Account Sidebar (Off-canvas) */}
      <div className={`account-sidebar ${isAccountOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={toggleAccount}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="user-info-large">
            <div className="user-avatar-placeholder">
              {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <span className="material-symbols-outlined">person</span>}
            </div>
            <h3>{user?.displayName}</h3>
            <p>{user?.email}</p>
            {user?.role === 'admin' && <span className="role-tag-admin">Administradora</span>}
          </div>

          <div className="sidebar-links">
            {user?.role === 'admin' ? (
              <>
                <h4 className="sidebar-section-title">Gestão</h4>
                <a href="#admin" onClick={closeAll}><span className="material-symbols-outlined">dashboard</span> Painel ADM</a>
                <a href="#admin" onClick={closeAll}><span className="material-symbols-outlined">event_available</span> Agenda Global</a>
                <a href="#admin" onClick={closeAll}><span className="material-symbols-outlined">attach_money</span> Editar Preços</a>
              </>
            ) : (
              <>
                <h4 className="sidebar-section-title">Conteúdo</h4>
                <a href="#student" onClick={closeAll}><span className="material-symbols-outlined">calendar_today</span> Minha Agenda</a>
                <a href="#student" onClick={closeAll}><span className="material-symbols-outlined">history</span> Histórico</a>
              </>
            )}
          </div>

          <button onClick={() => { logout(); closeAll(); }} className="btn-logout-sidebar">
            <span className="material-symbols-outlined">logout</span> Sair da Conta
          </button>
        </div>
      </div>
      
      {/* Overlay when sidebar is open */}
      {isAccountOpen && <div className="sidebar-overlay" onClick={closeAll}></div>}
    </nav>
  );
};

export default Header;

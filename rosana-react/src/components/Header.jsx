import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loginWithGoogle, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        <a href="#" className="logo" onClick={closeMenu}>Rosana Brito</a>
        
        {/* Hamburger Menu Toggle */}
        <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'mobile-active' : ''}`}>
          <a href="#about" onClick={closeMenu}>Sobre</a>
          <a href="#services" onClick={closeMenu}>Serviços</a>
          <a href="#methodology" onClick={closeMenu}>Metodologia</a>
          <a href="#stories" onClick={closeMenu}>Sucesso</a>
          
          {user ? (
            <div className="user-profile-nav">
              <span className="user-name">{user.displayName}</span>
              <button onClick={() => { logout(); closeMenu(); }} className="btn-logout">Sair</button>
            </div>
          ) : (
            <button onClick={() => { loginWithGoogle(); closeMenu(); }} className="btn btn-nav-action">Login</button>
          )}
          
          <a href="#contact" className="btn btn-nav-action" onClick={closeMenu}>Agendar Consulta</a>
        </div>
      </div>
    </nav>
  );
};

export default Header;

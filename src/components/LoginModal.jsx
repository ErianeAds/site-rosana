import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { 
    user, 
    loginWithGoogle, 
    loginWithApple, 
    loginWithEmail, 
    registerWithEmail, 
    signingIn 
  } = useAuth();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen && !signingIn) {
      onClose();
    }
  }, [user, isOpen, signingIn, onClose]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen && !signingIn) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, signingIn, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) return setError('Por favor, informe seu nome.');
        await registerWithEmail(email, password, name);
      }
    } catch (err) {
      setError(
        err.code === 'auth/user-not-found' ? 'Usuário não encontrado.' : 
        err.code === 'auth/wrong-password' ? 'Senha incorreta.' : 
        err.code === 'auth/email-already-in-use' ? 'E-mail já cadastrado.' :
        err.code === 'auth/invalid-email' ? 'E-mail inválido.' :
        err.code === 'auth/weak-password' ? 'Senha muito fraca. Use pelo menos 6 caracteres.' :
        'Erro ao processar. Tente novamente.'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={!signingIn ? onClose : undefined}>
      <div className="login-modal-wrapper">
        <div className="login-modal-container" onClick={e => e.stopPropagation()}>
          {!signingIn && (
            <button className="login-modal-close" onClick={onClose} aria-label="Fechar">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
          
          <header className="modal-header">
            <div className="login-modal-icon">
              <span className="material-symbols-outlined">
                {signingIn ? 'sync' : mode === 'login' ? 'lock' : 'person_add'}
              </span>
            </div>
            <h2 className="login-modal-title">
              {signingIn ? 'Sincronizando...' : mode === 'login' ? 'Bem-vindo de volta' : 'Inicie sua Jornada'}
            </h2>
            <p className="login-modal-subtitle">
              Acesse sua área exclusiva de mentoria estratégica
            </p>
          </header>

          {signingIn ? (
            <div className="loading-container">
              <div className="login-spinner"></div>
              <p className="loading-text">Conectando aos seus dados executivos...</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="login-form">
                {mode === 'signup' && (
                  <div className="input-group">
                    <label>Nome Completo</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                      placeholder="Seu nome"
                      className="form-input"
                    />
                  </div>
                )}
                
                <div className="input-group">
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    placeholder="exemplo@email.com"
                    className="form-input"
                  />
                </div>
                
                <div className="input-group">
                  <label>Senha</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••"
                    className="form-input"
                  />
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <button type="submit" className="login-submit-btn">
                  {mode === 'login' ? 'Entrar' : 'Criar minha Conta'}
                </button>
              </form>

              <div className="login-divider">
                <span>ou acesse via</span>
              </div>

              <div className="login-social-grid">
                <button className="social-btn google" onClick={loginWithGoogle}>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                  Google
                </button>
                <button className="social-btn apple" onClick={loginWithApple}>
                  <span className="material-symbols-outlined">apple</span>
                  Apple ID
                </button>
              </div>

              <p className="toggle-mode">
                {mode === 'login' ? 'Não tem uma conta?' : 'Já possui conta?'}
                <button 
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setError('');
                  }} 
                  className="toggle-btn"
                >
                  {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Overlay */
        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 28, 48, 0.75);
          backdrop-filter: blur(14px);
          z-index: 10000;
          display: grid;
          place-items: center;
          padding: 1rem;
        }
        
        .login-modal-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        /* Container */
        .login-modal-container {
          background: white;
          width: 100%;
          max-width: 440px;
          max-height: 90vh;
          overflow-y: auto;
          padding: clamp(2rem, 6vw, 3rem);
          border-radius: 40px;
          text-align: center;
          box-shadow: 0 40px 120px rgba(0,0,0,0.2);
          position: relative;
          scrollbar-width: thin;
        }
        
        .login-modal-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .login-modal-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .login-modal-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        /* Botão fechar */
        .login-modal-close {
          position: absolute;
          top: clamp(1rem, 4vw, 1.5rem);
          right: clamp(1rem, 4vw, 1.5rem);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #f8fafc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.2s ease;
          z-index: 1;
        }
        
        @media (hover: hover) {
          .login-modal-close:hover {
            background: #e2e8f0;
            color: #001e40;
            transform: scale(1.05);
          }
        }
        
        .login-modal-close:active {
          transform: scale(0.95);
        }
        
        .login-modal-close span {
          font-size: 20px;
        }
        
        /* Header */
        .modal-header {
          margin-bottom: 2rem;
        }
        
        .login-modal-icon {
          width: clamp(60px, 15vw, 72px);
          height: clamp(60px, 15vw, 72px);
          background: #f8fafc;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #bf9b30;
        }
        
        .login-modal-icon span {
          font-size: clamp(28px, 6vw, 32px);
        }
        
        .login-modal-icon span {
          animation: ${signingIn ? 'spin 2s linear infinite' : 'none'};
        }
        
        .login-modal-title {
          font-family: 'Noto Serif', serif;
          font-size: clamp(1.4rem, 5vw, 1.8rem);
          color: #001e40;
          margin: 0 0 0.5rem 0;
        }
        
        .login-modal-subtitle {
          font-size: clamp(0.85rem, 3vw, 0.95rem);
          color: #64748b;
          margin: 0;
        }
        
        /* Form */
        .login-form {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .input-group {
          text-align: left;
        }
        
        .input-group label {
          display: block;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          color: #735b25;
          margin-bottom: 8px;
          margin-left: 4px;
        }
        
        .form-input {
          width: 100%;
          padding: 14px 20px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          font-size: 1rem;
          color: #001e40;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #bf9b30;
          box-shadow: 0 0 0 4px rgba(191, 155, 48, 0.1);
        }
        
        .form-input::placeholder {
          color: #94a3b8;
        }
        
        .error-message {
          color: #dc2626;
          font-size: 0.8rem;
          margin: 5px 0 0 0;
          text-align: center;
        }
        
        .login-submit-btn {
          width: 100%;
          padding: 16px;
          background: #001e40;
          color: white;
          border: none;
          border-radius: 100px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
          margin-top: 1rem;
          font-size: 1rem;
        }
        
        .login-submit-btn:active {
          transform: scale(0.98);
        }
        
        /* Divisor */
        .login-divider {
          position: relative;
          margin: 2rem 0;
          text-align: center;
        }
        
        .login-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e2e8f0;
          z-index: 1;
        }
        
        .login-divider span {
          position: relative;
          z-index: 2;
          background: white;
          padding: 0 1rem;
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        /* Botões sociais */
        .login-social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        @media (hover: hover) {
          .social-btn:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
            transform: translateY(-2px);
          }
        }
        
        .social-btn:active {
          transform: translateY(0);
        }
        
        .social-btn.apple {
          background: #000;
          color: white;
          border: none;
        }
        
        .social-btn.apple span {
          font-size: 20px;
        }
        
        .social-btn.google img {
          width: 20px;
          height: 20px;
        }
        
        /* Loading */
        .loading-container {
          padding: 3rem 0;
          text-align: center;
        }
        
        .login-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #bf9b30;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        .loading-text {
          margin-top: 2rem;
          color: var(--on-surface-variant);
          font-size: 0.9rem;
        }
        
        /* Toggle mode */
        .toggle-mode {
          margin-top: 2rem;
          font-size: 0.85rem;
          color: #64748b;
          text-align: center;
        }
        
        .toggle-btn {
          background: none;
          border: none;
          color: #bf9b30;
          font-weight: bold;
          cursor: pointer;
          margin-left: 5px;
          text-decoration: underline;
          font-size: 0.85rem;
        }
        
        @media (hover: hover) {
          .toggle-btn:hover {
            color: #735b25;
          }
        }
        
        /* Animações */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
          .login-modal-overlay {
            padding: 0.75rem;
          }
          
          .login-modal-container {
            padding: 2rem 1.5rem;
            border-radius: 32px;
          }
          
          .login-modal-close {
            width: 40px;
            height: 40px;
            top: 1rem;
            right: 1rem;
          }
          
          .login-modal-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 1rem;
          }
          
          .form-input {
            padding: 12px 16px;
            font-size: 0.95rem;
          }
          
          .login-submit-btn {
            padding: 14px;
          }
          
          .social-btn {
            padding: 10px;
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 480px) {
          .login-modal-container {
            padding: 1.5rem 1.25rem;
            border-radius: 28px;
          }
          
          .login-modal-icon {
            width: 50px;
            height: 50px;
            border-radius: 16px;
          }
          
          .login-modal-icon span {
            font-size: 24px;
          }
          
          .login-social-grid {
            gap: 0.75rem;
          }
          
          .social-btn {
            padding: 10px 8px;
            font-size: 0.8rem;
          }
          
          .social-btn.google img {
            width: 18px;
            height: 18px;
          }
          
          .social-btn.apple span {
            font-size: 18px;
          }
          
          .toggle-mode {
            margin-top: 1.5rem;
            font-size: 0.8rem;
          }
        }
        
        @media (max-width: 380px) {
          .login-social-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
        
        /* Landscape */
        @media (max-width: 768px) and (orientation: landscape) {
          .login-modal-container {
            max-height: 85vh;
            padding: 1.5rem;
          }
          
          .modal-header {
            margin-bottom: 1rem;
          }
          
          .login-modal-icon {
            width: 45px;
            height: 45px;
            margin-bottom: 0.75rem;
          }
          
          .login-form {
            gap: 0.75rem;
            margin-bottom: 1rem;
          }
          
          .input-group label {
            margin-bottom: 4px;
          }
          
          .form-input {
            padding: 8px 12px;
          }
        }
        
        /* Acessibilidade */
        @media (prefers-reduced-motion: reduce) {
          .login-modal-close,
          .social-btn,
          .login-submit-btn {
            transition: none;
          }
          
          .login-modal-icon span,
          .login-spinner {
            animation: none;
          }
        }
        
        /* Touch devices */
        @media (hover: none) and (pointer: coarse) {
          .login-modal-close {
            width: 48px;
            height: 48px;
          }
          
          .social-btn {
            padding: 12px;
          }
          
          .toggle-btn {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

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
              <span className={`material-symbols-outlined ${signingIn ? 'spinning-icon' : ''}`}>
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
    </div>
  );
};

export default LoginModal;
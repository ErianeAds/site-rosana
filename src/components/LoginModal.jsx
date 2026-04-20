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

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen && !signingIn) {
      onClose();
    }
  }, [user, isOpen, signingIn, onClose]);

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
        setError(err.code === 'auth/user-not-found' ? 'Usuário não encontrado.' : 
               err.code === 'auth/wrong-password' ? 'Senha incorreta.' : 
               err.code === 'auth/email-already-in-use' ? 'E-mail já cadastrado.' :
               'Erro ao processar. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={!signingIn ? onClose : undefined}>
      <div className="login-modal-container" onClick={e => e.stopPropagation()}>
        {!signingIn && (
            <button className="login-modal-close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
        )}
        
        <header style={{ marginBottom: '2rem' }}>
          <div className="login-modal-icon">
            <span className="material-symbols-outlined">{signingIn ? 'sync' : mode === 'login' ? 'lock' : 'person_add'}</span>
          </div>
          <h2 className="login-modal-title">{signingIn ? 'Sincronizando...' : mode === 'login' ? 'Bem-vindo de volta' : 'Inicie sua Jornada'}</h2>
          <p className="login-modal-subtitle">Acesse sua área exclusiva de mentoria estratégica</p>
        </header>

        {signingIn ? (
            <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                <div className="login-spinner"></div>
                <p style={{ marginTop: '2rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Conectando aos seus dados executivos...</p>
            </div>
        ) : (
            <>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    {mode === 'signup' && (
                         <div className="input-group">
                            <label>Nome Completo</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Seu nome" />
                        </div>
                    )}
                    <div className="input-group">
                        <label>E-mail Corporativo</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="exemplo@email.com" />
                    </div>
                    <div className="input-group">
                        <label>Senha</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: '5px 0 0 0' }}>{error}</p>}
                    
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

                <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                    {mode === 'login' ? 'Não tem uma conta?' : 'Já possui conta?'}
                    <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}>
                        {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
                    </button>
                </p>
            </>
        )}
      </div>

      <style>{`
        .login-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 28, 48, 0.7); backdrop-filter: blur(12px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .login-modal-container { background: white; width: 100%; max-width: 440px; padding: 3rem; border-radius: 40px; text-align: center; box-shadow: 0 40px 100px rgba(0,0,0,0.1); position: relative; }
        .login-modal-close { position: absolute; top: 20px; right: 20px; width: 44px; height: 44px; border-radius: 50%; border: none; background: #f8fafc; cursor: pointer; display: flex; alignItems: center; justifyContent: center; color: #64748b; }
        .login-modal-icon { width: 72px; height: 72px; background: #f8fafc; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #bf9b30; }
        .login-modal-title { font-family: 'Noto Serif', serif; font-size: 1.8rem; color: #001e40; margin: 0 0 0.5rem 0; }
        .login-modal-subtitle { font-size: 0.95rem; color: #64748b; margin: 0; }
        
        .input-group { text-align: left; }
        .input-group label { display: block; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: #735b25; margin-bottom: 8px; margin-left: 4px; }
        .input-group input { width: 100%; padding: 14px 20px; border-radius: 16px; border: 1px solid #e2e8f0; font-size: 1rem; color: #001e40; transition: all 0.2s; }
        .input-group input:focus { outline: none; border-color: #bf9b30; box-shadow: 0 0 0 4px rgba(191, 155, 48, 0.1); }
        
        .login-submit-btn { width: 100%; padding: 16px; background: #001e40; color: white; border: none; border-radius: 100px; font-weight: bold; cursor: pointer; transition: transform 0.2s; margin-top: 1rem; }
        .login-submit-btn:active { transform: scale(0.98); }
        
        .login-divider { position: relative; margin: 2rem 0; text-align: center; }
        .login-divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e2e8f0; z-index: 1; }
        .login-divider span { position: relative; z-index: 2; background: white; padding: 0 1rem; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .login-social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; borderRadius: 16px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
        .social-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
        .social-btn.apple { background: #000; color: white; border: none; }
        .social-btn.google img { width: 20px; }
        
        .login-spinner { width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #bf9b30; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginModal;
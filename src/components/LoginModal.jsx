import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { user, loginWithGoogle, signingIn } = useAuth();

  // Fecha o modal automaticamente ao logar
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={e => e.stopPropagation()}>
        {!signingIn && (
          <button className="login-modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
        
        <div className="login-modal-header">
          <div className="login-logo-circle">
            <span className="material-symbols-outlined">{signingIn ? 'sync' : 'lock'}</span>
          </div>
          <h2>{signingIn ? 'Autenticando...' : 'Bem-vindo de volta'}</h2>
          <p>{signingIn ? 'Estamos conectando sua conta de forma segura.' : 'Acesse sua área exclusiva de mentoria'}</p>
        </div>

        <div className="login-options">
          {signingIn ? (
            <div className="login-loader">
              <div className="spinner"></div>
            </div>
          ) : (
            <button className="google-login-btn" onClick={async () => {
              await loginWithGoogle();
              // Modal closes via useEffect below when user state changes
            }}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              <span>Entrar com o Google</span>
            </button>
          )}
        </div>

        {!signingIn && (
          <p className="login-privacy-note">
            Ao entrar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 15, 40, 0.6);
          backdrop-filter: blur(16px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .login-modal-content {
          background: white;
          width: 90%;
          max-width: 420px;
          padding: 4rem 2.5rem;
          border-radius: 40px;
          position: relative;
          text-align: center;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.15);
          animation: modalSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .login-modal-close {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: #f1f5f9;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }
        .login-modal-close:hover { background: #e2e8f0; color: #0f172a; }

        .login-logo-circle {
          width: 80px;
          height: 80px;
          background: #f8fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #bf9b30;
        }
        .login-logo-circle span { font-size: 32px; }
        .login-logo-circle span.material-symbols-outlined {
           animation: ${signingIn ? 'spin 2s linear infinite' : 'none'};
        }

        .login-modal-header h2 {
          font-family: 'Noto Serif', serif;
          font-size: 1.8rem;
          margin: 0 0 0.5rem;
          color: #001e40;
        }
        .login-modal-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 2.5rem;
        }

        .google-login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 1.2rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.3s;
        }
        .google-login-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .google-login-btn img {
          width: 24px;
          height: 24px;
        }

        .login-loader { display: flex; justify-content: center; padding: 1rem; }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #bf9b30;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .login-privacy-note {
          margin-top: 2.5rem;
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.5;
        }

        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default LoginModal;


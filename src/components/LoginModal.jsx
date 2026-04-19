import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { user, loginWithGoogle, signingIn } = useAuth();

  // Fecha o modal apenas quando o usuário está logado E não está em processo de login
  useEffect(() => {
    if (user && isOpen && !signingIn) {
      onClose();
    }
  }, [user, isOpen, signingIn, onClose]);

  // Fecha ao pressionar ESC (apenas se não estiver logando)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen && !signingIn) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, signingIn, onClose]);

  // Previne scroll do body
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

  // Se estiver em processo de redirect, não mostra o modal (vai recarregar a página)
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
          
          <div className="login-modal-icon">
            <span className="material-symbols-outlined">
              {signingIn ? 'sync' : 'lock'}
            </span>
          </div>

          <h2 className="login-modal-title">
            {signingIn ? 'Aguarde...' : 'Bem-vindo de volta'}
          </h2>
          
          <p className="login-modal-subtitle">
            {signingIn 
              ? 'Redirecionando para o Google...' 
              : 'Acesse sua área exclusiva de mentoria'
            }
          </p>

          <div className="login-modal-content">
            {signingIn ? (
              <div className="login-loader">
                <div className="login-spinner"></div>
                <p className="login-loader-text">Você será redirecionado em instantes</p>
              </div>
            ) : (
              <button className="login-google-btn" onClick={loginWithGoogle}>
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="login-google-icon"
                />
                <span>Entrar com o Google</span>
              </button>
            )}
          </div>

          {!signingIn && (
            <p className="login-privacy">
              Ao entrar, você concorda com nossos termos de uso e política de privacidade.
            </p>
          )}
        </div>
      </div>

      <style>{`
        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 15, 40, 0.6);
          backdrop-filter: blur(12px);
          z-index: 10000;
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .login-modal-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-modal-container {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 420px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 40px 32px;
          border-radius: 32px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          margin: auto;
        }

        .login-modal-container::-webkit-scrollbar {
          width: 6px;
        }

        .login-modal-container::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 10px;
        }

        .login-modal-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .login-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #64748b;
          z-index: 1;
        }

        .login-modal-close:hover {
          background: #e2e8f0;
          color: #001e40;
        }

        .login-modal-close span {
          font-size: 20px;
        }

        .login-modal-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: #f8fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #bf9b30;
        }

        .login-modal-icon span {
          font-size: 32px;
        }

        .login-modal-icon span {
          animation: ${signingIn ? 'spin 2s linear infinite' : 'none'};
        }

        .login-modal-title {
          font-family: 'Noto Serif', serif;
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px;
          color: #001e40;
        }

        .login-modal-subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0 0 32px;
          line-height: 1.5;
        }

        .login-modal-content {
          margin-bottom: 32px;
        }

        .login-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 16px;
          font-weight: 600;
          color: #001e40;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .login-google-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .login-google-icon {
          width: 22px;
          height: 22px;
        }

        .login-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 20px 0;
        }

        .login-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f3f3;
          border-top-color: #bf9b30;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .login-loader-text {
          margin: 0;
          font-size: 14px;
          color: #64748b;
        }

        .login-privacy {
          margin: 0;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .login-modal-container {
            max-width: 400px;
            padding: 32px 24px;
            border-radius: 28px;
          }

          .login-modal-icon {
            width: 70px;
            height: 70px;
            margin-bottom: 20px;
          }

          .login-modal-icon span {
            font-size: 28px;
          }

          .login-modal-title {
            font-size: 24px;
          }

          .login-modal-subtitle {
            font-size: 14px;
            margin-bottom: 28px;
          }
        }

        @media (max-width: 480px) {
          .login-modal-overlay {
            padding: 12px;
          }

          .login-modal-container {
            padding: 24px 16px;
            border-radius: 20px;
          }

          .login-modal-icon {
            width: 60px;
            height: 60px;
          }

          .login-modal-icon span {
            font-size: 24px;
          }

          .login-modal-title {
            font-size: 20px;
          }

          .login-google-btn {
            padding: 12px 16px;
            font-size: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-modal-icon span,
          .login-spinner {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
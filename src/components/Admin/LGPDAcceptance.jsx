import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const LGPDAcceptance = ({ user, onAccept }) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        lgpdAccepted: true,
        lgpdAcceptedAt: serverTimestamp(),
        responsibilityTermSigned: true
      });
      onAccept();
    } catch (error) {
      console.error("Erro ao assinar termo:", error);
      alert("Erro ao validar assinatura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lgpd-overlay">
      <div className="lgpd-container">
        <header className="lgpd-header">
          <div className="lgpd-icon">
            <span className="material-symbols-outlined">gavel</span>
          </div>
          <h2 className="lgpd-title">Termo de Responsabilidade & LGPD</h2>
          <p className="lgpd-subtitle">Controle de Acesso Administrativo e Proteção de Dados</p>
        </header>

        <div className="lgpd-content">
          <section className="term-section">
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>1. Compromisso com a Privacidade</h4>
            <p>Ao acessar este Painel Administrativo, você declara estar ciente de que terá acesso a dados pessoais e sensíveis de alunos e mentorados, protegidos pela <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>.</p>
          </section>

          <section className="term-section">
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>2. Obrigações do Administrador</h4>
            <ul style={{ paddingLeft: '1.2rem', color: '#64748b' }}>
              <li>Utilizar os dados exclusivamente para fins de evolução acadêmica e estratégica do aluno.</li>
              <li>Não compartilhar informações de contato, faturamento ou progresso com terceiros sem autorização expressa.</li>
              <li>Manter o sigilo e a confidencialidade de todos os depoimentos e feedbacks recebidos.</li>
              <li>Zelar pela segurança de sua senha de acesso, evitando acessos não autorizados.</li>
            </ul>
          </section>

          <section className="term-section">
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>3. Responsabilidade Jurídica</h4>
            <p>O uso indevido das informações aqui contidas pode acarretar em sanções administrativas e responsabilidade civil, conforme previsto na legislação brasileira vigente.</p>
          </section>
        </div>

        <footer className="lgpd-footer">
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem', textAlign: 'center' }}>
            Ao clicar abaixo, você assina digitalmente este termo e confirma possuir autoridade para gerenciar estes dados.
          </p>
          <button 
            disabled={loading} 
            className="btn-accept-term" 
            onClick={handleAccept}
          >
            {loading ? 'Validando Assinatura...' : 'Aceito o Termo e Responsabilidades'}
          </button>
        </footer>
      </div>

      <style>{`
        .lgpd-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #001e40;
          z-index: 20000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .lgpd-container {
          background: white;
          width: 100%;
          max-width: 600px;
          border-radius: 40px;
          padding: 3rem;
          box-shadow: 0 40px 100px rgba(0,0,0,0.4);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .lgpd-header { text-align: center; margin-bottom: 2rem; }
        .lgpd-icon {
          width: 64px; height: 64px;
          background: #f8fafc;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
          color: #bf9b30;
        }
        .lgpd-title { font-family: 'Noto Serif', serif; font-size: 1.6rem; color: #001e40; margin: 0; }
        .lgpd-subtitle { font-size: 0.9rem; color: #64748b; margin-top: 0.5rem; }
        
        .lgpd-content {
          flex: 1;
          overflow-y: auto;
          padding-right: 1rem;
          margin-bottom: 2rem;
          text-align: left;
        }
        .term-section { margin-bottom: 1.5rem; line-height: 1.6; font-size: 0.95rem; color: #475569; }
        
        .btn-accept-term {
          width: 100%;
          padding: 1.2rem;
          background: #001e40;
          color: white;
          border: none;
          border-radius: 100px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-accept-term:hover:not(:disabled) {
          background: #bf9b30;
          transform: translateY(-2px);
        }
        .btn-accept-term:disabled { opacity: 0.6; cursor: not-allowed; }

        .lgpd-content::-webkit-scrollbar { width: 6px; }
        .lgpd-content::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LGPDAcceptance;

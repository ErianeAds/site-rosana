import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    // Redirect to home or show a message
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem' }}>
        <h2 className="serif">Acesso Restrito</h2>
        <p>Por favor, faça login para acessar esta área.</p>
        <button onClick={() => window.location.hash = ''} className="btn btn-primary">Voltar ao Início</button>
      </div>
    );
  }

  // Check actual role from Firestore (fetched in AuthContext)
  if (adminOnly && user.role !== 'admin') {
    return (
       <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem' }}>
        <h2 className="serif">Acesso Negado</h2>
        <p>Você não tem permissão para acessar o painel administrativo.</p>
        <button onClick={() => window.location.hash = ''} className="btn btn-primary">Voltar ao Início</button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

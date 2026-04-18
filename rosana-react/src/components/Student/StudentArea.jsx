import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentMentorships } from '../../firebase/services';

const StudentArea = () => {
  const { user, logout } = useAuth();
  const [mentorships, setMentorships] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchMentorships = async () => {
        const data = await getStudentMentorships(user.uid);
        setMentorships(data);
      };
      fetchMentorships();
    }
  }, [user]);
  return (
    <div className="student-area" style={{ background: '#f8f9ff', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Mini Nav for Student */}
      <nav style={{ 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(10px)', 
        padding: '1rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(11,28,48,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <span style={{ fontFamily: 'Noto Serif', fontStyle: 'italic', color: '#001e40', fontSize: '1.25rem' }}>Executive Distinction</span>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
          <a href="#" style={{ color: '#001e40', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #735b25' }}>Agendamento</a>
          <a href="#" style={{ color: '#737780', textDecoration: 'none' }}>Meu Histórico</a>
          <a href="#" style={{ color: '#737780', textDecoration: 'none' }}>Recursos</a>
          <button 
            onClick={() => { logout(); window.location.hash = ''; }} 
            className="btn-logout"
            style={{ fontSize: '0.75rem' }}
          >
            Sair
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 2rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <p style={{ color: '#735b25', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2px' }}>RESERVE SEU MOMENTO</p>
          <h1 style={{ fontFamily: 'Noto Serif', fontSize: '3rem', color: '#001e40', lineHeight: 1.1 }}>
            Agendamento do Aluno: {user?.displayName?.split(' ')[0] || 'Distingüido'}
          </h1>
        </header>

        <div className="scheduling-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 12px 40px rgba(0,0,0,0.04)', borderTop: '4px solid #735b25' }}>
            <h2 style={{ fontFamily: 'Noto Serif', color: '#001e40' }}>Outubro 2023</h2>
            {/* Calendar Placeholder */}
            <div style={{ height: '300px', background: '#f8f9ff', marginTop: '1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#737780' }}>
              Interface de Calendário
            </div>
          </div>

          <aside style={{ background: '#eff4ff', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'Noto Serif', color: '#001e40', fontSize: '1.125rem' }}>Horários Disponíveis</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['09:00 AM', '11:00 AM', '02:00 PM'].map((time, i) => (
                <button key={i} style={{ 
                  background: '#ffffff', 
                  border: '1px solid #c3c6d1', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  textAlign: 'left',
                  cursor: 'pointer'
                }}>
                  {time} - {i === 1 ? 'Sessão Individual' : 'Mentoria Estratégica'}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default StudentArea;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMentorships } from '../../firebase/services';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    revenue: 'R$ 0',
    mentorships: 0,
    slots: 0,
    status: 'Standby'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorships = await getMentorships();
        setStats(prev => ({
          ...prev,
          mentorships: mentorships.length,
          // Add more logic here as collections grow
        }));
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8f9ff' }}>
      {/* Sidebar Shell */}
      <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e5eeff', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'Noto Serif', color: '#001e40', marginBottom: '2rem' }}>Rosana</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="#" style={{ color: '#001e40', fontWeight: 'bold', textDecoration: 'none' }}>Dashboard</a>
          <a href="#" style={{ color: '#737780', textDecoration: 'none' }}>Agenda</a>
          <a href="#" style={{ color: '#737780', textDecoration: 'none' }}>Financeiro</a>
          <button 
            onClick={() => { logout(); window.location.hash = ''; }} 
            className="btn-logout" 
            style={{ marginTop: '2rem', textAlign: 'left', padding: 0 }}
          >
            Sair do Painel
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2px', color: '#735b25' }}>PRINCIPAL OVERVIEW</span>
          <h1 style={{ fontFamily: 'Noto Serif', fontSize: '2.5rem', color: '#001e40', marginTop: '0.5rem' }}>Olá, {user?.displayName || 'Rosana'}</h1>
        </header>

        {/* KPI Cards Shell */}
        <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Total Revenue', value: stats.revenue, accent: '#735b25' },
            { label: 'Active Mentorships', value: stats.mentorships, accent: '#001e40' },
            { label: 'Pending Slots', value: stats.slots, accent: '#001e40' },
            { label: 'Compliance Status', value: stats.status, accent: '#001e40' }
          ].map((kpi, idx) => (
            <div key={idx} style={{ 
              background: '#ffffff', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              borderTop: `4px solid ${kpi.accent}`
            }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#737780', textTransform: 'uppercase' }}>{kpi.label}</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'Noto Serif', fontWeight: 'bold', color: '#001e40', marginTop: '0.5rem' }}>{kpi.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

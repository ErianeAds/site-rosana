import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMentorships, getSiteContent } from '../../firebase/services';

const StudentArea = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [siteData, setSiteData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const [mentorships, content] = await Promise.all([
          getMentorships(),
          getSiteContent()
        ]);
        const myData = mentorships.filter(m => m.studentEmail === user?.email);
        setSessions(myData);
        setSiteData(content || {});
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchStudentData();
  }, [user]);

  const meetingLink = siteData.contact?.meetingLink || '#';
  const confirmedSession = sessions.find(s => s.status === 'confirmed');

  return (
    <div className="student-container" style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--secondary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.displayName ? user.displayName[0] : 'U'}
            </div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Olá, {user?.displayName?.split(' ')[0]}</h1>
          </div>
          <button onClick={logout} className="btn btn-tertiary">Sair</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
          <section style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: 'Noto Serif', marginBottom: '2rem' }}>Meus Agendamentos</h3>
            {loading ? <p>Sincronizando sessões...</p> : sessions.length === 0 ? <p>Nenhuma mentoria ativa.</p> : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {sessions.map((s, i) => (
                  <div key={i} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{s.serviceTitle}</h4>
                      <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>{s.date} às {s.time}hs</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px', background: s.status === 'confirmed' ? '#e6fff1' : '#fff', color: s.status === 'confirmed' ? '#008a3e' : '#64748b', fontWeight: 'bold' }}>
                        {s.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside style={{ display: 'grid', gap: '2rem', alignContent: 'start' }}>
            {confirmedSession && (
              <div style={{ background: '#001e40', color: 'white', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#fddc99', marginBottom: '1rem' }}>video_camera_front</span>
                <h4 style={{ marginBottom: '0.5rem' }}>Próxima Reunião</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.5rem' }}>{confirmedSession.date} às {confirmedSession.time}hs</p>
                <a href={meetingLink} target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'block', background: '#008a3e', color: 'white', textDecoration: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold' }}>
                  Entrar no Google Meet
                </a>
              </div>
            )}
            
            <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ marginBottom: '1rem' }}>Apoio ao Aluno</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Em caso de dúvidas sobre seu link ou horário, entre em contato via WhatsApp.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StudentArea;

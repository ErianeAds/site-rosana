import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    getStudentMentorships, 
    getSiteContent, 
    getStudentProgress, 
    updateStudentProgress,
    getCourses 
} from '../../firebase/services';
import CalendarPicker from '../CalendarPicker';
import JourneyCalendar from './JourneyCalendar';
import { format } from 'date-fns';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const StudentArea = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [siteData, setSiteData] = useState({});
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPillar, setCurrentPillar] = useState('Início da Jornada');
  const [nextSession, setNextSession] = useState(null);
  
  // States for Scheduling
  const [isScheduling, setIsScheduling] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [mentorships, content, courseData] = await Promise.all([
        getStudentMentorships(user.uid),
        getSiteContent(),
        getCourses()
      ]);
      
      setSiteData(content || {});
      setCourses(courseData || []);

      const parseDate = (dStr, tStr) => {
          if (!dStr || !tStr) return new Date(0);
          const [d, m, y] = dStr.split('/').map(Number);
          const [h, min] = tStr.split(':').map(Number);
          return new Date(y, m - 1, d, h, min);
      };

      const studentSessions = (mentorships || [])
        .sort((a, b) => parseDate(b.date, b.time) - parseDate(a.date, a.time));
      
      setSessions(studentSessions);

      const now = new Date();
      const futureConfirmed = studentSessions
        .filter(s => s.status === 'confirmed')
        .filter(s => parseDate(s.date, s.time) > now)
        .sort((a, b) => parseDate(a.date, a.time) - parseDate(b.date, b.time));
      
      setNextSession(futureConfirmed[0] || null);

      const confirmedCount = studentSessions.filter(s => s.status === 'confirmed').length;
      if (confirmedCount <= 1) setCurrentPillar('Diagnóstico');
      else if (confirmedCount <= 3) setCurrentPillar('Planejamento');
      else if (confirmedCount <= 6) setCurrentPillar('Execução');
      else setCurrentPillar('Follow-up');

      const progressData = await getStudentProgress(user.uid);
      if (progressData) {
        setProgress(progressData);
      } else {
          setProgress({
              currentPillar: 'Diagnóstico',
              objective: 'Definindo as bases da jornada...',
              tasks: [],
              featuredImage: null
          });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do aluno:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const toggleTask = async (taskId) => {
    if (!progress) return;
    const newTasks = progress.tasks.map(t => 
      t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    );
    const updated = { ...progress, tasks: newTasks };
    setProgress(updated);
    try {
      await updateStudentProgress(user.uid, updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBooking = async ({date, time}) => {
      if (!selectedService) return alert("Por favor, selecione o foco da mentoria primeiro.");
      try {
          const mentorshipData = {
            studentId: user.uid,
            studentName: user.displayName,
            studentEmail: user.email,
            serviceId: selectedService.id,
            serviceTitle: selectedService.name,
            date: format(date, 'dd/MM/yyyy'),
            time: time,
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          await addDoc(collection(db, 'mentorships'), mentorshipData);
          alert("Reserva solicitada com sucesso! Aguarde a confirmação por e-mail.");
          setIsScheduling(false);
          setSelectedService(null);
          fetchData();
      } catch (e) {
          console.error(e);
          alert("Ocorreu um erro ao processar seu agendamento.");
      }
  };

  const meetingLink = siteData.contact?.meetingLink || '#';

  const STYLES = {
    container: {
      minHeight: '100vh',
      background: 'var(--surface)',
      padding: '2rem'
    },
    headerTitle: {
      fontFamily: "'Noto Serif', serif",
      fontSize: '2rem',
      letterSpacing: '-0.02em',
      margin: 0,
      color: 'var(--primary)',
      fontWeight: '700'
    },
    sectionTitle: {
      fontFamily: "'Noto Serif', serif",
      fontSize: '1.25rem',
      letterSpacing: '0.02em',
      margin: 0,
      color: 'var(--primary)',
      fontWeight: '600'
    },
    nextMeetingCard: {
      background: 'linear-gradient(135deg, #0b1c30 0%, #1a2a3e 100%)',
      color: 'white',
      padding: '3rem',
      borderRadius: '32px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '3rem'
    },
    hybridGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '2.5rem'
    },
    contentSection: {
        background: 'var(--surface-container-low)',
        padding: '2.5rem',
        borderRadius: '32px',
        height: 'fit-content'
    },
    sessionItem: {
      background: 'var(--surface-container-lowest)', 
      padding: '1.5rem',
      borderRadius: '24px',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      border: 'none'
    },
    pilarBadge: {
        fontSize: '0.7rem',
        background: 'rgba(115, 91, 37, 0.1)',
        padding: '6px 14px',
        borderRadius: '100px',
        color: '#735b25',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(11, 28, 48, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
    },
    modalContent: {
        background: 'white',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '32px',
        padding: '3rem',
        position: 'relative'
    }
  };

  return (
    <div className="student-container" style={STYLES.container}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '72px', height: '72px', background: 'var(--surface-container-low)', color: 'var(--primary)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
              {user?.displayName ? user.displayName[0] : 'U'}
            </div>
            <div>
              <h1 style={STYLES.headerTitle}>Dê o próximo passo, {user?.displayName?.split(' ')[0]}.</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#735b25' }}>auto_awesome</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontWeight: '500' }}>{currentPillar} • Roadmap de Excelência</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => window.location.hash = ''} 
              className="btn-utility" 
              style={{ 
                background: 'var(--surface-container-low)', 
                color: 'var(--primary)', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
              Voltar ao Site
            </button>
            <button onClick={logout} className="btn-logout-student" style={{ border: 'none', background: 'var(--surface-container-low)', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }}>Sair</button>
          </div>
        </header>

        {isScheduling && (
            <div style={STYLES.modalOverlay}>
                <div style={STYLES.modalContent}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                             <h2 style={{ ...STYLES.headerTitle, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Agendar Próxima Etapa</h2>
                             <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Selecione o foco do seu próximo ciclo de desenvolvimento.</p>
                        </div>
                        <button onClick={() => setIsScheduling(false)} style={{ background: 'var(--surface-container-low)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                         <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#735b25', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Selecione o Foco:</label>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {courses.map((c, i) => (
                                <div key={i} onClick={() => setSelectedService(c)} style={{ 
                                    padding: '1.5rem', 
                                    borderRadius: '20px', 
                                    background: selectedService?.id === c.id ? 'var(--primary)' : 'var(--surface-container-low)',
                                    color: selectedService?.id === c.id ? 'white' : 'var(--primary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                    fontWeight: '600',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {selectedService?.id === c.id && <span className="material-symbols-outlined" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '18px' }}>check_circle</span>}
                                    {c.name}
                                </div>
                            ))}
                         </div>
                    </div>

                    <div style={{ opacity: selectedService ? 1 : 0.3, pointerEvents: selectedService ? 'all' : 'none' }}>
                         <CalendarPicker onSelect={handleBooking} />
                    </div>
                </div>
            </div>
        )}

        {nextSession && (
              <div className="next-meeting-card" style={STYLES.nextMeetingCard}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', background: 'rgba(115, 91, 37, 0.05)', borderRadius: '50%' }}></div>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#735b25', marginBottom: '1.5rem' }}>cast_connected</span>
                    <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: "'Noto Serif', serif" }}>Sua Próxima Conexão Estratégica</h4>
                    <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '2.5rem' }}>{nextSession.date} – às {nextSession.time}hs</p>
                    <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="btn-join-meet" style={{ maxWidth: '280px' }}>
                      Entrar no Google Meet
                    </a>
                </div>
              </div>
        )}

        <div className="student-grid-hybrid" style={STYLES.hybridGrid}>
          {/* Main Column: Agenda */}
          <section style={STYLES.contentSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h3 style={STYLES.sectionTitle}> Agenda de Mentorias</h3>
              <button 
                onClick={() => setIsScheduling(true)}
                style={{ background: '#735b25', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Agendar Nova
              </button>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)' }}>Sincronizando compromissos...</div>
            ) : sessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface-container-lowest)', borderRadius: '24px' }}>
                <p style={{ color: 'var(--on-surface-variant)', fontFamily: "'Noto Serif', serif", fontStyle: 'italic' }}>Nenhuma sessão agendada.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {sessions.map((s, i) => (
                  <div key={i} className="session-item-hybrid" style={STYLES.sessionItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '16px', 
                            background: s.status === 'confirmed' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(115, 91, 37, 0.08)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}>
                             <span className="material-symbols-outlined" style={{ fontSize: '24px', color: s.status === 'confirmed' ? '#22c55e' : '#735b25' }}>
                                {s.status === 'confirmed' ? 'verified' : 'hourglass_top'}
                             </span>
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--primary)', fontWeight: '600' }}>{s.serviceTitle}</h4>
                          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                             <span style={{ fontWeight: '600' }}>{s.date}</span>
                             <span>{s.time}hs</span>
                          </div>
                        </div>
                    </div>
                    <div>
                      <span className={`status-pill ${s.status}`} style={{ background: 'var(--surface)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {s.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <JourneyCalendar sessions={sessions} />
          </section>

          {/* Side Column: Evolution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {progress && (
                <section style={STYLES.contentSection}>
                    <h3 style={{ ...STYLES.sectionTitle, marginBottom: '2rem' }}>Pilar de Desenvolvimento</h3>
                    
                    {progress.objective && (
                        <div className="pull-quote-hybrid" style={{ 
                            padding: '1.5rem', 
                            marginBottom: '2rem', 
                            background: 'var(--surface-container-lowest)', 
                            borderRadius: '20px', 
                        }}>
                            <p style={{ margin: 0, fontSize: '1.1rem', fontFamily: "'Noto Serif', serif", fontStyle: 'italic', color: 'var(--primary)', lineHeight: '1.6' }}>
                                "{progress.objective}"
                            </p>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#735b25', fontWeight: 'bold', marginBottom: '1.25rem' }}>Material de Apoio</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {progress.featuredImage ? (
                                <div className="featured-material-card" style={{ 
                                    background: 'var(--surface-container-lowest)', 
                                    borderRadius: '24px', 
                                    overflow: 'hidden',
                                    border: '1px solid var(--outline-variant)'
                                }}>
                                    <img 
                                        src={progress.featuredImage.url} 
                                        alt="Material de Apoio" 
                                        style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} 
                                    />
                                    <div style={{ padding: '1rem', textAlign: 'center' }}>
                                        <a href={progress.featuredImage.url} target="_blank" rel="noreferrer" style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: '800', 
                                            color: '#735b25', 
                                            textDecoration: 'none', 
                                            textTransform: 'uppercase',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_in_new</span>
                                            Visualizar em Tela Cheia
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Sem material visual disponível para esta fase.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#735b25', fontWeight: 'bold', marginBottom: '1.25rem' }}>Tarefas Ativas</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {progress.tasks.length === 0 ? <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Nenhuma tarefa pendente.</p> : progress.tasks.map((task) => (
                                <div key={task.id} style={{ 
                                    background: 'var(--surface-container-lowest)', 
                                    padding: '1.25rem', 
                                    borderRadius: '20px'
                                }}>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer', color: task.status === 'completed' ? '#22c55e' : 'var(--outline-variant)' }}>
                                            <span className="material-symbols-outlined">{task.status === 'completed' ? 'check_circle' : 'circle'}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.title}</p>
                                            {task.feedback && (
                                                <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', fontFamily: "'Noto Serif', serif", fontStyle: 'italic', color: '#735b25', borderTop: '1px solid var(--surface)', paddingTop: '8px' }}>
                                                    {task.feedback}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div style={{ ...STYLES.contentSection, background: 'var(--primary)', color: 'white' }}>
              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: "'Noto Serif', serif" }}>
                <span className="material-symbols-outlined" style={{ color: '#735b25' }}>verified_user</span> Suporte Direto
              </h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '2rem', lineHeight: '1.6' }}>Dúvidas sobre sua implementação ou material? Fale diretamente com Rosana.</p>
              <a href={`https://wa.me/${siteData.contact?.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" 
                 className="btn-support-link" style={{ background: 'white', color: 'var(--primary)', border: 'none', width: '100%' }}>
                Iniciar Conversa <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .btn-join-meet { 
            display: inline-block; 
            background: #735b25; 
            color: white; 
            text-decoration: none; 
            padding: 1rem 2rem; 
            border-radius: 0.375rem;
            font-weight: 700; 
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); 
        }
        .btn-join-meet:hover { background: #8c713d; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(115, 91, 37, 0.2); }

        .session-item-hybrid:hover, .material-link-hybrid:hover { background: var(--surface-container) !important; transform: translateX(8px); }
        
        .btn-support-link { padding: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; transition: all 0.3s; }
        .btn-support-link:hover { transform: translateY(-2px); filter: brightness(0.9); }

        @media (max-width: 992px) {
            .student-grid-hybrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentArea;

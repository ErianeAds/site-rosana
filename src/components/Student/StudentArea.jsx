import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    getStudentMentorships, 
    getSiteContent, 
    getStudentProgress, 
    updateStudentProgress,
    getCourses,
    analyzeSentiment
} from '../../firebase/services';
import CalendarPicker from '../CalendarPicker';
import JourneyCalendar from './JourneyCalendar';
import { format } from 'date-fns';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const StudentArea = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [siteData, setSiteData] = useState({});
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPillar, setCurrentPillar] = useState('Início');
  const [isScheduling, setIsScheduling] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // States for Testimonials
  const [testimonial, setTestimonial] = useState('');
  const [hasSubmittedTestimonial, setHasSubmittedTestimonial] = useState(false);

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

      const progressData = await getStudentProgress(user.uid);
      if (progressData) {
        setProgress(progressData);
        setCurrentPillar(progressData.currentPillar || 'Diagnóstico');
      } else {
          setProgress({
              swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' },
              tasks: [],
              futureVision: '',
              featuredImage: { url: '' }
          });
      }

      // Check if testimonial already exists
      const testQ = query(collection(db, 'testimonials'), where('studentId', '==', user.uid));
      const testSnap = await getDocs(testQ);
      if (!testSnap.empty) {
          setHasSubmittedTestimonial(true);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const toggleTask = async (taskId) => {
    if (!progress?.tasks) return;
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
      if (!selectedService) return;
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
          alert("Reserva solicitada com sucesso!");
          setIsScheduling(false);
          fetchData();
      } catch (e) {
          console.error(e);
      }
  };

  const submitTestimonial = async () => {
      if (!testimonial.trim()) return;
      try {
          // Perform sentiment analysis before saving
          const { sentiment, confidence } = await analyzeSentiment(testimonial);

          await addDoc(collection(db, 'testimonials'), {
              studentId: user.uid,
              studentName: user.displayName,
              studentPhoto: user.photoURL || '',
              content: testimonial,
              status: 'pending', // Waiting for admin approval
              sentiment: sentiment,
              confidence: confidence,
              createdAt: new Date().toISOString()
          });
          setHasSubmittedTestimonial(true);
      } catch (e) {
          console.error("Erro ao enviar depoimento:", e);
          alert("Erro ao enviar seu depoimento. Tente novamente.");
      }
  };

  const STYLES = {
    container: { minHeight: '100vh', background: 'var(--surface)', padding: '2rem' },
    contentSection: { background: 'var(--surface-container-low)', padding: '2.5rem', borderRadius: '32px' },
    sectionTitle: { fontFamily: "'Noto Serif', serif", color: 'var(--primary)', fontWeight: '600' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 28, 48, 0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
    modalContent: { background: 'white', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '32px', padding: '3rem' }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Serif', serif" }}>Sincronizando Jornada...</div>;

  return (
    <div className="student-container" style={STYLES.container}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: '2rem', color: 'var(--primary)', margin: 0 }}>Dê o próximo passo, {user?.displayName?.split(' ')[0]}.</h1>
            <p style={{ color: '#735b25', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '5px' }}>{currentPillar} • Ciclo Estratégico</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.location.hash = ''} 
              className="btn-utility" 
              style={{ 
                background: 'var(--surface-container-low)', 
                color: 'var(--primary)', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>home</span>
              Início
            </button>
            <button onClick={logout} className="btn-utility" style={{ background: 'var(--surface-container-low)', color: '#dc2626', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Sair</button>
          </div>
        </header>

        {/* 1. Banner Cinematográfico (Full Width) */}
        {progress?.featuredImage?.url && (
            <div className="full-width-banner" style={{ borderRadius: '32px', overflow: 'hidden', marginBottom: '2.5rem', aspectRatio: '21/7', border: '1px solid var(--outline-variant)' }}>
                <img src={progress.featuredImage.url} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        )}

        {/* 2. Grid Estratégica */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '2rem', marginBottom: '2.5rem' }}>
            
            {/* SWOT Matrix */}
            <div style={STYLES.contentSection}>
                <h3 style={{ ...STYLES.sectionTitle, marginBottom: '2rem' }}>Diagnóstico Estratégico</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                        { label: 'Pontos Fortes', key: 'strengths', color: '#22c55e', icon: 'diamond' },
                        { label: 'Desafios', key: 'weaknesses', color: '#dc2626', icon: 'bolt' },
                        { label: 'Oportunidades', key: 'opportunities', color: '#3b82f6', icon: 'explore' },
                        { label: 'Riscos', key: 'threats', color: '#f59e0b', icon: 'priority_high' }
                    ].map(item => (
                        <div key={item.key} style={{ background: 'var(--surface-container-lowest)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--outline-variant)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: item.color, marginBottom: '8px', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.6', fontWeight: '500' }}>{progress?.swot?.[item.key] || '—'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Connection */}
            <div style={{ background: 'var(--primary)', borderRadius: '32px', padding: '2.5rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', opacity: 0.1 }}>hub</span>
                <h4 style={{ fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>Sua Próxima Conexão Estratégica</h4>
                {sessions.filter(s => s.status === 'confirmed').length > 0 ? (
                    <>
                        <h4 style={{ fontSize: '1.6rem', margin: '0 0 10px 0' }}>{sessions.find(s => s.status === 'confirmed').serviceTitle}</h4>
                        <p style={{ margin: 0, opacity: 0.8 }}>{sessions.find(s => s.status === 'confirmed').date} às {sessions.find(s => s.status === 'confirmed').time}hs</p>
                        <button style={{ marginTop: '2.5rem', background: '#735b25', color: 'white', border: 'none', padding: '15px', borderRadius: '16px', fontWeight: 'bold' }}>Entrar na Sala</button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                         <p style={{ opacity: 0.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>Nenhuma sessão agendada.</p>
                         <button onClick={() => setIsScheduling(true)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '100px', fontWeight: 'bold' }}>Agendar Agora</button>
                    </div>
                )}
            </div>
        </div>

        {/* 3. Coluna de Agenda e Ação (Invertidas) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
            <div style={STYLES.contentSection}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="material-symbols-outlined">calendar_month</span>
                    Agenda de Jornada
                </h4>
                <JourneyCalendar sessions={sessions} />
            </div>

            <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--surface-container-low) 0%, var(--surface-container-lowest) 100%)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--outline-variant)' }}>
                    <h4 style={{ fontSize: '0.65rem', color: '#735b25', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem' }}>Sua Visão de Futuro</h4>
                    <p style={{ margin: 0, fontStyle: 'italic', fontSize: '1.1rem', fontFamily: "'Noto Serif', serif", lineHeight: '1.6' }}>"{progress?.futureVision || 'Construindo o amanhã...'}"</p>
                </div>

                <div style={STYLES.contentSection}>
                    <h4 style={{ fontSize: '0.75rem', color: '#735b25', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Checklist</h4>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {progress?.tasks?.map(task => (
                            <div key={task.id} style={{ background: 'var(--surface-container-lowest)', padding: '1rem', borderRadius: '20px', border: '1px solid var(--outline-variant)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span className="material-symbols-outlined" onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer', color: task.status === 'completed' ? '#22c55e' : '#ccc', fontSize: '20px' }}>
                                    {task.status === 'completed' ? 'check_circle' : 'circle'}
                                </span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '500', textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.5 : 1 }}>{task.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>

        {/* Seção de Depoimento (Vozes de Sucesso) */}
        <div style={{ marginTop: '3rem', padding: '3rem', background: 'var(--surface-container-lowest)', borderRadius: '40px', border: '1px solid var(--outline-variant)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', top: '2rem', left: '2rem', fontSize: '4rem', opacity: 0.03 }}>format_quote</span>
            
            {!hasSubmittedTestimonial ? (
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h3 style={{ ...STYLES.sectionTitle, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Deixe sua Marca na Jornada</h3>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', marginBottom: '2rem' }}>Sua evolução é nossa maior conquista. Como tem sido sua experiência até aqui?</p>
                    
                    <textarea 
                        value={testimonial}
                        onChange={(e) => setTestimonial(e.target.value)}
                        placeholder="Escreva seu depoimento aqui..."
                        style={{ 
                            width: '100%', 
                            minHeight: '150px', 
                            padding: '1.5rem', 
                            borderRadius: '24px', 
                            background: 'var(--surface)', 
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--primary)',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            resize: 'none',
                            marginBottom: '1.5rem'
                        }}
                    />
                    
                    <button 
                        onClick={submitTestimonial}
                        disabled={!testimonial.trim()}
                        className="btn-premium-action" 
                        style={{ padding: '15px 40px', borderRadius: '100px', fontSize: '0.85rem', opacity: testimonial.trim() ? 1 : 0.5 }}
                    >
                        Enviar Depoimento
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                    </button>
                </div>
            ) : (
                <div style={{ padding: '2rem', animation: 'fadeIn 0.8s ease' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>check_circle</span>
                    </div>
                    <h3 style={{ ...STYLES.sectionTitle, fontSize: '1.5rem', marginBottom: '1rem' }}>Gratidão por Compartilhar!</h3>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                        Recebemos seu depoimento com muito carinho. Sua história de sucesso inspira novos caminhos e em breve poderá ser destaque em nossas <strong>Vozes de Sucesso</strong>.
                    </p>
                </div>
            )}
        </div>

        {/* Scheduling Modal */}
        {isScheduling && (
            <div style={STYLES.modalOverlay}>
                <div style={STYLES.modalContent}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontFamily: "'Noto Serif', serif", margin: 0 }}>Agendar Nova Conexão</h2>
                        <button onClick={() => setIsScheduling(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                        {courses.map(c => (
                            <div key={c.id} onClick={() => setSelectedService(c)} style={{ padding: '1.5rem', borderRadius: '20px', background: selectedService?.id === c.id ? 'var(--primary)' : 'var(--surface-container-low)', color: selectedService?.id === c.id ? 'white' : 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>{c.name}</div>
                        ))}
                    </div>
                    <CalendarPicker onSelect={handleBooking} />
                </div>
            </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
            div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
            .full-width-banner { aspect-ratio: 16/9 !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentArea;

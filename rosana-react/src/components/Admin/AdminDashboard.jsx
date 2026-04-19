import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getCourses, updateCourse, addCourse, deleteCourse,
  getSiteContent, updateSiteSection, getMentorships
} from '../../firebase/services';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('agenda');
  const [courses, setCourses] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [siteContent, setSiteContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = useCallback(async (type) => {
    setLoading(true);
    try {
      if (type === 'agenda' || type === 'students') {
        const data = await getMentorships();
        setMentorships(data || []);
      }
      if (type === 'content') {
        const data = await getCourses();
        setCourses(data || []);
      }
      if (type === 'brand') {
        const data = await getSiteContent();
        setSiteContent(data || {});
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Erro ao sincronizar dados.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'mentorships', id), { status: newStatus });
      setMessage({ type: 'success', text: 'Status atualizado!' });
      fetchData('agenda');
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (e) {
      setMessage({ type: 'error', text: 'Erro ao mudar status.' });
    }
  };

  const handleSaveSection = async (sectionId) => {
    try {
      await updateSiteSection(sectionId, siteContent[sectionId]);
      setMessage({ type: 'success', text: 'Informações salvas!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) { setMessage({ type: 'error', text: 'Erro ao salvar.' }); }
  };

  const formatCurrency = (value) => {
    const clean = value.replace(/\D/g, "");
    return clean ? new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(parseFloat(clean) / 100) : "R$ 0,00";
  };

  const menuItems = [
    { id: 'agenda', label: 'Agenda & Sessões', icon: 'auto_schedule' },
    { id: 'brand', label: 'Design & Automação', icon: 'auto_awesome' },
    { id: 'content', label: 'Produtos & Pagamentos', icon: 'payments' },
    { id: 'students', label: 'Base de Alunos', icon: 'groups' }
  ];

  return (
    <div className="admin-container" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#001e40' }}>
      <aside style={{ width: '300px', background: '#001e40', color: 'white', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Noto Serif', fontStyle: 'italic', fontSize: '1.8rem', color: '#fddc99', margin: 0 }}>Rosana Brito</h2>
        </div>
        <nav style={{ flex: 1, padding: '0 1rem' }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: '100%', padding: '1.2rem 1.5rem', marginBottom: '0.8rem', border: 'none', borderRadius: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s',
              background: activeTab === item.id ? 'rgba(253, 220, 153, 0.15)' : 'transparent',
              color: activeTab === item.id ? '#fddc99' : 'rgba(255,255,255,0.7)'
            }}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: '2rem' }}>
          <button onClick={logout} className="btn-logout" style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: 'rgba(255,100,100,0.1)', color: '#ff6b6b', border: 'none' }}>Sair</button>
        </div>
      </aside>

      <main style={{ marginLeft: '300px', flex: 1, padding: '3rem 4rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Noto Serif' }}>{menuItems.find(m => m.id === activeTab)?.label}</h1>
          <button onClick={() => fetchData(activeTab)} className="refresh-btn"><span className="material-symbols-outlined">sync</span></button>
        </header>

        {message.text && (
          <div style={{ padding: '1rem 1.5rem', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b', borderRadius: '12px', marginBottom: '2rem' }}>
            {message.text}
          </div>
        )}

        <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 80px rgba(0,30,64,0.02)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>Buscando dados...</div>
          ) : activeTab === 'agenda' ? (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
              <thead><tr style={{ textAlign: 'left', color: '#64748b' }}><th>ALUNO</th><th>SERVIÇO</th><th>DATA</th><th>STATUS</th></tr></thead>
              <tbody>
                {mentorships.map((m, i) => (
                  <tr key={i} style={{ background: '#f8fafc' }}>
                    <td style={{ padding: '1.2rem', fontWeight: 600 }}>{m.studentName}</td>
                    <td style={{ padding: '1.2rem' }}>{m.serviceTitle}</td>
                    <td style={{ padding: '1.2rem' }}>{m.date} - {m.time}hs</td>
                    <td style={{ padding: '1.2rem' }}>
                      <select value={m.status || 'pending'} onChange={(e) => handleUpdateStatus(m.id, e.target.value)} style={{ padding: '0.4rem', borderRadius: '8px' }}>
                        <option value="pending_payment">Aguard. Pagamento</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="completed">Realizada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTab === 'brand' ? (
            <div style={{ display: 'grid', gap: '3rem' }}>
              <section style={{ background: '#f8f9ff', padding: '2rem', borderRadius: '16px', border: '1px solid #e1e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Noto Serif', margin: 0 }}>Canais & Automação</h3>
                  <button onClick={() => handleSaveSection('contact')} className="btn btn-secondary">Gravar Automação</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div className="form-group"><label>E-mail Corporativo</label><input type="email" value={siteContent.contact?.email} onChange={e => setSiteContent({...siteContent, contact: {...siteContent.contact, email: e.target.value}})} /></div>
                  <div className="form-group"><label>WhatsApp</label><input type="text" value={siteContent.contact?.whatsapp} onChange={e => setSiteContent({...siteContent, contact: {...siteContent.contact, whatsapp: e.target.value}})} /></div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Link Permanente de Reunião (Google Meet / Teams)</label>
                    <input type="text" value={siteContent.contact?.meetingLink} onChange={e => setSiteContent({...siteContent, contact: {...siteContent.contact, meetingLink: e.target.value}})} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
                  </div>
                </div>
              </section>
              <section>
                 <h3 style={{ fontFamily: 'Noto Serif' }}>Design do Site</h3>
                 <p style={{ opacity: 0.6 }}>O gerenciamento visual (Hero/About) está ativo no banco de dados.</p>
              </section>
            </div>
          ) : activeTab === 'students' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
              {[...new Set(mentorships.map(m => m.studentEmail))].map(email => {
                const s = mentorships.find(m => m.studentEmail === email);
                return (
                  <div key={email} style={{ padding: '2rem', background: '#f8fafc', borderRadius: '24px', textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', background: '#001e40', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 'bold' }}>{s.studentName[0]}</div>
                    <h4 style={{ margin: 0 }}>{s.studentName}</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{email}</p>
                  </div>
                )
              })}
            </div>
          ) : activeTab === 'content' ? (
            <div style={{ display: 'grid', gap: '2rem' }}>
              <button onClick={() => setCourses([{ id: `temp_${Date.now()}`, name: 'Novo Plano', price: 'R$ 0,00', desc: '', duration: 'Sessão Única', paymentLink: '' }, ...courses])} className="btn-add-product">+ Novo Serviço Exclusivo</button>
              {courses.map(c => (
                <div key={c.id} className="course-card-admin">
                  <div className="form-group"><label>Nome do Serviço</label><input type="text" value={c.name} onChange={e => setCourses(courses.map(p => p.id === c.id ? {...p, name: e.target.value} : p))} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                    <div className="form-group"><label>Valor (R$)</label><input type="text" value={c.price} onChange={e => setCourses(courses.map(p => p.id === c.id ? {...p, price: formatCurrency(e.target.value)} : p))} /></div>
                    <div className="form-group"><label>Duração</label><input type="text" value={c.duration} onChange={e => setCourses(courses.map(p => p.id === c.id ? {...p, duration: e.target.value} : p))} /></div>
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Link de Pagamento ou Chave PIX</label>
                    <input type="text" value={c.paymentLink || ''} onChange={e => setCourses(courses.map(p => p.id === c.id ? {...p, paymentLink: e.target.value} : p))} placeholder="https://buy.stripe.com/..." />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button onClick={() => updateCourse(c.id, c)} className="btn btn-secondary">Salvar Plano</button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </main>
      <style>{`.refresh-btn { background: white; border: 1px solid #e2e8f0; padding: 0.8rem; borderRadius: 50%; cursor: pointer; } .course-card-admin { background: #f8fafc; padding: 2rem; border-radius: 20px; border: 1px solid #e2e8f0; } .btn-add-product { background: #001e40; color: white; padding: 1.5rem; border-radius: 12px; border: none; cursor: pointer; font-weight: bold; }`}</style>
    </div>
  );
};

export default AdminDashboard;

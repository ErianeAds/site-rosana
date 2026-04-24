import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

const TestimonialManager = ({ notify }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setTestimonials(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
      notify('error', 'Erro ao carregar depoimentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const toggleStatus = async (item) => {
    const newStatus = item.status === 'approved' ? 'pending' : 'approved';
    try {
      await updateDoc(doc(db, 'testimonials', item.id), { status: newStatus });
      notify('success', `Depoimento ${newStatus === 'approved' ? 'aprovado' : 'retornado para pendente'}.`);
      fetchTestimonials();
    } catch (e) {
      notify('error', 'Erro ao atualizar status.');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Excluir permanentemente este depoimento?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      notify('success', 'Depoimento excluído.');
      fetchTestimonials();
    } catch (e) {
      notify('error', 'Erro ao excluir.');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando depoimentos...</div>;

  return (
    <div className="testimonial-manager-wrapper">
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {testimonials.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5, padding: '3rem' }}>Nenhum depoimento recebido ainda.</p>
        ) : (
          testimonials.map(item => (
            <div key={item.id} style={{ 
                background: 'var(--surface-container-low)', 
                padding: '2rem', 
                borderRadius: '24px', 
                border: '1px solid var(--outline-variant)',
                position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {item.studentName?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.studentName}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ 
                            fontSize: '0.65rem', 
                            padding: '4px 10px', 
                            borderRadius: '100px', 
                            background: item.status === 'approved' ? '#dcfce7' : '#fef9c3',
                            color: item.status === 'approved' ? '#166534' : '#854d0e',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            {item.status === 'approved' ? 'Aprovado (Visível)' : 'Pendente de Aprovação'}
                        </span>
                        
                        {item.sentiment && (
                            <span style={{ 
                                fontSize: '0.65rem', 
                                padding: '4px 10px', 
                                borderRadius: '100px', 
                                background: item.sentiment.toLowerCase() === 'positive' ? '#ecfdf5' : item.sentiment.toLowerCase() === 'negative' ? '#fef2f2' : '#f3f4f6',
                                color: item.sentiment.toLowerCase() === 'positive' ? '#059669' : item.sentiment.toLowerCase() === 'negative' ? '#dc2626' : '#6b7280',
                                fontWeight: 'bold',
                                border: '1px solid currentColor',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                                    {item.sentiment.toLowerCase() === 'positive' ? 'mood' : item.sentiment.toLowerCase() === 'negative' ? 'mood_bad' : 'help'}
                                </span>
                                {item.sentiment === 'pending_analysis' ? 'Análise Pendente' : item.sentiment}
                                {item.confidence > 0 && ` (${Math.round(item.confidence * 100)}%)`}
                            </span>
                        )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => toggleStatus(item)}
                        style={{ 
                            background: item.status === 'approved' ? 'var(--surface-container-highest)' : 'var(--primary)', 
                            color: item.status === 'approved' ? 'var(--primary)' : 'white',
                            border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        {item.status === 'approved' ? 'Ocultar' : 'Aprovar para o Site'}
                    </button>
                    <button 
                        onClick={() => deleteItem(item.id)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--primary)', lineHeight: '1.6', fontStyle: 'italic', background: 'var(--surface-container-lowest)', padding: '1.5rem', borderRadius: '16px' }}>
                "{item.content}"
              </p>
              <p style={{ margin: '15px 0 0 0', fontSize: '0.7rem', opacity: 0.4 }}>Enviado em: {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialManager;

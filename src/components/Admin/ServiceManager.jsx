import React, { useState, useEffect } from 'react';
import { updateCourse, deleteCourse, addCourse } from '../../firebase/services';

const ServiceManager = ({ courses, onUpdate, notify }) => {
  // Sincronizar estado local quando os props mudarem
  const [localCourses, setLocalCourses] = useState(courses);

  useEffect(() => {
    setLocalCourses(courses);
  }, [courses]);

  const formatCurrency = (value) => {
    const clean = String(value).replace(/\D/g, "");
    return clean ? new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(parseFloat(clean) / 100) : "R$ 0,00";
  };

  const handleFieldChange = (id, field, value) => {
    setLocalCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const saveService = async (course) => {
    try {
      if (typeof course.id === 'string' && course.id.startsWith('new_')) {
          const { id, ...data } = course;
          await addCourse(data);
      } else {
          await updateCourse(course.id, course);
      }
      notify('success', 'Portfólio atualizado com sucesso.');
      onUpdate();
    } catch (e) {
      console.error("Erro ao salvar:", e);
      notify('error', 'Erro ao salvar alterações.');
    }
  };

  const handleDelete = async (id) => {
    console.log("Tentando excluir serviço ID:", id);
    if (!window.confirm('Tem certeza que deseja excluir esta mentoria? Esta ação não pode ser desfeita.')) return;
    
    try {
      if (typeof id === 'string' && id.startsWith('new_')) {
        // Se for um item novo ainda não salvo no Firebase, apenas remove da tela
        setLocalCourses(prev => prev.filter(c => c.id !== id));
        notify('success', 'Rascunho removido.');
      } else {
        // Se já existir no banco, deleta via serviço
        await deleteCourse(id);
        notify('success', 'Serviço removido com sucesso.');
        onUpdate();
      }
    } catch (e) {
      console.error("Erro ao excluir do Firebase:", e);
      notify('error', 'Erro ao excluir serviço do banco de dados.');
    }
  };

  return (
    <div className="services-grid-wrapper">
      <style>{`
        .btn-delete-premium:hover {
            background: #fdf2f2 !important;
            color: #dc2626 !important;
            border-color: #fee2e2 !important;
            transform: scale(1.08);
            box-shadow: 0 6px 15px rgba(220, 38, 38, 0.1);
        }
        .service-refinement-card {
            transition: all 0.3s ease;
        }
      `}</style>

      <div className="grid-header-actions" style={{ marginBottom: '2rem' }}>
        <button className="btn-premium-action" onClick={() => setLocalCourses([{ id: `new_${Date.now()}`, name: 'Nova Mentoria', price: 'R$ 0,00', duration: '60 min', paymentLink: '', description: '' }, ...localCourses])}>
          <span className="material-symbols-outlined">add</span>
          Novo Plano de Mentoria
        </button>
      </div>

      <div className="services-layers" style={{ display: 'grid', gap: '2rem' }}>
        {localCourses.map(c => (
          <div key={c.id} className="service-refinement-card" style={{ 
            background: 'var(--surface-container-low)', 
            padding: '2.5rem', 
            borderRadius: '32px', 
            border: '1px solid var(--outline-variant)' 
          }}>
            <div className="card-top-header" style={{ marginBottom: '1.5rem' }}>
               <input 
                 type="text" 
                 value={c.name} 
                 className="input-transparent-h3"
                 style={{ 
                    width: '100%', 
                    border: 'none', 
                    background: 'transparent', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: 'var(--primary)',
                    fontFamily: "'Noto Serif', serif" 
                 }}
                 onChange={e => handleFieldChange(c.id, 'name', e.target.value)} 
               />
            </div>
            
            <div className="field-duo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="input-group-layered">
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#735b25', fontWeight: 'bold' }}>Valor Comercial</label>
                <input 
                  type="text" 
                  value={c.price} 
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--outline-variant)', marginTop: '8px' }}
                  onChange={e => handleFieldChange(c.id, 'price', formatCurrency(e.target.value))} 
                />
              </div>
              <div className="input-group-layered">
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#735b25', fontWeight: 'bold' }}>Duração Sugerida</label>
                <input 
                  type="text" 
                  value={c.duration} 
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--outline-variant)', marginTop: '8px' }}
                  onChange={e => handleFieldChange(c.id, 'duration', e.target.value)} 
                />
              </div>
            </div>

            <div className="input-group-layered full-width" style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#735b25', fontWeight: 'bold' }}>Descrição do Plano</label>
              <textarea 
                value={c.description || ''} 
                onChange={e => handleFieldChange(c.id, 'description', e.target.value)}
                placeholder="Descreva o que está incluso nesta mentoria..."
                style={{ 
                    width: '100%', 
                    minHeight: '120px', 
                    borderRadius: '16px', 
                    padding: '16px', 
                    background: 'var(--surface-container-highest)', 
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    marginTop: '8px',
                    resize: 'none'
                }}
              />
            </div>

            <div className="input-group-layered full-width" style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#735b25', fontWeight: 'bold' }}>Link de Pagamento / Checkout</label>
              <input 
                type="text" 
                value={c.paymentLink || ''} 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--outline-variant)', marginTop: '8px' }}
                onChange={e => handleFieldChange(c.id, 'paymentLink', e.target.value)} 
                placeholder="Link do Stripe / Mercado Pago"
              />
            </div>

            <div className="card-footer-actions" style={{ 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'center' 
            }}>
              <button 
                className="btn-soft-shadow" 
                onClick={() => saveService(c)} 
                style={{ 
                    flex: 1, 
                    padding: '14px', 
                    borderRadius: '16px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    border: 'none', 
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
              >
                Gravar Ativos do Plano
              </button>
              
              <button 
                type="button"
                title="Remover serviço"
                className="btn-delete-premium"
                onClick={() => handleDelete(c.id)} 
                style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '16px', 
                    background: 'var(--surface-container-highest)', 
                    border: '1px solid var(--outline-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--on-surface-variant)',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>delete_sweep</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManager;

import React, { useState } from 'react';
import { updateCourse } from '../../firebase/services';

const ServiceManager = ({ courses, onUpdate, notify }) => {
  const [localCourses, setLocalCourses] = useState(courses);

  const formatCurrency = (value) => {
    const clean = String(value).replace(/\D/g, "");
    return clean ? new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(parseFloat(clean) / 100) : "R$ 0,00";
  };

  const handleFieldChange = (id, field, value) => {
    setLocalCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const saveService = async (course) => {
    try {
      await updateCourse(course.id, course);
      notify('success', 'Portfólio atualizado com sucesso.');
      onUpdate();
    } catch (e) {
      notify('error', 'Erro ao salvar alterações.');
    }
  };

  return (
    <div className="services-grid-wrapper">
      <div className="grid-header-actions">
        <button className="btn-premium-action" onClick={() => setLocalCourses([{ id: `new_${Date.now()}`, name: 'Nova Mentoria', price: 'R$ 0,00', duration: '60 min', paymentLink: '' }, ...localCourses])}>
          <span className="material-symbols-outlined">add</span>
          Novo Plano de Mentoria
        </button>
      </div>

      <div className="services-layers">
        {localCourses.map(c => (
          <div key={c.id} className="service-refinement-card">
            <div className="card-top-header">
               <input 
                 type="text" 
                 value={c.name} 
                 className="input-transparent-h3"
                 onChange={e => handleFieldChange(c.id, 'name', e.target.value)} 
               />
            </div>
            
            <div className="field-duo">
              <div className="input-group-layered">
                <label>Valor Comercial</label>
                <input 
                  type="text" 
                  value={c.price} 
                  onChange={e => handleFieldChange(c.id, 'price', formatCurrency(e.target.value))} 
                />
              </div>
              <div className="input-group-layered">
                <label>Duração Sugerida</label>
                <input 
                  type="text" 
                  value={c.duration} 
                  onChange={e => handleFieldChange(c.id, 'duration', e.target.value)} 
                />
              </div>
            </div>

            <div className="input-group-layered full-width">
              <label>Gateway de Pagamento / Chave Checkout</label>
              <input 
                type="text" 
                value={c.paymentLink || ''} 
                onChange={e => handleFieldChange(c.id, 'paymentLink', e.target.value)} 
                placeholder="Link do Stripe / Mercado Pago"
              />
            </div>

            <div className="card-footer-actions">
              <button className="btn-soft-shadow" onClick={() => saveService(c)}>
                Gravar Ativos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManager;

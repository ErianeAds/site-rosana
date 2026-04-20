import { useState, useEffect } from 'react';
import CalendarPicker from './CalendarPicker';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { getSiteContent } from '../firebase/services';

const Contact = ({ selectedPackage, onPayment }) => {
  const { user } = useAuth();
  const [formStatus, setFormStatus] = useState('idle');
  const [contacts, setContacts] = useState({ email: 'contato@rosanabrito.com.br', whatsapp: '5511995101551' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    selectedService: 'Solicitação de Contato',
    appointmentDate: null,
    appointmentTime: ''
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getSiteContent();
        if (data.contact) setContacts(data.contact);
      } catch (e) { console.error(e); }
    };
    fetchContacts();

    if (selectedPackage) {
      setFormData(prev => ({ 
        ...prev, 
        selectedService: selectedPackage.name || selectedPackage.title,
        name: user?.displayName || prev.name,
        email: user?.email || prev.email
      }));
    }
  }, [selectedPackage, user]);

  const formatPhone = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length <= 2) return value;
    if (value.length <= 6) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length <= 10) return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPackage && (!formData.appointmentDate || !formData.appointmentTime)) {
      alert("Por favor, selecione uma data.");
      return;
    }
    setFormStatus('loading');
    try {
      const mentorshipData = {
        studentId: user?.uid || 'guest',
        studentName: formData.name,
        studentEmail: formData.email,
        studentPhone: formData.phone,
        serviceId: selectedPackage?.id || 'general_contact',
        serviceTitle: formData.selectedService,
        date: formData.appointmentDate ? format(formData.appointmentDate, 'dd/MM/yyyy') : 'A definir',
        time: formData.appointmentTime || 'A definir',
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
        message: formData.message,
        price: selectedPackage?.price || 'Sessão Única'
      };
      await addDoc(collection(db, 'mentorships'), mentorshipData);
      setFormStatus('success');
      
      if (selectedPackage?.paymentLink && selectedPackage.paymentLink.startsWith('http')) {
        setTimeout(() => {
          window.location.href = selectedPackage.paymentLink;
        }, 4000);
      }
    } catch (error) {
      console.error(error);
      setFormStatus('idle');
    }
  };

  const isPix = selectedPackage?.paymentLink && !selectedPackage.paymentLink.startsWith('http');

  return (
    <section id="contact" className="contact-section">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {formStatus === 'success' ? (
          <div className="checkout-success-card" style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 80px rgba(0,0,0,0.05)' }}>
            <div className="icon-success" style={{ width: '80px', height: '80px', background: '#e6fff1', color: '#008a3e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>check_circle</span>
            </div>
            <h2 style={{ fontFamily: 'Noto Serif', marginBottom: '1rem' }}>Sessão Reservada!</h2>
            <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>O link da sua reunião no Google Meet foi enviado para seu e-mail corporativo. Por favor, verifique sua caixa de entrada.</p>
            
            <div className="payment-action-box" style={{ padding: '2rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e1e8f0' }}>
              {isPix ? (
                <div className="pix-box">
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Pague via PIX</p>
                  <div style={{ padding: '1rem', background: 'white', border: '2px dashed #bf9b30', color: '#bf9b30', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '12px', marginBottom: '1rem' }}>
                    {selectedPackage.paymentLink}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Após o pagamento, sua sessão será confirmada automaticamente.</p>
                </div>
              ) : selectedPackage?.paymentLink ? (
                <div>
                  <p style={{ marginBottom: '1.5rem' }}>Você está sendo redirecionado para o pagamento seguro...</p>
                  <a href={selectedPackage.paymentLink} className="btn btn-secondary" style={{ width: '100%', padding: '1.2rem' }}>Pagar Agora</a>
                </div>
              ) : (
                <p>Nossa equipe entrará em contato com os detalhes do pagamento.</p>
              )}
            </div>
            
            <button onClick={() => setFormStatus('idle')} className="btn btn-tertiary" style={{ marginTop: '2rem' }}>Voltar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="premium-form-card" style={{ background: 'white', padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 80px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontFamily: 'Noto Serif', marginBottom: '2rem', textAlign: 'center' }}>Detalhes do Agendamento</h2>
            
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  style={{ background: user ? 'var(--surface-container-low)' : 'white' }}
                  readOnly={!!user && user.displayName}
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Corporativo</label>
                <input 
                  type="text" 
                  required 
                  value={formData.phone} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "");
                    setFormData({...formData, phone: formatPhone(val)});
                  }} 
                  placeholder="(00) 00000-0000" 
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>E-mail de Trabalho</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                style={{ background: user ? 'var(--surface-container-low)' : 'white' }}
                readOnly={!!user}
              />
            </div>

            {selectedPackage && (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1.25rem 2rem', background: '#0b1c30', borderRadius: '16px', color: 'white' }}>
                   <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6, display: 'block' }}>Mentoria Selecionada</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', fontFamily: "'Noto Serif', serif" }}>{selectedPackage.name}</span>
                   </div>
                   <span style={{ color: '#735b25', fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedPackage.price}</span>
                </div>
                
                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(115, 91, 37, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#735b25', fontSize: '20px' }}>auto_awesome</span>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#735b25', fontWeight: '600' }}>Sua jornada será documentada no seu Roadmap de Evolução exclusivo.</p>
                </div>

                <CalendarPicker onSelect={({date, time}) => setFormData(prev => ({...prev, appointmentDate: date, appointmentTime: time}))} />
              </div>
            )}

            {!selectedPackage && <textarea rows="4" placeholder="Como podemos ajudar?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e1e8f0', marginBottom: '1.5rem' }} />}

            <button type="submit" className="btn btn-secondary" disabled={formStatus === 'loading'} style={{ width: '100%', padding: '1.25rem', marginTop: '2rem', fontSize: '1.1rem' }}>
              {formStatus === 'loading' ? 'Processando...' : 'Confirmar e Reservar'}
            </button>
          </form>
        )}
      </div>
      <style>{`
        .contact-section { padding: 80px 2rem; background: #fbfbfd; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </section>
  );
};

export default Contact;

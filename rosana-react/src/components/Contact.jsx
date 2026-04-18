import { useState, useEffect } from 'react';

const Contact = ({ selectedPackage, onPayment }) => {
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: '',
    selectedService: ''
  });

  // Pre-fill service if selected from the services section
  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({ ...prev, selectedService: selectedPackage.title }));
    }
  }, [selectedPackage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('loading');
    
    // Simulating API call for form submission
    setTimeout(() => {
      // If a package is selected, proceed to payment
      if (selectedPackage && selectedPackage.id !== 'c-suite-advisory') {
        onPayment(selectedPackage.id);
      }
      
      setFormStatus('success');
      setFormData({ name: '', email: '', role: '', message: '', selectedService: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" style={{ padding: '80px 2rem' }}>
      <div className="grid-two">
        <div>
          <h2 style={{ marginBottom: '2rem' }}>Pronta para o próximo passo?</h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem', marginBottom: '3rem' }}>Preencha o formulário para agendarmos uma sessão inicial de diagnóstico ou entre em contato pelos canais oficiais.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--secondary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '20px' }}>mail</span>
              </div>
              <a href="mailto:eriane.adsfecap@gmail.com" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>eriane.adsfecap@gmail.com</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--secondary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '20px' }}>call</span>
              </div>
              <a href="tel:+5511916911215" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>+55 (11) 91691-1215</a>
            </div>
          </div>
        </div>
        <div className="form-container">
          {formStatus === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--secondary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '40px' }}>check_circle</span>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Mensagem Enviada!</h3>
              <p style={{ color: 'var(--on-surface-variant)' }}>Rosana entrará em contato em breve para agendarmos sua sessão.</p>
              <button onClick={() => setFormStatus('idle')} className="btn btn-tertiary" style={{ marginTop: '2rem' }}>Enviar outra mensagem</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Ana Silva" 
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ana@empresa.com" 
                />
              </div>
              <div className="form-group">
                <label>Serviço de Interesse</label>
                <input 
                  type="text" 
                  name="selectedService"
                  value={formData.selectedService}
                  onChange={handleChange}
                  placeholder="Selecione um plano acima ou descreva aqui" 
                  readOnly={!!selectedPackage}
                  style={selectedPackage ? { borderBottomColor: 'var(--secondary)', fontWeight: 600 } : {}}
                />
              </div>
              <div className="form-group">
                <label>Como posso ajudar?</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Descreva seu desafio profissional..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-secondary" 
                disabled={formStatus === 'loading'}
                style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
              >
                {formStatus === 'loading' ? 'Processando...' : 
                 selectedPackage && selectedPackage.id !== 'c-suite-advisory' ? 'Confirmar e Pagar' : 'Solicitar Contato'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;

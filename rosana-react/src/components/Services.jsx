import { useState } from 'react';

const Services = ({ onSelectPackage }) => {
  const [activeTab, setActiveTab] = useState('Gestão & Liderança');

  const departments = [
    {
      name: 'Gestão & Liderança',
      packages: [
        {
          id: 'high-performance-coaching',
          title: 'High-Performance Coaching',
          price: 'R$ 950,00',
          period: 'Sessão Única',
          desc: 'Desenvolvimento de competências comportamentais e inteligência emocional para líderes.',
          cta: 'Contratar e Agendar'
        }
      ]
    },
    {
      name: 'Estratégia de Carreira',
      packages: [
        {
          id: 'executive-discovery',
          title: 'Executive Discovery Session',
          price: 'R$ 850,00',
          period: 'Sessão Única',
          desc: 'Diagnóstico profundo e roadmap de clareza estratégica para seu momento atual.',
          cta: 'Iniciar Jornada'
        },
        {
          id: 'strategic-leadership-path',
          title: 'Strategic Leadership Path',
          price: 'R$ 6.200,00',
          period: 'Ciclo de 3 meses',
          desc: 'Programa estruturado nos pilares: Diagnóstico, Planejamento, Execução e Follow-up.',
          cta: 'Iniciar Jornada'
        }
      ]
    },
    {
      name: 'Corporate Advisory',
      packages: [
        {
          id: 'c-suite-advisory',
          title: 'C-Suite Advisory',
          price: 'Sob Consulta',
          period: '',
          desc: 'Assessoria exclusiva para transições complexas, governança e decisões estratégicas de alto impacto.',
          cta: 'Solicitar Reunião Privada'
        }
      ]
    }
  ];

  return (
    <section id="services" style={{ padding: '80px 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="label-md">Serviços & Assessoria</span>
        <h2 style={{ marginTop: '1rem' }}>Sua Ascensão Estratégica</h2>
      </div>

      <div className="tabs-nav">
        {departments.map((dept) => (
          <button
            key={dept.name}
            className={`tab-btn ${activeTab === dept.name ? 'active' : ''}`}
            onClick={() => setActiveTab(dept.name)}
          >
            {dept.name}
          </button>
        ))}
      </div>

      <div className="services-grid" style={{ minHeight: '450px' }}>
        {departments
          .find((d) => d.name === activeTab)
          ?.packages.map((pkg) => (
            <div key={pkg.id} className="card-elite">
              <span className="price-tag">
                {pkg.price}
                {pkg.period && <small>({pkg.period})</small>}
              </span>
              <h3 style={{ marginBottom: '1rem', fontFamily: 'Noto Serif' }}>{pkg.title}</h3>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2.5rem', flexGrow: 1 }}>
                {pkg.desc}
              </p>
              <button 
                onClick={() => onSelectPackage(pkg)} 
                className="btn btn-secondary"
                style={{ width: '100%', padding: '1rem' }}
              >
                {pkg.cta}
              </button>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Services;

import { useState, useEffect } from 'react';
import { getCourses } from '../firebase/services';

const Services = ({ onSelectPackage }) => {
  const [activeTab, setActiveTab] = useState('Todas');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };
    fetchCoursesData();
  }, []);

  return (
    <section id="services" style={{ padding: '80px 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="label-md">Serviços & Assessoria</span>
        <h2 style={{ marginTop: '1rem' }}>Sua Ascensão Estratégica</h2>
      </div>

      <div className="services-grid" style={{ minHeight: '450px' }}>
        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%', color: '#737780' }}>Carregando portfólio...</div>
        ) : (
          courses.map((pkg) => (
            <div key={pkg.id} className="card-elite">
              <span className="price-tag">
                {pkg.price}
                {pkg.duration && <small>({pkg.duration})</small>}
              </span>
              <h3 style={{ marginBottom: '1rem', fontFamily: 'Noto Serif' }}>{pkg.name}</h3>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2.5rem', flexGrow: 1 }}>
                {pkg.desc}
              </p>
              <button 
                onClick={() => onSelectPackage(pkg)} 
                className="btn btn-secondary"
                style={{ width: '100%', padding: '1rem' }}
              >
                Contratar e Agendar
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Services;

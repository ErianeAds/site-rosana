import React, { useState, useEffect } from 'react';
import { getSiteContent } from '../firebase/services';

const About = () => {
  const [content, setContent] = useState({
    title: 'Tradição executiva aliada à visão de futuro.',
    text: 'Com mais de 30 anos de atuação sólida...',
    imageUrl: '/images/office.png'
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const siteData = await getSiteContent();
        if (siteData.about) {
          setContent(siteData.about);
        }
      } catch (error) {
        console.error("Error loading about content:", error);
      }
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" className="section-full bg-low house-about-section">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="grid-two">
          <div className="hero-image-container about-img-order">
            <img src={content.imageUrl || "/images/office.png"} alt="Perfil Rosana Brito" className="hero-image" style={{ transform: 'none' }} />
          </div>
          <div className="about-content-order">
            <h2 style={{ marginBottom: '2rem' }}>{content.title}</h2>
            <div style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem', whiteSpace: 'pre-line' }}>
              <p>{content.text}</p>
            </div>
            <div className="about-stats">
              <div>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>verified</span>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Prática Real</h4>
                <p style={{ fontSize: '0.875rem' }}>Metodologias testadas no campo executivo.</p>
              </div>
              <div>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>visibility</span>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Visão Estratégica</h4>
                <p style={{ fontSize: '0.875rem' }}>Antecipação de movimentos de mercado.</p>
              </div>
              <div>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>trending_up</span>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Resultados</h4>
                <p style={{ fontSize: '0.875rem' }}>Foco em evolução tangível e mensurável.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

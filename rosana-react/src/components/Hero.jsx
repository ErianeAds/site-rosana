import React, { useState, useEffect } from 'react';
import { getSiteContent } from '../firebase/services';

const Hero = () => {
  const [content, setContent] = useState({
    label: 'ESTRATÉGIA E CARREIRA',
    title: 'Destrave sua carreira com estratégia e clareza.',
    subtitle: 'Mentoria personalizada para profissionais que buscam crescimento com propósito, fundamentada em décadas de experiência executiva.',
    imageUrl: '/images/hero.png'
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const siteData = await getSiteContent();
        if (siteData.hero) {
          setContent(siteData.hero);
        }
      } catch (error) {
        console.error("Error loading hero content:", error);
      }
    };
    fetchHero();
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="grid-two">
        <div className="hero-content">
          <span className="label-md">{content.label}</span>
          <h1>{content.title}</h1>
          <p className="hero-subtitle">
            {content.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#contact" className="btn btn-secondary">Agendar Mentoria</a>
            <a href="#methodology" className="btn btn-tertiary">Conhecer o Método</a>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={content.imageUrl || "/images/hero.png"} alt="Rosana Brito" className="hero-image" />
          <div className="hero-badge">
            <span className="number">+30</span>
            <span className="text">Anos de Experiência</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

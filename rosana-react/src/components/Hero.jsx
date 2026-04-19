import React, { useState, useEffect } from 'react';
import { getSiteContent, getCourses } from '../firebase/services';

const Hero = ({ onSelectPackage }) => {
  const [content, setContent] = useState({
    label: 'ESTRATÉGIA E CARREIRA',
    title: 'Destrave sua carreira com estratégia e clareza.',
    subtitle: 'Mentoria personalizada para profissionais que buscam crescimento com propósito.',
    imageUrl: '/images/hero.png'
  });
  const [defaultCourse, setDefaultCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteData, courses] = await Promise.all([
          getSiteContent(),
          getCourses()
        ]);
        if (siteData.hero) setContent(siteData.hero);
        if (courses && courses.length > 0) {
          setDefaultCourse(courses[0]);
        }
      } catch (error) {
        console.error("Error loading hero content:", error);
      }
    };
    fetchData();
  }, []);

  const handleMainCTA = (e) => {
    e.preventDefault();
    if (defaultCourse) {
      onSelectPackage(defaultCourse);
    } else {
      // Fallback para rolar apenas
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="grid-two">
        <div className="hero-content">
          <span className="label-md">{content.label}</span>
          <h1>{content.title}</h1>
          <p className="hero-subtitle">{content.subtitle}</p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button onClick={handleMainCTA} className="btn btn-secondary" style={{ border: 'none', cursor: 'pointer' }}>
              Agendar Mentoria
            </button>
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

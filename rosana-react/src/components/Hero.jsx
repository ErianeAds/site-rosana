const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="grid-two">
        <div className="hero-content">
          <span className="label-md">Estratégia e Carreira</span>
          <h1>Destrave sua carreira com <span className="serif" style={{ fontStyle: 'italic', color: 'var(--primary-container)' }}>estratégia</span> e clareza.</h1>
          <p className="hero-subtitle">
            Mentoria personalizada para profissionais que buscam crescimento com propósito, fundamentada em décadas de experiência executiva.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#contact" className="btn btn-secondary">Agendar Mentoria</a>
            <a href="#methodology" className="btn btn-tertiary">Conhecer o Método</a>
          </div>
        </div>
        <div className="hero-image-container">
          <img src="/images/hero.png" alt="Rosana Brito - Mentoria Executiva" className="hero-image" />
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

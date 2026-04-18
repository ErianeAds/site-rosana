const About = () => {
  return (
    <section id="about" className="section-full bg-low">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="grid-two">
          <div className="hero-image-container about-img-order">
            <img src="/images/office.png" alt="Escritório Executivo" className="hero-image" style={{ transform: 'none' }} />
          </div>
          <div className="about-content-order">
            <h2 style={{ marginBottom: '2rem' }}>Tradição executiva aliada à visão de futuro.</h2>
            <div style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem' }}>
              <p style={{ marginBottom: '1.5rem' }}>Com mais de 30 anos de atuação sólida no setor financeiro, minha trajetória é marcada pela gestão de equipes de alta performance e decisões estratégicas de alto impacto.</p>
              <p>Hoje, minha missão é transpor esse conhecimento para profissionais que desejam não apenas subir degraus, mas construir uma fundação sólida e autêntica em suas carreiras.</p>
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

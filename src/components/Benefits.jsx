const Benefits = () => {
  return (
    <section id="benefits">
      <div className="bento-grid">
        <div className="bento-item bento-main">
          <span className="material-symbols-outlined bg-icon">insights</span>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Clareza e Propósito</h3>
          <p style={{ opacity: 0.8 }}>Entenda exatamente para onde sua carreira deve ir e como cada ação contribui para o seu legado profissional.</p>
        </div>
        <div className="bento-item bento-white">
          <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>security</span>
          <h4>Confiança</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '0.5rem' }}>Segurança para tomar decisões estratégicas complexas.</p>
        </div>
        <div className="bento-item bento-gold">
          <span className="material-symbols-outlined" style={{ marginBottom: '1rem', color: 'white' }}>stars</span>
          <h4 style={{ color: 'white' }}>Posicionamento</h4>
          <p style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '0.5rem' }}>Destaque-se em um mercado altamente competitivo.</p>
        </div>
        <div className="bento-item bento-blue">
          <div style={{ background: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>ads_click</span>
          </div>
          <div>
            <h4 style={{ color: 'var(--primary)' }}>Plano de Carreira Ativo</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Saia da inércia com um roadmap de crescimento validado.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;

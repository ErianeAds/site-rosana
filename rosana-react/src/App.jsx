import './App.css'

function App() {
  return (
    <>
      <nav className="glass-nav">
        <div className="nav-container">
          <a href="#" className="logo">Rosana Brito</a>
          <div className="nav-links">
            <a href="#about">Sobre</a>
            <a href="#services">Serviços</a>
            <a href="#methodology">Metodologia</a>
            <a href="#stories">Sucesso</a>
            <a href="#contact" className="btn btn-nav-action">Agendar Consulta</a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
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

        {/* About Section */}
        <section id="about" className="section-full bg-low">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="grid-two">
              <div className="hero-image-container" style={{ order: 2 }}>
                <img src="/images/office.png" alt="Escritório Executivo" className="hero-image" style={{ transform: 'none' }} />
              </div>
              <div style={{ order: 1 }}>
                <h2 style={{ marginBottom: '2rem' }}>Tradição executiva aliada à visão de futuro.</h2>
                <div style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem' }}>
                  <p style={{ marginBottom: '1.5rem' }}>Com mais de 30 anos de atuação sólida no setor financeiro, minha trajetória é marcada pela gestão de equipes de alta performance e decisões estratégicas de alto impacto.</p>
                  <p>Hoje, minha missão é transpor esse conhecimento para profissionais que desejam não apenas subir degraus, mas construir uma fundação sólida e autêntica em suas carreiras.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem' }}>
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

        {/* Services Section */}
        <section id="services">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="label-md">Como posso te ajudar</span>
            <h2 style={{ marginTop: '1rem' }}>Soluções Sob Medida</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Mentoria de Carreira', icon: 'psychology', desc: 'Acompanhamento contínuo para quem deseja acelerar sua evolução profissional com segurança.' },
              { title: 'Planejamento Profissional', icon: 'map', desc: 'Construção de um roadmap detalhado para atingir seus objetivos de curto e longo prazo.' },
              { title: 'Transição de Carreira', icon: 'sync_alt', desc: 'Estratégias seguras para mudar de área ou setor mantendo sua relevância no mercado.' },
              { title: 'Liderança', icon: 'groups', desc: 'Preparação para assumir cargos de alta gestão e inspirar equipes rumo ao sucesso.' },
            ].map((service, i) => (
              <div key={i} className="card">
                <div className="icon-wrapper"><span className="material-symbols-outlined">{service.icon}</span></div>
                <h3>{service.title}</h3>
                <p style={{ marginBottom: '2rem', flexGrow: 1, color: 'var(--on-surface-variant)' }}>{service.desc}</p>
                <a href="#contact" className="btn btn-tertiary" style={{ alignSelf: 'flex-start' }}>Saber mais</a>
              </div>
            ))}
          </div>
        </section>

        {/* Pull Quote */}
        <div className="pull-quote">
          <span className="material-symbols-outlined quote-icon">format_quote</span>
          <h3 style={{ fontSize: '2.5rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.4 }}>"Carreira não é sobre sorte, é sobre a convergência entre oportunidade e preparo estratégico."</h3>
          <cite>Rosana Brito</cite>
        </div>

        {/* Methodology */}
        <section id="methodology">
          <div style={{ marginBottom: '4rem' }}>
            <h2>O Caminho para a Excelência</h2>
            <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', marginTop: '1rem' }}>Um método estruturado em quatro pilares fundamentais para garantir que cada passo seja consciente e produtivo.</p>
          </div>
          <div className="process-grid">
            {[
              { num: '01', title: 'Diagnóstico', desc: 'Análise profunda do seu momento atual, competências e barreiras invisíveis.' },
              { num: '02', title: 'Planejamento', desc: 'Criação de metas claras e do plano de ação tático para alcançá-las.' },
              { num: '03', title: 'Execução', desc: 'Acompanhamento direto na implementação das estratégias no dia a dia.' },
              { num: '04', title: 'Follow-up', desc: 'Ajustes finos e análise de resultados para sustentabilidade do crescimento.' },
            ].map((step, i) => (
              <div key={i} className="process-step">
                <div className="step-number">{step.num}</div>
                <h4 style={{ marginBottom: '1rem' }}>{step.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Bento */}
        <section id="stories">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="label-md">Depoimentos</span>
            <h2 style={{ marginTop: '1rem' }}>Vozes de Sucesso</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { author: 'Cláudia M.', role: 'Diretora Financeira', quote: 'A mentoria com Rosana foi um divisor de águas. Sua visão estratégica e experiência prática me deram a segurança necessária para uma transição complexa de carreira.' },
              { author: 'Ricardo S.', role: 'Gerente Sênior', quote: 'O método é extremamente estruturado. Consegui desbloquear competências de liderança que eu nem sabia que eram barreiras para meu crescimento.' },
              { author: 'Juliana P.', role: 'Executive Partner', quote: 'Rosana traz uma autoridade que só quem viveu o mercado financeiro por décadas possui. Cada sessão é um aprendizado de altíssimo nível.' }
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <p>"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h5>{t.author}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Bento */}
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

        {/* Contact Section */}
        <section id="contact">
          <div className="grid-two">
            <div>
              <h2 style={{ marginBottom: '2rem' }}>Pronta para o próximo passo?</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem', marginBottom: '3rem' }}>Preencha o formulário para agendarmos uma sessão inicial de diagnóstico ou entre em contato pelos canais oficiais.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--secondary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '20px' }}>mail</span>
                  </div>
                  <span style={{ fontWeight: 500 }}>contato@rosanalimabrito.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--secondary-container)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '20px' }}>call</span>
                  </div>
                  <span style={{ fontWeight: 500 }}>+55 (11) 99999-9999</span>
                </div>
              </div>
            </div>
            <div className="form-container">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input type="text" placeholder="Ex: Ana Silva" />
                </div>
                <div className="form-group">
                  <label>E-mail Corporativo</label>
                  <input type="email" placeholder="ana@empresa.com" />
                </div>
                <div className="form-group">
                  <label>Cargo Atual</label>
                  <input type="text" placeholder="Ex: Gerente de Projetos" />
                </div>
                <div className="form-group">
                  <label>Como posso ajudar?</label>
                  <textarea rows="4" placeholder="Descreva seu desafio profissional..."></textarea>
                </div>
                  <button 
                    onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} 
                    className="btn btn-secondary" 
                    style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                  >
                    Agendar Sessão
                  </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <h4>Rosana Brito</h4>
            <p>Mentoria executiva para profissionais que buscam o próximo nível com excelência e integridade.</p>
          </div>
          <div className="footer-links">
            <h5>Redes Sociais</h5>
            <ul>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">WhatsApp</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>Institucional</h5>
            <ul>
              <li><a href="#">Privacidade</a></li>
              <li><a href="#">Termos</a></li>
              <li><a href="#">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Rosana Brito. Architectural Career Mentorship. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a 
        href="#" 
        style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          right: '2rem', 
          background: '#25D366', 
          color: 'white', 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 10px 30px rgba(37, 211, 102, 0.3)', 
          textDecoration: 'none', 
          zIndex: 1000, 
          transition: 'transform 0.3s ease' 
        }}
        onMouseOver={(e) => e.currentTarget.style.transform='scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform='scale(1)'}
      >
        <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93a7.898 7.898 0 0 0-2.322-5.607L13.601 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
        </svg>
      </a>
    </>
  )
}

export default App

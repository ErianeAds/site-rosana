const Testimonials = () => {
  const testimonials = [
    { author: 'Cláudia M.', role: 'Diretora Financeira', quote: 'A mentoria com Rosana foi um divisor de águas. Sua visão estratégica e experiência prática me deram a segurança necessária para uma transição complexa de carreira.' },
    { author: 'Ricardo S.', role: 'Gerente Sênior', quote: 'O método é extremamente estruturado. Consegui desbloquear competências de liderança que eu nem sabia que eram barreiras para meu crescimento.' },
    { author: 'Juliana P.', role: 'Executive Partner', quote: 'Rosana traz uma autoridade que só quem viveu o mercado financeiro por décadas possui. Cada sessão é um aprendizado de altíssimo nível.' }
  ];

  return (
    <section id="stories">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="label-md">Depoimentos</span>
        <h2 style={{ marginTop: '1rem' }}>Vozes de Sucesso</h2>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
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
  );
};

export default Testimonials;

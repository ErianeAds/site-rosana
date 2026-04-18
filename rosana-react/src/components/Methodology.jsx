const Methodology = () => {
  const steps = [
    { num: '01', title: 'Diagnóstico', desc: 'Análise profunda do seu momento atual, competências e barreiras invisíveis.' },
    { num: '02', title: 'Planejamento', desc: 'Criação de metas claras e do plano de ação tático para alcançá-las.' },
    { num: '03', title: 'Execução', desc: 'Acompanhamento direto na implementação das estratégias no dia a dia.' },
    { num: '04', title: 'Follow-up', desc: 'Ajustes finos e análise de resultados para sustentabilidade do crescimento.' },
  ];

  return (
    <>
      <div className="pull-quote">
        <span className="material-symbols-outlined quote-icon">format_quote</span>
        <h3 style={{ fontSize: '2.5rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.4 }}>"Carreira não é sobre sorte, é sobre a convergência entre oportunidade e preparo estratégico."</h3>
        <cite>Rosana Brito</cite>
      </div>

      <section id="methodology">
        <div style={{ marginBottom: '4rem' }}>
          <h2>O Caminho para a Excelência</h2>
          <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', marginTop: '1rem' }}>Um método estruturado em quatro pilares fundamentais para garantir que cada passo seja consciente e produtivo.</p>
        </div>
        <div className="process-grid">
          {steps.map((step, i) => (
            <div key={i} className="process-step">
              <div className="step-number">{step.num}</div>
              <h4 style={{ marginBottom: '1rem' }}>{step.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Methodology;

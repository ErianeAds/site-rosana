const Footer = () => {
  return (
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
      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>&copy; 2024 Rosana Brito. Architectural Career Mentorship. Todos os direitos reservados.</p>
        <a href="#admin" style={{ opacity: 0.3, color: 'inherit', fontSize: '0.75rem', textDecoration: 'none' }}>Acesso ADM</a>
      </div>
    </footer>
  );
};

export default Footer;

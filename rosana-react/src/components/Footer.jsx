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
      <div className="footer-bottom">
        <p>&copy; 2024 Rosana Brito. Architectural Career Mentorship. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

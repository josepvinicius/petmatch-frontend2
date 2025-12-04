import React from 'react';
import { Link } from 'react-router-dom';
import '../../../src/styles/components/footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Adote um Amigo</h3>
          <p>Conectando animais que precisam de um lar com pessoas dispostas a dar amor.</p>
        </div>
        
        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/animais">Animais Disponíveis</Link></li>
            <li><Link to="/sobre">Sobre Nós</Link></li>
            <li><Link to="/login">Área do Usuário</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contato</h4>
          <ul>
            <li>Email: contato@adoteumamigo.org</li>
            <li>Telefone: (11) 99999-9999</li>
            <li>Endereço: Rua dos Animais, 123 - São Paulo, SP</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Adote um Amigo. Todos os direitos reservados.</p>
        <p>Projeto desenvolvido para fins educacionais.</p>
      </div>
    </footer>
  );
};

export default Footer;
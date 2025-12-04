import React from 'react';
import '../../../src/styles/pages/about.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>Sobre o Adote um Amigo</h1>
        <p>Transformando vidas através da adoção responsável</p>
      </div>

      <section className="about-section">
        <h2>Nossa Missão</h2>
        <p>
          O Adote um Amigo é uma plataforma dedicada a conectar animais abandonados 
          com famílias amorosas. Acreditamos que todo animal merece um lar seguro e 
          cheio de amor, e trabalhamos incansavelmente para tornar isso possível.
        </p>
      </section>

      <section className="about-section">
        <h2>Nossa História</h2>
        <p>
          Fundada em 2020 por um grupo de amantes de animais, nossa organização 
          começou pequena, resgatando animais das ruas de São Paulo. Hoje, já 
          ajudamos mais de 500 animais a encontrarem lares definitivos e continuamos 
          crescendo para ajudar ainda mais.
        </p>
      </section>

      <section className="about-section">
        <h2>Como Funciona</h2>
        <div className="process-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Resgate</h3>
            <p>Resgatamos animais em situação de vulnerabilidade</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Cuidados</h3>
            <p>Fornecemos atendimento veterinário e cuidados básicos</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Adaptação</h3>
            <p>Preparamos o animal para convívio familiar</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Adoção</h3>
            <p>Conectamos com famílias responsáveis</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Nossos Valores</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>💖 Amor pelos Animais</h3>
            <p>Cada vida importa e merece respeito e cuidado</p>
          </div>
          <div className="value-card">
            <h3>🤝 Transparência</h3>
            <p>Todas as adoções são acompanhadas e documentadas</p>
          </div>
          <div className="value-card">
            <h3>🏠 Compromisso</h3>
            <p>Acompanhamento pós-adoção para garantir bem-estar</p>
          </div>
          <div className="value-card">
            <h3>🌱 Sustentabilidade</h3>
            <p>Promovemos a posse responsável e conscientização</p>
          </div>
        </div>
      </section>

      <section className="about-section cta-section">
        <h2>Quer Ajudar?</h2>
        <p>
          Você pode ajudar de várias formas: adotando, sendo voluntário, 
          doando ou divulgando nosso trabalho.
        </p>
        <div className="cta-buttons">
          <button className="btn btn-primary btn-large">
            Seja um Voluntário
          </button>
          <button className="btn btn-secondary btn-large">
            Faça uma Doação
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
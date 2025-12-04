import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { animalService } from '../../services/animalService';
import CardAnimal from '../../components/ui/CardAnimal';
import '../../../src/styles/pages/home.css';
import '../../../src/styles/variables.css';

const Home: React.FC = () => {
  const [availableAnimals, setAvailableAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableAnimals();
  }, []);

  const fetchAvailableAnimals = async () => {
    try {
      const response = await animalService.getAvailable();
      setAvailableAnimals(response.animais.slice(0, 6)); // Mostrar apenas 6
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Dê um lar para quem mais precisa</h1>
          <p>Encontre seu novo melhor amigo entre centenas de animais esperando por uma família</p>
          <div className="hero-buttons">
            <Link to="/animais" className="btn btn-primary btn-large">
              Ver Animais Disponíveis
            </Link>
            <Link to="/sobre" className="btn btn-secondary btn-large">
              Conheça nossa História
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Animals */}
      <section className="featured-animals">
        <h2>Animais Esperando por Você</h2>
        {loading ? (
          <div className="loading">Carregando animais...</div>
        ) : (
          <>
            <div className="animals-grid">
              {availableAnimals.map((animal) => (
                <CardAnimal key={animal.id} animal={animal} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/animais" className="btn btn-primary">
                Ver Todos os Animais
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat">
            <h3>+500</h3>
            <p>Animais Resgatados</p>
          </div>
          <div className="stat">
            <h3>+300</h3>
            <p>Adoções Realizadas</p>
          </div>
          <div className="stat">
            <h3>+50</h3>
            <p>Voluntários Ativos</p>
          </div>
          <div className="stat">
            <h3>10+</h3>
            <p>Anos de Atuação</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
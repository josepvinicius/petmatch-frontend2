// CardAnimal.tsx - ATUALIZADO
import React from 'react';
import { Link } from 'react-router-dom';
import '../../../src/styles/components/card.css';

// Interface atualizada com o campo 'foto'
interface CardAnimalProps {
  animal: {
    id: string;
    nome: string;
    especie: string;
    sexo: string;
    porte: string;
    saude: string;
    status: string;
    nascimento?: string;
    foto?: string;  // ← NOVO CAMPO (opcional)
  };
}

// Imagens placeholder por espécie
const getPlaceholderImage = (especie: string): string => {
  const especieLower = especie.toLowerCase();
  
  if (especieLower.includes('cachorro') || especieLower.includes('cão')) {
    return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';
  }
  if (especieLower.includes('gato')) {
    return 'https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?w-400&h=300&fit=crop';
  }
  if (especieLower.includes('pássaro') || especieLower.includes('passaro')) {
    return 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop';
  }
  if (especieLower.includes('coelho')) {
    return 'https://images.unsplash.com/photo-1556838803-cc94986cb631?w=400&h=300&fit=crop';
  }
  
  // Placeholder genérico para outras espécies
  return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop';
};

const CardAnimal: React.FC<CardAnimalProps> = ({ animal }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disponível':
        return 'status-available';
      case 'adotado':
        return 'status-adopted';
      case 'em tratamento':
        return 'status-treatment';
      default:
        return 'status-default';
    }
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 'Idade não informada';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years > 0) {
      return `${years} ano${years > 1 ? 's' : ''}`;
    }
    return `${Math.abs(months)} mês${Math.abs(months) > 1 ? 'es' : ''}`;
  };

  // Determina a imagem a ser exibida
  const imageSrc = animal.foto || getPlaceholderImage(animal.especie);

  return (
    <div className="animal-card">
      {/* Seção da Foto do Animal */}
      <div className="animal-card-image">
        <img 
          src={imageSrc} 
          alt={`Foto do ${animal.nome}`}
          className="animal-image"
          onError={(e) => {
            // Fallback em caso de erro no carregamento
            e.currentTarget.src = getPlaceholderImage(animal.especie);
          }}
        />
        <span className={`status-badge ${getStatusColor(animal.status)}`}>
          {animal.status}
        </span>
      </div>
      
      <div className="animal-card-content">
        {/* Nome do Animal */}
        <div className="animal-card-header">
          <h3 className="animal-name">{animal.nome}</h3>
        </div>
        
        {/* Informações do Animal */}
        <div className="animal-info">
          <div className="info-item">
            <span className="info-label">Espécie:</span>
            <span className="info-value">{animal.especie}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sexo:</span>
            <span className="info-value">{animal.sexo}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Porte:</span>
            <span className="info-value">{animal.porte}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Idade:</span>
            <span className="info-value">{calculateAge(animal.nascimento)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Saúde:</span>
            <span className="info-value">{animal.saude}</span>
          </div>
        </div>
      </div>
      
      {/* Botão de Ação */}
      <div className="animal-card-footer">
        {animal.status.toLowerCase() === 'disponível' ? (
          <Link to={`/animais/${animal.id}`} className="btn btn-primary">
            Conhecer {animal.nome}
          </Link>
        ) : (
          <button className="btn btn-secondary" disabled>
            {animal.status}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardAnimal;
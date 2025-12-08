// CardAnimal.tsx - ATUALIZADO COM AÇÕES DE ADMIN
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { animalService } from '../../../src/services/animalService';
import '../../../src/styles/components/card.css';
import '../../../src/styles/components/admin-actions.css';

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
    foto?: string;
    faca?: string;
  };
  isAdmin?: boolean;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

const getPlaceholderImage = (especie: string): string => {
  const especieLower = especie.toLowerCase();

  if (especieLower.includes('cachorro') || especieLower.includes('cão')) {
    return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';
  }
  if (especieLower.includes('gato')) {
    return 'https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?w=400&h=300&fit=crop';
  }
  if (especieLower.includes('pássaro') || especieLower.includes('passaro')) {
    return 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop';
  }
  if (especieLower.includes('coelho')) {
    return 'https://images.unsplash.com/photo-1556838803-cc94986cb631?w=400&h=300&fit=crop';
  }

  return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop';
};

const CardAnimal: React.FC<CardAnimalProps> = ({
  animal,
  isAdmin = false,
  showActions = false,
  onDelete
}) => {
  const navigate = useNavigate();

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

    try {
      const birth = new Date(birthDate);
      const today = new Date();

      if (isNaN(birth.getTime())) return 'Idade não informada';

      const months = (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth());

      if (months >= 24) {
        const years = Math.floor(months / 12);
        return `${years} ano${years > 1 ? 's' : ''}`;
      } else if (months >= 12) {
        return '1 ano';
      } else if (months > 0) {
        return `${months} mês${months > 1 ? 'es' : ''}`;
      }

      return 'Recém-nascido';
    } catch {
      return 'Idade não informada';
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Se estiver no dashboard admin, use o modal
    if (window.location.pathname.includes('/admin')) {
      // Disparar evento customizado para o modal
      const event = new CustomEvent('openEditModal', { detail: animal.id });
      window.dispatchEvent(event);
    } else {
      // Navegação normal para página de edição
      navigate(`/admin/animais/editar/${animal.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Tem certeza que deseja excluir "${animal.nome}"?`)) {
      return;
    }

    try {
      await animalService.delete(animal.id);

      if (onDelete) {
        onDelete(animal.id);
      } else {
        alert('Animal excluído com sucesso!');
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Erro ao excluir animal:', error);
      alert(error.response?.data?.msg || 'Erro ao excluir animal');
    }
  };

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
            e.currentTarget.src = getPlaceholderImage(animal.especie);
          }}
        />
        <span className={`status-badge ${getStatusColor(animal.status)}`}>
          {animal.status}
        </span>

        {/* Badge Admin (se for admin) */}
        {isAdmin && (
          <span className="admin-badge">
            👑 Admin
          </span>
        )}
      </div>

      <div className="animal-card-content">
        {/* Nome do Animal */}
        <div className="animal-card-header">
          <h3 className="animal-name">{animal.nome}</h3>
          {animal.faca && (
            <span className="animal-breed">{animal.faca}</span>
          )}
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

      {/* Botões de Ação */}
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

        {/* Ações de Admin (se habilitado) */}
        {(isAdmin || showActions) && (
          <div className="admin-actions">
            <button
              className="btn-admin btn-edit"
              onClick={handleEdit}
            >
              ✏️ Editar
            </button>
            <button
              className="btn-admin btn-delete"
              onClick={handleDelete}
            >
              🗑️ Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardAnimal;
// src/pages/public/AnimalDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { animalService } from '../../services/animalService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../../src/styles/pages/animal-detail.css';

interface AnimalDetail {
  id: string;
  nome: string;
  especie: string;
  faca: string;
  sexo: string;
  nascimento: string;
  porte: string;
  saude: string;
  status: string;
  foto?: string;
  dataCadastro?: string;
}

const AnimalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [animal, setAnimal] = useState<AnimalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adoptionLoading, setAdoptionLoading] = useState(false);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) {
        setError('ID do animal não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await animalService.getById(id);
        setAnimal(response.animal);
      } catch (error: any) {
        console.error('Erro ao carregar animal:', error);
        setError('Animal não encontrado ou erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  const handleAdoptionInterest = async () => {
    if (!user) {
      alert('Por favor, faça login para demonstrar interesse na adoção.');
      navigate('/login', { state: { from: `/animais/${id}` } });
      return;
    }

    setAdoptionLoading(true);
    try {
      // Aqui você pode integrar com um serviço de adoções
      alert(`Interesse em adoção registrado para ${animal?.nome}!\n\nEntraremos em contato em breve.`);
      
      // Opcional: Enviar email/notificação para admin
      // await adoptionService.registerInterest(user.id, id);
    } catch (error) {
      console.error('Erro ao registrar interesse:', error);
      alert('Erro ao registrar interesse. Tente novamente.');
    } finally {
      setAdoptionLoading(false);
    }
  };

  const handleEdit = () => {
    if (isAdmin && animal) {
      navigate(`/admin/animais/editar/${animal.id}`);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin || !animal) return;
    
    if (!window.confirm(`Tem certeza que deseja excluir ${animal.nome}?`)) {
      return;
    }

    try {
      await animalService.delete(animal.id);
      alert('Animal excluído com sucesso!');
      navigate('/animais');
    } catch (error: any) {
      console.error('Erro ao excluir animal:', error);
      alert(error.response?.data?.msg || 'Erro ao excluir animal');
    }
  };

  const calculateAge = (birthDate: string) => {
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      
      if (isNaN(birth.getTime())) return 'Data não informada';
      
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
      return 'Data não informada';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informada';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

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

  if (loading) {
    return <LoadingSpinner message="Carregando detalhes do animal..." />;
  }

  if (error || !animal) {
    return (
      <div className="animal-detail-error">
        <h2>Animal não encontrado</h2>
        <p>{error || 'O animal que você está procurando não existe.'}</p>
        <Button onClick={() => navigate('/animais')}>
          Voltar para lista de animais
        </Button>
      </div>
    );
  }

  // Imagem placeholder baseada na espécie
  const getPlaceholderImage = (especie: string): string => {
    const especieLower = especie.toLowerCase();
    
    if (especieLower.includes('cachorro') || especieLower.includes('cão')) {
      return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop';
    }
    if (especieLower.includes('gato')) {
      return 'https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?w=800&h=600&fit=crop';
    }
    if (especieLower.includes('pássaro') || especieLower.includes('passaro')) {
      return 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop';
    }
    if (especieLower.includes('coelho')) {
      return 'https://images.unsplash.com/photo-1556838803-cc94986cb631?w=800&h=600&fit=crop';
    }
    
    return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop';
  };

  const imageSrc = animal.foto || getPlaceholderImage(animal.especie);

  return (
    <div className="animal-detail-container">
      {/* Cabeçalho com navegação */}
      <div className="animal-detail-header">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to="/animais">Animais</Link>
          <span> / </span>
          <span>{animal.nome}</span>
        </div>
        
        <div className="header-actions">
          {isAdmin && (
            <div className="admin-actions">
              <Button 
                variant="secondary" 
                size="small"
                onClick={handleEdit}
              >
                ✏️ Editar
              </Button>
              <Button 
                variant="danger" 
                size="small"
                onClick={handleDelete}
              >
                🗑️ Excluir
              </Button>
            </div>
          )}
          <Button 
            variant="secondary" 
            onClick={() => navigate('/animais')}
          >
            ← Voltar para Animais
          </Button>
        </div>
      </div>

      <div className="animal-detail-content">
        {/* Imagem do Animal */}
        <div className="animal-image-section">
          <div className="image-wrapper">
            <img 
              src={imageSrc} 
              alt={`Foto de ${animal.nome}`}
              className="main-animal-image"
              onError={(e) => {
                e.currentTarget.src = getPlaceholderImage(animal.especie);
              }}
            />
            <div className={`animal-status ${getStatusColor(animal.status)}`}>
              {animal.status.toUpperCase()}
            </div>
          </div>
          
          {/* Ações principais */}
          <div className="primary-actions">
            {animal.status.toLowerCase() === 'disponível' ? (
              <Button 
                onClick={handleAdoptionInterest}
                loading={adoptionLoading}
                className="btn-adopt"
                size="large"
              >
                🏠 Tenho interesse em adotar
              </Button>
            ) : (
              <div className="not-available-message">
                <h3>Este animal não está disponível para adoção</h3>
                <p>Status: {animal.status}</p>
              </div>
            )}
            
            <div className="share-section">
              <p>Compartilhar:</p>
              <div className="share-buttons">
                <button className="btn-share">📱 WhatsApp</button>
                <button className="btn-share">📧 Email</button>
                <button className="btn-share">🔗 Copiar Link</button>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Animal */}
        <div className="animal-info-section">
          <div className="animal-header">
            <h1>{animal.nome}</h1>
            <p className="animal-subtitle">
              {animal.especie} • {animal.faca || 'SRD'} • {animal.sexo}
            </p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>📋 Informações Básicas</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Nome:</span>
                  <span className="info-value">{animal.nome}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Espécie:</span>
                  <span className="info-value">{animal.especie}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Raça/Faça:</span>
                  <span className="info-value">{animal.faca || 'SRD (Sem Raça Definida)'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sexo:</span>
                  <span className="info-value">{animal.sexo}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>📏 Características Físicas</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Porte:</span>
                  <span className="info-value">{animal.porte}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Idade:</span>
                  <span className="info-value">{calculateAge(animal.nascimento)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Data de Nascimento:</span>
                  <span className="info-value">{formatDate(animal.nascimento)}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>❤️ Saúde e Bem-estar</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Condição de Saúde:</span>
                  <span className="info-value">{animal.saude}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={`info-value status ${getStatusColor(animal.status)}`}>
                    {animal.status}
                  </span>
                </div>
                {animal.dataCadastro && (
                  <div className="info-item">
                    <span className="info-label">Cadastrado em:</span>
                    <span className="info-value">{formatDate(animal.dataCadastro)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Observações (se houver) */}
          {animal.saude && animal.saude.length > 50 && (
            <div className="observations-section">
              <h3>Observações Adicionais</h3>
              <div className="observations-content">
                <p>{animal.saude}</p>
              </div>
            </div>
          )}

          {/* Processo de Adoção */}
          {animal.status.toLowerCase() === 'disponível' && (
            <div className="adoption-process">
              <h3>🏠 Processo de Adoção</h3>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Demonstre interesse</h4>
                    <p>Clique no botão "Tenho interesse em adotar"</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Entraremos em contato</h4>
                    <p>Nossa equipe entrará em contato para agendar uma visita</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Conheça o animal</h4>
                    <p>Venha conhecer {animal.nome} pessoalmente</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Finalização</h4>
                    <p>Assinatura de termo de adoção responsável</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé com CTA */}
      <div className="animal-detail-footer">
        <div className="footer-content">
          <h3>Pronto para dar um lar amoroso para {animal.nome}?</h3>
          <p>Adotar muda vidas. A sua e a do animal.</p>
          {animal.status.toLowerCase() === 'disponível' ? (
            <Button 
              onClick={handleAdoptionInterest}
              loading={adoptionLoading}
              className="btn-adopt-footer"
              size="large"
            >
              🏠 Quero adotar {animal.nome}
            </Button>
          ) : (
            <Link to="/animais" className="btn-other-animals">
              👀 Ver outros animais disponíveis
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalDetail;
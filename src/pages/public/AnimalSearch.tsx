import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { animalService } from '../../services/animalService';
import CardAnimal from '../../components/ui/CardAnimal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../../src/styles/pages/animal-search.css';

const AnimalSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animais, setAnimais] = useState<any[]>([]);
  const [filteredAnimais, setFilteredAnimais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    especie: searchParams.get('especie') || '',
    status: searchParams.get('status') || '',
    porte: searchParams.get('porte') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    fetchAnimais();
  }, []);

  useEffect(() => {
    filterAnimais();
  }, [animais, filters]);

  const fetchAnimais = async () => {
    try {
      const response = await animalService.getAll();
      setAnimais(response.animais || []);
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnimais = () => {
    let filtered = [...animais];

    // Filtro por espécie
    if (filters.especie) {
      filtered = filtered.filter(animal => 
        animal.especie.toLowerCase().includes(filters.especie.toLowerCase())
      );
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(animal => 
        animal.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Filtro por porte
    if (filters.porte) {
      filtered = filtered.filter(animal => 
        animal.porte.toLowerCase() === filters.porte.toLowerCase()
      );
    }

    // Filtro por busca geral
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(animal =>
        animal.nome.toLowerCase().includes(searchLower) ||
        animal.especie.toLowerCase().includes(searchLower) ||
        animal.faca.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAnimais(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };
    
    setFilters(newFilters);
    
    // Atualiza URL com filtros
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setFilters({
      especie: '',
      status: '',
      porte: '',
      search: '',
    });
    setSearchParams({});
  };

  const getAvailableCount = () => {
    return animais.filter(a => a.status.toLowerCase() === 'disponível').length;
  };

  const getAdoptedCount = () => {
    return animais.filter(a => a.status.toLowerCase() === 'adotado').length;
  };

  if (loading) {
    return <LoadingSpinner message="Carregando animais..." />;
  }

  return (
    <div className="animal-search-container">
      {/* Hero Section */}
      <div className="search-hero">
        <h1>Encontre seu novo melhor amigo</h1>
        <p>
          Temos {getAvailableCount()} animais disponíveis para adoção e 
          já ajudamos {getAdoptedCount()} a encontrarem um lar.
        </p>
      </div>

      {/* Filtros */}
      <div className="search-filters">
        <div className="filters-header">
          <h2>Filtrar Animais</h2>
          <Button variant="secondary" onClick={handleResetFilters}>
            Limpar Filtros
          </Button>
        </div>

        <div className="filters-grid">
          <Input
            label="Buscar por nome, espécie ou raça"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Ex: Rex, Gato, Vira-lata..."
          />

          <div className="form-group">
            <label>Espécie</label>
            <select
              name="especie"
              value={filters.especie}
              onChange={handleFilterChange}
              className="select-field"
            >
              <option value="">Todas as espécies</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Coelho">Coelho</option>
              <option value="Pássaro">Pássaro</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select-field"
            >
              <option value="">Todos os status</option>
              <option value="disponível">Disponível</option>
              <option value="adotado">Adotado</option>
              <option value="em tratamento">Em tratamento</option>
              <option value="reservado">Reservado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Porte</label>
            <select
              name="porte"
              value={filters.porte}
              onChange={handleFilterChange}
              className="select-field"
            >
              <option value="">Todos os portes</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
        </div>

        <div className="filters-summary">
          <p>
            Mostrando {filteredAnimais.length} de {animais.length} animais
            {filters.especie && ` • Espécie: ${filters.especie}`}
            {filters.status && ` • Status: ${filters.status}`}
            {filters.porte && ` • Porte: ${filters.porte}`}
          </p>
        </div>
      </div>

      {/* Resultados */}
      <div className="search-results">
        {filteredAnimais.length === 0 ? (
          <div className="no-results">
            <h3>Nenhum animal encontrado</h3>
            <p>Tente ajustar os filtros ou buscar por outros termos.</p>
            <Button onClick={handleResetFilters}>
              Ver Todos os Animais
            </Button>
          </div>
        ) : (
          <>
            <div className="animals-grid">
              {filteredAnimais.map((animal) => (
                <CardAnimal key={animal.id} animal={animal} />
              ))}
            </div>

            {/* Estatísticas */}
            <div className="results-stats">
              <div className="stat-card">
                <h3>Disponíveis para Adoção</h3>
                <p className="stat-number">
                  {filteredAnimais.filter(a => a.status === 'disponível').length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Já Adotados</h3>
                <p className="stat-number">
                  {filteredAnimais.filter(a => a.status === 'adotado').length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Em Tratamento</h3>
                <p className="stat-number">
                  {filteredAnimais.filter(a => a.status === 'em tratamento').length}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Call to Action */}
      <div className="search-cta">
        <h2>Interessado em adotar?</h2>
        <p>
          Todos os nossos animais são vacinados, vermifugados e castrados. 
          Entre em contato para saber mais sobre o processo de adoção.
        </p>
        <div className="cta-buttons">
          <Button variant="primary" className="btn-large">
            Entrar em Contato
          </Button>
          <Button variant="secondary" className="btn-large">
            Baixar Formulário de Adoção
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnimalSearch;
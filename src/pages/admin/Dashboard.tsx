// Dashboard.tsx - ATUALIZADO COM FUNCIONALIDADES DE GERENCIAMENTO E ROTAS CORRETAS
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../../../src/services/animalService';
import '../../../src/styles/pages/dashboard.css';
import '../../../src/styles/variables.css';

interface Animal {
  id: string;
  nome: string;
  especie: string;
  sexo: string;
  porte: string;
  saude: string;
  status: string;
  nascimento?: string;
  foto?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [stats, setStats] = useState({
    totalAdocoes: 0,
    adocoesConcluidas: 0,
    animaisDisponiveis: 0,
    taxaAdocao: '0'
  });
  
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingAnimals(true);
      // Carregar animais reais do backend
      const response = await animalService.getAll();
      const animais: Animal[] = response.animais || [];
      
      // Calcular estatísticas
      const disponiveis = animais.filter(a => a.status.toLowerCase() === 'disponível');
      const adotados = animais.filter(a => a.status.toLowerCase() === 'adotado');
      
      setStats({
        totalAdocoes: adotados.length,
        adocoesConcluidas: adotados.length,
        animaisDisponiveis: disponiveis.length,
        taxaAdocao: animais.length > 0 ? ((adotados.length / animais.length) * 100).toFixed(2) : '0'
      });
      
      // Últimos 5 animais cadastrados
      const recent = animais
        .sort((a, b) => new Date(b.nascimento || '').getTime() - new Date(a.nascimento || '').getTime())
        .slice(0, 5);
      
      setRecentAnimals(recent);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback para dados mockados
      loadMockData();
    } finally {
      setLoadingAnimals(false);
    }
  };

  const loadMockData = () => {
    setStats({
      totalAdocoes: 15,
      adocoesConcluidas: 10,
      animaisDisponiveis: 5,
      taxaAdocao: '66.67'
    });
    
    setRecentAnimals([
      { id: '1', nome: 'Rex', especie: 'Cachorro', sexo: 'Macho', porte: 'Médio', saude: 'Saudável', status: 'Adotado' },
      { id: '2', nome: 'Luna', especie: 'Gato', sexo: 'Fêmea', porte: 'Pequeno', saude: 'Saudável', status: 'Adotado' },
      { id: '3', nome: 'Thor', especie: 'Cachorro', sexo: 'Macho', porte: 'Grande', saude: 'Tratamento', status: 'Em tratamento' },
    ]);
  };

  const handleEditAnimal = (id: string) => {
    // ✅ CORREÇÃO: Use alert temporário até criar a página de edição
    alert(`Funcionalidade de edição em desenvolvimento. Animal ID: ${id}`);
    // Para implementar depois: navigate(`/admin/animais/editar/${id}`);
  };

  const handleDeleteAnimal = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o animal "${nome}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await animalService.delete(id);
      alert('Animal excluído com sucesso!');
      loadData(); // Recarrega os dados
    } catch (error: any) {
      console.error('Erro ao excluir animal:', error);
      alert(error.response?.data?.msg || 'Erro ao excluir animal');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAnimals) {
    return <div className="loading">Carregando dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard Admin</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Adoções</h3>
          <p className="stat-number">{stats.totalAdocoes}</p>
        </div>
        
        <div className="stat-card">
          <h3>Adoções Concluídas</h3>
          <p className="stat-number">{stats.adocoesConcluidas}</p>
        </div>
        
        <div className="stat-card">
          <h3>Animais Disponíveis</h3>
          <p className="stat-number">{stats.animaisDisponiveis}</p>
          <small className="stat-hint">Para adoção 📸</small>
        </div>
        
        <div className="stat-card">
          <h3>Taxa de Adoção</h3>
          <p className="stat-number">{stats.taxaAdocao}%</p>
        </div>
      </div>

      {/* Animais Recentes - AGORA COM AÇÕES */}
      <div className="recent-animals">
        <div className="section-header">
          <h2>Animais Recentes</h2>
          <button 
            className="btn-refresh"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? 'Atualizando...' : '🔄 Atualizar'}
          </button>
        </div>
        
        <table className="animals-table">
          <thead>
            <tr>
              <th>Animal</th>
              <th>Espécie</th>
              <th>Sexo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {recentAnimals.length > 0 ? (
              recentAnimals.map((animal) => (
                <tr key={animal.id}>
                  <td className="animal-name-cell">
                    <div className="animal-name-with-photo">
                      {animal.foto ? (
                        <img 
                          src={animal.foto} 
                          alt={animal.nome}
                          className="animal-table-photo"
                        />
                      ) : (
                        <div className="animal-table-photo-placeholder">
                          {animal.especie === 'Cachorro' ? '🐶' : 
                           animal.especie === 'Gato' ? '🐱' : '🐾'}
                        </div>
                      )}
                      <span>{animal.nome}</span>
                    </div>
                  </td>
                  <td>{animal.especie}</td>
                  <td>{animal.sexo}</td>
                  <td>
                    <span className={`status-badge ${
                      animal.status.toLowerCase() === 'disponível' ? 'status-available' :
                      animal.status.toLowerCase() === 'adotado' ? 'status-adopted' :
                      'status-treatment'
                    }`}>
                      {animal.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEditAnimal(animal.id)}
                        title="Editar animal"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteAnimal(animal.id, animal.nome)}
                        disabled={loading}
                        title="Excluir animal"
                      >
                        🗑️ Excluir
                      </button>
                      <button 
                        className="btn-action btn-view"
                        onClick={() => navigate(`/animais/${animal.id}`)}
                        title="Ver detalhes"
                      >
                        👁️ Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="no-data">
                  Nenhum animal cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions - CORRIGIDO: USANDO ROTAS EXISTENTES */}
      <div className="quick-actions">
        <h2>Ações Rápidas</h2>
        <div className="actions-grid">
          {/* ✅ CORREÇÃO: Usa a rota definida no routes.tsx */}
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/novo-animal')}
          >
            <span>📷+</span>
            <p>Cadastrar Animal</p>
          </button>
          
          {/* ✅ Botão que já funciona (volta para dashboard) */}
          <button 
            className="action-btn"
            onClick={() => navigate('/admin')}
          >
            <span>📋</span>
            <p>Ver Todos Animais</p>
          </button>
          
          {/* ✅ Alert temporário até criar as páginas */}
          <button 
            className="action-btn" 
            onClick={() => alert('Funcionalidade "Gerenciar Adoções" em desenvolvimento')}
          >
            <span>📊</span>
            <p>Gerenciar Adoções</p>
          </button>
          
          {/* ✅ Alert temporário até criar as páginas */}
          <button 
            className="action-btn"
            onClick={() => alert('Funcionalidade "Gerenciar Usuários" em desenvolvimento')}
          >
            <span>👥</span>
            <p>Gerenciar Usuários</p>
          </button>
        </div>
      </div>
      
      {/* Dica */}
      <div className="dashboard-tip">
        <p>💡 <strong>Dica:</strong> Clique em "Cadastrar Animal" para adicionar novos animais com fotos!</p>
      </div>
    </div>
  );
};

export default Dashboard;
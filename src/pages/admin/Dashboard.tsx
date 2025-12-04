// Dashboard.tsx - APENAS ATUALIZAÇÃO DO BOTÃO E MENSAGEM
import React, { useEffect, useState } from 'react';
import '../../../src/styles/pages/dashboard.css';
import '../../../src/styles/variables.css';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAdocoes: 0,
    adocoesConcluidas: 0,
    animaisDisponiveis: 0,
    taxaAdocao: '0'
  });

  useEffect(() => {
    // Para MVP, use dados mockados ou localStorage
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Dados mockados para apresentação
    setStats({
      totalAdocoes: 15,
      adocoesConcluidas: 10,
      animaisDisponiveis: 5,
      taxaAdocao: '66.67'
    });
  };

  if (loading) {
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
          <small className="stat-hint">Agora com fotos! 📸</small> {/* ← NOVA LINHA */}
        </div>
        
        <div className="stat-card">
          <h3>Taxa de Adoção</h3>
          <p className="stat-number">{stats.taxaAdocao}%</p>
        </div>
      </div>

      {/* Recent Adoptions Table - Mockado */}
      <div className="recent-adoptions">
        <h2>Adoções Recentes</h2>
        <table className="adoptions-table">
          <thead>
            <tr>
              <th>Animal</th>
              <th>Adotante</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rex</td>
              <td>João Silva</td>
              <td>15/01/2024</td>
              <td><span className="status-badge status-completed">Concluída</span></td>
            </tr>
            <tr>
              <td>Luna</td>
              <td>Maria Santos</td>
              <td>10/01/2024</td>
              <td><span className="status-badge status-completed">Concluída</span></td>
            </tr>
            <tr>
              <td>Thor</td>
              <td>Carlos Oliveira</td>
              <td>05/01/2024</td>
              <td><span className="status-badge status-completed">Concluída</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Ações Rápidas</h2>
        <div className="actions-grid">
          <a href="/admin/novo-animal" className="action-btn">
            <span>📷+</span> {/* ← ÍCONE ATUALIZADO */}
            <p>Cadastrar Animal com Foto</p> {/* ← TEXTO ATUALIZADO */}
          </a>
          <button className="action-btn" onClick={() => alert('Funcionalidade em desenvolvimento')}>
            <span>📋</span>
            <p>Registrar Resgate</p>
          </button>
          <button className="action-btn" onClick={() => alert('Funcionalidade em desenvolvimento')}>
            <span>📊</span>
            <p>Gerar Relatório</p>
          </button>
          <button className="action-btn" onClick={() => alert('Funcionalidade em desenvolvimento')}>
            <span>👥</span>
            <p>Gerenciar Usuários</p>
          </button>
        </div>
      </div>
      
      {/* Dica sobre fotos (opcional) */}
      <div className="dashboard-tip">
        <p>💡 <strong>Novo:</strong> Agora você pode adicionar fotos aos animais no cadastro!</p>
      </div>
    </div>
  );
};

export default Dashboard;
import api from './api';

export interface Adoption {
  id: string;
  data_resgate: string;
  data_adocao?: string;
  observacoes?: string;
  id_usuario: string;
  id_animais: string;
  animal?: {
    id: string;
    nome: string;
    especie: string;
    porte: string;
  };
  user?: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface AdoptionStats {
  totalAdocoes: number;
  adocoesConcluidas: number;
  animaisDisponiveis: number;
  taxaAdocao: string;
}

export interface RegisterResgateData {
  data_resgate: string;
  observacoes?: string;
  id_animais: string;
}

export interface RegisterAdocaoData {
  id: string;
  data_adocao: string;
  observacoes?: string;
}

export const adoptionService = {
  // Listar todas as adoções
  async getAll() {
    const response = await api.get('/doacoes');
    return response.data;
  },

  // Buscar adoção por ID
  async getById(id: string) {
    const response = await api.get(`/doacoes/${id}`);
    return response.data;
  },

  // Buscar adoções por usuário
  async getByUser(userId: string) {
    const response = await api.get(`/doacoes/usuario/${userId}`);
    return response.data;
  },

  // Registrar resgate
  async registerResgate(data: RegisterResgateData) {
    const response = await api.post('/doacoes/resgate', data);
    return response.data;
  },

  // Registrar adoção
  async registerAdocao(data: RegisterAdocaoData) {
    const response = await api.post('/doacoes/adocao', data);
    return response.data;
  },

  // Atualizar observações
  async updateObservations(id: string, observacoes: string) {
    const response = await api.put(`/doacoes/${id}/observacoes`, { observacoes });
    return response.data;
  },

  // Deletar adoção
  async delete(id: string) {
    const response = await api.delete(`/doacoes/${id}`);
    return response.data;
  },

  // Obter estatísticas
  async getStats() {
    const response = await api.get('/doacoes/estatisticas');
    return response.data.estatisticas;
  },

  // Obter adoções recentes
  async getRecentAdoptions(limit: number = 10) {
    const response = await api.get('/doacoes');
    return response.data.doacoes.slice(0, limit);
  }
};
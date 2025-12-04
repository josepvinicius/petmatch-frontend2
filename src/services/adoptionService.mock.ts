// Serviço mockado para evitar erros de API
export const adoptionServiceMock = {
  async getStats() {
    // Dados mockados para apresentação
    return {
      totalAdocoes: 15,
      adocoesConcluidas: 10,
      animaisDisponiveis: 5,
      taxaAdocao: '66.67'
    };
  },

  async getRecentAdoptions(limit: number = 5) {
    // Adoções mockadas
    return [
      {
        id: '1',
        animal: { nome: 'Rex', especie: 'Cachorro' },
        user: { nome: 'João Silva' },
        data_resgate: '2024-01-10',
        data_adocao: '2024-01-15'
      },
      {
        id: '2',
        animal: { nome: 'Luna', especie: 'Gato' },
        user: { nome: 'Maria Santos' },
        data_resgate: '2024-01-05',
        data_adocao: '2024-01-10'
      }
    ].slice(0, limit);
  }
};

// No Dashboard, importe este mock em vez do serviço real
// import { adoptionServiceMock } from '../services/adoptionService.mock';
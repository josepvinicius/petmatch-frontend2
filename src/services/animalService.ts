import { api } from './api';

export interface Animal {
  id: string;
  nome: string;
  especie: string;
  faca: string;
  sexo: string;
  nascimento: string;
  porte: string;
  saude: string;
  status: string;
}

export const animalService = {
  async getAll() {
    const response = await api.get('/animais');
    return response.data;
  },

  async getAvailable() {
    const response = await api.get('/animais/disponiveis');
    return response.data;
  },

  async getBySpecies(especie: string) {
    const response = await api.get(`/animais/especie/${especie}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/animais/${id}`);
    return response.data;
  },

  async create(data: Omit<Animal, 'id'>) {
    const response = await api.post('/animais', data);
    return response.data;
  },

  async update(id: string, data: Partial<Animal>) {
    const response = await api.put(`/animais/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/animais/${id}`);
    return response.data;
  }
};
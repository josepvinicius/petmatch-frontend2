import api from './api';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  CPF: string;
  data_cadastro: string;
  adocoes?: any[];
  contato?: any;
  endereco?: any;
}

export interface UpdateProfileData {
  nome?: string;
  email?: string;
  CPF?: string;
}

export const userService = {
  async getProfile(): Promise<{ user: UserProfile }> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<any> {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  async getAllUsers(): Promise<any> {
    const response = await api.get('/user');
    return response.data;
  },

  async getUserById(id: string): Promise<any> {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  async createUser(data: any): Promise<any> {
    const response = await api.post('/user', data);
    return response.data;
  },

  async updateUser(id: string, data: any): Promise<any> {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<any> {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<any> {
    const response = await api.put('/user/change-password', data);
    return response.data;
  }
};
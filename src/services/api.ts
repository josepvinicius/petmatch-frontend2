import axios from 'axios';

// Configuração base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

 export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Se estiver usando cookies/token HTTP-only
  // withCredentials: true,
});

// Adiciona token JWT a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento específico para erro 401 (não autorizado)
    if (error.response?.status === 401) {
      console.error('Sessão expirada ou token inválido.');
      
      // Só redireciona se não estiver já na página de login
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/cadastro')) {
        
        // Limpa o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Adiciona um pequeno delay para evitar conflitos
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    
    // Você pode adicionar mais tratamentos aqui
    if (error.response?.status === 500) {
      console.error('Erro interno do servidor');
    }
    
    return Promise.reject(error);
  }
);

export default api;
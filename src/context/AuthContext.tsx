import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  isAdmin: boolean; // ← Adicione esta linha
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAdminStatus: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Valida o token com o backend
          const response = await api.get('/auth/profile');
          
          if (response.data.user) {
            const storedUser = authService.getCurrentUser();
            setUser(storedUser);
            
            // Verifica se é admin
            const adminStatus = storedUser?.email === 'admin@petmatch.com' || 
                               storedUser?.email === 'admin@teste.com';
            setIsAdmin(adminStatus);
          } else {
            // Token inválido, limpa o localStorage
            authService.logout();
          }
        } catch (error) {
          // Erro na validação do token, limpa o localStorage
          console.error('Token inválido:', error);
          authService.logout();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Nova função para verificar admin
  const checkAdminStatus = (): boolean => {
    const user = authService.getCurrentUser();
    const adminStatus = user?.email === 'admin@petmatch.com' ||
      user?.email === 'admin@teste.com';
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  const login = async (email: string, senha: string) => {
    try {
      const data = await authService.login({ email, senha });

      // ✅ VERIFICAÇÃO SIMPLES NO FRONTEND
      const adminStatus = email === 'admin@petmatch.com' || email === 'admin@teste.com';

      const userData = {
        ...data.user,
        isAdmin: adminStatus
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(adminStatus);

      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Erro ao fazer login');
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const data = await authService.register(userData);

      // Verifica se é admin
      const adminStatus = userData.email === 'admin@petmatch.com' || userData.email === 'admin@teste.com';

      const userWithAdmin = {
        ...data.user,
        isAdmin: adminStatus
      };

      localStorage.setItem('user', JSON.stringify(userWithAdmin));
      setUser(userWithAdmin);
      setIsAdmin(adminStatus);

      toast.success('Cadastro realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Erro ao cadastrar');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAdmin(false); // ← Limpa também o estado de admin
    toast.success('Logout realizado com sucesso!');
  };

  // ✅ CORREÇÃO AQUI: Inclua TODAS as propriedades no value
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin, // ← Adicione esta linha
      login,
      register,
      logout,
      checkAdminStatus // ← Adicione esta linha
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
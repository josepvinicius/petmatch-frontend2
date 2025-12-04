export interface AuthResponse {
  msg: string;
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    CPF: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  nome: string;
  exp?: number;
  iat?: number;
}

export interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
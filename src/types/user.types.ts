export interface User {
  id: string;
  nome: string;
  email: string;
  CPF: string;
  data_cadastro: string;
  isAdmin?: boolean;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  CPF: string;
  senha: string;
}

export interface UserProfile extends User {
  adocoes?: Adoption[];
  contato?: Contact;
  endereco?: Address;
}

export interface Adoption {
    
}

export interface Contact {
  id: string;
  fone: string;
  email: string;
}

export interface Address {
  id: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  CEP: string;
  municipio: string;
  uf: string;
}
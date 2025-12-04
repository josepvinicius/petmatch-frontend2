export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Adote um Amigo';

export const API_URLS = {
  development: 'http://localhost:3000',
  production: import.meta.env.VITE_API_URL || 'https://seu-backend.onrender.com',
};

export const ANIMAL_STATUS = {
  DISPONIVEL: 'disponível',
  ADOTADO: 'adotado',
  TRATAMENTO: 'em tratamento',
  RESERVADO: 'reservado',
} as const;

export const ANIMAL_SPECIES = {
  DOG: 'Cachorro',
  CAT: 'Gato',
  RABBIT: 'Coelho',
  BIRD: 'Pássaro',
  OTHER: 'Outro',
} as const;

export const ANIMAL_SIZE = {
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
} as const;

export const ANIMAL_GENDER = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
} as const;
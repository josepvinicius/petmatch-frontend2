export interface Animal {
  id: string;
  nome: string;
  especie: string;
  faca: string;
  sexo: 'Macho' | 'Fêmea';
  nascimento: string;
  porte: 'Pequeno' | 'Médio' | 'Grande';
  saude: string;
  status: 'disponível' | 'adotado' | 'em tratamento' | 'reservado';
  created_at?: string;
  updated_at?: string;
  foto?: string;
}

export interface AnimalFilters {
  especie?: string;
  status?: string;
  porte?: string;
  sexo?: string;
  search?: string;
}

export interface AnimalFormData {
  nome: string;
  especie: string;
  faca: string;
  sexo: string;
  nascimento: string;
  porte: string;
  saude: string;
  status: string;
  foto?: string;
}
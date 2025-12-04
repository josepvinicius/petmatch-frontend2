export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateLoginForm = (email: string, senha: string): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!email.includes('@')) {
    errors.email = 'Email inválido';
  }

  if (!senha.trim()) {
    errors.senha = 'Senha é obrigatória';
  } else if (senha.length < 6) {
    errors.senha = 'Senha deve ter pelo menos 6 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (data: {
  nome: string;
  email: string;
  CPF: string;
  senha: string;
  confirmarSenha: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.nome.trim()) {
    errors.nome = 'Nome é obrigatório';
  } else if (data.nome.length < 3) {
    errors.nome = 'Nome deve ter pelo menos 3 caracteres';
  }

  if (!data.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!data.email.includes('@')) {
    errors.email = 'Email inválido';
  }

  if (!data.CPF.trim()) {
    errors.CPF = 'CPF é obrigatório';
  } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data.CPF)) {
    errors.CPF = 'CPF inválido (formato: 000.000.000-00)';
  }

  if (!data.senha.trim()) {
    errors.senha = 'Senha é obrigatória';
  } else if (data.senha.length < 6) {
    errors.senha = 'Senha deve ter pelo menos 6 caracteres';
  }

  if (!data.confirmarSenha.trim()) {
    errors.confirmarSenha = 'Confirmação de senha é obrigatória';
  } else if (data.senha !== data.confirmarSenha) {
    errors.confirmarSenha = 'As senhas não coincidem';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAnimalForm = (data: {
  nome: string;
  especie: string;
  faca: string;
  sexo: string;
  nascimento: string;
  porte: string;
  saude: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.nome.trim()) {
    errors.nome = 'Nome é obrigatório';
  }

  if (!data.especie.trim()) {
    errors.especie = 'Espécie é obrigatória';
  }

  if (!data.faca.trim()) {
    errors.faca = 'Raça/Faça é obrigatória';
  }

  if (!data.sexo.trim()) {
    errors.sexo = 'Sexo é obrigatório';
  }

  if (!data.nascimento.trim()) {
    errors.nascimento = 'Data de nascimento é obrigatória';
  } else {
    const birthDate = new Date(data.nascimento);
    const today = new Date();
    
    if (birthDate > today) {
      errors.nascimento = 'Data de nascimento não pode ser futura';
    }
  }

  if (!data.porte.trim()) {
    errors.porte = 'Porte é obrigatório';
  }

  if (!data.saude.trim()) {
    errors.saude = 'Condição de saúde é obrigatória';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validação de data de adoção
export const validateAdoptionDate = (resgateDate: string, adocaoDate: string): boolean => {
  const resgate = new Date(resgateDate);
  const adocao = new Date(adocaoDate);
  
  return adocao >= resgate;
};
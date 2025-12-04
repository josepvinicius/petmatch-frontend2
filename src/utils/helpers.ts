// Formatar data no padrão brasileiro
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Data não informada';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Formatar CPF
export const formatCPF = (cpf: string): string => {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');
  
  // Aplica a máscara
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

// Calcular idade a partir da data de nascimento
export const calculateAge = (birthDate: string): string => {
  if (!birthDate) return 'Idade não informada';
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years > 0) {
    return `${years} ano${years > 1 ? 's' : ''}`;
  }
  
  return `${months} mês${months > 1 ? 'es' : ''}`;
};

// Validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar CPF (validação básica)
export const isValidCPF = (cpf: string): boolean => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
};

// Capitalizar primeira letra
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Gerar ID aleatório (para mock data)
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
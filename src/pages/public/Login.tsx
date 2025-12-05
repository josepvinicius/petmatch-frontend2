// Login.tsx - VERSÃO ATUALIZADA COM REDIRECIONAMENTO
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ← ADICIONE useLocation
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import '../../../src/styles/pages/auth.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ← ADICIONE ESTA LINHA
  
  // 🔥 CORREÇÃO: Pega a página de onde o usuário veio
  // O ProtectedRoute passa isso no state
  const from = (location.state as any)?.from || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.senha);
      // 🔥 CORREÇÃO: Redireciona para a página original, não sempre para home
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <Input 
            className='input'
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="seu@email.com"
          />
          
          <Input 
            className='input'
            label="Senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            required
            placeholder="Sua senha"
          />

          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>

        <div className="auth-links">
          <p>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
          <p>
            <Link to="/">Voltar para Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
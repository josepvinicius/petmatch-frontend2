import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../../src/styles/pages/profile.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    CPF: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data.user);
      setFormData({
        nome: data.user.nome,
        email: data.user.email,
        CPF: data.user.CPF,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

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
      await userService.updateProfile(formData);
      await fetchProfile();
      setEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      logout();
    }
  };

  if (loading && !profile) {
    return <LoadingSpinner message="Carregando perfil..." />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Meu Perfil</h1>
        <div className="profile-actions">
          <Button
            variant={editing ? 'secondary' : 'primary'}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancelar' : 'Editar Perfil'}
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>

      <div className="profile-content">
        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <Input
              label="Nome Completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label="CPF"
              name="CPF"
              value={formData.CPF}
              onChange={handleChange}
              required
              disabled // CPF geralmente não é editável
            />
            
            <div className="form-actions">
              <Button type="submit" loading={loading}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-section">
              <h3>Informações Pessoais</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Nome:</strong>
                  <span>{profile?.nome}</span>
                </div>
                <div className="info-item">
                  <strong>Email:</strong>
                  <span>{profile?.email}</span>
                </div>
                <div className="info-item">
                  <strong>CPF:</strong>
                  <span>{profile?.CPF}</span>
                </div>
                <div className="info-item">
                  <strong>Data de Cadastro:</strong>
                  <span>
                    {profile?.data_cadastro
                      ? new Date(profile.data_cadastro).toLocaleDateString('pt-BR')
                      : 'Não informada'}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Minhas Adoções</h3>
              {profile?.adocoes && profile.adocoes.length > 0 ? (
                <div className="adoptions-list">
                  {profile.adocoes.slice(0, 3).map((adocao: any) => (
                    <div key={adocao.id} className="adoption-item">
                      <span>{adocao.animal?.nome}</span>
                      <span className="adoption-date">
                        {new Date(adocao.data_adocao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Você ainda não realizou adoções.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
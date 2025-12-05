// src/pages/admin/EditAnimal.tsx - NOVO ARQUIVO
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animalService } from '../../../src/services/animalService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import '../../styles/pages/animal-detail.css';

const EditAnimal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingAnimal, setLoadingAnimal] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    faca: '',
    sexo: '',
    nascimento: '',
    porte: '',
    saude: '',
    status: 'disponível',
    foto: null as string | null,
  });

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) {
        navigate('/admin');
        return;
      }
      
      try {
        setLoadingAnimal(true);
        const response = await animalService.getById(id);
        const animal = response.animal;
        
        // Formatar data para input
        const formattedDate = animal.nascimento 
          ? new Date(animal.nascimento).toISOString().split('T')[0]
          : '';
        
        setFormData({
          nome: animal.nome || '',
          especie: animal.especie || '',
          faca: animal.faca || '',
          sexo: animal.sexo || '',
          nascimento: formattedDate,
          porte: animal.porte || '',
          saude: animal.saude || '',
          status: animal.status || 'disponível',
          foto: animal.foto || null,
        });
      } catch (error) {
        console.error('Erro ao carregar animal:', error);
        alert('Animal não encontrado');
        navigate('/admin');
      } finally {
        setLoadingAnimal(false);
      }
    };

    fetchAnimal();
  }, [id, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem (JPG, PNG, GIF)');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          foto: reader.result as string,
        });
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar imagem');
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);
    try {
      const dataToSend = {
        nome: formData.nome,
        especie: formData.especie,
        faca: formData.faca || 'SRD',
        sexo: formData.sexo,
        nascimento: formData.nascimento || new Date().toISOString().split('T')[0],
        porte: formData.porte,
        saude: formData.saude || 'Saudável',
        status: formData.status,
        foto: formData.foto || undefined,
      };

      await animalService.update(id, dataToSend);
      alert('Animal atualizado com sucesso!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Erro ao atualizar animal:', error);
      alert(error.response?.data?.msg || 'Erro ao atualizar animal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Tem certeza que deseja excluir este animal?')) {
      return;
    }

    setLoading(true);
    try {
      await animalService.delete(id);
      alert('Animal excluído com sucesso!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Erro ao excluir animal:', error);
      alert(error.response?.data?.msg || 'Erro ao excluir animal');
    } finally {
      setLoading(false);
    }
  };

  const handleClearPhoto = () => {
    setFormData({
      ...formData,
      foto: null
    });
  };

  if (loadingAnimal) {
    return <div className="loading">Carregando animal...</div>;
  }

  return (
    <div className="edit-animal-container">
      <div className="edit-animal-header">
        <h1>Editar Animal: {formData.nome}</h1>
        <Button variant="secondary" onClick={() => navigate('/admin')}>
          Voltar para Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="edit-animal-form">
        <div className="form-grid">
          {/* Seção de Foto */}
          <div className="form-group photo-section">
            <label>Foto do Animal</label>
            <div className="photo-upload-area">
              {formData.foto ? (
                <div className="photo-preview">
                  <img
                    src={formData.foto}
                    alt="Preview"
                    className="preview-image"
                  />
                  <div className="photo-actions">
                    <button
                      type="button"
                      className="btn-remove-photo"
                      onClick={handleClearPhoto}
                    >
                      Remover Foto
                    </button>
                    <label htmlFor="photo-upload" className="btn-change-photo">
                      Alterar Foto
                    </label>
                  </div>
                </div>
              ) : (
                <div className="photo-upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Clique para selecionar uma foto</p>
                  <small>Formatos: JPG, PNG</small>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="photo-input"
                    id="photo-upload"
                    disabled={loading}
                  />
                  <label htmlFor="photo-upload" className="btn-upload">
                    Selecionar Foto
                  </label>
                </div>
              )}
            </div>
          </div>

          <Input
            label="Nome do Animal *"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Ex: Rex, Luna, etc."
          />

          <div className="form-group">
            <label>Espécie *</label>
            <select
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Selecione</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Coelho">Coelho</option>
              <option value="Pássaro">Pássaro</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <Input
            label="Raça/Faça"
            name="faca"
            value={formData.faca}
            onChange={handleChange}
            placeholder="Ex: Vira-lata, SRD, etc. (opcional)"
          />

          <div className="form-group">
            <label>Sexo *</label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Selecione</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>
          </div>

          <Input
            label="Data de Nascimento"
            name="nascimento"
            type="date"
            value={formData.nascimento}
            onChange={handleChange}
          />

          <div className="form-group">
            <label>Porte *</label>
            <select
              name="porte"
              value={formData.porte}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Selecione</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>

          <Input
            label="Condição de Saúde"
            name="saude"
            value={formData.saude}
            onChange={handleChange}
            placeholder="Ex: Saudável, Tratamento, etc."
          />

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="disponível">Disponível</option>
              <option value="em tratamento">Em Tratamento</option>
              <option value="adotado">Adotado</option>
              <option value="reservado">Reservado</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" loading={loading} className="btn-save">
            Salvar Alterações
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={loading}
            className="btn-delete"
          >
            Excluir Animal
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditAnimal;
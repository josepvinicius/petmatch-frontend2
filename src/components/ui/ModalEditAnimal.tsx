import React, { useState, useEffect } from 'react';
import { animalService } from '../../services/animalService';
import { imageUtils } from '../../utils/imageUtils';
import '../../styles/components/modal-edit-animal.css';

interface ModalEditAnimalProps {
  isOpen: boolean;
  onClose: () => void;
  animalId: string;
  onUpdate: () => void;
}

interface AnimalFormData {
  id: string;
  nome: string;
  especie: string;
  faca: string;
  sexo: string;
  nascimento: string;
  porte: string;
  saude: string;
  status: string;
  foto: string | null;
}

const ModalEditAnimal: React.FC<ModalEditAnimalProps> = ({
  isOpen,
  onClose,
  animalId,
  onUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingAnimal, setLoadingAnimal] = useState(false);
  const [formData, setFormData] = useState<AnimalFormData>({
    id: '',
    nome: '',
    especie: '',
    faca: '',
    sexo: '',
    nascimento: '',
    porte: '',
    saude: '',
    status: 'disponível',
    foto: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && animalId) {
      loadAnimal();
    }
  }, [isOpen, animalId]);

  const loadAnimal = async () => {
    try {
      setLoadingAnimal(true);
      const response = await animalService.getById(animalId);
      const animal = response.animal;
      
      // Formatar data para input
      const formattedDate = animal.nascimento 
        ? new Date(animal.nascimento).toISOString().split('T')[0]
        : '';
      
      setFormData({
        id: animal.id,
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

      if (animal.foto) {
        setImagePreview(animal.foto);
      }
    } catch (error) {
      console.error('Erro ao carregar animal:', error);
      alert('Erro ao carregar animal');
      onClose();
    } finally {
      setLoadingAnimal(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem (JPG, PNG, GIF)');
      return;
    }

    // Limite de 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB');
      return;
    }

    setLoading(true);
    try {
      const base64 = await imageUtils.fileToBase64Simple(file);
      setFormData(prev => ({
        ...prev,
        foto: base64
      }));
      setImagePreview(base64);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar imagem. Tente uma imagem menor.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearPhoto = () => {
    setFormData(prev => ({
      ...prev,
      foto: null
    }));
    setImagePreview(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.especie.trim()) {
      newErrors.especie = 'Espécie é obrigatória';
    }
    
    if (!formData.sexo) {
      newErrors.sexo = 'Sexo é obrigatório';
    }
    
    if (!formData.porte) {
      newErrors.porte = 'Porte é obrigatório';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // Formatar dados para envio
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
      
      await animalService.update(formData.id, dataToSend);
      alert('Animal atualizado com sucesso!');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar animal:', error);
      alert(error.response?.data?.msg || 'Erro ao atualizar animal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este animal?')) {
      return;
    }
    
    setLoading(true);
    try {
      await animalService.delete(formData.id);
      alert('Animal excluído com sucesso!');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Erro ao excluir animal:', error);
      alert(error.response?.data?.msg || 'Erro ao excluir animal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <h2>Editar Animal</h2>
            <p>Atualize as informações de {formData.nome}</p>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            disabled={loading}
          >
            &times;
          </button>
        </div>

        {/* Loading */}
        {loadingAnimal ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Carregando informações do animal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-content">
            {/* Seção de Foto */}
            <div className="photo-section">
              <label className="form-label">Foto do Animal (opcional)</label>
              
              <div className="photo-container">
                {/* Preview da Foto */}
                <div className="photo-preview-container">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="photo-preview"
                      />
                      <button
                        type="button"
                        onClick={handleClearPhoto}
                        className="photo-remove-btn"
                        title="Remover foto"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="photo-upload-placeholder">
                      <span className="icon">📷</span>
                      <span className="text">Sem foto</span>
                    </div>
                  )}
                </div>

                {/* Controles de Upload */}
                <div className="photo-controls">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="photo-upload-edit"
                        className="photo-upload-btn"
                      >
                        <span className="icon">📤</span>
                        {imagePreview ? 'Alterar Foto' : 'Adicionar Foto'}
                      </label>
                      <input
                        type="file"
                        id="photo-upload-edit"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="photo-info">
                      <p>• Formatos: JPG, PNG, GIF</p>
                      <p>• Tamanho máximo: 2MB</p>
                      <p>• As fotos são otimizadas automaticamente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Campos */}
            <div className="form-grid">
              {/* Nome */}
              <div className="form-group">
                <label className="form-label required">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`form-input ${errors.nome ? 'error' : ''}`}
                  placeholder="Nome do animal"
                  disabled={loading}
                />
                {errors.nome && (
                  <p className="form-error">{errors.nome}</p>
                )}
              </div>

              {/* Espécie */}
              <div className="form-group">
                <label className="form-label required">Espécie</label>
                <select
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  className={`form-select ${errors.especie ? 'error' : ''}`}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Coelho">Coelho</option>
                  <option value="Pássaro">Pássaro</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.especie && (
                  <p className="form-error">{errors.especie}</p>
                )}
              </div>

              {/* Raça/Faça */}
              <div className="form-group">
                <label className="form-label">Raça/Faça</label>
                <input
                  type="text"
                  name="faca"
                  value={formData.faca}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: Vira-lata, SRD, etc."
                  disabled={loading}
                />
              </div>

              {/* Sexo */}
              <div className="form-group">
                <label className="form-label required">Sexo</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className={`form-select ${errors.sexo ? 'error' : ''}`}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
                {errors.sexo && (
                  <p className="form-error">{errors.sexo}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div className="form-group">
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              {/* Porte */}
              <div className="form-group">
                <label className="form-label required">Porte</label>
                <select
                  name="porte"
                  value={formData.porte}
                  onChange={handleChange}
                  className={`form-select ${errors.porte ? 'error' : ''}`}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
                {errors.porte && (
                  <p className="form-error">{errors.porte}</p>
                )}
              </div>

              {/* Saúde */}
              <div className="form-group">
                <label className="form-label">Condição de Saúde</label>
                <input
                  type="text"
                  name="saude"
                  value={formData.saude}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: Saudável, Em tratamento, etc."
                  disabled={loading}
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label required">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`form-select ${errors.status ? 'error' : ''}`}
                  disabled={loading}
                >
                  <option value="disponível">Disponível</option>
                  <option value="em tratamento">Em Tratamento</option>
                  <option value="adotado">Adotado</option>
                  <option value="reservado">Reservado</option>
                </select>
                {errors.status && (
                  <p className="form-error">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Notas */}
            <div className="form-notes">
              <p><span className="font-medium">Nota:</span> * Campos obrigatórios</p>
            </div>

            {/* Ações */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="action-btn action-btn-save"
              >
                <span className="icon">💾</span>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="action-btn action-btn-delete"
              >
                <span className="icon">🗑️</span>
                Excluir Animal
              </button>
              
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="action-btn action-btn-cancel"
              >
                <span className="icon">✕</span>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalEditAnimal;
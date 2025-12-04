import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../../services/animalService';
import { imageUtils } from '../../utils/imageUtils'; // ← ADICIONE ESTA IMPORT
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import '../../../src/styles/pages/add-animal.css';

const AddAnimal: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  // Handler para upload de foto
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações básicas
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem (JPG, PNG, GIF)');
      return;
    }

    // Limite reduzido para 1MB
    if (file.size > 1 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 1MB. Ela será comprimida automaticamente.');
    }

    setLoading(true);

    try {
      // Usa a versão SIMPLIFICADA para maior compressão
      const base64 = await imageUtils.fileToBase64Simple(file);

      // Verifica tamanho final (aproximado)
      const base64Size = (base64.length * 3) / 4; // Estimativa aproximada
      if (base64Size > 300 * 1024) { // 300KB
        console.warn('Imagem ainda muito grande após compressão:', Math.round(base64Size / 1024), 'KB');
      }

      setFormData({
        ...formData,
        foto: base64
      });
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar imagem. Tente uma imagem menor.');
    } finally {
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
    setLoading(true);

    try {
      // Validação adicional
      if (!formData.nome || !formData.especie || !formData.sexo || !formData.porte) {
        alert('Por favor, preencha todos os campos obrigatórios (*)');
        setLoading(false);
        return;
      }

      // Preparar dados com foto (se existir)
      const dataToSend = {
        nome: formData.nome,
        especie: formData.especie,
        faca: formData.faca || 'SRD', // Default se vazio
        sexo: formData.sexo,
        nascimento: formData.nascimento || new Date().toISOString().split('T')[0], // Default hoje
        porte: formData.porte,
        saude: formData.saude || 'Saudável', // Default
        status: formData.status,
        foto: formData.foto || undefined, // Envia undefined se não tiver foto
      };

      await animalService.create(dataToSend);
      alert('Animal cadastrado com sucesso!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Erro ao cadastrar animal:', error);
      alert(error.response?.data?.msg || 'Erro ao cadastrar animal');
    } finally {
      setLoading(false);
    }
  };

  // Limpar foto
  const handleClearPhoto = () => {
    setFormData({
      ...formData,
      foto: null
    });
  };

  return (
    <div className="add-animal-container">
      <div className="add-animal-header">
        <h1>Cadastrar Novo Animal</h1>
        <Button variant="secondary" onClick={() => navigate('/admin')}>
          Voltar para Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="add-animal-form">
        <div className="form-grid">
          {/* Seção de Foto */}
          <div className="form-group photo-section">
            <label>Foto do Animal (opcional)</label>
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
                  <small>Formatos: JPG, PNG. Máx: 2MB</small>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="photo-input"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="btn-upload">
                    Selecionar Foto
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Campos existentes */}
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
            placeholder="Opcional - deixe em branco para desconhecida"
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
            placeholder="Ex: Saudável, Tratamento, etc. (opcional)"
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

        <div className="form-info">
          <p className="form-note">* Campos obrigatórios</p>
          <p className="form-note">📷 As fotos são automaticamente otimizadas para melhor desempenho</p>
        </div>

        <div className="form-actions">
          <Button type="submit" loading={loading} className="btn-submit">
            Cadastrar Animal
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

export default AddAnimal;
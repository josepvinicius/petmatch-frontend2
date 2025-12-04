import React, { useState } from 'react';
import { animalService } from '../../services/animalService';
import { imageUtils } from '../../utils/imageUtils';

interface AnimalFormProps {
  onSuccess?: () => void;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ onSuccess }) => {
  
  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    faca: '',
    sexo: '',
    nascimento: '',
    porte: '',
    saude: '',
    status: 'disponível', 
    foto: '' as string | undefined
  });
  
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verifica se é imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    // Verifica tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    try {
      const base64 = await imageUtils.fileToBase64(file);
      setFormData({ ...formData, foto: base64 });
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar imagem');
    }
  };

  // ADICIONE UM HANDLER PARA OS OUTROS CAMPOS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ADICIONE O STATUS AO ENVIAR (se ainda não estiver incluído)
      const dataToSend = {
        ...formData,
        status: formData.status || 'disponível'  // Garante que tenha um status
      };
      
      await animalService.create(dataToSend);
      alert('Animal cadastrado com sucesso!');
      
      // RESET DO FORM (incluindo status)
      setFormData({
        nome: '',
        especie: '',
        faca: '',
        sexo: '',
        nascimento: '',
        porte: '',
        saude: '',
        status: 'disponível',
        foto: undefined
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao cadastrar animal:', error);
      alert('Erro ao cadastrar animal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos existentes... */}
      
      {/* Campo de nome */}
      <div className="form-group">
        <label>Nome do Animal *</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          required
          className="form-control"
          placeholder="Ex: Rex, Luna, Thor"
        />
      </div>
      
      {/* Campo de espécie */}
      <div className="form-group">
        <label>Espécie *</label>
        <input
          type="text"
          name="especie"
          value={formData.especie}
          onChange={handleInputChange}
          required
          className="form-control"
          placeholder="Ex: Cachorro, Gato"
        />
      </div>
      
      {/* Campo de raça (faca) */}
      <div className="form-group">
        <label>Raça *</label>
        <input
          type="text"
          name="faca"
          value={formData.faca}
          onChange={handleInputChange}
          required
          className="form-control"
          placeholder="Ex: Vira-lata, SRD, Labrador"
        />
      </div>
      
      {/* Campo de sexo */}
      <div className="form-group">
        <label>Sexo *</label>
        <select
          name="sexo"
          value={formData.sexo}
          onChange={handleInputChange}
          required
          className="form-control"
        >
          <option value="">Selecione</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </select>
      </div>
      
      {/* Campo de data de nascimento */}
      <div className="form-group">
        <label>Data de Nascimento *</label>
        <input
          type="date"
          name="nascimento"
          value={formData.nascimento}
          onChange={handleInputChange}
          required
          className="form-control"
        />
      </div>
      
      {/* Campo de porte */}
      <div className="form-group">
        <label>Porte *</label>
        <select
          name="porte"
          value={formData.porte}
          onChange={handleInputChange}
          required
          className="form-control"
        >
          <option value="">Selecione</option>
          <option value="Pequeno">Pequeno</option>
          <option value="Médio">Médio</option>
          <option value="Grande">Grande</option>
        </select>
      </div>
      
      {/* Campo de saúde */}
      <div className="form-group">
        <label>Condição de Saúde *</label>
        <input
          type="text"
          name="saude"
          value={formData.saude}
          onChange={handleInputChange}
          required
          className="form-control"
          placeholder="Ex: Saudável, Tratamento em andamento"
        />
      </div>

      {/* Campo de foto */}
      <div className="form-group">
        <label>Foto do Animal</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-control"
        />
        <small className="text-muted">
          Formatos: JPG, PNG, GIF. Máximo: 5MB
        </small>
        
        {/* Preview da imagem */}
        {formData.foto && (
          <div className="mt-2">
            <p>Preview:</p>
            <img 
              src={formData.foto} 
              alt="Preview" 
              style={{ 
                maxWidth: '200px', 
                maxHeight: '150px',
                borderRadius: '8px'
              }} 
            />
          </div>
        )}
      </div>

      {/* Campo status (pode ser oculto) */}
      <input
        type="hidden"
        name="status"
        value={formData.status}
      />

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? 'Salvando...' : 'Cadastrar Animal'}
      </button>
    </form>
  );
};

export default AnimalForm;
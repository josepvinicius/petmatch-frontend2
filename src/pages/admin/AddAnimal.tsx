import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../../services/animalService';
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
  });

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
      await animalService.create(formData);
      alert('Animal cadastrado com sucesso!');
      navigate('/animais');
    } catch (error: any) {
      console.error('Erro ao cadastrar animal:', error);
      alert(error.response?.data?.msg || 'Erro ao cadastrar animal');
    } finally {
      setLoading(false);
    }
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
          <Input
            label="Nome do Animal"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Ex: Rex, Luna, etc."
          />

          <div className="form-group">
            <label>Espécie</label>
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
            required
            placeholder="Ex: Vira-lata, SRD, etc."
          />

          <div className="form-group">
            <label>Sexo</label>
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
            required
          />

          <div className="form-group">
            <label>Porte</label>
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
            required
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
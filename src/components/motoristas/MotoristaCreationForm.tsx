'use client';

import React, { useState } from 'react';
import { createMotorista, MotoristaData } from '@/services/motorista';

const initialData: MotoristaData = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cnh: '', 
    cnh_vencimento: '',
    placa_veiculo: '',
    modelo_veiculo: '',
    cor_veiculo: '',
    ano_veiculo: ''
};

const MotoristaCreationForm: React.FC = () => {
    const [formData, setFormData] = useState<MotoristaData>(initialData);
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', message: '' });

        try {
            await createMotorista(formData);
            setStatusMessage({ type: 'success', message: 'Motorista criado com sucesso!' });
            setFormData(initialData);
        } catch (err: any) {
            setStatusMessage({ type: 'error', message: 'Erro ao criar motorista.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nome:
                <input name="nome" value={formData.nome} onChange={handleChange} required />
            </label>
            <label>
                CPF:
                <input name="cpf" value={formData.cpf} onChange={handleChange} required />
            </label>
            <label>
                E-mail:
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
                Telefone:
                <input name="telefone" value={formData.telefone} onChange={handleChange} required />
            </label>
            <label>
                CNH:
                <input name="cnh" value={formData.cnh} onChange={handleChange} required />
            </label>
            <label>
                Vencimento da CNH:
                <input name="cnh_vencimento" type="date" value={formData.cnh_vencimento} onChange={handleChange} required />
            </label>
            <label>
                Placa do Veículo:
                <input name="placa_veiculo" value={formData.placa_veiculo} onChange={handleChange} required />
            </label>
            <label>
                Modelo do Veículo:
                <input name="modelo_veiculo" value={formData.modelo_veiculo} onChange={handleChange} required />
            </label>
            <label>
                Cor do Veículo:
                <input name="cor_veiculo" value={formData.cor_veiculo} onChange={handleChange} required />
            </label>
            <label>
                Ano do Veículo:
                <input name="ano_veiculo" value={formData.ano_veiculo} onChange={handleChange} required />
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Motorista'}
            </button>
            {statusMessage.message && (
                <div className={statusMessage.type}>
                    {statusMessage.message}
                </div>
            )}
        </form>
    );
};

export default MotoristaCreationForm;

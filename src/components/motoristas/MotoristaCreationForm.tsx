'use client';

import React, { useState } from 'react';
import { createMotorista, MotoristaData } from '@/services/motorista';

const initialData: MotoristaData = {
    nome: '',
    cnh: '',
    placa_veiculo: '',
    modelo_veiculo: '',
};

const MotoristaCreationForm: React.FC = () => {
    const [formData, setFormData] = useState<MotoristaData>(initialData);
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage({ type: '', message: '' });
        setLoading(true);

        try {
            const response = await createMotorista(formData);
            
            setStatusMessage({ type: 'success', message: `Motorista ${response.nome} (CNH: ${response.cnh}) cadastrado com sucesso!` });
            setFormData(initialData);
            
        } catch (error: any) {
            setStatusMessage({ type: 'error', message: error.message || 'Erro desconhecido ao cadastrar motorista.' });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = { padding: '10px', margin: '5px 0', width: '100%', boxSizing: 'border-box' };
    const btnStyle: React.CSSProperties = { padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
    const containerStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };

    return (
        <div style={containerStyle}>
            <h2>Cadastrar Novo Motorista</h2>
            
            {statusMessage.message && (
                <div style={{ padding: '10px', borderRadius: '4px', marginBottom: '20px', backgroundColor: statusMessage.type === 'success' ? '#d4edda' : '#f8d7da', color: statusMessage.type === 'success' ? '#155724' : '#721c24' }}>
                    {statusMessage.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label htmlFor="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="cnh">CNH</label>
                        <input type="text" id="cnh" name="cnh" value={formData.cnh} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="placa_veiculo">Placa do Veículo</label>
                        <input type="text" id="placa_veiculo" name="placa_veiculo" value={formData.placa_veiculo} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="modelo_veiculo">Modelo do Veículo</label>
                        <input type="text" id="modelo_veiculo" name="modelo_veiculo" value={formData.modelo_veiculo} onChange={handleChange} required style={inputStyle} />
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" disabled={loading} style={{ ...btnStyle, backgroundColor: loading ? '#28a74599' : '#28a745', color: 'white' }}>
                        {loading ? 'Cadastrando...' : 'Cadastrar Motorista'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MotoristaCreationForm;

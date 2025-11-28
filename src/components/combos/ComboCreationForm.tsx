'use client';

import React, { useState } from 'react';
import { createCombo, ComboCreateData, PontoTuristicoData } from '@/services/combo';
import { useRouter } from 'next/navigation';

// Estado inicial para um ponto turistico vazio
const emptyPonto: PontoTuristicoData = {
    nome_ponto: '',
    endereco: '',
    latitude: 0.0,
    longitude: 0.0,
    ordem_sequencial: 1,
};

// CORREÇÃO FINAL: Usa um tipo simples e explicito para o estado do FORMULARIO
interface LocalComboFormState {
    nome: string;
    descricao: string;
    preco_fixo: string; // EXPLICITAMENTE STRING no estado inicial
    parceiro_hotel: string;
}

const ComboCreationForm: React.FC = () => {
    const router = useRouter();
    const [comboData, setComboData] = useState<LocalComboFormState>({ // Aplica o tipo simples
        nome: '',
        descricao: '',
        preco_fixo: '0.00',
        parceiro_hotel: '',
    });
    const [pontos, setPontos] = useState<PontoTuristicoData[]>([{ ...emptyPonto }]);
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    // --- Handlers de Mudança ---

    const handleComboChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setComboData(prev => ({ ...prev, [name]: value }));
    };

    const handlePontoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newPontos = pontos.map((ponto, i) => {
            if (i === index) {
                // Converte Latitude, Longitude e Ordem para numero
                const numericValue = ['latitude', 'longitude', 'ordem_sequencial'].includes(name) ? parseFloat(value) : value;
                return { ...ponto, [name]: numericValue };
            }
            return ponto;
        });
        setPontos(newPontos);
    };

    // --- Adicionar/Remover Pontos ---

    const addPonto = () => {
        const newOrd = pontos.length + 1;
        setPontos(prev => [...prev, { ...emptyPonto, ordem_sequencial: newOrd }]);
    };

    const removePonto = (index: number) => {
        if (pontos.length > 1) {
            setPontos(prev => prev.filter((_, i) => i !== index));
        }
    };

    // --- Submissão do Formulário ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage({ type: '', message: '' });
        setLoading(true);

        try {
            // Validacao basica dos pontos
            const validPontos = pontos.every(p => p.nome_ponto && p.endereco && p.latitude !== 0 && p.longitude !== 0);
            if (!validPontos) {
                throw new Error("Por favor, preencha todos os campos de todos os Pontos Turísticos.");
            }

            // CRÍTICO: Converte o preco_fixo de volta para número antes de enviar para a API
            const finalData: ComboCreateData = {
                nome: comboData.nome,
                descricao: comboData.descricao,
                parceiro_hotel: comboData.parceiro_hotel,
                preco_fixo: parseFloat(comboData.preco_fixo), // CONVERSAO AQUI
                pontos: pontos.sort((a, b) => a.ordem_sequencial - b.ordem_sequencial),
            };

            const response = await createCombo(finalData);
            
            setStatusMessage({ type: 'success', message: `Combo Turístico "${response.nome}" criado com sucesso! ID: ${response.id}. A IA otimizou a rota.` });
            
            // Limpa o formulario apos o sucesso (opcional)
            setComboData({
                nome: '',
                descricao: '',
                preco_fixo: '0.00',
                parceiro_hotel: '',
            });
            setPontos([{ ...emptyPonto }]);
            
        } catch (error: any) {
            setStatusMessage({ type: 'error', message: error.message || 'Erro desconhecido.' });
            if (error.message.includes("Token JWT ausente")) {
                router.push('/');
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Estilos de Componente (Inline para simplicidade) ---

    const inputStyle: React.CSSProperties = { padding: '10px', margin: '5px 0', width: '100%', boxSizing: 'border-box' };
    const btnStyle: React.CSSProperties = { padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
    const containerStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
    const pontoContainerStyle: React.CSSProperties = { border: '1px dashed #ccc', padding: '15px', margin: '15px 0', borderRadius: '6px' };

    return (
        <div style={containerStyle}>
            <h2>Criar Novo Combo</h2>
            
            {statusMessage.message && (
                <div style={{ padding: '10px', borderRadius: '4px', marginBottom: '20px', backgroundColor: statusMessage.type === 'success' ? '#d4edda' : '#f8d7da', color: statusMessage.type === 'success' ? '#155724' : '#721c24' }}>
                    {statusMessage.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* --- SECAO 1: Dados Basicos do Combo --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label htmlFor="nome">Nome do Combo (Ex: "Tour Luxo Rio")</label>
                        <input type="text" id="nome" name="nome" value={comboData.nome} onChange={handleComboChange} required style={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="preco_fixo">Preço Fixo (R$)</label>
                        <input type="number" id="preco_fixo" name="preco_fixo" value={comboData.preco_fixo} onChange={handleComboChange} required step="0.01" style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="descricao">Descrição (Para o App do Passageiro)</label>
                        <textarea id="descricao" name="descricao" value={comboData.descricao} onChange={handleComboChange} required style={{ ...inputStyle, height: '80px' }} />
                    </div>
                    <div>
                        <label htmlFor="parceiro_hotel">Parceiro Hotel (Opcional)</label>
                        <input type="text" id="parceiro_hotel" name="parceiro_hotel" value={comboData.parceiro_hotel} onChange={handleComboChange} style={inputStyle} />
                    </div>
                </div>

                <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                    Pontos Turísticos ({pontos.length} Pontos)
                </h3>

                {/* --- SECAO 2: Pontos Dinamicos --- */}
                {pontos.map((ponto, index) => (
                    <div key={index} style={pontoContainerStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h4>Ponto #{index + 1}</h4>
                            {pontos.length > 1 && (
                                <button type="button" onClick={() => removePonto(index)} style={{ ...btnStyle, backgroundColor: '#f00', color: 'white' }}>
                                    Remover
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
                            <div>
                                <label htmlFor={`nome_ponto-${index}`}>Nome</label>
                                <input type="text" id={`nome_ponto-${index}`} name="nome_ponto" value={ponto.nome_ponto} onChange={(e) => handlePontoChange(index, e as any)} required style={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor={`latitude-${index}`}>Latitude</label>
                                <input type="number" id={`latitude-${index}`} name="latitude" value={ponto.latitude} onChange={(e) => handlePontoChange(index, e as any)} required step="any" style={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor={`longitude-${index}`}>Longitude</label>
                                <input type="number" id={`longitude-${index}`} name="longitude" value={ponto.longitude} onChange={(e) => handlePontoChange(index, e as any)} required step="any" style={inputStyle} />
                            </div>
                             <div>
                                <label htmlFor={`ordem_sequencial-${index}`}>Ordem</label>
                                <input type="number" id={`ordem_sequencial-${index}`} name="ordem_sequencial" value={ponto.ordem_sequencial} onChange={(e) => handlePontoChange(index, e as any)} required style={inputStyle} />
                            </div>
                            <div style={{ gridColumn: 'span 4' }}>
                                <label htmlFor={`endereco-${index}`}>Endereço Completo</label>
                                <input type="text" id={`endereco-${index}`} name="endereco" value={ponto.endereco} onChange={(e) => handlePontoChange(index, e as any)} required style={inputStyle} />
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* --- SECAO 3: Acoes --- */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={addPonto} style={{ ...btnStyle, backgroundColor: '#28a745', color: 'white' }}>
                        + Adicionar Ponto
                    </button>
                    
                    <button type="submit" disabled={loading} style={{ ...btnStyle, backgroundColor: loading ? '#007bff99' : '#007bff', color: 'white' }}>
                        {loading ? 'Processando IA...' : 'Criar Combo Otimizado'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComboCreationForm;

'use client';

import React, { useState, useEffect } from 'react';
import { updateCombo, ComboCreateData, PontoTuristicoData, ComboResponse } from '@/services/combo';

// CORREÇÃO: Define a interface do estado local do formulário
// onde preco_fixo é obrigatoriamente uma string para o input HTML.
interface ComboEditFormState {
    nome: string;
    descricao: string;
    preco_fixo: string; 
    parceiro_hotel: string;
}

// Estado inicial para um ponto turístico vazio
const emptyPonto: PontoTuristicoData = {
    nome_ponto: '',
    endereco: '',
    latitude: 0.0,
    longitude: 0.0,
    ordem_sequencial: 1,
};

interface ComboEditModalProps {
    combo: ComboResponse | null; 
    onClose: () => void;
    onUpdate: (updatedCombo: ComboResponse) => void;
}

const ComboEditModal: React.FC<ComboEditModalProps> = ({ combo, onClose, onUpdate }) => {
    
    // O modal só deve ser exibido se tiver dados de combo
    if (!combo) return null;

    // Converte os dados do combo para o formato de estado de formulário
    const initialComboData: ComboEditFormState = {
        nome: combo.nome,
        descricao: combo.descricao,
        preco_fixo: combo.preco_fixo.toFixed(2), // Converte número para string (Correto)
        parceiro_hotel: combo.parceiro_hotel || '',
    };
    
    // Usa a interface corrigida (ComboEditFormState)
    const [comboData, setComboData] = useState<ComboEditFormState>(initialComboData);
    const [pontos, setPontos] = useState<PontoTuristicoData[]>(combo.pontos);
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    // Efeito para redefinir o estado quando o combo (prop) muda
    useEffect(() => {
        if (combo) {
            setComboData({
                nome: combo.nome,
                descricao: combo.descricao,
                preco_fixo: combo.preco_fixo.toFixed(2),
                parceiro_hotel: combo.parceiro_hotel || '',
            });
            setPontos(combo.pontos);
            setStatusMessage({ type: '', message: '' });
        }
    }, [combo]);


    // --- Handlers de Mudança ---

    const handleComboChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setComboData(prev => ({ ...prev, [name]: value }));
    };

    const handlePontoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newPontos = pontos.map((ponto, i) => {
            if (i === index) {
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

    // --- Submissão da Edição (PUT) ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage({ type: '', message: '' });
        setLoading(true);

        try {
            // Validação e formatação de dados para a API
            const finalData: ComboCreateData = {
                nome: comboData.nome,
                descricao: comboData.descricao,
                parceiro_hotel: comboData.parceiro_hotel,
                preco_fixo: parseFloat(comboData.preco_fixo), // CONVERTE STRING DE VOLTA PARA NUMBER
                pontos: pontos.sort((a, b) => a.ordem_sequencial - b.ordem_sequencial),
            };

            // Chama a função de atualização (PUT)
            const response = await updateCombo(combo.id, finalData);
            
            setStatusMessage({ type: 'success', message: `Combo "${response.nome}" atualizado com sucesso!` });
            
            // Notifica o componente pai (tabela) para atualizar a lista
            onUpdate(response);
            onClose(); // Fecha o modal após o sucesso
            
        } catch (error: any) {
            setStatusMessage({ type: 'error', message: error.message || 'Erro desconhecido ao atualizar combo.' });
        } finally {
            setLoading(false);
        }
    };

    // --- Estilos do Modal (Inline para simplificar) ---
    const modalBackground: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalContent: React.CSSProperties = { backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', width: '90%', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };
    const inputStyle: React.CSSProperties = { padding: '10px', margin: '5px 0', width: '100%', boxSizing: 'border-box' };
    const btnStyle: React.CSSProperties = { padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
    const pontoContainerStyle: React.CSSProperties = { border: '1px dashed #ccc', padding: '15px', margin: '15px 0', borderRadius: '6px', backgroundColor: '#f9f9f9' };

    return (
        <div style={modalBackground}>
            <div style={modalContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h2>✏️ Editando Combo ID: {combo.id}</h2>
                    <button onClick={onClose} style={{ ...btnStyle, backgroundColor: '#6c757d', color: 'white' }}>
                        Fechar
                    </button>
                </div>

                {statusMessage.message && (
                    <div style={{ padding: '10px', borderRadius: '4px', marginBottom: '20px', backgroundColor: statusMessage.type === 'success' ? '#d4edda' : '#f8d7da', color: statusMessage.type === 'success' ? '#155724' : '#721c24' }}>
                        {statusMessage.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* --- Dados Basicos do Combo --- */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label htmlFor="nome">Nome do Combo</label>
                            <input type="text" id="nome" name="nome" value={comboData.nome} onChange={handleComboChange} required style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="preco_fixo">Preço Fixo (R$)</label>
                            <input type="number" id="preco_fixo" name="preco_fixo" value={comboData.preco_fixo} onChange={handleComboChange} required step="0.01" style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="descricao">Descrição</label>
                            <textarea id="descricao" name="descricao" value={comboData.descricao} onChange={handleComboChange} required style={{ ...inputStyle, height: '80px' }} />
                        </div>
                        <div>
                            <label htmlFor="parceiro_hotel">Parceiro Hotel</label>
                            <input type="text" id="parceiro_hotel" name="parceiro_hotel" value={comboData.parceiro_hotel} onChange={handleComboChange} style={inputStyle} />
                        </div>
                    </div>

                    <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                        Pontos Turísticos ({pontos.length} Pontos)
                    </h3>

                    {/* --- Pontos Dinamicos --- */}
                    {pontos.map((ponto, index) => (
                        <div key={index} style={pontoContainerStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4>Ponto #{index + 1} (Ordem de Visita: {ponto.ordem_sequencial})</h4>
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
                                    <label htmlFor={`ordem_sequencial-${index}`}>Nova Ordem</label>
                                    <input type="number" id={`ordem_sequencial-${index}`} name="ordem_sequencial" value={ponto.ordem_sequencial} onChange={(e) => handlePontoChange(index, e as any)} required style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: 'span 4' }}>
                                    <label htmlFor={`endereco-${index}`}>Endereço Completo</label>
                                    <input type="text" id={`endereco-${index}`} name="endereco" value={ponto.endereco} onChange={(e) => handlePontoChange(index, e as any)} required style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* --- Acoes --- */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={addPonto} style={{ ...btnStyle, backgroundColor: '#28a745', color: 'white' }}>
                            + Adicionar Ponto
                        </button>
                        
                        <button type="submit" disabled={loading} style={{ ...btnStyle, backgroundColor: loading ? '#0056b399' : '#0056b3', color: 'white' }}>
                            {loading ? 'Salvando...' : 'Salvar Edição'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComboEditModal;

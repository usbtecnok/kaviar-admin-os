'use client';

import React, { useEffect, useState } from 'react';
import { listCombos, deleteCombo, ComboResponse } from '@/services/combo';
import { useRouter } from 'next/navigation';
import { getToken } from '@/services/auth'; 
import ComboCreationForm from './ComboCreationForm';
import ComboEditModal from './ComboEditModal'; // IMPORTAÇÃO DO MODAL

const ComboListTable: React.FC = () => {
    const router = useRouter();
    const [combos, setCombos] = useState<ComboResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comboToEdit, setComboToEdit] = useState<ComboResponse | null>(null); // NOVO ESTADO: QUAL COMBO SERÁ EDITADO

    // --- Lógica de Busca de Dados ---

    const fetchCombos = async () => {
        const token = getToken(); 
        if (!token) {
            router.push('/');
            return; 
        }

        setIsLoading(true);
        setError(null);
        try {
            const fetchedCombos = await listCombos();
            setCombos(fetchedCombos);
        } catch (err: any) {
            setError(err.message || 'Falha ao buscar combos. Verifique se a API está online.');
            if (err.message.includes("Token JWT ausente")) {
                router.push('/');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCombos();
    }, []);

    // --- Handlers de Ação ---

    const handleUpdateList = (updatedCombo: ComboResponse) => {
        // Atualiza a lista após a edição sem precisar recarregar todos os dados
        setCombos(prev => prev.map(c => c.id === updatedCombo.id ? updatedCombo : c));
    };

    const handleDelete = async (comboId: number, comboName: string) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR o combo "${comboName}" (ID: ${comboId})? Esta ação é irreversível.`)) {
            return;
        }

        try {
            await deleteCombo(comboId);
            // Atualiza a lista removendo o combo deletado
            setCombos(prev => prev.filter(c => c.id !== comboId));
            alert(`Combo ${comboName} deletado com sucesso!`);
        } catch (err: any) {
            alert(`Erro ao deletar combo: ${err.message}`);
        }
    };

    // --- Renderização de Estados ---

    // Estilos para a tabela
    const baseStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '10px' };

    if (isLoading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                Carregando combos...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red', padding: '20px' }}>
                Erro: {error}
                <p style={{ marginTop: '10px' }}>Tente fazer o logout e login novamente.</p>
            </div>
        );
    }
    
    // --- Renderização Principal (Tabela e Formulário) ---
    return (
        <div>
            <ComboCreationForm />
            
            <h3 style={{ marginTop: '40px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Combos Existentes ({combos.length})</h3>

            {combos.length === 0 ? (
                <p>Nenhum combo cadastrado. Use o formulário acima para criar um!</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ ...baseStyle, backgroundColor: '#e9ecef' }}>ID</th>
                            <th style={{ ...baseStyle, backgroundColor: '#e9ecef' }}>Nome</th>
                            <th style={{ ...baseStyle, backgroundColor: '#e9ecef' }}>Preço (R$)</th>
                            <th style={{ ...baseStyle, backgroundColor: '#e9ecef' }}>Duração (h)</th>
                            <th style={{ ...baseStyle, backgroundColor: '#e9ecef' }}>Pontos</th>
                            <th style={{ ...baseStyle, backgroundColor: '#e9ecef' }}>Status</th>
                            <th style={{ ...baseStyle, backgroundColor: '#e9ecef' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combos.map((combo) => (
                            <tr key={combo.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={baseStyle}>{combo.id}</td>
                                <td style={baseStyle}>{combo.nome}</td>
                                <td style={baseStyle}>R$ {combo.preco_fixo.toFixed(2)}</td>
                                <td style={baseStyle}>{combo.duracao_estimada_horas.toFixed(2)}</td>
                                <td style={baseStyle}>{combo.pontos.length}</td>
                                <td style={{ ...baseStyle, color: combo.is_ativo ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {combo.is_ativo ? 'Ativo' : 'Inativo'}
                                </td>
                                <td style={baseStyle}>
                                    <button 
                                        // AÇÃO DE EDIÇÃO: Abre o modal
                                        onClick={() => setComboToEdit(combo)}
                                        style={{ padding: '5px 10px', marginRight: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', cursor: 'pointer' }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(combo.id, combo.nome)}
                                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* MODAL DE EDIÇÃO - Sempre renderiza, mas é oculto se comboToEdit for null */}
            <ComboEditModal 
                combo={comboToEdit}
                onClose={() => setComboToEdit(null)}
                onUpdate={handleUpdateList}
            />
        </div>
    );
};

export default ComboListTable;

'use client';

import React, { useState, useEffect } from 'react';
import { listMotoristas, deleteMotorista, MotoristaResponse } from '@/services/motorista';
import { useRouter } from 'next/navigation';

const MotoristaListTable: React.FC = () => {
    const router = useRouter();
    const [motoristas, setMotoristas] = useState<MotoristaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMotoristas = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedMotoristas = await listMotoristas();
            setMotoristas(fetchedMotoristas);
        } catch (err: any) {
            setError(err.message || 'Falha ao buscar motoristas.');
            if (err.message.includes("Token JWT ausente")) {
                router.push('/');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMotoristas();
    }, []);

    const handleDelete = async (motoristaId: number, motoristaName: string) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR o motorista "${motoristaName}"?`)) {
            return;
        }

        try {
            await deleteMotorista(motoristaId);
            setMotoristas(prev => prev.filter(m => m.id !== motoristaId));
            alert(`Motorista ${motoristaName} deletado com sucesso!`);
        } catch (err: any) {
            alert(`Erro ao deletar motorista: ${err.message}`);
        }
    };
    
    // --- Estilos de Tabela ---
    const baseStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '10px' };
    const headerStyle: React.CSSProperties = { ...baseStyle, backgroundColor: '#e9ecef', fontWeight: 'bold' };

    if (loading) {
        return <p>Carregando lista de Motoristas...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Erro: {error}</p>;
    }

    return (
        <div style={{ marginTop: '40px' }}>
            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Motoristas Cadastrados ({motoristas.length})</h3>

            {motoristas.length === 0 ? (
                <p>Nenhum motorista cadastrado ainda.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={headerStyle}>ID</th>
                            <th style={headerStyle}>Nome</th>
                            <th style={headerStyle}>CNH</th>
                            <th style={headerStyle}>Veículo</th>
                            <th style={headerStyle}>Placa</th>
                            <th style={headerStyle}>Status</th>
                            <th style={headerStyle}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {motoristas.map((motorista) => (
                            <tr key={motorista.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={baseStyle}>{motorista.id}</td>
                                <td style={baseStyle}>{motorista.nome}</td>
                                <td style={baseStyle}>{motorista.cnh}</td>
                                <td style={baseStyle}>{motorista.modelo_veiculo}</td>
                                <td style={baseStyle}>{motorista.placa_veiculo}</td>
                                <td style={{ ...baseStyle, color: motorista.is_ativo ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {motorista.is_ativo ? 'Ativo' : 'Inativo'}
                                </td>
                                <td style={baseStyle}>
                                    <button 
                                        // O MODAL DE EDIÇÃO seria implementado aqui.
                                        style={{ padding: '5px 10px', marginRight: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', cursor: 'pointer' }}
                                        onClick={() => alert(`Aguardando implementação do modal de Edição para Motorista ID ${motorista.id}.`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(motorista.id, motorista.nome)}
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
        </div>
    );
};

export default MotoristaListTable;

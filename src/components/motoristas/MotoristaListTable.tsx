"use client";

import React, { useEffect, useState } from 'react';
import { listMotoristas, MotoristaResponse } from '../../services/motorista';

// Badge de status de aprovação
const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    const st = (status ?? 'pendente').toLowerCase();
    let color = 'bg-gray-200 text-gray-800';

    if (st === 'aprovado') color = 'bg-green-100 text-green-700';
    else if (st === 'pendente') color = 'bg-yellow-100 text-yellow-700';
    else if (st === 'rejeitado') color = 'bg-red-100 text-red-700';

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
            {st.toUpperCase()}
        </span>
    );
};

// Tabela principal
export default function MotoristaListTable() {
    const [motoristas, setMotoristas] = useState<MotoristaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMotoristas = async () => {
            try {
                const data = await listMotoristas();
                setMotoristas(data);
                setError(null);
            } catch (err: any) {
                setError(`Erro ao carregar: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchMotoristas();
    }, []);

    const baseStyle: React.CSSProperties = {
        padding: "12px 16px",
        fontSize: "14px",
        borderBottom: "1px solid #f3f4f6",
        textAlign: "left",
    };

    if (loading)
        return <p className="text-center mt-8 text-xl text-indigo-600">Carregando motoristas...</p>;

    if (error)
        return (
            <div className="p-6 bg-red-100 text-red-700 border rounded-xl max-w-4xl mx-auto mt-8">
                <h2 className="text-xl font-bold">Erro</h2>
                <p>{error}</p>
            </div>
        );

    if (motoristas.length === 0)
        return <p className="text-center mt-8 text-xl text-gray-500">Nenhum motorista cadastrado.</p>;

    return (
        <div className="mt-8 shadow-xl rounded-xl overflow-hidden max-w-6xl mx-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-600">
                    <tr>
                        <th style={{ ...baseStyle, color: "white" }}>ID</th>
                        <th style={{ ...baseStyle, color: "white" }}>Nome</th>
                        <th style={{ ...baseStyle, color: "white" }}>CPF</th>
                        <th style={{ ...baseStyle, color: "white" }}>E-mail</th>
                        <th style={{ ...baseStyle, color: "white" }}>Telefone</th>
                        <th style={{ ...baseStyle, color: "white" }}>CNH</th>
                        <th style={{ ...baseStyle, color: "white" }}>Vencimento</th>
                        <th style={{ ...baseStyle, color: "white" }}>Placa</th>
                        <th style={{ ...baseStyle, color: "white" }}>Modelo</th>
                        <th style={{ ...baseStyle, color: "white" }}>Cor</th>
                        <th style={{ ...baseStyle, color: "white" }}>Ano</th>
                        <th style={{ ...baseStyle, color: "white" }}>PIX</th>
                        <th style={{ ...baseStyle, color: "white" }}>Status</th>
                        <th style={{ ...baseStyle, color: "white" }}>Aprovação</th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {motoristas.map((motorista) => {
                        const status = motorista.status ?? "indefinido";
                        return (
                            <tr key={motorista.id} className="hover:bg-indigo-50 transition duration-100">
                                <td style={baseStyle}>{motorista.id}</td>
                                <td style={baseStyle}>{motorista.nome}</td>
                                <td style={baseStyle}>{motorista.cpf}</td>
                                <td style={baseStyle}>{motorista.email}</td>
                                <td style={baseStyle}>{motorista.telefone}</td>
                                <td style={baseStyle}>{motorista.cnh_numero}</td>
                                <td style={baseStyle}>{motorista.cnh_vencimento}</td>
                                <td style={baseStyle}>{motorista.placa}</td>
                                <td style={baseStyle}>{motorista.modelo}</td>
                                <td style={baseStyle}>{motorista.cor}</td>
                                <td style={baseStyle}>{motorista.ano}</td>
                                <td style={baseStyle}>{motorista.chave_pix || "N/A"}</td>

                                <td
                                    style={{
                                        ...baseStyle,
                                        color: status.toLowerCase() === "ativo" ? "green" : "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {status.toUpperCase()}
                                </td>

                                <td style={baseStyle}>
                                    <StatusBadge status={motorista.status_aprovacao} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

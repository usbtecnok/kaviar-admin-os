"use client";

import React, { useState } from 'react';
import { createMotorista, MotoristaData } from '../../services/motorista';

// Estado inicial com todos os campos obrigatórios do motorista + senha
const initialFormData: MotoristaData = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cnh_numero: '',
    cnh_vencimento: '',
    chave_pix: '',
    placa: '',
    modelo: '',
    cor: '',
    ano: 0,
    senha: ''   // ← CAMPO OBRIGATÓRIO ADICIONADO
};

export default function MotoristaCreationForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [mensagem, setMensagem] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMotorista(formData);
            setMensagem("Motorista cadastrado com sucesso!");
        } catch (err: any) {
            setMensagem("Erro ao cadastrar motorista: " + err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow space-y-4">
            <input name="nome" placeholder="Nome completo" onChange={handleChange} className="w-full p-2 border rounded" />

            <input name="cpf" placeholder="CPF" onChange={handleChange} className="w-full p-2 border rounded" />

            <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />

            <input name="telefone" placeholder="Telefone" onChange={handleChange} className="w-full p-2 border rounded" />

            <input name="cnh_numero" placeholder="Número da CNH" onChange={handleChange} className="w-full p-2 border rounded" />

            <input type="date" name="cnh_vencimento" onChange={handleChange} className="w-full p-2 border rounded" />

            <input name="chave_pix" placeholder="Chave PIX" onChange={handleChange} className="w-full p-2 border rounded" />

            <input name="placa" placeholder="Placa" onChange={handleChange} className="w-full p-2 border rounded" />

            <input name="modelo" placeholder="Modelo do veículo" onChange={handleChange} className="w-full p-2 border rounded" />

            <input name="cor" placeholder="Cor do veículo" onChange={handleChange} className="w-full p-2 border rounded" />

            <input type="number" name="ano" placeholder="Ano" onChange={handleChange} className="w-full p-2 border rounded" />

            <input type="password" name="senha" placeholder="Senha do motorista" onChange={handleChange} className="w-full p-2 border rounded" />

            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                Cadastrar Motorista
            </button>

            {mensagem && <p className="text-center mt-2">{mensagem}</p>}
        </form>
    );
}

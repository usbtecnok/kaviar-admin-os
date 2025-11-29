"use client";

import React, { useState } from "react";
import { createMotorista } from "../../services/motorista";

export interface MotoristaData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  chave_pix: string;
  cnh_numero: string;
  cnh_vencimento: string;
  placa: string;
  modelo: string;
  cor: string;
  ano: number;
}

const initialFormData: MotoristaData = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  chave_pix: "",
  cnh_numero: "",
  cnh_vencimento: "",
  placa: "",
  modelo: "",
  cor: "",
  ano: 0,
};

export default function MotoristaCreationForm() {
  const [form, setForm] = useState<MotoristaData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMotorista(form);
      setMsg("Motorista criado com sucesso!");
      setForm(initialFormData);
    } catch (err: any) {
      setMsg("Erro ao criar motorista: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Cadastrar Motorista</h2>

      {msg && <p className="mb-4 text-indigo-700">{msg}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {Object.keys(initialFormData).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            value={(form as any)[key]}
            onChange={handleChange}
            placeholder={key}
            className="border p-2 rounded"
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white p-3 rounded-lg"
        >
          {loading ? "Salvando..." : "Salvar Motorista"}
        </button>
      </form>
    </div>
  );
}

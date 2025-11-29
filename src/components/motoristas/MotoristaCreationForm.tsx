"use client";

import React, { useState } from "react";
import { createMotorista } from "../../services/motorista";
import { MotoristaData } from "../../services/motorista";

const initialFormData: MotoristaData = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  senha: "",
  chave_pix: "",
  cnh_numero: "",
  cnh_vencimento: "",
  placa: "",
  modelo: "",
  cor: "",
  ano: 0,
};

export default function MotoristaCreationForm() {
  const [formData, setFormData] = useState<MotoristaData>(initialFormData);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createMotorista(formData);
      setMessage("Motorista criado com sucesso!");
      setFormData(initialFormData);
    } catch (error: any) {
      setMessage("Erro ao criar motorista: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="tex

cat > src/components/motoristas/MotoristaListTable.tsx << 'EOF'
"use client";

import React, { useEffect, useState } from "react";
import { listMotoristas, MotoristaResponse } from "../../services/motorista";

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const s = status?.toLowerCase() || "pendente";
  const color =
    s === "aprovado"
      ? "bg-green-100 text-green-700"
      : s === "rejeitado"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {s.toUpperCase()}
    </span>
  );
};

export default function MotoristaListTable() {
  const [motoristas, setMotoristas] = useState<MotoristaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMotoristas()
      .then((data) => setMotoristas(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center mt-4 text-indigo-600 text-lg">Carregando motoristas...</p>;

  return (
    <div className="mt-10 shadow-xl rounded-xl overflow-hidden max-w-7xl mx-auto bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-indigo-600 text-white">
          <tr>
            {[
              "ID",
              "Nome",
              "CPF",
              "E-mail",
              "Telefone",
              "CNH",
              "Vencimento",
              "Placa",
              "Modelo",
              "Cor",
              "Ano",
              "PIX",
              "Status",
              "Aprovação",
            ].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-sm font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {motoristas.map((m) => (
            <tr key={m.id} className="hover:bg-indigo-50 transition">
              <td className="px-4 py-3">{m.id}</td>
              <td className="px-4 py-3">{m.nome}</td>
              <td className="px-4 py-3">{m.cpf}</td>
              <td className="px-4 py-3">{m.email}</td>
              <td className="px-4 py-3">{m.telefone}</td>
              <td className="px-4 py-3">{m.cnh_numero}</td>
              <td className="px-4 py-3">{m.cnh_vencimento}</td>
              <td className="px-4 py-3">{m.placa}</td>
              <td className="px-4 py-3">{m.modelo}</td>
              <td className="px-4 py-3">{m.cor}</td>
              <td className="px-4 py-3">{m.ano}</td>
              <td className="px-4 py-3">{m.chave_pix}</td>
              <td
                className="px-4 py-3 font-bold"
                style={{ color: m.status === "ativo" ? "green" : "red" }}
              >
                {(m.status || "pendente").toUpperCase()}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={m.status_aprovacao} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

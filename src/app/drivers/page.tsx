"use client";

import React, { useState } from "react";
import MotoristaListTable from "../../components/motoristas/MotoristaListTable";
import MotoristaCreationForm from "../../components/motoristas/MotoristaCreationForm";

export default function DriversPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Gerenciamento de Motoristas</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
        >
          {showForm ? "Fechar Formulário" : "Novo Motorista"}
        </button>
      </div>

      {/* FORMULÁRIO */}
      {showForm && (
        <div className="mb-10">
          <MotoristaCreationForm />
        </div>
      )}

      {/* LISTA */}
      <MotoristaListTable />
    </div>
  );
}

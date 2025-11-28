import React, { useState } from 'react';
import { createMotorista } from '../../services/motorista';
import { MotoristaData } from '../../services/motorista';

// Estado inicial com todos os 11 campos obrigatórios (agora incluindo PIX)
const initialFormData: MotoristaData = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    chave_pix: '', // NOVO CAMPO
    cnh_numero: '',
    cnh_vencimento: '', // Formato YYYY-MM-DD
    placa: '',
    modelo: '',
    cor: '',
    ano: 0,
};

// Componente do Formulário
export default function MotoristaCreationForm() {
    const [formData, setFormData] = useState<MotoristaData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Função que lida com a mudança nos campos do formulário
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value,
        }));
        setError(null);
        setSuccess(null);
    };

    // Função que lida com o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // A interface MotoristaData garante que todos os campos serão enviados com o nome correto
            const result = await createMotorista(formData);
            setSuccess(`Motorista ${result.nome} cadastrado com sucesso! ID: ${result.id}`);
            setFormData(initialFormData); // Limpa o formulário após o sucesso
        } catch (err: any) {
            console.error('Erro de Cadastro:', err);
            setError(err.message || 'Falha ao cadastrar motorista. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-xl rounded-xl border border-gray-100 max-w-4xl mx-auto mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
                Cadastro Completo de Motorista
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- SEÇÃO DE DADOS PESSOAIS --- */}
                <h3 className="text-lg font-semibold text-indigo-600 pt-4 border-t">Dados Pessoais e Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome Completo */}
                    <InputField label="Nome Completo" name="nome" type="text" value={formData.nome} onChange={handleChange} required />
                    {/* CPF */}
                    <InputField label="CPF" name="cpf" type="text" value={formData.cpf} onChange={handleChange} required pattern="\d{11}" title="O CPF deve conter 11 dígitos." />
                    {/* E-mail */}
                    <InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    {/* Telefone */}
                    <InputField label="Telefone" name="telefone" type="text" value={formData.telefone} onChange={handleChange} required />
                </div>
                
                {/* --- SEÇÃO DE DOCUMENTAÇÃO --- */}
                <h3 className="text-lg font-semibold text-indigo-600 pt-4 border-t">Documentação e Pagamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Chave PIX (NOVO CAMPO) */}
                    <InputField label="Chave PIX" name="chave_pix" type="text" value={formData.chave_pix} onChange={handleChange} />
                    {/* CNH Número */}
                    <InputField label="CNH (Número)" name="cnh_numero" type="text" value={formData.cnh_numero} onChange={handleChange} required />
                    {/* CNH Vencimento */}
                    <InputField label="CNH (Vencimento)" name="cnh_vencimento" type="date" value={formData.cnh_vencimento} onChange={handleChange} required />
                </div>
                
                {/* --- SEÇÃO DE VEÍCULO --- */}
                <h3 className="text-lg font-semibold text-indigo-600 pt-4 border-t">Detalhes do Veículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Placa */}
                    <InputField label="Placa" name="placa" type="text" value={formData.placa} onChange={handleChange} required />
                    {/* Modelo */}
                    <InputField label="Modelo" name="modelo" type="text" value={formData.modelo} onChange={handleChange} required />
                    {/* Cor */}
                    <InputField label="Cor" name="cor" type="text" value={formData.cor} onChange={handleChange} required />
                    {/* Ano */}
                    <InputField label="Ano" name="ano" type="number" value={formData.ano} onChange={handleChange} required min={1990} max={new Date().getFullYear()} />
                </div>

                {/* --- MENSAGENS E BOTÃO --- */}
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg whitespace-pre-wrap">
                        <strong className="font-bold">Erro de Validação/API:</strong>
                        <p>{error}</p>
                    </div>
                )}
                {success && (
                    <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded-lg">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg text-white font-bold transition duration-150 ${
                        loading
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar Motorista'}
                </button>
            </form>
        </div>
    );
}

// Sub-Componente para Campo de Input
interface InputFieldProps {
    label: string;
    name: keyof MotoristaData;
    type: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    pattern?: string;
    title?: string;
    min?: number;
    max?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type, value, onChange, required, pattern, title, min, max }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            pattern={pattern}
            title={title}
            min={min}
            max={max}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
    </div>
);

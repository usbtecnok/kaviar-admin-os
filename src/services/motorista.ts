// src/services/motorista.ts
import axios from 'axios';
import { getToken } from './auth';

const API_BASE_URL = 'https://kaviar-backend.onrender.com/api/v1';

// --- Interfaces ---

export interface MotoristaData {
    nome: string;
    cnh: string;
    placa_veiculo: string;
    modelo_veiculo: string;
}

export interface MotoristaResponse extends MotoristaData {
    id: number;
    is_ativo: boolean;
}

// --- Funções Auxiliares ---
function getAuthHeaders() {
    const token = getToken();
    if (!token) {
        throw new Error("Token JWT ausente. Faça o login novamente.");
    }
    return { Authorization: `Bearer ${token}` };
}

// --- Funções CRUD ---

export async function createMotorista(data: MotoristaData): Promise<MotoristaResponse> {
    const url = `${API_BASE_URL}/motoristas/`;
    try {
        const response = await axios.post<MotoristaResponse>(url, data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const detail = error.response.data.detail;
            let errorMessage = 'Erro ao criar motorista.';

            if (typeof detail === 'string') {
                errorMessage = detail;
            } else if (Array.isArray(detail) || typeof detail === 'object') {
                errorMessage = JSON.stringify(detail, null, 2);
            }

            throw new Error(errorMessage);
        }
        throw new Error('Erro de rede ao comunicar com o servidor Kaviar API.');
    }
}

export async function listMotoristas(): Promise<MotoristaResponse[]> {
    const url = `${API_BASE_URL}/motoristas/`;
    try {
        const response = await axios.get<MotoristaResponse[]>(url, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const detail = error.response.data.detail;
            const msg = typeof detail === 'string' ? detail : JSON.stringify(detail);
            throw new Error(msg);
        }
        throw new Error('Erro de rede ao comunicar com o servidor Kaviar API.');
    }
}

export async function updateMotorista(id: number, data: MotoristaData): Promise<MotoristaResponse> {
    const url = `${API_BASE_URL}/motoristas/${id}`;
    try {
        const response = await axios.put<MotoristaResponse>(url, data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const detail = error.response.data.detail;
            const msg = typeof detail === 'string' ? detail : JSON.stringify(detail);
            throw new Error(msg);
        }
        throw new Error('Erro de rede ao comunicar com o servidor Kaviar API.');
    }
}

export async function deleteMotorista(id: number): Promise<void> {
    const url = `${API_BASE_URL}/motoristas/${id}`;
    try {
        await axios.delete(url, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const detail = error.response.data.detail;
            const msg = typeof detail === 'string' ? detail : JSON.stringify(detail);
            throw new Error(msg);
        }
        throw new Error('Erro de rede ao comunicar com o servidor Kaviar API.');
    }
}

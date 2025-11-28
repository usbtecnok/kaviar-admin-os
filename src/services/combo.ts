// src/services/combo.ts
import axios from 'axios';
import { getToken } from './auth';

// URL base da sua API no Render
const API_BASE_URL = 'https://kaviar-backend.onrender.com/api/v1';

// --- Interfaces de Dados ---

export interface PontoTuristicoData {
    id?: number;
    combo_id?: number;
    nome_ponto: string;
    endereco: string;
    latitude: number;
    longitude: number;
    ordem_sequencial: number;
}

export interface ComboCreateData {
    nome: string;
    descricao: string;
    preco_fixo: number; 
    parceiro_hotel: string;
    pontos: PontoTuristicoData[];
}

export interface ComboResponse {
    id: number;
    nome: string;
    descricao: string;
    preco_fixo: number;
    duracao_estimada_horas: number;
    distancia_total_km: number;
    parceiro_hotel: string;
    is_ativo: boolean;
    rota_otimizada_json: string; 
    pontos: PontoTuristicoData[];
}

// --- Funções de Serviço (Comunicação com a API) ---

/**
 * Funcao para obter o cabecalho de Autorizacao JWT
 */
function getAuthHeaders() {
    const token = getToken();
    if (!token) {
        throw new Error("Token JWT ausente. Faça o login novamente.");
    }
    return { Authorization: `Bearer ${token}` };
}

/**
 * Funcao para criar um novo Combo Turistico (POST).
 */
export async function createCombo(data: ComboCreateData): Promise<ComboResponse> {
    const url = `${API_BASE_URL}/combos/`;
    try {
        const response = await axios.post<ComboResponse>(url, data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.detail || 'Erro ao criar combo no servidor.';
            throw new Error(errorMessage);
        }
        throw new Error('Erro de rede ao comunicar com o servidor Kaviar API.');
    }
}

/**
 * Funcao para listar todos os Combos Turisticos existentes (GET).
 */
export async function listCombos(): Promise<ComboResponse[]> {
    const url = `${API_BASE_URL}/combos/`;
    try {
        const response = await axios.get<ComboResponse[]>(url, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.detail || 'Erro ao listar combos no servidor.';
            throw new Error(errorMessage);
        }
        throw new Error('Erro de rede ao comunicar com o servidor Kaviar API.');
    }
}

/**
 * Funcao para atualizar um Combo Turistico existente (PUT).
 */
export async function updateCombo(id: number, data: ComboCreateData): Promise<ComboResponse> {
    const url = `${API_BASE_URL}/combos/${id}`;
    try {
        const response = await axios.put<ComboResponse>(url, data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.detail || 'Erro ao atualizar combo no servidor.';
            throw new Error(errorMessage);
        }
        throw new Error('Erro de rede ao comunicar com o servidor Kaviar API.');
    }
}

/**
 * Funcao para deletar um Combo Turistico (DELETE).
 */
export async function deleteCombo(id: number): Promise<void> {
    const url = `${API_BASE_URL}/combos/${id}`;
    try {
        await axios.delete(url, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.detail || 'Erro ao deletar combo no servidor.';
            throw new Error(errorMessage);
        }
        throw new Error('Erro de rede ao comunicar com o servidor Kaviar API.');
    }
}

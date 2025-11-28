import axios from 'axios';
import { getToken as getStoredToken, logout as removeToken } from './auth';

// URL base da sua API no Render (Usando a URL real de produção)
const API_BASE_URL = 'https://kaviar-backend.onrender.com/api/v1';

// Tipagem basica para os dados de Login
interface LoginCredentials {
    email: string;
    senha: string;
}

// Tipagem basica para a resposta do Token JWT
interface LoginResponse {
    access_token: string;
    token_type: string;
}

/**
 * Funcao para realizar o login do administrador.
 * @param credentials - Email e Senha.
 */
export async function loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
    const url = `${API_BASE_URL}/login`;
    
    try {
        const response = await axios.post<LoginResponse>(url, {
            email: credentials.email,
            senha: credentials.senha,
        });

        if (response.data.access_token) {
            localStorage.setItem('kaviar_admin_token', response.data.access_token);
        }
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Retorna a mensagem detalhada do FastAPI (ex: "Credenciais inválidas.")
            throw new Error(error.response.data.detail || 'Falha na autenticação. Credenciais inválidas.');
        }
        throw new Error('Erro de rede ou servidor não respondeu. Verifique a API do Render.');
    }
}

/**
 * Funcao para obter o token armazenado.
 */
export function getToken(): string | null {
    return localStorage.getItem('kaviar_admin_token');
}

/**
 * Funcao para deslogar e limpar o token.
 */
export function logout() {
    localStorage.removeItem('kaviar_admin_token');
}

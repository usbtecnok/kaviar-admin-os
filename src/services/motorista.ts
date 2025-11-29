import api from "./api";

/**
 * Dados retornados pelo backend
 */
export interface MotoristaResponse {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cnh_numero: string;
  cnh_vencimento: string;
  chave_pix: string;
  placa: string;
  modelo: string;
  cor: string;
  ano: number;
  status?: string;
  status_aprovacao?: string;
}

/**
 * Dados enviados ao backend (cadastro)
 * Não inclui ID
 */
export interface MotoristaData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cnh_numero: string;
  cnh_vencimento: string;
  chave_pix: string;
  placa: string;
  modelo: string;
  cor: string;
  ano: number;
  senha: string;  // motorista precisa de senha para login
}

// LISTA MOTORISTAS
export async function listMotoristas(): Promise<MotoristaResponse[]> {
  const res = await api.get("/api/v1/motoristas");
  return res.data;
}

// CRIA MOTORISTA
export async function createMotorista(data: MotoristaData) {
  const res = await api.post("/api/v1/motoristas", data);
  return res.data;
}

// APROVAR MOTORISTA
export async function aprovarMotorista(id: number) {
  const res = await api.patch(`/api/v1/motoristas/${id}/aprovar`);
  return res.data;
}

// REJEITAR MOTORISTA
export async function rejeitarMotorista(id: number) {
  const res = await api.patch(`/api/v1/motoristas/${id}/rejeitar`);
  return res.data;
}


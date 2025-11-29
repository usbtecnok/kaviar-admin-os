import api from "./api";

export interface MotoristaResponse {
  id: number;
  nome: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  cnh_numero?: string;
  cnh_vencimento?: string;
  placa?: string;
  modelo?: string;
  cor?: string;
  ano?: number;
  chave_pix?: string;
  status?: string;
  status_aprovacao?: string;
}

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

// LISTAR TODOS
export async function listMotoristas(): Promise<MotoristaResponse[]> {
  const res = await api.get("/api/v1/motoristas");
  return res.data;
}

// CRIAR
export async function createMotorista(data: MotoristaData) {
  const res = await api.post("/api/v1/motoristas", data);
  return res.data;
}

// APROVAR
export async function aprovarMotorista(id: number) {
  const res = await api.patch(`/api/v1/motoristas/${id}/aprovar`);
  return res.data;
}

// REJEITAR
export async function rejeitarMotorista(id: number) {
  const res = await api.patch(`/api/v1/motoristas/${id}/rejeitar`);
  return res.data;
}

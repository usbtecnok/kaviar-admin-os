import api from "./api";

export interface MotoristaData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  chave_pix: string;
  cnh_numero: string;
  cnh_vencimento: string;
  placa: string;
  modelo: string;
  cor: string;
  ano: number;
}

export interface MotoristaResponse extends MotoristaData {
  id: number;
  status?: string;
  status_aprovacao?: string;
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

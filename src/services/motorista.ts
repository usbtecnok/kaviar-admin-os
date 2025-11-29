import api from "./api";

export interface MotoristaResponse {
  id: number;
  nome: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  cnh_numero?: string;
  placa?: string;
  chave_pix?: string;
  status?: string;
  status_aprovacao?: string;
}

// LISTA MOTORISTAS
export async function listMotoristas(): Promise<MotoristaResponse[]> {
  const res = await api.get("/api/v1/motoristas");
  return res.data;
}

// CRIA MOTORISTA
export async function createMotorista(data: any) {
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


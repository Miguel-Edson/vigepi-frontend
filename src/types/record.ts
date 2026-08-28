// src/types/record.ts

export interface RecordAPI {
  id: string;
  pacienteId: string; // ID que liga a ficha ao paciente
  sinam?: string;
  bairro?: string;
  fonteNotificadora?: string;
  status?: string; 
  tipoFicha?: string;
  // ... outros campos que vierem da API
}
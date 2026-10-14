import { apiFetch } from '@/lib/api';
// Ajuste os imports dos DTOs conforme o que você tem no seu arquivo de types
import { RecordAPI, CreateRecordDTO, UpdateRecordDTO, AddObservationDTO } from '../types/record'; 

export const recordService = {
  
  // 1. POST: Criar ficha de notificação (Requer ADM)
  async create(data: CreateRecordDTO): Promise<RecordAPI> {
    return apiFetch<RecordAPI>('/record', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 2. GET: Listar todas as fichas
  async getAllRecords(): Promise<RecordAPI[]> {
    return apiFetch<RecordAPI[]>('/record/all', {
      method: 'GET',
    });
  },

  // 3. GET (TRUQUE FRONTEND): Buscar fichas e filtrar por paciente
  async getRecordsByPatientId(patientId: string): Promise<RecordAPI[]> {
    const allRecords = await apiFetch<RecordAPI[]>('/record/all', {
      method: 'GET',
    });
    
    // Filtra localmente. Certifique-se de que a estrutura do retorno possui patient.id
    return allRecords.filter((record) => record.patient?.id === patientId);
  },

  // 4. GET: Buscar ficha por ID
  async getById(id: string): Promise<RecordAPI> {
    return apiFetch<RecordAPI>(`/record/${id}`, {
      method: 'GET',
    });
  },

  // 5. PATCH: Atualizar ficha (Requer ADM)
  async update(id: string, data: UpdateRecordDTO): Promise<RecordAPI> {
    return apiFetch<RecordAPI>(`/record/update/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // 6. DELETE: Remover ficha (Requer ADM)
  async remove(id: string): Promise<void> {
    return apiFetch<void>(`/record/${id}`, {
      method: 'DELETE',
    });
  },

  // 7. POST: Adicionar observação clínica
  async addObservation(id: string, data: AddObservationDTO): Promise<any> {
    return apiFetch<any>(`/record/${id}/observations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
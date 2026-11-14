import { apiFetch } from '@/lib/api';
// Ajuste os imports dos DTOs conforme o que você tem no seu arquivo de types
import { RecordAPI, CreateRecordDTO, UpdateRecordDTO, AddObservationDTO } from '../types/record'; 
import { MonitoramentoGestanteAPI, CreateMonitoramentoDTO } from "@/modules/records/types/monitoring";
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

  // ==========================================================================
  // ROTAS DE MONITORAMENTO (ACOMPANHAMENTO)
  // ==========================================================================

  /**
   * 1. GET: Listar todos os monitoramentos de uma ficha específica
   * Swagger: GET /records/{tipo}/{fichaId}/monitoramentos
   */
  async getMonitoramentosByRecordId(tipo: string, fichaId: string): Promise<MonitoramentoGestanteAPI[]> {
    return apiFetch<MonitoramentoGestanteAPI[]>(`/records/${tipo}/${fichaId}/monitoramentos`, {
      method: 'GET',
    });
  },

  /**
   * 2. POST: Criar um novo registro de monitoramento para a ficha
   * Swagger: POST /records/{tipo}/{fichaId}/monitoramentos
   */
  async createMonitoramento(tipo: string, fichaId: string, data: CreateMonitoramentoDTO): Promise<MonitoramentoGestanteAPI> {
    return apiFetch<MonitoramentoGestanteAPI>(`/records/${tipo}/${fichaId}/monitoramentos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * 3. GET: Detalhar um monitoramento específico pelo seu ID
   * Swagger: GET /monitoramentos/{id}
   */
  async getMonitoramentoById(id: string): Promise<MonitoramentoGestanteAPI> {
    return apiFetch<MonitoramentoGestanteAPI>(`/monitoramentos/${id}`, {
      method: 'GET',
    });
  },

  /**
   * 4. PATCH: Atualizar os dados de um monitoramento específico
   * Swagger: PATCH /monitoramentos/{id}
   */
  async updateMonitoramento(id: string, data: Partial<CreateMonitoramentoDTO>): Promise<MonitoramentoGestanteAPI> {
    return apiFetch<MonitoramentoGestanteAPI>(`/monitoramentos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * 5. DELETE: Remover um monitoramento (Soft Delete)
   * Swagger: DELETE /monitoramentos/{id}
   */
  async deleteMonitoramento(id: string): Promise<void> {
    return apiFetch<void>(`/monitoramentos/${id}`, {
      method: 'DELETE',
    });
  }
};


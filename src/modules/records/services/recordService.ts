import { apiFetch, ApiError } from '@/lib/api';
// Ajuste os imports dos DTOs conforme o que você tem no seu arquivo de types
import { RecordAPI, CreateRecordDTO, UpdateRecordDTO, AddObservationDTO, ObservationAPI } from '../types/record'; 
import { extractObservations, findObservationList, toRawList } from '@/modules/records/observations/normalize';
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

  // 3. GET: Buscar as fichas de UM paciente (o filtro acontece no servidor)
  //    Contrato esperado do backend: GET /record/patient/:patientId -> RecordAPI[]
  //    (devolver [] quando o paciente não tem fichas, e não 404)
  async getRecordsByPatientId(patientId: string): Promise<RecordAPI[]> {
    try {
      return await apiFetch<RecordAPI[]>(`/record/patient/${patientId}`, {
        method: 'GET',
      });
    } catch (error) {
      // TEMPORÁRIO: só cai no comportamento antigo se a ROTA ainda não existe no backend
      // (o NestJS responde "Cannot GET ..."). Remover assim que o endpoint for publicado,
      // porque o fallback volta a trazer as fichas de todos os pacientes para o navegador.
      const rotaInexistente =
        error instanceof ApiError &&
        error.status === 404 &&
        error.message.startsWith('Cannot GET');

      if (!rotaInexistente) throw error;

      console.warn(
        '[SIMOS] /record/patient/:id não existe no backend; usando fallback que busca TODAS as fichas.'
      );
      const allRecords = await apiFetch<RecordAPI[]>('/record/all', { method: 'GET' });
      return allRecords.filter((record) => record.patient?.id === patientId);
    }
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

  // 7.1 GET: Listar as observações clínicas de uma ficha (mais recentes primeiro)
  async listObservations(id: string): Promise<ObservationAPI[]> {
    let payload: unknown;

    try {
      payload = await apiFetch<unknown>(`/record/${id}/observations`, { method: 'GET' });
    } catch (error) {
      const rotaInexistente =
        error instanceof ApiError && error.status === 404 && error.message.startsWith('Cannot GET');
      if (!rotaInexistente) throw error;

      // Sem rota GET própria: procura as observações dentro da própria ficha
      const record = await apiFetch<unknown>(`/record/${id}`, { method: 'GET' });
      const embedded = findObservationList(record);
      if (!embedded) {
        // Melhor avisar do que mostrar "nenhuma observação" quando, na verdade, não dá para ler.
        throw new Error(
          'Não foi possível listar as observações: o backend não tem a rota GET /record/{id}/observations e a ficha não traz as observações junto.'
        );
      }
      payload = embedded;
    }

    const observations = extractObservations(payload);
    if (observations.length === 0 && toRawList(payload).length > 0) {
      console.warn('[SIMOS] Observações recebidas, mas em um formato não reconhecido:', payload);
    }
    return observations;
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


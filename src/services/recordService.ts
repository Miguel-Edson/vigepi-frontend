// src/services/recordService.ts
import { apiFetch } from '@/lib/api';
import { RecordAPI } from '@/types/record';

export const recordService = {
  async getAllRecords(): Promise<RecordAPI[]> {
    return apiFetch<RecordAPI[]>('/record/all', {
      method: 'GET',
    });
  },

  async addObservation(recordId: string, texto: string): Promise<any> {
    return apiFetch(`/record/${recordId}/observations`, {
      method: 'POST',
      body: JSON.stringify({ texto }),
    });
  },

};
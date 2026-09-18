// src/services/recordService.ts
import { apiFetch } from '@/lib/api';
import { RecordAPI } from '@/types/record';

export const recordService = {
  async getAllRecords(): Promise<RecordAPI[]> {
    return apiFetch<RecordAPI[]>('/record/all', {
      method: 'GET',
    });
  },
};
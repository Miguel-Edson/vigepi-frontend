import { useState, useEffect, useCallback } from 'react';
import { recordService } from '@/modules/records/services/recordService';
import { RecordAPI } from '@/modules/records/types/record';

export function useRecords() {
  const [records, setRecords] = useState<RecordAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await recordService.getAllRecords();
      setRecords(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar fichas:", err);
      setError("Não foi possível carregar as fichas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, isLoading, error, refetch: fetchRecords };
}
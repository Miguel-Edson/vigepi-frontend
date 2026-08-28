// src/hooks/usePatients.ts
import { useState, useEffect, useCallback } from 'react';
import { patientService } from '@/services/patientService';
import { recordService } from '@/services/recordService';
import { PatientAPI } from '@/types/patient';
import { RecordAPI } from '@/types/record';

export function usePatients() {
  const [patients, setPatients] = useState<PatientAPI[]>([]);
  const [records, setRecords] = useState<RecordAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Busca pacientes e fichas ao mesmo tempo (paralelo) para ser mais rápido
      const [patientsData, recordsData] = await Promise.all([
        patientService.getAllPatients(),
        recordService.getAllRecords()
      ]);
      
      setPatients(patientsData);
      setRecords(recordsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Não foi possível carregar os dados do sistema.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { patients, records, isLoading, error, refetch: fetchData };
}
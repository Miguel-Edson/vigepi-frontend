import { useState, useEffect, useCallback } from 'react';
import { patientService } from '@/modules/patients/services/patientService';
import { PatientAPI } from '@/modules/patients/types/patient';

export function usePatients() {
  const [patients, setPatients] = useState<PatientAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await patientService.getAllPatients();
      setPatients(data);
      setError(null);
    } catch (err) { 
      console.error("Erro ao buscar pacientes:", err);
      setError("Não foi possível carregar os dados dos pacientes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, isLoading, error, refetch: fetchPatients };
}
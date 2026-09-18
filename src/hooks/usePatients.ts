// src/hooks/usePatients.ts
import { useState, useEffect, useCallback } from 'react';
import { patientService } from '@/services/patientService';
import { recordService } from '@/services/recordService';
import { PatientAPI } from '@/types/patient';
import { RecordAPI } from '@/types/record';

// Função auxiliar para pegar a ficha mais recente de cada paciente
function getLatestRecordPerPatient(records: RecordAPI[]) {
  const latestMap = new Map<string, RecordAPI>();

  // Ordena por data decrescente (mais recente primeiro)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.dataNotificacao).getTime() - new Date(a.dataNotificacao).getTime()
  );

  sortedRecords.forEach(record => {
    // Lemos o ID de dentro do objeto aninhado 'patient' devolvido pelo backend
    const idDoPaciente = record.patient?.id; 
    
    if (idDoPaciente && !latestMap.has(idDoPaciente)) {
      latestMap.set(idDoPaciente, record);
    }
  });

  return latestMap;
}

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

  return { 
    patients, 
    records,
    // Exportamos o mapa já processado para a página consumir direto
    latestRecordsMap: getLatestRecordPerPatient(records),
    isLoading, 
    error, 
    refetch: fetchData 
  };
}
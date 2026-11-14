export interface MonitoramentoGestanteAPI {
  id: string;
  tipoFicha?: string;
  codigoFonteNotificadora?: string;
  fonteNotificadora?: string;
  dataDiagnostico?: string;
  semanaGestacional?: string;
  data1Prenatal?: string;
  testeRapido?: string;
  
  // Tratamento 1 da Gestante
  dose1dataTrat1?: string;
  dose2dataTrat1?: string;
  dose3dataTrat1?: string;
  
  // Tratamento 2 da Gestante
  dose1dataTrat2?: string;
  dose2dataTrat2?: string;
  dose3dataTrat2?: string;
  
  // Tratamento 3 da Gestante
  dose1dataTrat3?: string;
  dose2dataTrat3?: string;
  dose3dataTrat3?: string;
  
  dpp?: string;
  
  // Parceria
  parceriaDose1dataTrat1?: string;
  parceriaDose1dataTrat2?: string;
  parceriaDose1dataTrat3?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export type CreateMonitoramentoDTO = Omit<MonitoramentoGestanteAPI, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastModifiedBy' | 'deletedAt'>;
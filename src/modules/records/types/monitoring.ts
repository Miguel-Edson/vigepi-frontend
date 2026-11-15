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

// Espelham as entidades do backend: monitoramentos_adquirida e monitoramentos_congenita
export interface MonitoramentoAdquiridaAPI {
  id: string;
  idade?: number;
  dataTesteRapido?: string;
  resultTesteRapido?: string;
  dataVdrlDiag?: string;
  resultVdrlDiag?: string;

  // Tratamento 1 e 2 (até 3 doses cada)
  dose1dataTrat1?: string;
  dose2dataTrat1?: string;
  dose3dataTrat1?: string;
  dose1dataTrat2?: string;
  dose2dataTrat2?: string;
  dose3dataTrat2?: string;

  // Parceria
  parcTratado?: string;
  dose1dataTrat1Parc?: string;
  dose2dataTrat1Parc?: string;
  dose3dataTrat1Parc?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface MonitoramentoCongenitaAPI {
  id: string;
  nomeMae?: string;
  nomeRN?: string;
  datanascRN?: string;
  vdrlDaMaeData?: string;
  vdrlDaMaeTitulacao?: string;
  vdrlDaRNData?: string;
  vdrlDaRNTitulacao?: string;
  rxOssosLongos?: string;
  fundoDeOlho?: string;
  mes1SegmentoSifilis?: string;
  mes1SegmentoTitulacao?: string;
  mes3SegmentoSifilis?: string;
  mes3SegmentoTitulacao?: string;
  mes6SegmentoSifilis?: string;
  mes6SegmentoTitulacao?: string;
  mes12SegmentoSifilis?: string;
  mes12SegmentoTitulacao?: string;
  mes16SegmentoSifilis?: string;
  mes16SegmentoTitulacao?: string;
  tpma?: string;
  classificacaoFinal?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MonitoramentoAPI = MonitoramentoGestanteAPI | MonitoramentoAdquiridaAPI | MonitoramentoCongenitaAPI;

/**
 * Uma linha por ficha, só com as colunas de dose, devolvida por GET /monitoramentos/resumo
 * (alimenta o status "Em Tratamento / próxima dose" na listagem de pacientes).
 */
export interface MonitoramentoResumo {
  recordId: string;
  tipo: "gestante" | "adquirida";
  [coluna: string]: string | null | undefined;
}

export type CreateMonitoramentoDTO = Omit<MonitoramentoGestanteAPI, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastModifiedBy' | 'deletedAt'>;
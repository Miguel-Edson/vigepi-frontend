// src/types/record.ts

export enum Agravo {
  SIFILIS_CONGENITA = 'Sífilis Congênita',
  SIFILIS_ADQUIRIDA = 'Sífilis Adquirida',
  SIFILIS_GESTACIONAL = 'Sífilis Gestacional',
}

export enum Cid10 {
  CID_O981 = '098.1',
  CID_A539 = 'A53.9',
  CID_A509 = 'A50.9',
}

export enum StatusFicha {
  DESCONTINUADO = 'Descontinuado',
  TRATAMENTO_FINALIZADO = 'Tratamento Finalizado',
  AGUARDANDO_EXAME = 'Aguardando Exame',
  DOSE_ATRASADA = 'Dose Atrasada',
  DPP = 'DPP',
  OBITO = 'Óbito',
}

export interface RecordAPI {
  id: string;
  tipoNotificacao: string;
  agravo: Agravo;
  numSinan: string;
  status: StatusFicha;
  codeCid: Cid10;
  dataNotificacao: string;
  UF: string;
  municipio: string;
  codeIbge: string;
  codeUnidadeSaude: string;
  dataDiagnostico: string;
  createdAt: string;
  updatedAt: string;
  
  // O TypeORM geralmente retorna as relações como objetos aninhados
  patient?: { 
    id: string; 
    nome?: string; 
  };
}
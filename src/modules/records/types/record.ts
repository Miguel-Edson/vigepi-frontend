// ============================================================================
// 1. ENUMS GERAIS DA FICHA (RECORD)
// ============================================================================
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

// ============================================================================
// 2. ENUMS ESPECÍFICOS: SÍFILIS ADQUIRIDA (ACQUIRED)
// ============================================================================
export enum OpcoesSimNao {
  SIM = 'Sim',
  NAO = 'Não',
  IGNORADO = 'Ignorado',
}

export enum CompSexualEnum {
  HOMENS = '1 - Relação sexual com homens',
  HOMENS_MULHERES = '2 - Relação sexual com homens e mulheres',
  MULHERES = '3 - Relação sexual com mulheres',
  IGNORADO = '9 - Ignorado',
}

export enum TesteEnum {
  REAGENTE = '1 - Reagente',
  NAO_REAGENTE = '2 - Não Reagente',
  NAO_REALIZADO = '3 - Não Realizado',
  IGNORADO = '9 - Ignorado',
}

export enum ClassClinicaEnum {
  PRIMARIA = '1 - Primária',
  SECUNDARIA = '2 - Secundária',
  TERCIARIA = '3 - Terciária',
  IGNORADO = '9 - Ignorado',
}

export enum EsquemaTratamentoEnum {
  PENICILINA_24 = '1 - Penicilina G Benzatina 2.400.000 UI',
  PENICILINA_48 = '2 - Penicilina G Benzatina 4.800.000 UI',
  PENICILINA_72 = '3 - Penicilina G Benzatina 7.200.000 UI',
  OUTRO = '4 - Outro esquema',
  NAO_REALIZADO = '5 - Não Realizado',
  IGNORADO = '9 - Ignorado',
}

export enum ClassFinalEnum {
  CONFIRMADO = '1 - Confirmado',
  DESCARTADO = '2 - Descartado',
  OUTRO = 'Outro',
}

// ============================================================================
// 3. INTERFACES DE ENTIDADES
// ============================================================================

/** Dados Específicos da Sífilis Adquirida (Mapeia a entidade Acquired) */
export interface AcquiredDetailsAPI {
  id: string;
  ocupacao: string;
  antSifilis: OpcoesSimNao;
  seSimTratRealizado: OpcoesSimNao;
  compSexual: CompSexualEnum;
  testeNaoTreponico: TesteEnum;
  titulo?: string;
  data?: string;
  testeTreponico: TesteEnum;
  esquemaTratAdquirida: EsquemaTratamentoEnum;
  dataInicioTrat?: string;
  classClinica: ClassClinicaEnum;
  classFinal: ClassFinalEnum;
  classFinalOutro?: string;
}

/** Ficha Geral de Notificação (Mapeia a entidade Record) */
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
  
  patient?: { 
    id: string; 
    nome?: string; 
  };

  // RELAÇÕES (OneToOne)
  detalhesAdquirida?: AcquiredDetailsAPI;
  // futuramente você adicionará aqui:
  // detalhesCongenita?: CongenitalDetailsAPI;
  // detalhesGestante?: PregnantDetailsAPI;
}

// ============================================================================
// 4. DTOs (Data Transfer Objects) PARA O SERVICE
// ============================================================================

export interface CreateRecordDTO {
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
  patientId: string;
  
  // Dados aninhados na criação
  detalhesAdquirida?: Omit<AcquiredDetailsAPI, 'id'>;
}

export interface UpdateRecordDTO extends Partial<CreateRecordDTO> {
  // O Partial torna todas as propriedades opcionais para atualização
}

export interface AddObservationDTO {
  text: string;
}
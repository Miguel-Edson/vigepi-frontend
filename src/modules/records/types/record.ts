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
// 2. ENUMS ESPECÍFICOS: SÍFILIS ADQUIRIDA (ACQUIRED) E COMPARTILHADOS
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
// 3. ENUMS ESPECÍFICOS: SÍFILIS CONGÊNITA (CONGENITAL)
// ============================================================================
export enum DiagSifilisMatEnum {
  DURANTE_PRE_NATAL  = '1 - Durante o Pré-Natal',
  MOMENTO_PARTO      = '2 - No momento do parto/curetagem',
  APOS_PARTO         = '3 - Após o parto',
  NAO_REALIZADO      = '4 - Não realizado',
  IGNORADO           = '9 - Ignorado',
}

export enum EsquemaTratMaeEnum {
  ADEQUADO      = '1 - Adequado',
  INADEQUADO    = '2 - Inadequado',
  NAO_REALIZADO = '3 - Não realizado',
  IGNORADO      = '9 - Ignorado',
}

export enum TesteEnum18mEnum {
  REAGENTE      = '1 - Reagente',
  NAO_REAGENTE  = '2 - Não Reagente',
  NAO_REALIZADO = '3 - Não Realizado',
  NAO_SE_APLICA = '4 - Não se aplica',
  IGNORADO      = '9 - Ignorado',
}

export enum Options3Enum {
  SIM           = '1 - Sim',
  NAO           = '2 - Não',
  NAO_REALIZADO = '3 - Não realizado',
  IGNORADO      = '9 - Ignorado',
}

export enum DiagClinicoEnum {
  ASSINTOMATICO = '1 - Assintomático',
  SINTOMATICO   = '2 - Sintomático',
  NAO_SE_APLICA = '3 - Não se aplica',
  IGNORADO      = '9 - Ignorado',
}

export enum SinaisSintomasEnum {
  SIM           = '1 - Sim',
  NAO           = '2 - Não',
  NAO_SE_APLICA = '3 - Não se aplica',
  IGNORADO      = '9 - Ignorado',
}

export enum EsquemaTratCriancaEnum {
  PENICILINA_CRISTALINA = '1 - Peni G cristal 100k-150k UI/Kg/dia',
  PENICILINA_PROCAINA   = '2 - Peni G procaína 50k UI/Kg/dia 10d', 
  PENICILINA_BENZATINA  = '3 - Peni G benzatina 50k UI/Kg/dia',  
  OUTRO                 = '4 - Outro esquema',
  NAO_REALIZADO         = '5 - Não Realizado',
  IGNORADO              = '9 - Ignorado',
}

export enum EvolucaoEnum {
  VIVO                = '1 - Vivo',
  OBITO_SIFILIS       = '2 - Óbito por sífilis congênita',
  OBITO_OUTRAS_CAUSAS = '3 - Óbito por outras causas',
  ABORTO              = '4 - Aborto',
  NATIMORTO           = '5 - Natimorto',
  IGNORADO            = '9 - Ignorado',
}

// ============================================================================
// 3.5. ENUMS ESPECÍFICOS: SÍFILIS GESTACIONAL (PREGNANT)
// ============================================================================
export enum ClassClinicaGestanteEnum {
  PRIMARIA   = '1 - Primária',
  SECUNDARIA = '2 - Secundária',
  TERCIARIA  = '3 - Terciária',
  LATENTE    = '4 - Latente',
  IGNORADO   = '9 - Ignorado',
}

export enum EsquemaTratamentoGestanteEnum {
  PENICILINA_2_4 = '1 - Penicilina G benzatina 2.400.000 UI',
  PENICILINA_4_8 = '2 - Penicilina G benzatina 4.800.000 UI',
  PENICILINA_7_2 = '3 - Penicilina G benzatina 7.200.000 UI',
  OUTRO          = '4 - Outro esquema',
  NAO_REALIZADO  = '5 - Não realizado',
  IGNORADO       = '9 - Ignorado',
}

export enum MotivoNaoTratParceiroEnum {
  SEM_CONTATO            = '1 - Sem contato com gestante',
  NAO_COMUNICADO         = '2 - Não comunicado/convocado',
  NAO_COMPARECEU         = '3 - Convocado mas não compareceu',
  RECUSOU                = '4 - Convocado mas recusou',
  SOROLOGIA_NAO_REAGENTE = '5 - Sorologia não reagente',
  OUTRO_MOTIVO           = '6 - Outro motivo',
}

// ============================================================================
// 4. INTERFACES DE ENTIDADES
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

/** Dados Específicos da Sífilis Congênita (Mapeia a entidade Congenital) */
export interface CongenitalDetailsAPI {
  id: string;
  
  // Antecedentes Epidemiológicos da Gestante/Mãe
  idadeMae: number;
  racaCorMae: string;
  ocupacaoMae: string;
  escolaridadeMae: string;
  preNatalGestacao: OpcoesSimNao;
  ufPreNatal?: string;
  municipioPreNatal?: string;
  codigoIbgePreNatal?: string;
  unidadeSaudePreNatal?: string;
  codigoUnidadePreNatal?: string;

  // Dados do Laboratório da Gestante/Mãe
  diagSifilisMat: DiagSifilisMatEnum;
  testeNaoTreponemicoMae: TesteEnum;
  tituloMae?: string;
  dataTesteNaoTreponemicoMae?: string;
  testeTreponemicoMae: TesteEnum;

  // Tratamento da Gestante/Mãe
  esquemaTratMae: EsquemaTratMaeEnum;
  dataInicioTratMae?: string;
  parceiroTratado: OpcoesSimNao;

  // Antecedentes Epidemiológicos da Criança
  ufNascimento?: string;
  municipioNascimento?: string;
  codigoIbgeNascimento?: string;
  localNascimento?: string;
  codigoLocalNascimento?: string;

  // Dados do Laboratório da Criança
  testeNaoTreponemicoCrianca: TesteEnum;
  tituloCrianca?: string;
  dataNaoTreponemicoCrianca?: string;
  testeTreponemicoCrianca: TesteEnum18mEnum;
  dataTreponemicoCrianca?: string;
  testeNaoTreponemicoLiquor: TesteEnum;
  tituloLiquor?: string;
  dataLiquor?: string;
  titulacaoAscendente: Options3Enum;
  evidenciaTreponema: Options3Enum;
  alteracaoLiquorica: Options3Enum;
  diagRadiologico: Options3Enum;

  // Dados Clínicos da Criança
  diagClinico: DiagClinicoEnum;
  sinaisSintomas: SinaisSintomasEnum;
  ictericia: boolean;
  anemia: boolean;
  esplenomegalia: boolean;
  osteocondrite: boolean;
  riniteMucoSanguinolenta: boolean;
  hepatomegalia: boolean;
  lesoesCutaneas: boolean;
  pseudoparalisia: boolean;
  outroSinal?: string;

  // Tratamento e Evolução da Criança
  esquemaTratCrianca: EsquemaTratCriancaEnum;
  evolucaoCaso: EvolucaoEnum;
  dataObito?: string;
}

export interface PregnantDetailsAPI {
  id?: string;
  ocupacao?: string;
  /** AAAA-MM-DD. Enviar null para limpar. A DPP é calculada pelo backend (DUM + 280 dias). */
  dataUltimaMenstruacao?: string | null;
  ufPreNatal?: string;
  municipioPreNatal?: string;
  codigoIbgePreNatal?: string;
  unidadePreNatal?: string;
  codigoUnidadePreNatal?: string;
  numeroSisprenatal?: string;
  classificacaoClinica?: ClassClinicaGestanteEnum;
  testeNaoTreponemicoPreNatal?: TesteEnum;
  tituloNaoTreponemico?: string;
  dataTesteNaoTreponemico?: string;
  testeTreponemicoPreNatal?: TesteEnum;
  esquemaTratPresGestante?: EsquemaTratamentoGestanteEnum;
  parceiroTratGestante?: OpcoesSimNao;
  esquemaTratPresParceiro?: EsquemaTratamentoGestanteEnum;
  motivoNaoTratParceiro?: MotivoNaoTratParceiroEnum;
  outroMotivoNaoTratParceiro?: string;
}

/** Calculado pelo backend a partir da DUM; null/ausente se não há DUM ou se ela é futura. */
export interface StatusGestacional {
  dpp: string; // AAAA-MM-DD
  idadeGestacionalSemanas: number;
  idadeGestacionalDias: number;
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
  detalhesCongenita?: CongenitalDetailsAPI;
  detalhesGestante?: PregnantDetailsAPI;

  /** Só em fichas gestacionais: DPP e idade gestacional estimadas pela DUM. */
  statusGestacional?: StatusGestacional | null;
}

// ============================================================================
// 5. DTOs (Data Transfer Objects) PARA O SERVICE
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
  detalhesCongenita?: Omit<CongenitalDetailsAPI, 'id'>;
  detalhesGestante?: Omit<PregnantDetailsAPI, 'id'>;
}

export interface UpdateRecordDTO extends Partial<CreateRecordDTO> {
  // O Partial torna todas as propriedades opcionais para atualização
}

export interface AddObservationDTO {
  text: string;
}
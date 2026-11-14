import * as z from "zod";

import { 
  Cid10,
  StatusFicha,
  ClassClinicaGestanteEnum, 
  EsquemaTratamentoGestanteEnum, 
  MotivoNaoTratParceiroEnum,
  CompSexualEnum, 
  ClassClinicaEnum, 
  EsquemaTratamentoEnum, 
  ClassFinalEnum, 
  OpcoesSimNao 
} from "../types/record";

export { 
  Cid10,
  StatusFicha,
  ClassClinicaGestanteEnum, 
  EsquemaTratamentoGestanteEnum, 
  MotivoNaoTratParceiroEnum,
  CompSexualEnum, 
  ClassClinicaEnum, 
  EsquemaTratamentoEnum, 
  ClassFinalEnum, 
  OpcoesSimNao 
};

// Simulação dos Enums baseados na sua Entidade TypeORM
export enum OptionsEnum { SIM = '1 - Sim', NAO = '2 - Não', IGNORADO = '9 - Ignorado' }
export enum TesteEnum { REAGENTE = '1 - Reagente', NAO_REAGENTE = '2 - Não Reagente', NAO_REALIZADO = '3 - Não Realizado', IGNORADO = '9 - Ignorado' }
export enum DiagSifilisMatEnum { DURANTE_PRE_NATAL = '1 - Durante o Pré-Natal', MOMENTO_PARTO = '2 - No momento do parto/curetagem', APOS_PARTO = '3 - Após o parto', NAO_REALIZADO = '4 - Não realizado', IGNORADO = '9 - Ignorado' }
export enum EsquemaTratMaeEnum { ADEQUADO = '1 - Adequado', INADEQUADO = '2 - Inadequado', NAO_REALIZADO = '3 - Não realizado', IGNORADO = '9 - Ignorado' }
export enum TesteEnum18mEnum { REAGENTE = '1 - Reagente', NAO_REAGENTE = '2 - Não Reagente', NAO_REALIZADO = '3 - Não Realizado', NAO_SE_APLICA = '4 - Não se aplica', IGNORADO = '9 - Ignorado' }
export enum Options3Enum { SIM = '1 - Sim', NAO = '2 - Não', NAO_REALIZADO = '3 - Não realizado', IGNORADO = '9 - Ignorado' }
export enum DiagClinicoEnum { ASSINTOMATICO = '1 - Assintomático', SINTOMATICO = '2 - Sintomático', NAO_SE_APLICA = '3 - Não se aplica', IGNORADO = '9 - Ignorado' }
export enum SinaisSintomasEnum { SIM = '1 - Sim', NAO = '2 - Não', NAO_SE_APLICA = '3 - Não se aplica', IGNORADO = '9 - Ignorado' }
export enum EsquemaTratCriancaEnum { PENICILINA_CRISTALINA = '1 - Peni G cristal 100k-150k UI/Kg/dia', PENICILINA_PROCAINA = '2 - Peni G procaína 50k UI/Kg/dia 10d', PENICILINA_BENZATINA = '3 - Peni G benzatina 50k UI/Kg/dia', OUTRO = '4 - Outro esquema', NAO_REALIZADO = '5 - Não Realizado', IGNORADO = '9 - Ignorado' }
export enum EvolucaoEnum { VIVO = '1 - Vivo', OBITO_SIFILIS = '2 - Óbito por sífilis congênita', OBITO_OUTRAS_CAUSAS = '3 - Óbito por outras causas', ABORTO = '4 - Aborto', NATIMORTO = '5 - Natimorto', IGNORADO = '9 - Ignorado' }

// 🔥 Utilitário mágico para o novo Zod: Transforma o Enum num formato seguro para o z.enum()
const enumToZod = <T extends Record<string, string>>(e: T) => Object.values(e) as [string, ...string[]];

export const recordAdquiridaSchema = z.object({
  // --- DADOS GERAIS DA FICHA ---
  tipoNotificacao: z.string().min(1, "Obrigatório"),
  numSinan: z.string().min(1, "Obrigatório"),
  agravo: z.string(),
  codeCid: z.string().min(1, "Obrigatório"),
  status: z.string().min(1, "Obrigatório"),
  dataNotificacao: z.string().min(10, "Obrigatório"),
  dataDiagnostico: z.string().min(10, "Obrigatório"),
  uf: z.string().min(2, "Obrigatório"),
  municipio: z.string().min(1, "Obrigatório"),
  codigoIbge: z.string().optional(),
  codigoUnidadeSaude: z.string().optional(),

  // --- DETALHES ESPECÍFICOS DA ADQUIRIDA ---
  detalhesAdquirida: z.object({
    ocupacao: z.string().optional(), // opcional ou .min(1) se for obrigatório
    
    // Antecedentes Epidemiológicos
    antSifilis: z.enum(enumToZod(OpcoesSimNao)),
    seSimTratRealizado: z.enum(enumToZod(OpcoesSimNao)),
    compSexual: z.enum(enumToZod(CompSexualEnum)),
    
    // Dados Laboratoriais
    testeNaoTreponico: z.enum(enumToZod(TesteEnum)),
    titulo: z.string().optional(),
    data: z.string().optional(),
    testeTreponico: z.enum(enumToZod(TesteEnum)),
    
    // Tratamento e Classificação
    esquemaTratAdquirida: z.enum(enumToZod(EsquemaTratamentoEnum)),
    dataInicioTrat: z.string().optional(),
    classClinica: z.enum(enumToZod(ClassClinicaEnum)),
    classFinal: z.enum(enumToZod(ClassFinalEnum)),
    classFinalOutro: z.string().optional(),
  })
});

export type RecordAdquiridaForm = z.infer<typeof recordAdquiridaSchema>;


export const recordCongenitaSchema = z.object({
  // --- DADOS GERAIS DA FICHA ---
  tipoNotificacao: z.string().min(1, "Obrigatório"),
  numSinan: z.string().min(1, "Obrigatório"),
  agravo: z.string(),
  codeCid: z.string().min(1, "Obrigatório"),
  status: z.string().min(1, "Obrigatório"),
  dataNotificacao: z.string().min(10, "Obrigatório"),
  dataDiagnostico: z.string().min(10, "Obrigatório"),
  uf: z.string().min(2, "Obrigatório"),
  municipio: z.string().min(1, "Obrigatório"),
  codigoIbge: z.string().optional(),
  codigoUnidadeSaude: z.string().optional(),

  // --- DETALHES ESPECÍFICOS ---
  detalhesCongenita: z.object({
    // Antecedentes da Mãe
    idadeMae: z.string().transform(Number),
    racaCorMae: z.string().min(1, "Obrigatório"),
    ocupacaoMae: z.string().optional(),
    escolaridadeMae: z.string().min(1, "Obrigatório"),
    preNatalGestacao: z.enum(enumToZod(OptionsEnum)),
    ufPreNatal: z.string().optional(),
    municipioPreNatal: z.string().optional(),
    codigoIbgePreNatal: z.string().optional(),
    unidadeSaudePreNatal: z.string().optional(),
    codigoUnidadePreNatal: z.string().optional(),
    
    // Laboratório da Mãe
    diagSifilisMat: z.enum(enumToZod(DiagSifilisMatEnum)),
    testeNaoTreponemicoMae: z.enum(enumToZod(TesteEnum)),
    tituloMae: z.string().optional(),
    dataTesteNaoTreponemicoMae: z.string().optional(),
    testeTreponemicoMae: z.enum(enumToZod(TesteEnum)),
    
    // Tratamento da Mãe
    esquemaTratMae: z.enum(enumToZod(EsquemaTratMaeEnum)),
    dataInicioTratMae: z.string().optional(),
    parceiroTratado: z.enum(enumToZod(OptionsEnum)),
    
    // Antecedentes da Criança
    ufNascimento: z.string().optional(),
    municipioNascimento: z.string().optional(),
    codigoIbgeNascimento: z.string().optional(),
    localNascimento: z.string().optional(),
    codigoLocalNascimento: z.string().optional(),

    // Laboratório da Criança
    testeNaoTreponemicoCrianca: z.enum(enumToZod(TesteEnum)),
    tituloCrianca: z.string().optional(),
    dataNaoTreponemicoCrianca: z.string().optional(),
    testeTreponemicoCrianca: z.enum(enumToZod(TesteEnum18mEnum)),
    dataTreponemicoCrianca: z.string().optional(),
    testeNaoTreponemicoLiquor: z.enum(enumToZod(TesteEnum)),
    tituloLiquor: z.string().optional(),
    dataLiquor: z.string().optional(),
    titulacaoAscendente: z.enum(enumToZod(Options3Enum)),
    evidenciaTreponema: z.enum(enumToZod(Options3Enum)),
    alteracaoLiquorica: z.enum(enumToZod(Options3Enum)),
    diagRadiologico: z.enum(enumToZod(Options3Enum)),
    
    // Clínica da Criança
    diagClinico: z.enum(enumToZod(DiagClinicoEnum)),
    sinaisSintomas: z.enum(enumToZod(SinaisSintomasEnum)),
    ictericia: z.boolean().default(false),
    anemia: z.boolean().default(false),
    esplenomegalia: z.boolean().default(false),
    osteocondrite: z.boolean().default(false),
    riniteMucoSanguinolenta: z.boolean().default(false),
    hepatomegalia: z.boolean().default(false),
    lesoesCutaneas: z.boolean().default(false),
    pseudoparalisia: z.boolean().default(false),
    outroSinal: z.string().optional(),
    
    // Tratamento e Evolução
    esquemaTratCrianca: z.enum(enumToZod(EsquemaTratCriancaEnum)),
    evolucaoCaso: z.enum(enumToZod(EvolucaoEnum)),
    dataObito: z.string().optional(),
  })
});

export type RecordCongenitaForm = z.infer<typeof recordCongenitaSchema>;

export const recordGestacionalSchema = z.object({
  // --- DADOS GERAIS DA FICHA ---
  tipoNotificacao: z.string().min(1, "Obrigatório"),
  numSinan: z.string().min(1, "Obrigatório"),
  agravo: z.string(), 
  
  // Agora usam os Enums corretos do backend
  codeCid: z.enum(enumToZod(Cid10)), 
  status: z.enum(enumToZod(StatusFicha)), 
  
  dataNotificacao: z.string().min(10, "Obrigatório"),
  dataDiagnostico: z.string().min(10, "Obrigatório"),
  
  // Nomes corrigidos para bater exatamente com a CreateRecordDTO do NestJS
  UF: z.string().min(2, "Obrigatório"), 
  municipio: z.string().min(1, "Obrigatório"),
  codeIbge: z.string().min(1, "Obrigatório"), 
  codeUnidadeSaude: z.string().min(1, "Obrigatório"), 

  // --- DETALHES ESPECÍFICOS DA GESTANTE ---
  detalhesGestante: z.object({
    ocupacao: z.string().optional(),
    ufPreNatal: z.string().optional(),
    municipioPreNatal: z.string().optional(),
    codigoIbgePreNatal: z.string().optional(),
    unidadePreNatal: z.string().optional(),
    codigoUnidadePreNatal: z.string().optional(),
    numeroSisprenatal: z.string().optional(),
    classificacaoClinica: z.enum(enumToZod(ClassClinicaGestanteEnum)).optional(),
    testeNaoTreponemicoPreNatal: z.enum(enumToZod(TesteEnum)).optional(),
    tituloNaoTreponemico: z.string().optional(),
    dataTesteNaoTreponemico: z.string().optional(),
    testeTreponemicoPreNatal: z.enum(enumToZod(TesteEnum)).optional(),
    esquemaTratPresGestante: z.enum(enumToZod(EsquemaTratamentoGestanteEnum)).optional(),
    
    // Corrigido de OptionsEnum para OpcoesSimNao ("Sim" em vez de "1 - Sim")
    parceiroTratGestante: z.enum(enumToZod(OpcoesSimNao)).optional(), 
    
    esquemaTratPresParceiro: z.enum(enumToZod(EsquemaTratamentoGestanteEnum)).optional(),
    motivoNaoTratParceiro: z.enum(enumToZod(MotivoNaoTratParceiroEnum)).optional(),
    outroMotivoNaoTratParceiro: z.string().optional(),
  })
});

export type RecordGestacionalForm = z.infer<typeof recordGestacionalSchema>;
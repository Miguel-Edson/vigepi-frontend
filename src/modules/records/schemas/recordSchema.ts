import * as z from "zod";

import {
  // Gerais
  Cid10,
  StatusFicha,
  OpcoesSimNao,
  // Adquirida
  CompSexualEnum,
  TesteEnum,
  ClassClinicaEnum,
  EsquemaTratamentoEnum,
  ClassFinalEnum,
  // Congênita
  DiagSifilisMatEnum,
  EsquemaTratMaeEnum,
  TesteEnum18mEnum,
  Options3Enum,
  DiagClinicoEnum,
  SinaisSintomasEnum,
  EsquemaTratCriancaEnum,
  EvolucaoEnum,
  // Gestacional
  ClassClinicaGestanteEnum,
  EsquemaTratamentoGestanteEnum,
  MotivoNaoTratParceiroEnum,
} from "../types/record";

// Os enums moram em types/record.ts (fonte única). Reexportados aqui porque vários
// componentes já importam daqui.
export {
  Cid10,
  StatusFicha,
  OpcoesSimNao,
  CompSexualEnum,
  TesteEnum,
  ClassClinicaEnum,
  EsquemaTratamentoEnum,
  ClassFinalEnum,
  DiagSifilisMatEnum,
  EsquemaTratMaeEnum,
  TesteEnum18mEnum,
  Options3Enum,
  DiagClinicoEnum,
  SinaisSintomasEnum,
  EsquemaTratCriancaEnum,
  EvolucaoEnum,
  ClassClinicaGestanteEnum,
  EsquemaTratamentoGestanteEnum,
  MotivoNaoTratParceiroEnum,
};

// Transforma um Enum num formato seguro para o z.enum()
const enumToZod = <T extends Record<string, string>>(e: T) => Object.values(e) as [string, ...string[]];

// Select obrigatório (sem escolha => "Obrigatório", em vez da mensagem técnica do Zod)
const requiredEnum = <T extends Record<string, string>>(e: T) =>
  z.enum(enumToZod(e), { message: "Obrigatório" });

// ============================================================================
// DADOS GERAIS DA FICHA (iguais nos 3 tipos). Nomes batem com o CreateRecordDTO do NestJS.
// ============================================================================
export const recordGeneralSchema = z.object({
  tipoNotificacao: z.string().min(1, "Obrigatório"),
  numSinan: z.string().min(1, "Obrigatório"),
  agravo: z.string(),
  codeCid: requiredEnum(Cid10),
  status: requiredEnum(StatusFicha),
  dataNotificacao: z.string().min(10, "Obrigatório"),
  dataDiagnostico: z.string().min(10, "Obrigatório"),
  UF: z.string().min(2, "Obrigatório"),
  municipio: z.string().min(1, "Obrigatório"),
  codeIbge: z.string().min(1, "Obrigatório"),
  codeUnidadeSaude: z.string().min(1, "Obrigatório"),
});

export type RecordGeneralFields = z.infer<typeof recordGeneralSchema>;

// ============================================================================
// SÍFILIS ADQUIRIDA
// ============================================================================
export const recordAdquiridaSchema = recordGeneralSchema.extend({
  detalhesAdquirida: z.object({
    ocupacao: z.string().optional(),

    // Antecedentes Epidemiológicos
    antSifilis: requiredEnum(OpcoesSimNao),
    seSimTratRealizado: requiredEnum(OpcoesSimNao),
    compSexual: requiredEnum(CompSexualEnum),

    // Dados Laboratoriais
    testeNaoTreponico: requiredEnum(TesteEnum),
    titulo: z.string().optional(),
    data: z.string().optional(),
    testeTreponico: requiredEnum(TesteEnum),

    // Tratamento e Classificação
    esquemaTratAdquirida: requiredEnum(EsquemaTratamentoEnum),
    dataInicioTrat: z.string().optional(),
    classClinica: requiredEnum(ClassClinicaEnum),
    classFinal: requiredEnum(ClassFinalEnum),
    classFinalOutro: z.string().optional(),
  }),
});

export type RecordAdquiridaForm = z.infer<typeof recordAdquiridaSchema>;

// ============================================================================
// SÍFILIS CONGÊNITA
// ============================================================================
export const recordCongenitaSchema = recordGeneralSchema.extend({
  detalhesCongenita: z.object({
    // Antecedentes da Mãe
    // (campo numérico: em branco chega como undefined; ver RecordSections)
    idadeMae: z
      .number({ message: "Obrigatório" })
      .int("Idade inválida")
      .min(0, "Idade inválida")
      .max(120, "Idade inválida"),
    racaCorMae: z.string().min(1, "Obrigatório"),
    ocupacaoMae: z.string().optional(),
    escolaridadeMae: z.string().min(1, "Obrigatório"),
    preNatalGestacao: requiredEnum(OpcoesSimNao),
    ufPreNatal: z.string().optional(),
    municipioPreNatal: z.string().optional(),
    codigoIbgePreNatal: z.string().optional(),
    unidadeSaudePreNatal: z.string().optional(),
    codigoUnidadePreNatal: z.string().optional(),

    // Laboratório da Mãe
    diagSifilisMat: requiredEnum(DiagSifilisMatEnum),
    testeNaoTreponemicoMae: requiredEnum(TesteEnum),
    tituloMae: z.string().optional(),
    dataTesteNaoTreponemicoMae: z.string().optional(),
    testeTreponemicoMae: requiredEnum(TesteEnum),

    // Tratamento da Mãe
    esquemaTratMae: requiredEnum(EsquemaTratMaeEnum),
    dataInicioTratMae: z.string().optional(),
    parceiroTratado: requiredEnum(OpcoesSimNao),

    // Antecedentes da Criança
    ufNascimento: z.string().optional(),
    municipioNascimento: z.string().optional(),
    codigoIbgeNascimento: z.string().optional(),
    localNascimento: z.string().optional(),
    codigoLocalNascimento: z.string().optional(),

    // Laboratório da Criança
    testeNaoTreponemicoCrianca: requiredEnum(TesteEnum),
    tituloCrianca: z.string().optional(),
    dataNaoTreponemicoCrianca: z.string().optional(),
    testeTreponemicoCrianca: requiredEnum(TesteEnum18mEnum),
    dataTreponemicoCrianca: z.string().optional(),
    testeNaoTreponemicoLiquor: requiredEnum(TesteEnum),
    tituloLiquor: z.string().optional(),
    dataLiquor: z.string().optional(),
    titulacaoAscendente: requiredEnum(Options3Enum),
    evidenciaTreponema: requiredEnum(Options3Enum),
    alteracaoLiquorica: requiredEnum(Options3Enum),
    diagRadiologico: requiredEnum(Options3Enum),

    // Clínica da Criança
    diagClinico: requiredEnum(DiagClinicoEnum),
    sinaisSintomas: requiredEnum(SinaisSintomasEnum),
    ictericia: z.boolean(),
    anemia: z.boolean(),
    esplenomegalia: z.boolean(),
    osteocondrite: z.boolean(),
    riniteMucoSanguinolenta: z.boolean(),
    hepatomegalia: z.boolean(),
    lesoesCutaneas: z.boolean(),
    pseudoparalisia: z.boolean(),
    outroSinal: z.string().optional(),

    // Tratamento e Evolução
    esquemaTratCrianca: requiredEnum(EsquemaTratCriancaEnum),
    evolucaoCaso: requiredEnum(EvolucaoEnum),
    dataObito: z.string().optional(),
  }),
});

export type RecordCongenitaForm = z.infer<typeof recordCongenitaSchema>;

// ============================================================================
// SÍFILIS GESTACIONAL
// ============================================================================
export const recordGestacionalSchema = recordGeneralSchema.extend({
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
    parceiroTratGestante: z.enum(enumToZod(OpcoesSimNao)).optional(),
    esquemaTratPresParceiro: z.enum(enumToZod(EsquemaTratamentoGestanteEnum)).optional(),
    motivoNaoTratParceiro: z.enum(enumToZod(MotivoNaoTratParceiroEnum)).optional(),
    outroMotivoNaoTratParceiro: z.string().optional(),
  }),
});

export type RecordGestacionalForm = z.infer<typeof recordGestacionalSchema>;

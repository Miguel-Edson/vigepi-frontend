import * as z from "zod";

export const monitoramentoGestanteSchema = z.object({
  codigoFonteNotificadora: z.string().optional(),
  fonteNotificadora: z.string().optional(),
  dataDiagnostico: z.string().optional(),
  semanaGestacional: z.string().optional(),
  data1Prenatal: z.string().optional(),
  testeRapido: z.string().optional(),
  dpp: z.string().optional(),
  
  // Tratamento 1
  dose1dataTrat1: z.string().optional(),
  dose2dataTrat1: z.string().optional(),
  dose3dataTrat1: z.string().optional(),

  // Tratamento 2
  dose1dataTrat2: z.string().optional(),
  dose2dataTrat2: z.string().optional(),
  dose3dataTrat2: z.string().optional(),

  // Tratamento 3
  dose1dataTrat3: z.string().optional(),
  dose2dataTrat3: z.string().optional(),
  dose3dataTrat3: z.string().optional(),

  // Parceria
  parceriaDose1dataTrat1: z.string().optional(),
  parceriaDose1dataTrat2: z.string().optional(),
  parceriaDose1dataTrat3: z.string().optional(),
});

export type MonitoramentoGestanteForm = z.infer<typeof monitoramentoGestanteSchema>;

// ============================================================================
// Formulários de "dados do acompanhamento" (tudo MENOS as doses: elas são tratadas
// pela linha do tempo de tratamentos). Cada tipo de ficha tem os seus campos.
// ============================================================================
const text = z.string().optional();
const date = z.string().optional();

export const monitoramentoGestanteInfoSchema = z.object({
  codigoFonteNotificadora: text,
  fonteNotificadora: text,
  dataDiagnostico: date,
  semanaGestacional: text,
  data1Prenatal: date,
  testeRapido: text,
  dpp: date,
  parceriaDose1dataTrat1: date,
  parceriaDose1dataTrat2: date,
  parceriaDose1dataTrat3: date,
});

export const monitoramentoAdquiridaInfoSchema = z.object({
  idade: z.number({ message: "Informe um número" }).int("Idade inválida").min(0, "Idade inválida").max(120, "Idade inválida").optional(),
  dataTesteRapido: date,
  resultTesteRapido: text,
  dataVdrlDiag: date,
  resultVdrlDiag: text,
  parcTratado: text,
  dose1dataTrat1Parc: date,
  dose2dataTrat1Parc: date,
  dose3dataTrat1Parc: date,
});

export const monitoramentoCongenitaInfoSchema = z.object({
  nomeMae: text,
  nomeRN: text,
  datanascRN: date,
  vdrlDaMaeData: date,
  vdrlDaMaeTitulacao: text,
  vdrlDaRNData: date,
  vdrlDaRNTitulacao: text,
  rxOssosLongos: text,
  fundoDeOlho: text,
  mes1SegmentoSifilis: text,
  mes1SegmentoTitulacao: text,
  mes3SegmentoSifilis: text,
  mes3SegmentoTitulacao: text,
  mes6SegmentoSifilis: text,
  mes6SegmentoTitulacao: text,
  mes12SegmentoSifilis: text,
  mes12SegmentoTitulacao: text,
  mes16SegmentoSifilis: text,
  mes16SegmentoTitulacao: text,
  tpma: text,
  classificacaoFinal: text,
});

export const MONITORING_INFO_SCHEMAS = {
  gestante: monitoramentoGestanteInfoSchema,
  adquirida: monitoramentoAdquiridaInfoSchema,
  congenita: monitoramentoCongenitaInfoSchema,
};
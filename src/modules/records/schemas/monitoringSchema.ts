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
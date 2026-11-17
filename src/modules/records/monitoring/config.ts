import { Agravo } from "@/modules/records/types/record";

// ============================================================================
// REGRAS DO TRATAMENTO — para mudar uma regra, altere SÓ este arquivo.
// ============================================================================

/**
 * Intervalo, em dias, entre uma dose e a próxima.
 * Confirmar com a equipe clínica qual vale: 7 ou 14 dias.
 */
export const DOSE_INTERVAL_DAYS = 7;

/** Doses por tratamento (colunas dose1..dose3 no backend). */
export const DOSES_PER_TREATMENT = 3;

/**
 * Quantos tratamentos cada ficha comporta. É o limite das COLUNAS do backend
 * (dose1dataTrat1 ... dose3dataTrat3). Para permitir mais, primeiro crie as colunas
 * novas no backend (ex.: dose1dataTrat4...) e depois aumente o número aqui.
 */
export const MAX_TREATMENTS = { gestante: 3, adquirida: 2 } as const;

export type TreatmentTipo = keyof typeof MAX_TREATMENTS;
export type MonitoramentoTipo = TreatmentTipo | "congenita";

/** Gestante e adquirida têm tratamento com doses; a congênita só tem exames de seguimento. */
export const hasTreatments = (tipo: MonitoramentoTipo): tipo is TreatmentTipo => tipo in MAX_TREATMENTS;

/** Valor do `:tipo` nas rotas /records/:tipo/:fichaId/monitoramentos */
export function agravoToTipo(agravo?: string): MonitoramentoTipo | undefined {
  switch (agravo) {
    case Agravo.SIFILIS_GESTACIONAL: return "gestante";
    case Agravo.SIFILIS_ADQUIRIDA: return "adquirida";
    case Agravo.SIFILIS_CONGENITA: return "congenita";
    default: return undefined;
  }
}

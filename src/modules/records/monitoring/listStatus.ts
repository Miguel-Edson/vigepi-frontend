import { StatusFicha } from "@/modules/records/types/record";
import { formatDate } from "@/utils/formatters";
import { todayISO } from "@/utils/dates";
import { MAX_TREATMENTS, type TreatmentTipo } from "./config";
import { getTreatmentStatus, readTreatments } from "./treatment";

export const STATUS_EM_TRATAMENTO = "Em Tratamento";

export interface ListStatus {
  /** Chave usada pelas abas/filtros da listagem. */
  key: string;
  /** Texto extra mostrado abaixo do status (ex.: data da próxima dose). */
  detail?: string;
}

const plural = (n: number, singular: string, plural_: string) => `${n} ${n === 1 ? singular : plural_}`;

/**
 * Status mostrado na listagem de pacientes. Quando há dados de doses, ele é CALCULADO
 * a partir das datas (e vira "Dose Atrasada" sozinho quando o prazo passa).
 * Óbito e Descontinuado, definidos manualmente na ficha, sempre prevalecem.
 */
export function getListStatus(
  recordStatus: string,
  tipo: TreatmentTipo | undefined,
  doses: Record<string, unknown> | undefined,
  today: string = todayISO()
): ListStatus {
  if (!tipo || !doses) return { key: recordStatus };
  if (recordStatus === StatusFicha.OBITO || recordStatus === StatusFicha.DESCONTINUADO) return { key: recordStatus };

  const status = getTreatmentStatus(readTreatments(doses, MAX_TREATMENTS[tipo], today), today);

  switch (status.kind) {
    case "em_tratamento":
      return {
        key: STATUS_EM_TRATAMENTO,
        detail: `Próxima dose (${status.nextDoseNumber}ª): ${formatDate(status.nextDoseDate)}`,
      };
    case "dose_atrasada": {
      const late = Math.abs(status.daysUntilNext ?? 0);
      return {
        key: StatusFicha.DOSE_ATRASADA,
        detail: `${status.nextDoseNumber}ª dose era para ${formatDate(status.nextDoseDate)} (${plural(late, "dia", "dias")} de atraso)`,
      };
    }
    case "finalizado":
      return { key: StatusFicha.TRATAMENTO_FINALIZADO, detail: `Última dose: ${formatDate(status.lastDoseDate)}` };
    default:
      return { key: recordStatus };
  }
}

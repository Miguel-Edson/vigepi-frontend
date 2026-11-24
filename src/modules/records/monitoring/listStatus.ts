import { StatusFicha } from "@/modules/records/types/record";
import { formatDate } from "@/utils/formatters";
import { todayISO } from "@/utils/dates";
import { MAX_TREATMENTS, type TreatmentTipo } from "./config";
import {
  describeDaysUntil,
  getDoseUrgency,
  getTreatmentStatus,
  readTreatments,
  type DoseUrgency,
} from "./treatment";

/** Aba/status de quem tem dose marcada e em dia. */
export const STATUS_EM_TRATAMENTO = "Em Tratamento";

export interface NextDose {
  date: string; // AAAA-MM-DD (também serve para ordenar)
  urgency: DoseUrgency;
  /** "hoje", "amanhã", "em 4 dias" ou "2 dias de atraso" */
  when: string;
}

export interface ListStatus {
  /** Chave usada pelas abas/filtros da listagem (é o nome do status). */
  key: string;
  /** Texto extra mostrado abaixo do status (ex.: data da próxima dose). */
  detail?: string;
  /** Presente quando há uma dose a tomar (em dia ou vencida): alimenta o alerta visual. */
  nextDose?: NextDose;
}

/**
 * Status mostrado na listagem de pacientes (aba + texto + alerta).
 *
 *  - Dose marcada e em dia ... aba "Em Tratamento", com a data da próxima dose; faltando poucos dias
 *                              (DOSE_ALERT_DAYS) o alerta fica vermelho;
 *  - Passou da data .......... vai sozinho para "Dose Atrasada" (a data prevista continua visível);
 *  - 3 doses aplicadas ....... "Tratamento Finalizado";
 *  - Ficha marcada como concluída / abandonada / óbito (manual) prevalece sobre as doses.
 */
export function getListStatus(
  recordStatus: string,
  tipo: TreatmentTipo | undefined,
  doses: Record<string, unknown> | undefined,
  today: string = todayISO()
): ListStatus {
  if (!tipo) return { key: recordStatus }; // congênita não tem doses

  const status = getTreatmentStatus(readTreatments(doses, MAX_TREATMENTS[tipo], today), { today, recordStatus });

  switch (status.kind) {
    case "obito":
      return { key: StatusFicha.OBITO };
    case "abandonado":
      return { key: StatusFicha.DESCONTINUADO };
    case "finalizado":
      return status.lastDoseDate
        ? { key: StatusFicha.TRATAMENTO_FINALIZADO, detail: `Última dose: ${formatDate(status.lastDoseDate)}` }
        : { key: StatusFicha.TRATAMENTO_FINALIZADO };
    case "dose_atrasada":
      return {
        key: StatusFicha.DOSE_ATRASADA,
        detail: `${status.nextDoseNumber}ª dose era para ${formatDate(status.nextDoseDate)}`,
        nextDose: {
          date: status.nextDoseDate as string,
          urgency: "late",
          when: describeDaysUntil(status.daysUntilNext ?? -1),
        },
      };
    case "em_tratamento": {
      const days = status.daysUntilNext ?? 0;
      return {
        key: STATUS_EM_TRATAMENTO,
        detail: `Próxima dose (${status.nextDoseNumber}ª): ${formatDate(status.nextDoseDate)}`,
        nextDose: { date: status.nextDoseDate as string, urgency: getDoseUrgency(days), when: describeDaysUntil(days) },
      };
    }
    default:
      return { key: recordStatus };
  }
}

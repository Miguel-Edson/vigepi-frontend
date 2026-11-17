import { StatusFicha } from "@/modules/records/types/record";
import { formatDate } from "@/utils/formatters";
import { todayISO } from "@/utils/dates";
import { MAX_TREATMENTS, type TreatmentTipo } from "./config";
import { getTreatmentStatus, readTreatments } from "./treatment";

export interface ListStatus {
  /** Chave usada pelas abas/filtros da listagem (é o nome do status da ficha). */
  key: string;
  /** Texto extra mostrado abaixo do status (ex.: data da próxima dose). */
  detail?: string;
}

const plural = (n: number, singular: string, plural_: string) => `${n} ${n === 1 ? singular : plural_}`;

/**
 * Status mostrado na listagem de pacientes (aba + texto).
 *
 *  - Dose em dia ......... continua na aba do status da ficha (ex.: Aguardando Exame),
 *                          com a data da próxima dose na coluna de status;
 *  - Passou da data ...... vai sozinho para "Dose Atrasada" (a data prevista continua visível);
 *  - 3 doses aplicadas ... "Tratamento Finalizado";
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
    case "dose_atrasada": {
      const late = Math.abs(status.daysUntilNext ?? 0);
      return {
        key: StatusFicha.DOSE_ATRASADA,
        detail: `${status.nextDoseNumber}ª dose era para ${formatDate(status.nextDoseDate)} (${plural(late, "dia", "dias")} de atraso)`,
      };
    }
    case "em_tratamento":
      return {
        // "Dose Atrasada" gravada à mão ficou velha (agora é calculada): volta para Aguardando Exame
        key: recordStatus === StatusFicha.DOSE_ATRASADA ? StatusFicha.AGUARDANDO_EXAME : recordStatus,
        detail: `Próxima dose (${status.nextDoseNumber}ª): ${formatDate(status.nextDoseDate)}`,
      };
    default:
      return { key: recordStatus };
  }
}

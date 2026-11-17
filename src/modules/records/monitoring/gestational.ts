import type { StatusGestacional } from "@/modules/records/types/record";
import { formatDate } from "@/utils/formatters";

export interface DppInfo {
  /** Texto curto para a listagem, ex.: "DPP: 12/04" */
  text: string;
  /** Texto completo (tooltip): data inteira, origem e idade gestacional. */
  title?: string;
  /** true quando não há DPP e o usuário precisa informar a DUM. */
  pending?: boolean;
}

export function formatGestationalAge(
  status: Pick<StatusGestacional, "idadeGestacionalSemanas" | "idadeGestacionalDias">
): string {
  const w = status.idadeGestacionalSemanas;
  const d = status.idadeGestacionalDias;
  return `${w} ${w === 1 ? "semana" : "semanas"} e ${d} ${d === 1 ? "dia" : "dias"}`;
}

const dayMonth = (iso: string) => formatDate(iso).slice(0, 5); // "2027-04-12" -> "12/04"

/**
 * DPP mostrada na listagem. Prioridade: a estimada pela DUM (statusGestacional, vinda do
 * backend) e, se não houver, a DPP digitada à mão no acompanhamento.
 */
export function getDppInfo(status: StatusGestacional | null | undefined, manualDpp?: string | null): DppInfo {
  if (status?.dpp) {
    return {
      text: `DPP: ${dayMonth(status.dpp)}`,
      title: `DPP estimada pela DUM: ${formatDate(status.dpp)} · hoje: ${formatGestationalAge(status)}`,
    };
  }
  if (manualDpp) {
    return { text: `DPP: ${dayMonth(manualDpp)}`, title: `DPP informada no acompanhamento: ${formatDate(manualDpp)}` };
  }
  return {
    text: "DPP: informe a DUM",
    title: "Sem DUM (ou com DUM futura) não é possível calcular a DPP",
    pending: true,
  };
}

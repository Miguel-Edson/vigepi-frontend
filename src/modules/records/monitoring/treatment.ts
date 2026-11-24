import { StatusFicha } from "@/modules/records/types/record";
import { addDays, diffInDays, isValidISODate, todayISO } from "@/utils/dates";
import { formatDate } from "@/utils/formatters";
import { DOSE_ALERT_DAYS, DOSE_INTERVAL_DAYS, DOSES_PER_TREATMENT } from "./config";

// Funções puras (sem React nem API): leem as colunas dose{N}dataTrat{M} de um
// monitoramento e calculam o estado do tratamento e a data da próxima dose.

export type TreatmentState = "completo" | "em_andamento" | "atrasado" | "interrompido";

export interface Treatment {
  number: number;
  /** Datas das doses 1..3 ("AAAA-MM-DD") ou null se ainda não aplicada. */
  doses: (string | null)[];
  appliedCount: number;
  lastDoseDate: string | null;
  nextDoseNumber: number | null;
  /** Última dose + DOSE_INTERVAL_DAYS. null se o tratamento está completo. */
  nextDoseDate: string | null;
  state: TreatmentState;
}

/** Nome da coluna no backend: doseKey(2, 1) => "dose1dataTrat2" */
export const doseKey = (treatment: number, dose: number) => `dose${dose}dataTrat${treatment}`;

function asDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const day = value.slice(0, 10); // aceita também "2026-10-14T00:00:00.000Z"
  return isValidISODate(day) ? day : null;
}

/**
 * Lê os tratamentos de um monitoramento. Um tratamento "existe" quando tem ao menos
 * uma dose com data. O ÚLTIMO é o tratamento atual; os anteriores incompletos contam
 * como interrompidos (o paciente abandonou e recomeçou).
 */
export function readTreatments(
  monitoramento: Record<string, unknown> | null | undefined,
  maxTreatments: number,
  today: string = todayISO()
): Treatment[] {
  if (!monitoramento) return [];

  const found: { number: number; doses: (string | null)[] }[] = [];
  for (let t = 1; t <= maxTreatments; t++) {
    const doses = Array.from({ length: DOSES_PER_TREATMENT }, (_, i) => asDate(monitoramento[doseKey(t, i + 1)]));
    if (doses.some(Boolean)) found.push({ number: t, doses });
  }

  const latestNumber = found.length ? found[found.length - 1].number : null;

  return found.map(({ number, doses }) => {
    let appliedCount = 0;
    doses.forEach((date, i) => {
      if (date) appliedCount = i + 1;
    });

    const lastDoseDate = appliedCount ? doses[appliedCount - 1] : null;
    const complete = appliedCount >= DOSES_PER_TREATMENT;
    const nextDoseNumber = complete ? null : appliedCount + 1;
    const nextDoseDate = !complete && lastDoseDate ? addDays(lastDoseDate, DOSE_INTERVAL_DAYS) : null;

    let state: TreatmentState;
    if (complete) state = "completo";
    else if (number !== latestNumber) state = "interrompido";
    else state = nextDoseDate !== null && today > nextDoseDate ? "atrasado" : "em_andamento";

    return { number, doses, appliedCount, lastDoseDate, nextDoseNumber, nextDoseDate, state };
  });
}

// ----------------------------------------------------------------------------
// Status geral (o que aparece no banner da ficha e na listagem de pacientes)
// ----------------------------------------------------------------------------
export type TreatmentStatusKind =
  | "sem_tratamento"
  | "em_tratamento"
  | "dose_atrasada"
  | "finalizado"
  | "abandonado"
  | "obito";

export const STATUS_LABEL: Record<TreatmentStatusKind, string> = {
  sem_tratamento: "Sem tratamento iniciado",
  em_tratamento: "Em tratamento",
  dose_atrasada: "Dose atrasada",
  finalizado: "Tratamento finalizado",
  abandonado: "Tratamento abandonado",
  obito: "Óbito registrado",
};

export interface TreatmentStatus {
  kind: TreatmentStatusKind;
  label: string;
  treatmentNumber: number | null;
  nextDoseNumber: number | null;
  nextDoseDate: string | null;
  /** Dias até a próxima dose (negativo = atrasada). */
  daysUntilNext: number | null;
  lastDoseDate: string | null;
}

/**
 * Status geral do tratamento.
 * O status da FICHA marcado manualmente (Óbito, Descontinuado = abandonado, Tratamento
 * Finalizado = concluído) prevalece sobre as doses; fora isso o status vem das datas.
 */
export function getTreatmentStatus(
  treatments: Treatment[],
  options: { today?: string; recordStatus?: string } = {}
): TreatmentStatus {
  const today = options.today ?? todayISO();
  const latest = treatments[treatments.length - 1];

  const build = (kind: TreatmentStatusKind, extra: Partial<TreatmentStatus> = {}): TreatmentStatus => ({
    kind,
    label: STATUS_LABEL[kind],
    treatmentNumber: latest?.number ?? null,
    lastDoseDate: latest?.lastDoseDate ?? null,
    nextDoseNumber: null,
    nextDoseDate: null,
    daysUntilNext: null,
    ...extra,
  });

  switch (options.recordStatus) {
    case StatusFicha.OBITO: return build("obito");
    case StatusFicha.DESCONTINUADO: return build("abandonado");
    case StatusFicha.TRATAMENTO_FINALIZADO: return build("finalizado");
  }

  if (!latest) return build("sem_tratamento");
  if (latest.state === "completo") return build("finalizado"); // 3 doses aplicadas

  return build(latest.state === "atrasado" ? "dose_atrasada" : "em_tratamento", {
    nextDoseNumber: latest.nextDoseNumber,
    nextDoseDate: latest.nextDoseDate,
    daysUntilNext: latest.nextDoseDate ? diffInDays(today, latest.nextDoseDate) : null,
  });
}

// ----------------------------------------------------------------------------
// Proximidade da próxima dose (alerta visual)
// ----------------------------------------------------------------------------
/** late = dose vencida; urgent = faltam DOSE_ALERT_DAYS dias ou menos; normal = com folga. */
export type DoseUrgency = "late" | "urgent" | "normal";

export function getDoseUrgency(daysUntil: number): DoseUrgency {
  if (daysUntil < 0) return "late";
  return daysUntil <= DOSE_ALERT_DAYS ? "urgent" : "normal";
}

/** "hoje", "amanhã", "em 3 dias" ou "2 dias de atraso". */
export function describeDaysUntil(days: number): string {
  if (days === 0) return "hoje";
  if (days === 1) return "amanhã";
  if (days > 1) return `em ${days} dias`;
  const late = Math.abs(days);
  return `${late} ${late === 1 ? "dia" : "dias"} de atraso`;
}

// ----------------------------------------------------------------------------
// Validação da data de uma dose
// ----------------------------------------------------------------------------
export function validateDoseDate(args: {
  doseNumber: number;
  date: string;
  previousDate?: string | null; // data da dose anterior (se houver)
  followingDate?: string | null; // data da dose seguinte (ao editar uma dose do meio)
  today?: string;
}): string | null {
  const { doseNumber, date, previousDate, followingDate, today = todayISO() } = args;

  if (!date || !isValidISODate(date)) return "Informe uma data válida.";
  if (date > today) return "A data da dose não pode ser futura.";
  if (previousDate && date <= previousDate) {
    return `A ${doseNumber}ª dose precisa ser depois da ${doseNumber - 1}ª (${formatDate(previousDate)}).`;
  }
  if (followingDate && date >= followingDate) {
    return `A ${doseNumber}ª dose precisa ser antes da ${doseNumber + 1}ª (${formatDate(followingDate)}).`;
  }
  return null;
}

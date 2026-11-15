"use client";

import { DOSE_INTERVAL_DAYS } from "@/modules/records/monitoring/config";
import type { TreatmentStatus, TreatmentStatusKind } from "@/modules/records/monitoring/treatment";
import { formatDate } from "@/utils/formatters";

const STYLE: Record<TreatmentStatusKind, { box: string; dot: string }> = {
  sem_tratamento: { box: "bg-gray-50 border-gray-200 text-gray-700", dot: "bg-gray-400" },
  em_tratamento: { box: "bg-emerald-50 border-emerald-200 text-emerald-800", dot: "bg-emerald-500" },
  dose_atrasada: { box: "bg-red-50 border-red-200 text-red-800", dot: "bg-red-500" },
  finalizado: { box: "bg-blue-50 border-blue-200 text-blue-800", dot: "bg-blue-500" },
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function relative(days: number | null): string {
  if (days === null) return "";
  if (days === 0) return "hoje";
  if (days === 1) return "amanhã";
  if (days > 1) return `em ${days} dias`;
  return `${plural(Math.abs(days), "dia", "dias")} de atraso`;
}

export function TreatmentStatusBanner({ status }: { status: TreatmentStatus }) {
  const style = STYLE[status.kind];

  return (
    <div className={`border rounded-xl p-5 flex flex-col gap-1 ${style.box}`} role="status">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
        <span className="font-bold">{status.label}</span>
        {status.treatmentNumber && status.kind !== "sem_tratamento" && (
          <span className="text-xs font-medium opacity-80">· {status.treatmentNumber}º tratamento</span>
        )}
      </div>

      {(status.kind === "em_tratamento" || status.kind === "dose_atrasada") && status.nextDoseDate && (
        <p className="text-sm">
          {status.kind === "em_tratamento" ? "Próxima dose" : "Dose prevista"} ({status.nextDoseNumber}ª):{" "}
          <strong>{formatDate(status.nextDoseDate)}</strong> ({relative(status.daysUntilNext)})
        </p>
      )}

      {status.kind === "finalizado" && status.lastDoseDate && (
        <p className="text-sm">Última dose aplicada em <strong>{formatDate(status.lastDoseDate)}</strong>.</p>
      )}

      {status.kind === "sem_tratamento" && <p className="text-sm">Nenhuma dose registrada nesta ficha.</p>}

      <p className="text-xs opacity-70 mt-1">Intervalo considerado entre as doses: {DOSE_INTERVAL_DAYS} dias.</p>
    </div>
  );
}

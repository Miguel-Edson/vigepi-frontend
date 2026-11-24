"use client";

import { DOSE_INTERVAL_DAYS } from "@/modules/records/monitoring/config";
import { describeDaysUntil, getDoseUrgency, type TreatmentStatus, type TreatmentStatusKind } from "@/modules/records/monitoring/treatment";
import { formatDate } from "@/utils/formatters";

const STYLE: Record<TreatmentStatusKind, { box: string; dot: string }> = {
  sem_tratamento: { box: "bg-gray-50 border-gray-200 text-gray-700", dot: "bg-gray-400" },
  em_tratamento: { box: "bg-emerald-50 border-emerald-200 text-emerald-800", dot: "bg-emerald-500" },
  dose_atrasada: { box: "bg-red-50 border-red-200 text-red-800", dot: "bg-red-500" },
  finalizado: { box: "bg-blue-50 border-blue-200 text-blue-800", dot: "bg-blue-500" },
  abandonado: { box: "bg-amber-50 border-amber-200 text-amber-800", dot: "bg-amber-500" },
  obito: { box: "bg-gray-100 border-gray-300 text-gray-800", dot: "bg-gray-700" },
};

const relative = (days: number | null) => (days === null ? "" : describeDaysUntil(days));

export function TreatmentStatusBanner({ status }: { status: TreatmentStatus }) {
  // Dose próxima (ou vencida) destaca em vermelho, igual à listagem de pacientes
  const isUrgent =
    status.kind === "em_tratamento" && status.daysUntilNext !== null && getDoseUrgency(status.daysUntilNext) === "urgent";
  const style = isUrgent ? STYLE.dose_atrasada : STYLE[status.kind];

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

      {status.kind === "finalizado" && (
        <p className="text-sm">
          {status.lastDoseDate ? (
            <>Última dose aplicada em <strong>{formatDate(status.lastDoseDate)}</strong>.</>
          ) : (
            "Tratamento marcado como concluído."
          )}
        </p>
      )}

      {status.kind === "abandonado" && (
        <p className="text-sm">
          Tratamento marcado como abandonado. Registrar uma nova dose reabre a ficha automaticamente.
        </p>
      )}

      {status.kind === "sem_tratamento" && <p className="text-sm">Nenhuma dose registrada nesta ficha.</p>}

      <p className="text-xs opacity-70 mt-1">Intervalo considerado entre as doses: {DOSE_INTERVAL_DAYS} dias.</p>
    </div>
  );
}

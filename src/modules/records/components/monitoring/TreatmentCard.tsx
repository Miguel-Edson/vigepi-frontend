"use client";

import { useState } from "react";
import { DOSE_INTERVAL_DAYS, DOSES_PER_TREATMENT } from "@/modules/records/monitoring/config";
import { validateDoseDate, type TreatmentState } from "@/modules/records/monitoring/treatment";
import { addDays, diffInDays, todayISO } from "@/utils/dates";
import { formatDate } from "@/utils/formatters";

const BADGE: Record<TreatmentState | "novo", { label: string; className: string }> = {
  novo: { label: "Novo", className: "bg-primary/10 text-primary-dark" },
  em_andamento: { label: "Em andamento", className: "bg-emerald-100 text-emerald-700" },
  atrasado: { label: "Atrasado", className: "bg-red-100 text-red-700" },
  completo: { label: "Concluído", className: "bg-blue-100 text-blue-700" },
  interrompido: { label: "Interrompido", className: "bg-amber-100 text-amber-700" },
};

interface TreatmentCardProps {
  number: number;
  doses: (string | null)[];
  state: TreatmentState | "novo";
  canEdit: boolean;
  /** Lançam erro se a API recusar; o cartão mostra a mensagem. */
  onSaveDose: (doseNumber: number, date: string) => Promise<void>;
  onRemoveDose: (doseNumber: number) => Promise<void>;
  onCancelDraft?: () => void;
}

const inputClass =
  "h-10 px-3 bg-white border border-primary rounded-md text-sm text-gray-800 focus:outline-hidden";
const smallBtn = "px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

export function TreatmentCard({ number, doses, state, canEdit, onSaveDose, onRemoveDose, onCancelDraft }: TreatmentCardProps) {
  const today = todayISO();
  const applied = doses.reduce<number>((acc, date, i) => (date ? i + 1 : acc), 0);

  const [pendingDate, setPendingDate] = useState(today);
  const [editing, setEditing] = useState<{ dose: number; value: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    setSaving(true);
    setError(null);
    try {
      await action();
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Não foi possível salvar a dose.");
    } finally {
      setSaving(false);
    }
  };

  const submitDose = (doseNumber: number, date: string) => {
    const message = validateDoseDate({
      doseNumber,
      date,
      previousDate: doses[doseNumber - 2] ?? null,
      followingDate: doses[doseNumber] ?? null,
      today,
    });
    if (message) {
      setError(message);
      return;
    }
    return run(() => onSaveDose(doseNumber, date));
  };

  const removeDose = (doseNumber: number) => {
    if (!window.confirm(`Remover o registro da ${doseNumber}ª dose?`)) return;
    return run(() => onRemoveDose(doseNumber));
  };

  const hint = (doseNumber: number): string | null => {
    const previous = doses[doseNumber - 2];
    if (!previous) return null;
    const expected = addDays(previous, DOSE_INTERVAL_DAYS);
    const days = diffInDays(today, expected);
    const when = days < 0 ? `atrasada há ${Math.abs(days)} dia(s)` : days === 0 ? "é hoje" : `em ${days} dia(s)`;
    return `Prevista para ${formatDate(expected)} (${when})`;
  };

  const badge = BADGE[state];

  return (
    <div className="bg-gray-50/60 border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{number}º Tratamento</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.className}`}>{badge.label}</span>
          {state === "novo" && onCancelDraft && (
            <button type="button" onClick={onCancelDraft} className="text-xs text-gray-500 hover:text-red-500 cursor-pointer">
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: DOSES_PER_TREATMENT }, (_, i) => {
          const doseNumber = i + 1;
          const date = doses[i];
          const isNext = doseNumber === applied + 1;

          return (
            <div key={doseNumber} className="space-y-1">
              <label className="text-xs text-gray-500 font-medium pl-1">{doseNumber}ª dose</label>

              {date && editing?.dose === doseNumber ? (
                <div className="space-y-2">
                  <input
                    type="date"
                    max={today}
                    value={editing.value}
                    onChange={(e) => setEditing({ dose: doseNumber, value: e.target.value })}
                    className={`w-full ${inputClass}`}
                  />
                  <div className="flex gap-2">
                    <button type="button" disabled={saving} onClick={() => submitDose(doseNumber, editing.value)} className={`${smallBtn} bg-primary text-white hover:bg-primary-dark`}>
                      {saving ? "Salvando..." : "Salvar"}
                    </button>
                    <button type="button" disabled={saving} onClick={() => { setEditing(null); setError(null); }} className={`${smallBtn} border border-gray-300 text-gray-600 hover:bg-gray-100`}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : date ? (
                <div className="space-y-2">
                  <div className="w-full h-10 px-3 bg-white border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {formatDate(date)}
                  </div>
                  {canEdit && (
                    <div className="flex gap-3 pl-1">
                      <button type="button" onClick={() => { setEditing({ dose: doseNumber, value: date }); setError(null); }} className="text-xs text-primary-dark hover:underline cursor-pointer">
                        Editar
                      </button>
                      {doseNumber === applied && (
                        <button type="button" disabled={saving} onClick={() => removeDose(doseNumber)} className="text-xs text-red-500 hover:underline cursor-pointer">
                          Remover
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : isNext ? (
                <div className="space-y-2">
                  {hint(doseNumber) && <p className="text-xs text-gray-500 pl-1">{hint(doseNumber)}</p>}
                  {canEdit ? (
                    <>
                      <input
                        type="date"
                        max={today}
                        value={pendingDate}
                        onChange={(e) => setPendingDate(e.target.value)}
                        className={`w-full ${inputClass}`}
                      />
                      <button type="button" disabled={saving} onClick={() => submitDose(doseNumber, pendingDate)} className={`${smallBtn} bg-primary text-white hover:bg-primary-dark`}>
                        {saving ? "Salvando..." : "Registrar dose"}
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-10 px-3 bg-white border border-dashed border-gray-300 rounded-md flex items-center text-sm text-amber-600 italic">
                      Aguardando aplicação
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-10 px-3 bg-gray-100 border border-gray-200 rounded-md flex items-center text-sm text-gray-400">
                  Aguardando {doseNumber - 1}ª dose
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-700 bg-red-100 border border-red-200 rounded-md p-2">
          {error}
        </p>
      )}
    </div>
  );
}

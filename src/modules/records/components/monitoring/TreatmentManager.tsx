"use client";

import { useState } from "react";
import { MAX_TREATMENTS, type TreatmentTipo } from "@/modules/records/monitoring/config";
import { doseKey, readTreatments } from "@/modules/records/monitoring/treatment";
import { TreatmentCard } from "./TreatmentCard";

interface TreatmentManagerProps {
  tipo: TreatmentTipo;
  monitoramento: Record<string, unknown> | null;
  canEdit: boolean;
  /** Salva (PATCH/POST) e recarrega. Lança erro se a API recusar. */
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

export function TreatmentManager({ tipo, monitoramento, canEdit, onSave }: TreatmentManagerProps) {
  const max = MAX_TREATMENTS[tipo];
  const treatments = readTreatments(monitoramento, max);
  const latest = treatments[treatments.length - 1];
  const nextNumber = (latest?.number ?? 0) + 1;
  const reachedLimit = nextNumber > max;

  // Tratamento que o usuário começou a abrir mas ainda não tem a 1ª dose salva.
  // Ele só passa a existir no backend quando a 1ª dose é registrada.
  const [draft, setDraft] = useState<number | null>(null);

  const startNew = () => {
    if (
      latest &&
      latest.state !== "completo" &&
      !window.confirm(
        `O ${latest.number}º tratamento não foi concluído e ficará marcado como interrompido. Iniciar um novo tratamento?`
      )
    ) {
      return;
    }
    setDraft(nextNumber);
  };

  const saveDose = async (treatmentNumber: number, doseNumber: number, date: string) => {
    await onSave({ [doseKey(treatmentNumber, doseNumber)]: date });
    if (draft === treatmentNumber) setDraft(null);
  };

  const removeDose = async (treatmentNumber: number, doseNumber: number) => {
    await onSave({ [doseKey(treatmentNumber, doseNumber)]: null });
  };

  return (
    <div className="bg-white border border-primary rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="text-primary font-bold text-sm border-b pb-2 uppercase tracking-wide">Tratamentos e Doses</h3>

      {treatments.length === 0 && draft === null && (
        <div className="text-center py-6 space-y-3">
          <p className="text-gray-400 text-sm">Nenhum tratamento registrado.</p>
          {canEdit && (
            <button type="button" onClick={startNew} className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer">
              + Iniciar primeiro tratamento
            </button>
          )}
        </div>
      )}

      <div className="space-y-6">
        {treatments.map((t) => (
          <TreatmentCard
            key={t.number}
            number={t.number}
            doses={t.doses}
            state={t.state}
            canEdit={canEdit}
            onSaveDose={(dose, date) => saveDose(t.number, dose, date)}
            onRemoveDose={(dose) => removeDose(t.number, dose)}
          />
        ))}

        {draft !== null && (
          <TreatmentCard
            key={`draft-${draft}`}
            number={draft}
            doses={[null, null, null]}
            state="novo"
            canEdit={canEdit}
            onSaveDose={(dose, date) => saveDose(draft, dose, date)}
            onRemoveDose={async () => undefined}
            onCancelDraft={() => setDraft(null)}
          />
        )}
      </div>

      {canEdit && treatments.length > 0 && (
        <div className="flex flex-col items-end gap-1 pt-2">
          <button
            type="button"
            onClick={startNew}
            disabled={reachedLimit || draft !== null}
            className="px-4 py-2 border border-primary text-primary rounded-full text-xs font-semibold hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⊕ Novo tratamento
          </button>
          {reachedLimit && (
            <p className="text-xs text-gray-400">Limite de {max} tratamentos por ficha atingido.</p>
          )}
        </div>
      )}
    </div>
  );
}

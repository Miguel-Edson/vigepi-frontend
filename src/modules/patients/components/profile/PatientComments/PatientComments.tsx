"use client";

import { useState } from "react";
import { RecordAPI } from "@/modules/records/types/record";
import { RecordObservations } from "@/modules/records/components/observations/RecordObservations";

interface PatientCommentsProps {
  records: RecordAPI[];
  onObservationAdded?: () => void; // Para atualizar os dados após enviar
}

/**
 * Observações clínicas na ficha GERAL do paciente: mostra (e permite escrever) as observações
 * da ficha selecionada. São as mesmas da aba "Observações" dentro da ficha.
 */
export function PatientComments({ records, onObservationAdded }: PatientCommentsProps) {
  const [selectedRecordId, setSelectedRecordId] = useState<string>("");

  // Se a ficha escolhida não existe (ainda carregando, ou ficha removida), usa a primeira
  const activeRecordId = records.some((r) => r.id === selectedRecordId) ? selectedRecordId : records[0]?.id ?? "";
  const activeRecord = records.find((r) => r.id === activeRecordId);

  if (records.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8 space-y-2">
        <h2 className="text-lg font-bold text-gray-800">Observações Clínicas</h2>
        <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400 text-center">
          É necessário ter ao menos uma ficha cadastrada para adicionar observações clínicas.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Qual ficha está sendo exibida: com mais de uma, deixa escolher */}
      <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 space-y-1">
        <label className="text-xs text-gray-600 font-medium" htmlFor="ficha-observacoes">
          Observações da ficha (SINAM):
        </label>
        {records.length > 1 ? (
          <select
            id="ficha-observacoes"
            value={activeRecordId}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-gray-300 rounded-md text-sm text-gray-800"
          >
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.agravo} - SINAM: {r.numSinan} ({r.status})
              </option>
            ))}
          </select>
        ) : (
          <p id="ficha-observacoes" className="text-sm font-medium text-gray-800">
            {activeRecord?.agravo} - SINAM: {activeRecord?.numSinan} ({activeRecord?.status})
          </p>
        )}
      </div>

      {/* key: ao trocar de ficha, recarrega a lista dela */}
      <RecordObservations key={activeRecordId} recordId={activeRecordId} onAdded={onObservationAdded} />
    </div>
  );
}

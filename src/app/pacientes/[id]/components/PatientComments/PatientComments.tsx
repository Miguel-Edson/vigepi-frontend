"use client";

import { useState } from "react";
import { RecordAPI } from "@/types/record";
import { recordService } from "@/services/recordService";

interface PatientCommentsProps {
  records: RecordAPI[];
  onObservationAdded?: () => void; // Para atualizar os dados após enviar
}

export function PatientComments({ records, onObservationAdded }: PatientCommentsProps) {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0]?.id || "");
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId || !texto.trim()) {
      alert("Selecione uma ficha e digite o texto da observação.");
      return;
    }

    try {
      setLoading(true);
      await recordService.addObservation(selectedRecordId, texto);
      alert("Observação clínica registrada com sucesso!");
      setTexto("");
      if (onObservationAdded) onObservationAdded();
    } catch (error) {
      console.error("Erro ao registrar observação:", error);
      alert("Não foi possível salvar a observação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Observações Clínicas</h2>
          <p className="text-xs text-gray-500">Notas clínicas imutáveis vinculadas às fichas de notificação do paciente.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400 text-center">
          É necessário ter ao menos uma ficha cadastrada para adicionar observações clínicas.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Se houver mais de uma ficha, deixa escolher a qual ficha a observação se refere */}
          {records.length > 1 && (
            <div className="space-y-1">
              <label className="text-xs text-gray-600 font-medium">Vincular à Ficha (SINAM):</label>
              <select 
                value={selectedRecordId}
                onChange={(e) => setSelectedRecordId(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-gray-300 rounded-md text-sm text-gray-800"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.agravo} - SINAM: {r.numSinan} ({r.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <textarea 
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Digite a observação clínica aqui (ex: Paciente relatou melhora após tratamento...)" 
              className="w-full h-28 p-3 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-1 focus:ring-primary focus:border-primary resize-none outline-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Adicionar Observação"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
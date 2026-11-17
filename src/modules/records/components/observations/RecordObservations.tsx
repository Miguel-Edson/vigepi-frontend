"use client";

import { useState, type FormEvent } from "react";
import { useRecordObservations } from "@/modules/records/hooks/useRecordObservations";
import { OBSERVATION_MAX_LENGTH } from "@/modules/records/observations/limits";
import { formatDateTime } from "@/utils/formatters";

interface RecordObservationsProps {
  recordId: string;
  /** Chamado depois de salvar uma observação (opcional). */
  onAdded?: () => void;
}

/**
 * Observações clínicas de uma ficha: formulário para escrever + histórico.
 * É o mesmo componente na aba da ficha e na ficha geral do paciente, então uma observação
 * escrita em um lugar aparece no outro (os dois leem /record/:id/observations).
 */
export function RecordObservations({ recordId, onAdded }: RecordObservationsProps) {
  const { observations, isLoading, error, add } = useRecordObservations(recordId);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      setSubmitError("Digite a observação antes de salvar.");
      return;
    }
    if (value.length > OBSERVATION_MAX_LENGTH) {
      setSubmitError(`A observação não pode ter mais de ${OBSERVATION_MAX_LENGTH} caracteres.`);
      return;
    }

    setSaving(true);
    setSubmitError(null);
    try {
      await add(value);
      setText("");
      onAdded?.();
    } catch (err) {
      // o texto digitado é mantido para tentar de novo
      setSubmitError(err instanceof Error && err.message ? err.message : "Não foi possível salvar a observação.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Observações Clínicas</h2>
        <p className="text-xs text-gray-500">
          Notas clínicas vinculadas a esta ficha. Depois de salvas, não podem ser editadas nem apagadas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={OBSERVATION_MAX_LENGTH}
          placeholder="Digite a observação clínica aqui (ex.: Paciente relatou melhora após o tratamento...)"
          className="w-full h-28 p-3 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-1 focus:ring-primary focus:border-primary resize-none outline-none"
        />

        {submitError && (
          <p role="alert" className="text-sm font-medium text-red-700 bg-red-100 border border-red-200 rounded-md p-2 whitespace-pre-line">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className={`text-xs ${text.length >= OBSERVATION_MAX_LENGTH * 0.95 ? "text-red-600 font-semibold" : "text-gray-400"}`}>
            {text.length}/{OBSERVATION_MAX_LENGTH}
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Registrando..." : "Adicionar Observação"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Histórico</h3>

        {isLoading ? (
          <p className="text-sm text-gray-400">Carregando observações...</p>
        ) : error ? (
          <p role="alert" className="text-sm text-red-500">{error}</p>
        ) : observations.length === 0 ? (
          <p className="text-sm text-gray-400 p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center">
            Nenhuma observação registrada nesta ficha.
          </p>
        ) : (
          <ul className="space-y-3">
            {observations.map((observation) => (
              <li key={observation.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/60">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{observation.text}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {observation.authorName ? `${observation.authorName} · ` : ""}
                  {formatDateTime(observation.createdAt) || "data não informada"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

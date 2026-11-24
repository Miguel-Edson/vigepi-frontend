import { useCallback, useEffect, useState } from "react";
import { recordService } from "@/modules/records/services/recordService";
import type { ObservationAPI } from "@/modules/records/types/record";

/** Observações clínicas de UMA ficha: carrega a lista e adiciona novas (POST /record/:id/observations). */
export function useRecordObservations(recordId: string) {
  const [observations, setObservations] = useState<ObservationAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setObservations(await recordService.listObservations(recordId));
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar observações:", err);
      setError(err instanceof Error && err.message ? err.message : "Não foi possível carregar as observações.");
    } finally {
      setIsLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    setIsLoading(true);
    reload();
  }, [reload]);

  /** Lança erro se a API recusar: quem chama mostra a mensagem e mantém o texto digitado. */
  const add = useCallback(
    async (text: string) => {
      await recordService.addObservation(recordId, { texto: text });
      await reload();
    },
    [recordId, reload]
  );

  return { observations, isLoading, error, add };
}

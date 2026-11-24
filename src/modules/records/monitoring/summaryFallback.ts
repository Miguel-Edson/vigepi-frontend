import type { MonitoramentoResumo } from "@/modules/records/types/monitoring";
import type { TreatmentTipo } from "./config";

export interface SummaryTarget {
  id: string;
  tipo: TreatmentTipo;
}

/**
 * PLANO B quando GET /monitoramentos/resumo não existe: busca o monitoramento de cada ficha, com no
 * máximo `concurrency` chamadas ao mesmo tempo. É bem mais lento que o resumo (uma chamada por ficha),
 * então serve só até o endpoint ser criado. Falha em uma ficha não derruba as outras.
 */
export async function fetchSummariesFallback(
  targets: SummaryTarget[],
  fetchRow: (tipo: TreatmentTipo, recordId: string) => Promise<Record<string, unknown> | null>,
  options: {
    concurrency?: number;
    /** Chamado a cada ~10 fichas concluídas, com o que já foi carregado (a tela vai se preenchendo). */
    onProgress?: (partial: Record<string, MonitoramentoResumo>) => void;
    isCancelled?: () => boolean;
  } = {}
): Promise<Record<string, MonitoramentoResumo>> {
  const { concurrency = 6, onProgress, isCancelled } = options;
  const result: Record<string, MonitoramentoResumo> = {};
  let next = 0;
  let done = 0;

  const worker = async () => {
    while (next < targets.length && !isCancelled?.()) {
      const target = targets[next++];
      try {
        const row = await fetchRow(target.tipo, target.id);
        if (row) result[target.id] = { ...row, recordId: target.id, tipo: target.tipo } as unknown as MonitoramentoResumo;
      } catch (error) {
        console.warn(`[SIMOS] Não foi possível ler o acompanhamento da ficha ${target.id}.`, error);
      }
      done++;
      if (onProgress && done % 10 === 0) onProgress({ ...result });
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, targets.length) }, worker));
  return result;
}

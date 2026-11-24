import { useEffect, useMemo, useState } from "react";
import { monitoramentoService, pickCurrent } from "@/modules/records/services/monitoramentoService";
import { agravoToTipo, hasTreatments } from "@/modules/records/monitoring/config";
import { fetchSummariesFallback, type SummaryTarget } from "@/modules/records/monitoring/summaryFallback";
import { StatusFicha, type RecordAPI } from "@/modules/records/types/record";
import type { MonitoramentoResumo } from "@/modules/records/types/monitoring";

/**
 * Doses de todas as fichas, indexadas pelo id da ficha (alimenta o status e o alerta da listagem).
 * 1º tenta GET /monitoramentos/resumo (uma chamada). Se a rota não existir, busca ficha por ficha.
 */
export function useTreatmentSummaries(records: RecordAPI[]) {
  const [byRecord, setByRecord] = useState<Record<string, MonitoramentoResumo>>({});

  // Só gestante e adquirida têm doses; óbito/abandono não precisam delas (o status manual prevalece)
  const targets = useMemo<SummaryTarget[]>(
    () =>
      records.flatMap((record) => {
        const tipo = agravoToTipo(record.agravo);
        const skip = record.status === StatusFicha.OBITO || record.status === StatusFicha.DESCONTINUADO;
        return tipo && hasTreatments(tipo) && !skip ? [{ id: record.id, tipo }] : [];
      }),
    [records]
  );
  const targetsKey = targets.map((t) => `${t.tipo}:${t.id}`).join(",");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const resumo = await monitoramentoService.getResumo();
      if (cancelled) return;

      if (resumo) {
        setByRecord(Object.fromEntries(resumo.map((row) => [row.recordId, row])));
        return;
      }

      // Plano B: endpoint indisponível
      if (targets.length === 0) return;
      console.info(`[SIMOS] Buscando o acompanhamento de ${targets.length} ficha(s) uma a uma (plano B).`);
      const result = await fetchSummariesFallback(
        targets,
        async (tipo, id) => pickCurrent(await monitoramentoService.listByRecord(tipo, id)) as unknown as Record<string, unknown> | null,
        { isCancelled: () => cancelled, onProgress: (partial) => !cancelled && setByRecord(partial) }
      );
      if (!cancelled) setByRecord(result);
    })();

    return () => {
      cancelled = true;
    };
    // `targets` muda junto com `targetsKey`; usar só a chave evita refazer tudo a cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetsKey]);

  return byRecord;
}

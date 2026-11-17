import { useEffect, useState } from "react";
import { monitoramentoService } from "@/modules/records/services/monitoramentoService";
import type { MonitoramentoResumo } from "@/modules/records/types/monitoring";

/** Doses de todas as fichas, indexadas pelo id da ficha (alimenta o status da listagem). */
export function useTreatmentSummaries() {
  const [byRecord, setByRecord] = useState<Record<string, MonitoramentoResumo>>({});

  useEffect(() => {
    let cancelled = false;
    monitoramentoService.getResumo().then((rows) => {
      if (!cancelled) setByRecord(Object.fromEntries(rows.map((row) => [row.recordId, row])));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return byRecord;
}

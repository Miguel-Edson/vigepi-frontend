import { useCallback, useEffect, useState } from "react";
import { monitoramentoService, pickCurrent } from "@/modules/records/services/monitoramentoService";
import type { MonitoramentoTipo } from "@/modules/records/monitoring/config";

type Row = Record<string, unknown>;

// Na criação (POST) não faz sentido mandar campos nulos
const dropNullish = (data: Row): Row =>
  Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== undefined));

/**
 * Carrega o monitoramento de uma ficha e salva alterações:
 * se ainda não existe, cria (POST); se já existe, atualiza (PATCH).
 */
export function useMonitoramento(tipo: MonitoramentoTipo, recordId: string) {
  const [monitoramento, setMonitoramento] = useState<Row | null>(null);
  const [isLoading, setIsLoading] = useState(true); // só na primeira carga (evita piscar a tela ao salvar)
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const rows = await monitoramentoService.listByRecord(tipo, recordId);
      setMonitoramento(pickCurrent(rows) as unknown as Row | null);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar monitoramento:", err);
      setError(err instanceof Error && err.message ? err.message : "Não foi possível carregar o acompanhamento.");
    } finally {
      setIsLoading(false);
    }
  }, [tipo, recordId]);

  useEffect(() => {
    reload();
  }, [reload]);

  /** Lança erro se a API recusar: quem chama mostra a mensagem. */
  const save = useCallback(
    async (data: Row) => {
      const id = monitoramento?.id as string | undefined;
      if (id) await monitoramentoService.update(id, data);
      else await monitoramentoService.create(tipo, recordId, dropNullish(data));
      await reload();
    },
    [monitoramento, tipo, recordId, reload]
  );

  return { monitoramento, isLoading, error, save, reload };
}

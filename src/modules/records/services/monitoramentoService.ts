import { apiFetch } from "@/lib/api";
import type { MonitoramentoAPI, MonitoramentoResumo } from "@/modules/records/types/monitoring";
import type { MonitoramentoTipo } from "@/modules/records/monitoring/config";

// Rotas do MonitoramentoController (backend)
export const monitoramentoService = {
  /** GET /records/:tipo/:fichaId/monitoramentos */
  listByRecord(tipo: MonitoramentoTipo, recordId: string): Promise<MonitoramentoAPI[]> {
    return apiFetch<MonitoramentoAPI[]>(`/records/${tipo}/${recordId}/monitoramentos`, { method: "GET" });
  },

  /** POST /records/:tipo/:fichaId/monitoramentos (ADM) */
  create(tipo: MonitoramentoTipo, recordId: string, data: Record<string, unknown>): Promise<MonitoramentoAPI> {
    return apiFetch<MonitoramentoAPI>(`/records/${tipo}/${recordId}/monitoramentos`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** PATCH /monitoramentos/:id (ADM). Enviar null apaga o campo. */
  update(id: string, data: Record<string, unknown>): Promise<MonitoramentoAPI> {
    return apiFetch<MonitoramentoAPI>(`/monitoramentos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /** DELETE /monitoramentos/:id (ADM, soft delete) */
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/monitoramentos/${id}`, { method: "DELETE" });
  },

  /**
   * GET /monitoramentos/resumo — uma linha por ficha com as colunas de dose
   * (ver BACKEND_CHECKLIST.md, seção 5). Se a rota ainda não existe, devolve [] e a
   * listagem continua funcionando com o status manual da ficha.
   */
  async getResumo(): Promise<MonitoramentoResumo[]> {
    try {
      return await apiFetch<MonitoramentoResumo[]>("/monitoramentos/resumo", { method: "GET" });
    } catch (error) {
      console.warn(
        "[SIMOS] /monitoramentos/resumo indisponível; a listagem usa o status da ficha. " +
          "Erro 500 aqui costuma significar que a rota ainda não existe no backend (o Nest a trata como " +
          "GET /monitoramentos/:id e tenta ler 'resumo' como UUID) ou foi declarada DEPOIS do @Get(':id').",
        error
      );
      return [];
    }
  },
};

/** Uma ficha deve ter um único monitoramento; se vierem vários, usa o mais recente. */
export function pickCurrent(rows: MonitoramentoAPI[]): MonitoramentoAPI | null {
  if (!rows.length) return null;
  return [...rows].sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")))[0];
}

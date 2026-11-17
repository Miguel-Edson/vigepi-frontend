import type { ObservationAPI } from "@/modules/records/types/record";

// Converte o que a API devolver (objeto ou lista) para ObservationAPI. É tolerante com o
// nome dos campos para não quebrar se o backend usar outro nome (text/texto/content...).
// Quando o formato real estiver confirmado, dá para enxugar isto.

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v : undefined);

export function normalizeObservation(raw: unknown, index = 0): ObservationAPI | null {
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const text = str(o.text) ?? str(o.texto) ?? str(o.content) ?? str(o.observacao) ?? str(o.observation);
  if (!text) return null;

  const author = (o.createdBy ?? o.criadoPor ?? o.author ?? o.autor ?? o.usuario ?? o.user) as unknown;
  const authorName =
    typeof author === "string"
      ? str(author)
      : author !== null && typeof author === "object"
        ? str((author as Record<string, unknown>).nome) ??
          str((author as Record<string, unknown>).name) ??
          str((author as Record<string, unknown>).username) ??
          str((author as Record<string, unknown>).email)
        : undefined;

  return {
    id: str(o.id) ?? `obs-${index}`,
    text,
    createdAt: str(o.createdAt) ?? str(o.criadoEm) ?? str(o.created_at) ?? str(o.data) ?? "",
    authorName,
  };
}

/** Aceita uma lista direta ou embrulhada em { observations | data | items }. Mais recentes primeiro. */
export function extractObservations(payload: unknown): ObservationAPI[] {
  const wrapped =
    payload !== null && typeof payload === "object" && !Array.isArray(payload)
      ? ((payload as Record<string, unknown>).observations ??
        (payload as Record<string, unknown>).data ??
        (payload as Record<string, unknown>).items)
      : payload;

  if (!Array.isArray(wrapped)) return [];

  return wrapped
    .map((item, index) => normalizeObservation(item, index))
    .filter((item): item is ObservationAPI => item !== null)
    .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
}

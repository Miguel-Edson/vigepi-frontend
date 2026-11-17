import type { ObservationAPI } from "@/modules/records/types/record";

// Converte o que a API devolver (objeto ou lista) para ObservationAPI. É tolerante com o
// nome dos campos para não quebrar se o backend usar outro nome (text/texto/content...).
// Quando o formato real estiver confirmado, dá para enxugar isto.

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v : undefined);

export function normalizeObservation(raw: unknown, index = 0): ObservationAPI | null {
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const text =
    str(o.texto) ?? str(o.text) ?? str(o.content) ?? str(o.conteudo) ?? str(o.observacao) ??
    str(o.observation) ?? str(o.comentario) ?? str(o.descricao) ?? str(o.mensagem);
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

/** A lista "crua": aceita array direto ou embrulhado em { observations | observacoes | data | items | results }. */
export function toRawList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload !== null && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    for (const key of ["observations", "observacoes", "observacoesClinicas", "data", "items", "results"]) {
      if (Array.isArray(o[key])) return o[key] as unknown[];
    }
    const arrays = Object.values(o).filter(Array.isArray);
    if (arrays.length === 1) return arrays[0] as unknown[]; // único campo que é lista
  }
  return [];
}

/** Dentro de uma ficha, acha a lista de observações pelo nome do campo (observations, observacoes, comentarios...). */
export function findObservationList(record: unknown): unknown[] | null {
  if (record === null || typeof record !== "object") return null;
  for (const [key, value] of Object.entries(record as Record<string, unknown>)) {
    if (/observ|coment|anota|^notas?$/i.test(key) && Array.isArray(value)) return value;
  }
  return null;
}

/** Mais recentes primeiro. */
export function extractObservations(payload: unknown): ObservationAPI[] {
  return toRawList(payload)
    .map((item, index) => normalizeObservation(item, index))
    .filter((item): item is ObservationAPI => item !== null)
    .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
}

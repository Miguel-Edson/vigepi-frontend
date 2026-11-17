/** Lê o primeiro carimbo preenchido entre vários nomes possíveis do campo (camelCase ou snake_case). */
export function pickTimestamp(source: unknown, keys: string[]): string | null {
  if (source === null || typeof source !== "object") return null;
  for (const key of keys) {
    const value = (source as Record<string, unknown>)[key];
    if (typeof value === "string" && value) return value;
  }
  return null;
}

/** O mais recente entre vários carimbos de tempo (ISO). Ignora vazios e datas inválidas. */
export function latestTimestamp(values: (string | null | undefined)[]): string | null {
  let best: string | null = null;
  let bestMs = -Infinity;

  for (const value of values) {
    if (!value) continue;
    const ms = Date.parse(value);
    if (Number.isNaN(ms)) continue;
    if (ms > bestMs) {
      bestMs = ms;
      best = value;
    }
  }

  return best;
}

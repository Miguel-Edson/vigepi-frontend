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

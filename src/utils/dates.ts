// Datas no formato "AAAA-MM-DD" (o mesmo das colunas `date` do backend).
// Tudo é calculado em UTC a partir do texto, então fuso horário e horário de verão
// nunca deslocam o dia.

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

export function isValidISODate(value: string): boolean {
  const m = ISO_DATE.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

function toUTC(iso: string): number {
  const m = ISO_DATE.exec(iso);
  if (!m) throw new Error(`Data inválida: ${iso}`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Soma (ou subtrai) dias a uma data "AAAA-MM-DD". */
export function addDays(iso: string, days: number): string {
  const dt = new Date(toUTC(iso) + days * DAY_MS);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** Quantidade de dias de `from` até `to` (negativo se `to` é anterior). */
export function diffInDays(from: string, to: string): number {
  return Math.round((toUTC(to) - toUTC(from)) / DAY_MS);
}

/** Data de hoje, no calendário LOCAL do usuário, como "AAAA-MM-DD". */
export function todayISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

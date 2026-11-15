// Limpeza de payload antes de enviar para a API.
// Campos de formulário vazios chegam como "" (ou NaN, nos numéricos), e a API
// costuma recusar isso em campos de data/enum.

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isEmpty = (v: unknown) =>
  v === "" || v === undefined || (typeof v === "number" && Number.isNaN(v));

/** CRIAÇÃO: remove os campos vazios (a API trata como "não informado"). */
export function omitEmpty<T>(value: T): T {
  if (Array.isArray(value)) return value.map(omitEmpty) as unknown as T;
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      if (isEmpty(v)) continue;
      out[key] = omitEmpty(v);
    }
    return out as T;
  }
  return value;
}

/** ATUALIZAÇÃO: troca campos vazios por null, para o usuário conseguir APAGAR um valor. */
export function emptyToNull<T>(value: T): T {
  if (Array.isArray(value)) return value.map(emptyToNull) as unknown as T;
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      if (v === undefined) continue;
      out[key] = isEmpty(v) ? null : emptyToNull(v);
    }
    return out as T;
  }
  return value;
}

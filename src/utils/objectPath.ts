// Leitura/escrita em objetos por caminho ("detalhesCongenita.idadeMae")

export function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (acc, key) =>
      acc !== null && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
    obj
  );
}

export function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let cursor = obj;
  keys.slice(0, -1).forEach((key) => {
    if (cursor[key] === null || typeof cursor[key] !== "object") cursor[key] = {};
    cursor = cursor[key] as Record<string, unknown>;
  });
  cursor[keys[keys.length - 1]] = value;
}

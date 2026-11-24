import type { FieldValues } from "react-hook-form";
import { toDateInput } from "@/utils/formatters";
import { getByPath, setByPath } from "@/utils/objectPath";
import type { SectionDef } from "./RecordSections";

// A API devolve null nos campos vazios, mas o Zod (.optional()) não aceita null.
function stripNulls(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripNulls);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [k, stripNulls(v)])
    );
  }
  return value;
}

/**
 * Converte a ficha vinda da API em valores prontos para o formulário:
 *  - null vira "vazio";
 *  - datas viram AAAA-MM-DD (o <input type="date"> não aceita data com hora);
 *  - checkboxes sem valor viram false.
 */
export function recordToFormValues<T extends FieldValues>(
  record: unknown,
  sections: SectionDef<FieldValues>[]
): T {
  const values = stripNulls(record) as Record<string, unknown>;

  for (const section of sections) {
    for (const field of section.fields) {
      const current = getByPath(values, field.name);
      if (field.type === "date" && typeof current === "string") {
        setByPath(values, field.name, toDateInput(current));
      }
      if (field.type === "checkbox" && current === undefined) {
        setByPath(values, field.name, false);
      }
    }
  }

  return values as T;
}

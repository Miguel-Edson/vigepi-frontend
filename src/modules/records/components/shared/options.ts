import type { FieldOption } from "./RecordSections";

export const enumToOptions = (e: Record<string, string>): FieldOption[] =>
  Object.values(e).map((value) => ({ label: value, value }));

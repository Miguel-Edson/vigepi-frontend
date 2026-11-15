import { Sexo } from "./types/patient";

export const GESTATIONAL_ONLY_FEMALE_MESSAGE =
  "A ficha gestacional só pode ser criada para pacientes do sexo feminino.";

/** Ficha de Sífilis Gestacional: apenas pacientes do sexo feminino. */
export function canHaveGestationalRecord(patient?: { sexo?: Sexo } | null): boolean {
  return patient?.sexo === Sexo.FEMININO;
}

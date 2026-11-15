import { Cid10, StatusFicha, type RecordGeneralFields } from "@/modules/records/schemas/recordSchema";
import type { SectionDef } from "./RecordSections";
import { enumToOptions } from "./options";

/** Dados Gerais: iguais nas fichas Adquirida, Congênita e (futuramente) Gestacional. */
export const generalSection: SectionDef<RecordGeneralFields> = {
  title: "Dados Gerais",
  fields: [
    { name: "numSinan", label: "Nº SINAN *", span: 3 },
    { name: "tipoNotificacao", label: "Tipo de Notificação *", span: 3 },
    { name: "dataNotificacao", label: "Data da Notificação *", type: "date", span: 3 },
    { name: "dataDiagnostico", label: "Data do Diagnóstico *", type: "date", span: 3 },

    { name: "codeCid", label: "CID 10 *", type: "select", options: enumToOptions(Cid10), span: 3 },
    { name: "status", label: "Status *", type: "select", options: enumToOptions(StatusFicha), span: 3 },
    { name: "UF", label: "UF *", span: 2 },
    { name: "municipio", label: "Município *", span: 4 },

    { name: "codeIbge", label: "Código IBGE do Município *", span: 6 },
    { name: "codeUnidadeSaude", label: "Código da Unidade de Saúde *", span: 6 },
  ],
};

import type { FieldValues } from "react-hook-form";
import type { SectionDef } from "@/modules/records/components/shared/RecordSections";
import type { MonitoramentoTipo } from "@/modules/records/monitoring/config";

// Campos do acompanhamento por tipo de ficha. As DOSES ficam de fora de propósito:
// elas são tratadas pela linha do tempo de tratamentos (TreatmentManager).

const gestante: SectionDef<FieldValues>[] = [
  {
    title: "Seguimento de Sífilis em Gestantes",
    fields: [
      { name: "dataDiagnostico", label: "Data do diagnóstico", type: "date", span: 3 },
      { name: "semanaGestacional", label: "Semana gestacional", span: 3 },
      { name: "data1Prenatal", label: "Data do 1º pré-natal", type: "date", span: 3 },
      { name: "dpp", label: "Data prevista do parto (DPP)", type: "date", span: 3 },
      { name: "testeRapido", label: "Teste rápido", span: 4 },
      { name: "codigoFonteNotificadora", label: "Código da fonte notificadora", span: 3 },
      { name: "fonteNotificadora", label: "Fonte notificadora", span: 5 },
    ],
  },
  {
    title: "Parceria Sexual (dose única, por tratamento)",
    fields: [
      { name: "parceriaDose1dataTrat1", label: "Dose do parceiro: 1º tratamento", type: "date", span: 4 },
      { name: "parceriaDose1dataTrat2", label: "Dose do parceiro: 2º tratamento", type: "date", span: 4 },
      { name: "parceriaDose1dataTrat3", label: "Dose do parceiro: 3º tratamento", type: "date", span: 4 },
    ],
  },
];

const adquirida: SectionDef<FieldValues>[] = [
  {
    title: "Seguimento de Sífilis Adquirida",
    fields: [
      { name: "idade", label: "Idade", type: "number", span: 2 },
      { name: "dataTesteRapido", label: "Data do teste rápido", type: "date", span: 3 },
      { name: "resultTesteRapido", label: "Resultado do teste rápido", span: 3 },
      { name: "dataVdrlDiag", label: "Data do VDRL (diagnóstico)", type: "date", span: 2 },
      { name: "resultVdrlDiag", label: "Resultado do VDRL", span: 2 },
    ],
  },
  {
    title: "Parceria Sexual",
    fields: [
      { name: "parcTratado", label: "Parceiro tratado?", span: 3 },
      { name: "dose1dataTrat1Parc", label: "1ª dose do parceiro", type: "date", span: 3 },
      { name: "dose2dataTrat1Parc", label: "2ª dose do parceiro", type: "date", span: 3 },
      { name: "dose3dataTrat1Parc", label: "3ª dose do parceiro", type: "date", span: 3 },
    ],
  },
];

const congenita: SectionDef<FieldValues>[] = [
  {
    title: "Identificação",
    fields: [
      { name: "nomeMae", label: "Nome da mãe", span: 5 },
      { name: "nomeRN", label: "Nome do recém-nascido", span: 5 },
      { name: "datanascRN", label: "Data de nascimento do RN", type: "date", span: 2 },
    ],
  },
  {
    title: "VDRL",
    fields: [
      { name: "vdrlDaMaeData", label: "VDRL da mãe: data", type: "date", span: 3 },
      { name: "vdrlDaMaeTitulacao", label: "VDRL da mãe: titulação", span: 3 },
      { name: "vdrlDaRNData", label: "VDRL do RN: data", type: "date", span: 3 },
      { name: "vdrlDaRNTitulacao", label: "VDRL do RN: titulação", span: 3 },
    ],
  },
  {
    title: "Exames",
    fields: [
      { name: "rxOssosLongos", label: "Raio-X de ossos longos", span: 6 },
      { name: "fundoDeOlho", label: "Fundo de olho", span: 6 },
    ],
  },
  {
    title: "Seguimento da Criança (1, 3, 6, 12 e 16 meses)",
    fields: [
      { name: "mes1SegmentoSifilis", label: "1º mês: seguimento", span: 6 },
      { name: "mes1SegmentoTitulacao", label: "1º mês: titulação", span: 6 },
      { name: "mes3SegmentoSifilis", label: "3º mês: seguimento", span: 6 },
      { name: "mes3SegmentoTitulacao", label: "3º mês: titulação", span: 6 },
      { name: "mes6SegmentoSifilis", label: "6º mês: seguimento", span: 6 },
      { name: "mes6SegmentoTitulacao", label: "6º mês: titulação", span: 6 },
      { name: "mes12SegmentoSifilis", label: "12º mês: seguimento", span: 6 },
      { name: "mes12SegmentoTitulacao", label: "12º mês: titulação", span: 6 },
      { name: "mes16SegmentoSifilis", label: "16º mês: seguimento", span: 6 },
      { name: "mes16SegmentoTitulacao", label: "16º mês: titulação", span: 6 },
    ],
  },
  {
    title: "Encerramento",
    fields: [
      { name: "tpma", label: "TPMA", span: 6 },
      { name: "classificacaoFinal", label: "Classificação final", span: 6 },
    ],
  },
];

export const MONITORING_SECTIONS: Record<MonitoramentoTipo, SectionDef<FieldValues>[]> = {
  gestante,
  adquirida,
  congenita,
};

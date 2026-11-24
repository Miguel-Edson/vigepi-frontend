import {
  OpcoesSimNao,
  CompSexualEnum,
  TesteEnum,
  EsquemaTratamentoEnum,
  ClassClinicaEnum,
  ClassFinalEnum,
  type RecordAdquiridaForm,
} from "@/modules/records/schemas/recordSchema";
import type { SectionDef } from "../shared/RecordSections";
import { generalSection } from "../shared/generalSection";
import { enumToOptions } from "../shared/options";

/** Campos da ficha de Sífilis Adquirida (usados no modal de criação e na página da ficha). */
export const acquiredSections: SectionDef<RecordAdquiridaForm>[] = [
  generalSection,
  {
    title: "Antecedentes Clínicos e Epidemiológicos",
    fields: [
      { name: "detalhesAdquirida.ocupacao", label: "Ocupação", span: 12 },
      { name: "detalhesAdquirida.antSifilis", label: "Antecedente de Sífilis *", type: "select", options: enumToOptions(OpcoesSimNao), span: 6 },
      { name: "detalhesAdquirida.seSimTratRealizado", label: "Se sim, tratamento realizado? *", type: "select", options: enumToOptions(OpcoesSimNao), span: 6 },
      { name: "detalhesAdquirida.compSexual", label: "Comportamento sexual *", type: "select", options: enumToOptions(CompSexualEnum), span: 12 },
    ],
  },
  {
    title: "Dados Laboratoriais",
    fields: [
      { name: "detalhesAdquirida.testeNaoTreponico", label: "Teste não treponêmico *", type: "select", options: enumToOptions(TesteEnum), span: 4 },
      { name: "detalhesAdquirida.titulo", label: "Título", placeholder: "Ex: 1:8", span: 4 },
      { name: "detalhesAdquirida.data", label: "Data do teste", type: "date", span: 4 },
      { name: "detalhesAdquirida.testeTreponico", label: "Teste treponêmico *", type: "select", options: enumToOptions(TesteEnum), span: 12 },
    ],
  },
  {
    title: "Tratamento / Encerramento",
    fields: [
      { name: "detalhesAdquirida.esquemaTratAdquirida", label: "Esquema de tratamento prescrito *", type: "select", options: enumToOptions(EsquemaTratamentoEnum), span: 8 },
      { name: "detalhesAdquirida.dataInicioTrat", label: "Data de início do tratamento", type: "date", span: 4 },
      { name: "detalhesAdquirida.classClinica", label: "Classificação clínica *", type: "select", options: enumToOptions(ClassClinicaEnum), span: 6 },
      { name: "detalhesAdquirida.classFinal", label: "Classificação final *", type: "select", options: enumToOptions(ClassFinalEnum), span: 6 },
      { name: "detalhesAdquirida.classFinalOutro", label: "Classificação final: outro (especificar)", span: 12 },
    ],
  },
];

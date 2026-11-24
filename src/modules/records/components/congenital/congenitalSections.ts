import {
  OpcoesSimNao,
  TesteEnum,
  TesteEnum18mEnum,
  DiagSifilisMatEnum,
  EsquemaTratMaeEnum,
  Options3Enum,
  DiagClinicoEnum,
  SinaisSintomasEnum,
  EsquemaTratCriancaEnum,
  EvolucaoEnum,
  type RecordCongenitaForm,
} from "@/modules/records/schemas/recordSchema";
import { Raca, Escolaridade } from "@/modules/patients/types/patient";
import type { SectionDef } from "../shared/RecordSections";
import { generalSection } from "../shared/generalSection";
import { enumToOptions } from "../shared/options";

const sim = enumToOptions(OpcoesSimNao);
const teste = enumToOptions(TesteEnum);
const opcoes3 = enumToOptions(Options3Enum);

/** Campos da ficha de Sífilis Congênita (usados no modal de criação e na página da ficha). */
export const congenitalSections: SectionDef<RecordCongenitaForm>[] = [
  generalSection,
  {
    title: "Antecedentes Maternos",
    fields: [
      { name: "detalhesCongenita.idadeMae", label: "Idade da mãe *", type: "number", span: 2 },
      { name: "detalhesCongenita.racaCorMae", label: "Raça/Cor da mãe *", type: "select", options: enumToOptions(Raca), span: 3 },
      { name: "detalhesCongenita.escolaridadeMae", label: "Escolaridade da mãe *", type: "select", options: enumToOptions(Escolaridade), span: 4 },
      { name: "detalhesCongenita.ocupacaoMae", label: "Ocupação da mãe", span: 3 },

      { name: "detalhesCongenita.preNatalGestacao", label: "Fez pré-natal? *", type: "select", options: sim, span: 3 },
      { name: "detalhesCongenita.ufPreNatal", label: "UF do pré-natal", span: 2 },
      { name: "detalhesCongenita.municipioPreNatal", label: "Município do pré-natal", span: 4 },
      { name: "detalhesCongenita.codigoIbgePreNatal", label: "Código IBGE (pré-natal)", span: 3 },
      { name: "detalhesCongenita.unidadeSaudePreNatal", label: "Unidade de saúde do pré-natal", span: 6 },
      { name: "detalhesCongenita.codigoUnidadePreNatal", label: "Código da unidade (pré-natal)", span: 6 },
    ],
  },
  {
    title: "Laboratório e Tratamento da Mãe",
    fields: [
      { name: "detalhesCongenita.diagSifilisMat", label: "Momento do diagnóstico materno *", type: "select", options: enumToOptions(DiagSifilisMatEnum), span: 6 },
      { name: "detalhesCongenita.testeNaoTreponemicoMae", label: "Teste não treponêmico (mãe) *", type: "select", options: teste, span: 6 },
      { name: "detalhesCongenita.tituloMae", label: "Título", placeholder: "Ex: 1:8", span: 4 },
      { name: "detalhesCongenita.dataTesteNaoTreponemicoMae", label: "Data do teste", type: "date", span: 4 },
      { name: "detalhesCongenita.testeTreponemicoMae", label: "Teste treponêmico (mãe) *", type: "select", options: teste, span: 4 },

      { name: "detalhesCongenita.esquemaTratMae", label: "Esquema de tratamento materno *", type: "select", options: enumToOptions(EsquemaTratMaeEnum), span: 4 },
      { name: "detalhesCongenita.dataInicioTratMae", label: "Data de início do tratamento", type: "date", span: 4 },
      { name: "detalhesCongenita.parceiroTratado", label: "Parceiro tratado? *", type: "select", options: sim, span: 4 },
    ],
  },
  {
    title: "Nascimento da Criança",
    fields: [
      { name: "detalhesCongenita.ufNascimento", label: "UF do nascimento", span: 2 },
      { name: "detalhesCongenita.municipioNascimento", label: "Município do nascimento", span: 4 },
      { name: "detalhesCongenita.codigoIbgeNascimento", label: "Código IBGE (nascimento)", span: 3 },
      { name: "detalhesCongenita.codigoLocalNascimento", label: "Código do local", span: 3 },
      { name: "detalhesCongenita.localNascimento", label: "Local de nascimento (hospital/maternidade)", span: 12 },
    ],
  },
  {
    title: "Laboratório da Criança",
    fields: [
      { name: "detalhesCongenita.testeNaoTreponemicoCrianca", label: "Teste não treponêmico (sangue periférico) *", type: "select", options: teste, span: 4 },
      { name: "detalhesCongenita.tituloCrianca", label: "Título", placeholder: "Ex: 1:8", span: 4 },
      { name: "detalhesCongenita.dataNaoTreponemicoCrianca", label: "Data do teste", type: "date", span: 4 },

      { name: "detalhesCongenita.testeTreponemicoCrianca", label: "Teste treponêmico (a partir de 18 meses) *", type: "select", options: enumToOptions(TesteEnum18mEnum), span: 6 },
      { name: "detalhesCongenita.dataTreponemicoCrianca", label: "Data do teste treponêmico", type: "date", span: 6 },

      { name: "detalhesCongenita.testeNaoTreponemicoLiquor", label: "Teste não treponêmico (líquor) *", type: "select", options: teste, span: 4 },
      { name: "detalhesCongenita.tituloLiquor", label: "Título (líquor)", span: 4 },
      { name: "detalhesCongenita.dataLiquor", label: "Data (líquor)", type: "date", span: 4 },

      { name: "detalhesCongenita.titulacaoAscendente", label: "Titulação ascendente *", type: "select", options: opcoes3, span: 6 },
      { name: "detalhesCongenita.evidenciaTreponema", label: "Evidência de treponema *", type: "select", options: opcoes3, span: 6 },
      { name: "detalhesCongenita.alteracaoLiquorica", label: "Alteração liquórica *", type: "select", options: opcoes3, span: 6 },
      { name: "detalhesCongenita.diagRadiologico", label: "Diagnóstico radiológico *", type: "select", options: opcoes3, span: 6 },
    ],
  },
  {
    title: "Dados Clínicos da Criança",
    fields: [
      { name: "detalhesCongenita.diagClinico", label: "Diagnóstico clínico *", type: "select", options: enumToOptions(DiagClinicoEnum), span: 6 },
      { name: "detalhesCongenita.sinaisSintomas", label: "Sinais e sintomas *", type: "select", options: enumToOptions(SinaisSintomasEnum), span: 6 },

      { name: "detalhesCongenita.ictericia", label: "Icterícia", type: "checkbox", heading: "Sinais e sintomas apresentados (marque se houver)" },
      { name: "detalhesCongenita.anemia", label: "Anemia", type: "checkbox" },
      { name: "detalhesCongenita.esplenomegalia", label: "Esplenomegalia", type: "checkbox" },
      { name: "detalhesCongenita.osteocondrite", label: "Osteocondrite", type: "checkbox" },
      { name: "detalhesCongenita.riniteMucoSanguinolenta", label: "Rinite sanguinolenta", type: "checkbox" },
      { name: "detalhesCongenita.hepatomegalia", label: "Hepatomegalia", type: "checkbox" },
      { name: "detalhesCongenita.lesoesCutaneas", label: "Lesões cutâneas", type: "checkbox" },
      { name: "detalhesCongenita.pseudoparalisia", label: "Pseudoparalisia", type: "checkbox" },

      { name: "detalhesCongenita.outroSinal", label: "Outro sinal ou sintoma (especificar)", span: 12 },
    ],
  },
  {
    title: "Tratamento e Evolução da Criança",
    fields: [
      { name: "detalhesCongenita.esquemaTratCrianca", label: "Esquema de tratamento da criança *", type: "select", options: enumToOptions(EsquemaTratCriancaEnum), span: 6 },
      { name: "detalhesCongenita.evolucaoCaso", label: "Evolução do caso *", type: "select", options: enumToOptions(EvolucaoEnum), span: 6 },
      { name: "detalhesCongenita.dataObito", label: "Data do óbito (se aplicável)", type: "date", span: 6 },
    ],
  },
];

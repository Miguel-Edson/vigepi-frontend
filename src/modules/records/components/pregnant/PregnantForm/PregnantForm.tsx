"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  recordGestacionalSchema, 
  type RecordGestacionalForm, 
  Cid10, 
  StatusFicha,
  ClassClinicaGestanteEnum,
  EsquemaTratamentoGestanteEnum,
  OpcoesSimNao,
  TesteEnum,
  MotivoNaoTratParceiroEnum
} from "@/modules/records/schemas/recordSchema";
import { RecordAPI } from "@/modules/records/types/record";
import { recordService } from "@/modules/records/services/recordService";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { MonitoringTab } from "../Monitoring/MonitoringTab";
import { RecordClosureButtons } from "@/modules/records/components/shared/RecordClosureButtons";
import { recordToFormValues } from "@/modules/records/components/shared/formValues";
import { useRecordClosure } from "@/modules/records/hooks/useRecordClosure";
import { formatGestationalAge } from "@/modules/records/monitoring/gestational";
import { formatDate } from "@/utils/formatters";
import { emptyToNull } from "@/utils/payload";
import { RecordPageShell } from "@/modules/records/components/shared/RecordPageShell";
import { RecordObservations } from "@/modules/records/components/observations/RecordObservations";

interface PregnantFormProps {
  recordId: string;
  patientId: string;
}

type ActiveTab = "gestante" | "acompanhamento" | "observacoes" | "historico";

const TABS = [
  { id: "gestante", label: "Sífilis em Gestante" },
  { id: "acompanhamento", label: "Acompanhamento" },
  { id: "observacoes", label: "Observações" },
  { id: "historico", label: "Histórico de Alterações" },
];

export default function FichaGestante({ recordId, patientId }: PregnantFormProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("gestante");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fichaReal, setFichaReal] = useState<RecordAPI | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<RecordGestacionalForm>({
    resolver: zodResolver(recordGestacionalSchema)
  });

  // `silent`: recarrega sem trocar a tela por "Carregando..." (usado depois de salvar/mudar status)
  const carregarFicha = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const data = await recordService.getById(recordId);
      setFichaReal(data);

      // A API devolve null nos campos vazios e o Zod (.optional()) não aceita null: sem esta
      // limpeza o "Salvar Alterações" falhava sem mostrar erro.
      reset(recordToFormValues<RecordGestacionalForm>({
        tipoNotificacao: data.tipoNotificacao,
        numSinan: data.numSinan,
        agravo: data.agravo,
        codeCid: data.codeCid as Cid10,
        status: data.status as StatusFicha,
        dataNotificacao: data.dataNotificacao,
        dataDiagnostico: data.dataDiagnostico,
        UF: data.UF,
        municipio: data.municipio,
        codeIbge: data.codeIbge,
        codeUnidadeSaude: data.codeUnidadeSaude,
        detalhesGestante: data.detalhesGestante
      }, []));
    } catch (error) {
      console.error("Erro ao carregar ficha:", error);
    } finally {
      setIsLoading(false);
    }
  }, [recordId, reset]);

  useEffect(() => {
    carregarFicha();
  }, [carregarFicha]);

  // Concluir / abandonar / reabrir: grava o status da ficha e recarrega
  const closure = useRecordClosure(fichaReal, () => carregarFicha(true));

  const toOptions = (enumObj: any) => Object.values(enumObj).map(val => ({ label: String(val), value: String(val) }));

  const onSubmitUpdate = async (data: RecordGestacionalForm) => {
    try {
      // Campo vazio vai como null: "" não é data/opção válida para a API (dava o erro "must be a valid
      // ISO 8601 date string") e null é como a API apaga um valor, inclusive a DUM.
      await recordService.update(recordId, emptyToNull(data) as any);
      await carregarFicha(true); // traz a DPP e a idade gestacional recalculadas pelo backend
      setIsEditing(false);
      alert("Ficha atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar ficha:", error);
      alert(error instanceof Error && error.message ? error.message : "Erro ao salvar alterações.");
    }
  };

  const onInvalid = () => alert("Revise os campos destacados em vermelho antes de salvar.");

  if (isLoading) {
    return <div className="min-h-screen flex justify-center pt-20 text-gray-500">Carregando ficha...</div>;
  }

  if (!fichaReal) {
    return <div className="min-h-screen flex justify-center pt-20 text-red-500">Ficha não encontrada.</div>;
  }

  return (
    <RecordPageShell
      patientId={patientId}
      numSinan={fichaReal.numSinan}
      isEditing={isEditing}
      onToggleEdit={() => {
        if (isEditing) carregarFicha(true); // cancelar: descarta o que foi digitado
        setIsEditing(!isEditing);
      }}
      actions={<RecordClosureButtons status={fichaReal.status} closure={closure} />}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as ActiveTab)}
    >
      {/* CONTEÚDO DA ABA: SÍFILIS EM GESTANTE */}
      {activeTab === "gestante" && (
        <form onSubmit={handleSubmit(onSubmitUpdate, onInvalid)} className="space-y-6">          
          {/* Bloco 1: Dados Gerais */}
          <div className="border border-primary rounded-xl p-5 relative bg-white">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
              Dados Gerais
            </h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-12 md:col-span-3 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Data da Notificação *</label>
                {isEditing ? (
                  <InputField type="date" register={register("dataNotificacao")} error={errors.dataNotificacao?.message} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {formatDate(fichaReal.dataNotificacao) || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-3 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">CID 10 *</label>
                {isEditing ? (
                  <SelectField name="codeCid" control={control} options={toOptions(Cid10)} error={errors.codeCid?.message} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {fichaReal.codeCid}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-3 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Status Atual *</label>
                {isEditing ? (
                  <SelectField name="status" control={control} options={toOptions(StatusFicha)} error={errors.status?.message} />
                ) : (
                  <div className="w-full h-10 px-3 bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold rounded-md flex items-center text-sm">
                    {fichaReal.status}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bloco 2: Dados Complementares do Caso */}
          <div className="border border-primary rounded-xl p-5 relative bg-white">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
              Dados Complementares do Caso
            </h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Ocupação</label>
                {isEditing ? (
                  <InputField register={register("detalhesGestante.ocupacao")} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {fichaReal.detalhesGestante?.ocupacao || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-2 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">UF Pré-Natal</label>
                {isEditing ? (
                  <InputField register={register("detalhesGestante.ufPreNatal")} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {fichaReal.detalhesGestante?.ufPreNatal || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-6 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Município do Pré-Natal</label>
                {isEditing ? (
                  <InputField register={register("detalhesGestante.municipioPreNatal")} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {fichaReal.detalhesGestante?.municipioPreNatal || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-5 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Unidade de Saúde (Pré-Natal)</label>
                {isEditing ? (
                  <InputField register={register("detalhesGestante.unidadePreNatal")} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {fichaReal.detalhesGestante?.unidadePreNatal || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Nº SISPRENATAL</label>
                {isEditing ? (
                  <InputField register={register("detalhesGestante.numeroSisprenatal")} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {fichaReal.detalhesGestante?.numeroSisprenatal || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-3 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Classificação Clínica</label>
                {isEditing ? (
                  <SelectField name="detalhesGestante.classificacaoClinica" control={control} options={toOptions(ClassClinicaGestanteEnum)} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 truncate">
                    {fichaReal.detalhesGestante?.classificacaoClinica || "-"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bloco: DUM, DPP e idade gestacional */}
          <div className="border border-primary rounded-xl p-5 relative bg-white">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
              Gestação: DUM e DPP
            </h3>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Data da Última Menstruação (DUM)</label>
                {isEditing ? (
                  <InputField type="date" register={register("detalhesGestante.dataUltimaMenstruacao")} error={errors.detalhesGestante?.dataUltimaMenstruacao?.message} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {formatDate(fichaReal.detalhesGestante?.dataUltimaMenstruacao) || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Data Provável do Parto (DPP)</label>
                <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm font-semibold text-gray-800">
                  {fichaReal.statusGestacional ? formatDate(fichaReal.statusGestacional.dpp) : "-"}
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Idade gestacional hoje</label>
                <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                  {fichaReal.statusGestacional ? formatGestationalAge(fichaReal.statusGestacional) : "-"}
                </div>
              </div>

              <p className="col-span-12 text-xs text-gray-400">
                {fichaReal.statusGestacional
                  ? "A DPP é estimada como DUM + 280 dias e não substitui a avaliação clínica nem a datação por ultrassom."
                  : "Informe uma DUM válida (não futura) para calcular a DPP e a idade gestacional."}
                {isEditing && " Ao salvar, os valores são recalculados."}
              </p>
            </div>
          </div>

          {/* Bloco 3: Dados Laboratoriais e Tratamento */}
          <div className="border border-primary rounded-xl p-5 relative bg-white">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
              Dados Laboratoriais e Tratamento
            </h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Teste Não Treponêmico</label>
                {isEditing ? (
                  <SelectField name="detalhesGestante.testeNaoTreponemicoPreNatal" control={control} options={toOptions(TesteEnum)} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 truncate">
                    {fichaReal.detalhesGestante?.testeNaoTreponemicoPreNatal || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Título</label>
                {isEditing ? (
                  <InputField register={register("detalhesGestante.tituloNaoTreponemico")} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {fichaReal.detalhesGestante?.tituloNaoTreponemico || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Data do Teste</label>
                {isEditing ? (
                  <InputField type="date" register={register("detalhesGestante.dataTesteNaoTreponemico")} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {formatDate(fichaReal.detalhesGestante?.dataTesteNaoTreponemico) || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-6 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Teste Treponêmico</label>
                {isEditing ? (
                  <SelectField name="detalhesGestante.testeTreponemicoPreNatal" control={control} options={toOptions(TesteEnum)} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 truncate">
                    {fichaReal.detalhesGestante?.testeTreponemicoPreNatal || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-6 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Esquema Tratamento Prescrito</label>
                {isEditing ? (
                  <SelectField name="detalhesGestante.esquemaTratPresGestante" control={control} options={toOptions(EsquemaTratamentoGestanteEnum)} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 truncate">
                    {fichaReal.detalhesGestante?.esquemaTratPresGestante || "-"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bloco 4: Parceria Sexual */}
          <div className="border border-primary rounded-xl p-5 relative bg-white">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
              Antecedentes da Parceria Sexual
            </h3>
            
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-12 md:col-span-3 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Parceiro Tratado?</label>
                {isEditing ? (
                  <SelectField name="detalhesGestante.parceiroTratGestante" control={control} options={toOptions(OpcoesSimNao)} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 truncate">
                    {fichaReal.detalhesGestante?.parceiroTratGestante || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-5 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Esquema Tratamento Parceiro</label>
                {isEditing ? (
                  <SelectField name="detalhesGestante.esquemaTratPresParceiro" control={control} options={toOptions(EsquemaTratamentoGestanteEnum)} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 truncate">
                    {fichaReal.detalhesGestante?.esquemaTratPresParceiro || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-4 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Motivo Não Tratamento</label>
                {isEditing ? (
                  <SelectField name="detalhesGestante.motivoNaoTratParceiro" control={control} options={toOptions(MotivoNaoTratParceiroEnum)} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 truncate">
                    {fichaReal.detalhesGestante?.motivoNaoTratParceiro || "-"}
                  </div>
                )}
              </div>

              <div className="col-span-12 space-y-1">
                <label className="text-xs text-gray-500 font-medium pl-1">Outro Motivo (Especificar)</label>
                {isEditing ? (
                  <InputField register={register("detalhesGestante.outroMotivoNaoTratParceiro")} />
                ) : (
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    {fichaReal.detalhesGestante?.outroMotivoNaoTratParceiro || "-"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões Finais de Edição */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
              >
                Salvar Alterações
              </button>
            </div>
          )}
        </form>
      )}

      {/* ABA DE ACOMPANHAMENTO */}
      {activeTab === "acompanhamento" && (
        <MonitoringTab recordId={recordId} tipoAgravo="gestante" record={fichaReal} onRecordChanged={() => carregarFicha(true)} />
      )}

      {/* ABA DE OBSERVAÇÕES CLÍNICAS */}
      {activeTab === "observacoes" && <RecordObservations recordId={recordId} />}

      {/* ABA DE HISTÓRICO */}
      {activeTab === "historico" && (
        <div className="p-8 text-center text-gray-500">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Histórico de Alterações</h3>
          <p className="text-sm">Registro de logs e modificações realizadas nesta ficha.</p>
        </div>
      )}
    </RecordPageShell>
  );
}

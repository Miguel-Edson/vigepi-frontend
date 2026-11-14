"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

interface PregnantFormProps {
  recordId: string;
  patientId: string;
}

export default function FichaGestante({ recordId, patientId }: PregnantFormProps) {
  const [activeTab, setActiveTab] = useState<"gestante" | "acompanhamento" | "historico">("gestante");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fichaReal, setFichaReal] = useState<RecordAPI | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<RecordGestacionalForm>({
    resolver: zodResolver(recordGestacionalSchema)
  });

  useEffect(() => {
    async function carregarFicha() {
      try {
        setIsLoading(true);
        const data = await recordService.getById(recordId);
        setFichaReal(data);
        
        reset({
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
          detalhesGestante: data.detalhesGestante as any
        });
      } catch (error) {
        console.error("Erro ao carregar ficha:", error);
      } finally {
        setIsLoading(false);
      }
    }
    carregarFicha();
  }, [recordId, reset]);

  const toOptions = (enumObj: any) => Object.values(enumObj).map(val => ({ label: String(val), value: String(val) }));

  const onSubmitUpdate = async (data: RecordGestacionalForm) => {
    try {
      const updated = await recordService.update(recordId, data as any);
      setFichaReal(updated);
      setIsEditing(false);
      alert("Ficha atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar ficha:", error);
      alert("Erro ao salvar alterações.");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex justify-center pt-20 text-gray-500">Carregando ficha...</div>;
  }

  if (!fichaReal) {
    return <div className="min-h-screen flex justify-center pt-20 text-red-500">Ficha não encontrada.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Cabeçalho de Navegação */}
      <div>
        <Link href={`/pacientes/${patientId}`} className="text-sm text-gray-400 hover:text-primary transition-colors">
          ← Voltar para o Prontuário do Paciente
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <h1 className="text-xl font-bold text-gray-800">
            Ficha Epidemiológica <span className="text-primary font-normal">| N° SINAN: {fichaReal.numSinan}</span>
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <button 
              type="button" 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {isEditing ? "Cancelar Edição" : "Editar Informações"}
            </button>
            <button 
              type="button"
              onClick={() => alert("Ficha marcada como concluída")}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 cursor-pointer"
            >
              Marcar como concluída
            </button>
            <button 
              type="button"
              onClick={() => alert("Ficha marcada como abandonada")}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 cursor-pointer"
            >
              Marcar como abandonada
            </button>
          </div>
        </div>

        <div className="flex items-center gap-8 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab("gestante")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === "gestante" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Sífilis em Gestante
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("acompanhamento")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === "acompanhamento" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Acompanhamento
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("historico")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === "historico" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Histórico de Alterações
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA: SÍFILIS EM GESTANTE */}
      {activeTab === "gestante" && (
        <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-6">          
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
                    {fichaReal.dataNotificacao}
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
                    {fichaReal.detalhesGestante?.dataTesteNaoTreponemico || "-"}
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
        <MonitoringTab recordId={recordId} tipoAgravo="gestante" />
      )}

      {/* ABA DE HISTÓRICO */}
      {activeTab === "historico" && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Histórico de Alterações</h3>
          <p className="text-sm">Registro de logs e modificações realizadas nesta ficha.</p>
        </div>
      )}
    </div>
  );
}
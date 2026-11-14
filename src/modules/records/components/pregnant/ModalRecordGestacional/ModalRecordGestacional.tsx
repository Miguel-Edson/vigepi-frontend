"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { 
  recordGestacionalSchema, type RecordGestacionalForm, 
  ClassClinicaGestanteEnum, EsquemaTratamentoGestanteEnum, 
  MotivoNaoTratParceiroEnum, OpcoesSimNao, TesteEnum, Cid10, StatusFicha 
} from "@/modules/records/schemas/recordSchema";

interface ModalRecordGestacionalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSaveAction: (data: RecordGestacionalForm & { patientId: string }) => void;
}

export function ModalRecordGestacional({ isOpen, onClose, patientId, onSaveAction }: ModalRecordGestacionalProps) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<RecordGestacionalForm>({
    resolver: zodResolver(recordGestacionalSchema)
  });

  useEffect(() => {
    if (!isOpen) {
      reset({ agravo: "Sífilis Gestacional" });
    }
  }, [isOpen, reset]);

  const toOptions = (enumObj: any) => Object.values(enumObj).map(val => ({ label: String(val), value: String(val) }));

  const onSubmit = (data: RecordGestacionalForm) => {
    const payload = { ...data, patientId };
    onSaveAction(payload);
    reset();
    onClose();
  };

  const handleAutoFill = () => {
    reset({
      tipoNotificacao: "2", numSinan: "7654321", agravo: "Sífilis Gestacional", 
      codeCid: Cid10.CID_O981, // Usa o enum exato: "098.1"
      status: StatusFicha.AGUARDANDO_EXAME, // Usa o enum exato
      dataNotificacao: "2026-10-14", dataDiagnostico: "2026-10-12",
      UF: "CE", municipio: "Sobral", codeIbge: "2312908", codeUnidadeSaude: "202020", // Adicionados campos obrigatórios
      detalhesGestante: {
        ocupacao: "Professora", ufPreNatal: "CE", municipioPreNatal: "Sobral",
        unidadePreNatal: "CSF Centro", classificacaoClinica: ClassClinicaGestanteEnum.PRIMARIA,
        numeroSisprenatal: "12345678", testeNaoTreponemicoPreNatal: TesteEnum.REAGENTE,
        tituloNaoTreponemico: "1:16", dataTesteNaoTreponemico: "2026-10-10",
        testeTreponemicoPreNatal: TesteEnum.REAGENTE, esquemaTratPresGestante: EsquemaTratamentoGestanteEnum.PENICILINA_2_4,
        parceiroTratGestante: OpcoesSimNao.NAO, motivoNaoTratParceiro: MotivoNaoTratParceiroEnum.RECUSOU
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit(onSubmit as any, (err) => console.error(err))} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Nova Ficha de Investigação</h2>
            <p className="text-sm text-teal-600 font-medium">Sífilis Gestacional</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none cursor-pointer">&times;</button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-8 bg-gray-50">
          
          {/* BLOCO 1: DADOS GERAIS */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-gray-700 font-bold mb-4 border-b pb-2">1. Dados Gerais da Notificação</h3>
            
            <div className="grid grid-cols-12 gap-4">
              <InputField label="Nº SINAN *" register={register("numSinan")} error={errors.numSinan?.message} className="col-span-12 md:col-span-3" />
              <InputField type="date" label="Data de Notificação *" register={register("dataNotificacao")} error={errors.dataNotificacao?.message} className="col-span-12 md:col-span-3" />
              <InputField type="date" label="Data de Diagnóstico *" register={register("dataDiagnostico")} error={errors.dataDiagnostico?.message} className="col-span-12 md:col-span-3" />
              <SelectField label="CID 10 *" name="codeCid" control={control} options={toOptions(Cid10)} error={errors.codeCid?.message} className="col-span-12 md:col-span-3" />
              
              <InputField label="UF *" register={register("UF")} error={errors.UF?.message} className="col-span-12 md:col-span-2" />
              <InputField label="Município *" register={register("municipio")} error={errors.municipio?.message} className="col-span-12 md:col-span-4" />
              <InputField label="Tipo Notificação *" register={register("tipoNotificacao")} error={errors.tipoNotificacao?.message} className="col-span-12 md:col-span-3" />
              <SelectField label="Status *" name="status" control={control} options={toOptions(StatusFicha)} error={errors.status?.message} className="col-span-12 md:col-span-3" />
              
              <InputField label="Cód. IBGE Município *" register={register("codeIbge")} error={errors.codeIbge?.message} className="col-span-12 md:col-span-6" />
              <InputField label="Cód. Unidade de Saúde *" register={register("codeUnidadeSaude")} error={errors.codeUnidadeSaude?.message} className="col-span-12 md:col-span-6" />
            </div>
          </div>

          {/* BLOCO 2: DADOS DO CASO (PRÉ-NATAL E CLÍNICA) */}
          <div className="bg-white border border-teal-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-teal-700 font-bold mb-4 border-b border-teal-100 pb-2">2. Dados Complementares do Caso</h3>
            <div className="grid grid-cols-12 gap-4">
              <InputField label="Ocupação" register={register("detalhesGestante.ocupacao")} className="col-span-12 md:col-span-4" />
              <InputField label="UF do Pré-Natal" register={register("detalhesGestante.ufPreNatal")} className="col-span-12 md:col-span-2" />
              <InputField label="Município do Pré-Natal" register={register("detalhesGestante.municipioPreNatal")} className="col-span-12 md:col-span-6" />
              
              <InputField label="Unidade de Saúde (Pré-Natal)" register={register("detalhesGestante.unidadePreNatal")} className="col-span-12 md:col-span-6" />
              <InputField label="Nº SISPRENATAL" register={register("detalhesGestante.numeroSisprenatal")} className="col-span-12 md:col-span-3" />
              <SelectField label="Classificação Clínica" name="detalhesGestante.classificacaoClinica" control={control} options={toOptions(ClassClinicaGestanteEnum)} className="col-span-12 md:col-span-3" />
            </div>
          </div>

          {/* BLOCO 3: LABORATÓRIO E TRATAMENTO */}
          <div className="bg-white border border-teal-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-teal-700 font-bold mb-4 border-b border-teal-100 pb-2">3. Dados Laboratoriais e Tratamento (Gestante)</h3>
            <div className="grid grid-cols-12 gap-4">
              <SelectField label="Teste Não Treponêmico" name="detalhesGestante.testeNaoTreponemicoPreNatal" control={control} options={toOptions(TesteEnum)} className="col-span-12 md:col-span-4" />
              <InputField label="Título" register={register("detalhesGestante.tituloNaoTreponemico")} placeholder="Ex: 1:8" className="col-span-12 md:col-span-4" />
              <InputField type="date" label="Data do Teste" register={register("detalhesGestante.dataTesteNaoTreponemico")} className="col-span-12 md:col-span-4" />
              
              <SelectField label="Teste Treponêmico" name="detalhesGestante.testeTreponemicoPreNatal" control={control} options={toOptions(TesteEnum)} className="col-span-12 md:col-span-6" />
              <SelectField label="Esquema de Tratamento Prescrito" name="detalhesGestante.esquemaTratPresGestante" control={control} options={toOptions(EsquemaTratamentoGestanteEnum)} className="col-span-12 md:col-span-6" />
            </div>
          </div>

          {/* BLOCO 4: PARCERIA SEXUAL */}
          <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-amber-700 font-bold mb-4 border-b border-amber-100 pb-2">4. Antecedentes da Parceria Sexual</h3>
            <div className="grid grid-cols-12 gap-4">
              <SelectField label="Parceiro Tratado?" name="detalhesGestante.parceiroTratGestante" control={control} options={toOptions(OpcoesSimNao)} className="col-span-12 md:col-span-3" />
              <SelectField label="Esquema Tratamento Parceiro" name="detalhesGestante.esquemaTratPresParceiro" control={control} options={toOptions(EsquemaTratamentoGestanteEnum)} className="col-span-12 md:col-span-5" />
              <SelectField label="Motivo do Não Tratamento" name="detalhesGestante.motivoNaoTratParceiro" control={control} options={toOptions(MotivoNaoTratParceiroEnum)} className="col-span-12 md:col-span-4" />
              <InputField label="Outro Motivo (Especificar)" register={register("detalhesGestante.outroMotivoNaoTratParceiro")} className="col-span-12 md:col-span-12" />
            </div>
          </div>
          
        </div>

        {/* Rodapé Dinâmico */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white rounded-b-xl sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button type="button" onClick={handleAutoFill} className="px-4 py-2 border border-dashed border-purple-400 text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors text-sm font-semibold flex items-center gap-2">
            Auto-Preencher (Dev)
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 font-medium">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 font-medium">Salvar Ficha Gestacional</button>
          </div>
        </div>

      </form>
    </div>
  );
}
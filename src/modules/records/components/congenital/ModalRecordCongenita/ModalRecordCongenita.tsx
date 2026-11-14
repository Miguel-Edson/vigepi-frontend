"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { recordCongenitaSchema, type RecordCongenitaForm, DiagSifilisMatEnum, EsquemaTratMaeEnum, OptionsEnum, TesteEnum, TesteEnum18mEnum, Options3Enum, DiagClinicoEnum, SinaisSintomasEnum, EsquemaTratCriancaEnum, EvolucaoEnum } from "@/modules/records/schemas/recordSchema";

interface ModalRecordCongenitaProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSaveAction: (data: any) => void;
}

export function ModalRecordCongenita({ isOpen, onClose, patientId, onSaveAction }: ModalRecordCongenitaProps) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<RecordCongenitaForm>({
    resolver: zodResolver(recordCongenitaSchema),
    defaultValues: {
      agravo: "Sífilis Congênita",
      detalhesCongenita: {
        ictericia: false, anemia: false, esplenomegalia: false, osteocondrite: false,
        riniteMucoSanguinolenta: false, hepatomegalia: false, lesoesCutaneas: false, pseudoparalisia: false
      }
    }
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  // Conversão de Enums para Options do Select
  const toOptions = (enumObj: any) => Object.values(enumObj).map(val => ({ label: String(val), value: String(val) }));

  const onSubmit = (data: RecordCongenitaForm) => {
    const payload = {
      ...data,
      patientId, // Injetamos o ID do paciente automaticamente no payload final
    };
    onSaveAction(payload);
    reset();
    onClose();
  };

  const handleAutoFill = () => {
    reset({
      tipoNotificacao: "2", numSinan: "1234567", agravo: "Sífilis Congênita", codeCid: "A50.9",
      status: "Ativo", dataNotificacao: "2026-10-14", dataDiagnostico: "2026-10-10",
      uf: "CE", municipio: "Sobral",
      detalhesCongenita: {
        idadeMae: "28", racaCorMae: "Parda", escolaridadeMae: "Médio Completo", preNatalGestacao: OptionsEnum.SIM,
        diagSifilisMat: DiagSifilisMatEnum.DURANTE_PRE_NATAL, testeNaoTreponemicoMae: TesteEnum.REAGENTE,
        testeTreponemicoMae: TesteEnum.REAGENTE, esquemaTratMae: EsquemaTratMaeEnum.ADEQUADO,
        parceiroTratado: OptionsEnum.SIM, testeNaoTreponemicoCrianca: TesteEnum.REAGENTE,
        testeTreponemicoCrianca: TesteEnum18mEnum.NAO_SE_APLICA, testeNaoTreponemicoLiquor: TesteEnum.NAO_REALIZADO,
        titulacaoAscendente: Options3Enum.NAO, evidenciaTreponema: Options3Enum.NAO,
        alteracaoLiquorica: Options3Enum.NAO, diagRadiologico: Options3Enum.NAO,
        diagClinico: DiagClinicoEnum.ASSINTOMATICO, sinaisSintomas: SinaisSintomasEnum.NAO,
        esquemaTratCrianca: EsquemaTratCriancaEnum.PENICILINA_BENZATINA, evolucaoCaso: EvolucaoEnum.VIVO,
        ictericia: false, anemia: false, esplenomegalia: false, osteocondrite: false, riniteMucoSanguinolenta: false, hepatomegalia: false, lesoesCutaneas: false, pseudoparalisia: false
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Nova Ficha de Investigação</h2>
            <p className="text-sm text-primary font-medium">Sífilis Congênita</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none cursor-pointer">&times;</button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-8 bg-gray-50">
          
          {/* BLOCO 1: DADOS GERAIS */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-primary font-bold mb-4 border-b pb-2">1. Dados Gerais da Notificação</h3>
            <div className="grid grid-cols-12 gap-4">
              <InputField label="Nº SINAN *" register={register("numSinan")} className="col-span-12 md:col-span-3" />
              <InputField type="date" label="Data de Notificação *" register={register("dataNotificacao")} className="col-span-12 md:col-span-3" />
              <InputField type="date" label="Data de Diagnóstico *" register={register("dataDiagnostico")} className="col-span-12 md:col-span-3" />
              <InputField label="CID 10 *" register={register("codeCid")} placeholder="Ex: A50.9" className="col-span-12 md:col-span-3" />
              
              <InputField label="UF *" register={register("uf")} className="col-span-12 md:col-span-2" />
              <InputField label="Município *" register={register("municipio")} className="col-span-12 md:col-span-4" />
              <InputField label="Tipo Notificação *" register={register("tipoNotificacao")} className="col-span-12 md:col-span-3" />
              <InputField label="Status *" register={register("status")} className="col-span-12 md:col-span-3" />
            </div>
          </div>

          {/* BLOCO 2: DADOS DA MÃE */}
          <div className="bg-white border border-pink-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-pink-600 font-bold mb-4 border-b border-pink-100 pb-2">2. Antecedentes Maternos</h3>
            <div className="grid grid-cols-12 gap-4">
              <InputField type="number" label="Idade da Mãe *" register={register("detalhesCongenita.idadeMae")} className="col-span-12 md:col-span-2" />
              <InputField label="Raça/Cor *" register={register("detalhesCongenita.racaCorMae")} className="col-span-12 md:col-span-3" />
              <InputField label="Escolaridade *" register={register("detalhesCongenita.escolaridadeMae")} className="col-span-12 md:col-span-4" />
              <SelectField label="Pré-Natal?" name="detalhesCongenita.preNatalGestacao" control={control} options={toOptions(OptionsEnum)} className="col-span-12 md:col-span-3" />
              
              <SelectField label="Momento do Diagnóstico Materno *" name="detalhesCongenita.diagSifilisMat" control={control} options={toOptions(DiagSifilisMatEnum)} className="col-span-12 md:col-span-4" />
              <SelectField label="Esquema Tratamento Materno *" name="detalhesCongenita.esquemaTratMae" control={control} options={toOptions(EsquemaTratMaeEnum)} className="col-span-12 md:col-span-4" />
              <SelectField label="Parceiro Tratado? *" name="detalhesCongenita.parceiroTratado" control={control} options={toOptions(OptionsEnum)} className="col-span-12 md:col-span-4" />
            </div>
          </div>

          {/* BLOCO 3: DADOS DA CRIANÇA */}
          <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-blue-600 font-bold mb-4 border-b border-blue-100 pb-2">3. Dados da Criança (Laboratório e Clínica)</h3>
            <div className="grid grid-cols-12 gap-4">
              <SelectField label="Teste Não Treponêmico Criança *" name="detalhesCongenita.testeNaoTreponemicoCrianca" control={control} options={toOptions(TesteEnum)} className="col-span-12 md:col-span-4" />
              <SelectField label="Teste Treponêmico (18m) *" name="detalhesCongenita.testeTreponemicoCrianca" control={control} options={toOptions(TesteEnum18mEnum)} className="col-span-12 md:col-span-4" />
              <SelectField label="Teste Não Treponêmico Líquor *" name="detalhesCongenita.testeNaoTreponemicoLiquor" control={control} options={toOptions(TesteEnum)} className="col-span-12 md:col-span-4" />
              
              <SelectField label="Diagnóstico Clínico *" name="detalhesCongenita.diagClinico" control={control} options={toOptions(DiagClinicoEnum)} className="col-span-12 md:col-span-6" />
              <SelectField label="Tratamento da Criança *" name="detalhesCongenita.esquemaTratCrianca" control={control} options={toOptions(EsquemaTratCriancaEnum)} className="col-span-12 md:col-span-6" />
            </div>
            
            {/* Checkboxes de Sinais e Sintomas */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Sinais e Sintomas Apresentados (Marque se houver):</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("detalhesCongenita.ictericia")} className="rounded text-blue-600 focus:ring-blue-500" /> Icterícia</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("detalhesCongenita.anemia")} className="rounded text-blue-600 focus:ring-blue-500" /> Anemia</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("detalhesCongenita.esplenomegalia")} className="rounded text-blue-600 focus:ring-blue-500" /> Esplenomegalia</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("detalhesCongenita.osteocondrite")} className="rounded text-blue-600 focus:ring-blue-500" /> Osteocondrite</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("detalhesCongenita.riniteMucoSanguinolenta")} className="rounded text-blue-600 focus:ring-blue-500" /> Rinite Sanguinolenta</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("detalhesCongenita.hepatomegalia")} className="rounded text-blue-600 focus:ring-blue-500" /> Hepatomegalia</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("detalhesCongenita.lesoesCutaneas")} className="rounded text-blue-600 focus:ring-blue-500" /> Lesões Cutâneas</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("detalhesCongenita.pseudoparalisia")} className="rounded text-blue-600 focus:ring-blue-500" /> Pseudoparalisia</label>
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-4 mt-6">
              <SelectField label="Evolução do Caso *" name="detalhesCongenita.evolucaoCaso" control={control} options={toOptions(EvolucaoEnum)} className="col-span-12 md:col-span-6" />
              <InputField type="date" label="Data do Óbito (se aplicável)" register={register("detalhesCongenita.dataObito")} className="col-span-12 md:col-span-6" />
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
            <button type="submit" className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary font-medium">Salvar Ficha Congênita</button>
          </div>
        </div>

      </form>
    </div>
  );
}
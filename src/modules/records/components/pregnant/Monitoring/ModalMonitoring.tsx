"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/form/InputField";
import { 
  monitoramentoGestanteSchema, 
  type MonitoramentoGestanteForm 
} from "@/modules/records/schemas/monitoringSchema";

interface ModalMonitoringProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAction: (data: MonitoramentoGestanteForm) => void;
}

export function ModalMonitoring({ isOpen, onClose, onSaveAction }: ModalMonitoringProps) {
  const { register, handleSubmit, reset } = useForm<MonitoramentoGestanteForm>({
    resolver: zodResolver(monitoramentoGestanteSchema)
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = (data: MonitoramentoGestanteForm) => {
    onSaveAction(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Novo Tratamento / Acompanhamento</h2>
            <p className="text-sm text-primary font-medium">Seguimento de Sífilis em Gestantes</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none cursor-pointer">&times;</button>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 space-y-6 bg-gray-50">
          
          {/* Seção 1: Dados Base */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-gray-700 font-bold text-sm border-b pb-2 uppercase tracking-wide">1. Dados do Diagnóstico e Pré-natal</h3>
            <div className="grid grid-cols-12 gap-4">
              <InputField type="date" label="Data do Diagnóstico" register={register("dataDiagnostico")} className="col-span-12 md:col-span-3" />
              <InputField type="date" label="Data 1ª Consulta Pré-Natal" register={register("data1Prenatal")} className="col-span-12 md:col-span-3" />
              <InputField label="Teste Rápido (Dia/Resultado)" placeholder="Ex: Reagente" register={register("testeRapido")} className="col-span-12 md:col-span-3" />
              <InputField type="date" label="Data Prevista do Parto (DPP)" register={register("dpp")} className="col-span-12 md:col-span-3" />
              
              <InputField label="Semana Gestacional" placeholder="Ex: 16 semanas" register={register("semanaGestacional")} className="col-span-12 md:col-span-4" />
              <InputField label="Fonte Notificadora" register={register("fonteNotificadora")} className="col-span-12 md:col-span-4" />
              <InputField label="Cód. Fonte Notificadora" register={register("codigoFonteNotificadora")} className="col-span-12 md:col-span-4" />
            </div>
          </div>

          {/* Seção 2: TTO da Gestante */}
          <div className="bg-emerald-50/30 border border-emerald-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-emerald-800 font-bold text-sm border-b border-emerald-100 pb-2 uppercase tracking-wide">2. TTO da Gestante (Penicilina Benzatina)</h3>
            <div className="grid grid-cols-12 gap-4">
              <InputField type="date" label="Data da 1ª Dose" register={register("dose1dataTrat1")} className="col-span-12 md:col-span-4" />
              <InputField type="date" label="Data da 2ª Dose" register={register("dose2dataTrat1")} className="col-span-12 md:col-span-4" />
              <InputField type="date" label="Data da 3ª Dose" register={register("dose3dataTrat1")} className="col-span-12 md:col-span-4" />
            </div>
          </div>

          {/* Seção 3: TTO da Parceria */}
          <div className="bg-blue-50/30 border border-blue-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-blue-800 font-bold text-sm border-b border-blue-100 pb-2 uppercase tracking-wide">3. TTO da Parceria</h3>
            <div className="grid grid-cols-12 gap-4">
              <InputField type="date" label="Parceria - Data 1ª Dose" register={register("parceriaDose1dataTrat1")} className="col-span-12 md:col-span-4" />
            </div>
          </div>
          
        </div>

        {/* Rodapé */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-xl sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 font-medium cursor-pointer">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark font-medium cursor-pointer">Salvar Tratamento</button>
        </div>

      </form>
    </div>
  );
}
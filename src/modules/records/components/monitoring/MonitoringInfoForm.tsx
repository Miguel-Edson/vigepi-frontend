"use client";

import { useEffect, useState } from "react";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecordSections } from "@/modules/records/components/shared/RecordSections";
import { recordToFormValues } from "@/modules/records/components/shared/formValues";
import { MONITORING_INFO_SCHEMAS } from "@/modules/records/schemas/monitoringSchema";
import type { MonitoramentoTipo } from "@/modules/records/monitoring/config";
import { MONITORING_SECTIONS } from "./monitoringSections";

interface MonitoringInfoFormProps {
  tipo: MonitoramentoTipo;
  monitoramento: Record<string, unknown> | null;
  canEdit: boolean;
  /** Salva (PATCH/POST) e recarrega. Lança erro se a API recusar. */
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

/** Dados do acompanhamento (tudo menos as doses): leitura por padrão, com botão de editar. */
export function MonitoringInfoForm({ tipo, monitoramento, canEdit, onSave }: MonitoringInfoFormProps) {
  const sections = MONITORING_SECTIONS[tipo];
  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    resolver: zodResolver(MONITORING_INFO_SCHEMAS[tipo]) as unknown as Resolver<FieldValues>,
  });

  // Mantém o formulário igual ao que está salvo (inclusive depois de cada salvamento)
  useEffect(() => {
    if (!isEditing) reset(recordToFormValues<FieldValues>(monitoramento ?? {}, sections));
  }, [monitoramento, isEditing, reset, sections]);

  const cancel = () => {
    setSubmitError(null);
    setIsEditing(false);
  };

  const onSubmit = async (values: FieldValues) => {
    setSubmitError(null);

    // Campos esvaziados vão como null, para realmente apagar o valor salvo
    const payload: Record<string, unknown> = {};
    for (const section of sections) {
      for (const field of section.fields) {
        const value = values[field.name];
        payload[field.name] = value === undefined || value === "" ? null : value;
      }
    }

    try {
      await onSave(payload);
      setIsEditing(false);
    } catch (error) {
      setSubmitError(error instanceof Error && error.message ? error.message : "Não foi possível salvar o acompanhamento.");
    }
  };

  const onInvalid = () => setSubmitError("Revise os campos destacados em vermelho antes de salvar.");

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      {canEdit && !isEditing && (
        <div className="flex justify-end">
          <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            Editar dados do acompanhamento
          </button>
        </div>
      )}

      <RecordSections
        sections={sections}
        isEditing={isEditing}
        register={register}
        control={control}
        errors={errors}
        record={monitoramento ?? {}}
      />

      {submitError && (
        <p role="alert" className="text-sm font-medium text-red-700 bg-red-100 border border-red-200 rounded-md p-3 whitespace-pre-line">
          {submitError}
        </p>
      )}

      {isEditing && (
        <div className="flex justify-end gap-3">
          <button type="button" onClick={cancel} className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      )}
    </form>
  );
}

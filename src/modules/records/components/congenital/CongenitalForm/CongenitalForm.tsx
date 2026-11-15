"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recordCongenitaSchema, type RecordCongenitaForm } from "@/modules/records/schemas/recordSchema";
import { Agravo, type RecordAPI, type UpdateRecordDTO } from "@/modules/records/types/record";
import { recordService } from "@/modules/records/services/recordService";
import { FormSubmitError } from "@/components/form/FormSubmitError";
import { RecordPageShell } from "@/modules/records/components/shared/RecordPageShell";
import { RecordSections } from "@/modules/records/components/shared/RecordSections";
import { recordToFormValues } from "@/modules/records/components/shared/formValues";
import { emptyToNull } from "@/utils/payload";
import { MonitoringTab } from "@/modules/records/components/monitoring/MonitoringTab";
import { congenitalSections } from "../congenitalSections";

interface CongenitalFormProps {
  recordId: string;
  patientId: string;
}

const TABS = [
  { id: "ficha", label: "Sífilis Congênita" },
  { id: "acompanhamento", label: "Acompanhamento" },
];

export function CongenitalForm({ recordId, patientId }: CongenitalFormProps) {
  const [activeTab, setActiveTab] = useState("ficha");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [record, setRecord] = useState<RecordAPI | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecordCongenitaForm>({ resolver: zodResolver(recordCongenitaSchema) });

  const loadRecord = useCallback(async () => {
    try {
      setLoadError(null);
      const data = await recordService.getById(recordId);

      if (data.patient?.id && data.patient.id !== patientId) {
        throw new Error("Esta ficha não pertence a este paciente.");
      }
      if (data.agravo !== Agravo.SIFILIS_CONGENITA) {
        throw new Error("Esta ficha não é de Sífilis Congênita.");
      }

      setRecord(data);
      reset(recordToFormValues<RecordCongenitaForm>(data, congenitalSections));
    } catch (error) {
      console.error("Erro ao carregar ficha congênita:", error);
      setLoadError(error instanceof Error && error.message ? error.message : "Não foi possível carregar a ficha.");
    } finally {
      setIsLoading(false);
    }
  }, [recordId, patientId, reset]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const handleToggleEdit = () => {
    // Ao cancelar, descarta o que foi digitado e volta aos dados salvos
    if (isEditing && record) reset(recordToFormValues<RecordCongenitaForm>(record, congenitalSections));
    setSubmitError(null);
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: RecordCongenitaForm) => {
    setSubmitError(null);
    try {
      await recordService.update(recordId, emptyToNull(data) as unknown as UpdateRecordDTO);
      await loadRecord(); // recarrega a ficha completa (com os detalhes) a partir da API
      setIsEditing(false);
      alert("Ficha atualizada com sucesso!");
    } catch (error) {
      setSubmitError(error instanceof Error && error.message ? error.message : "Erro ao salvar alterações.");
    }
  };

  const onInvalid = () => setSubmitError("Revise os campos destacados em vermelho antes de salvar.");

  if (isLoading) {
    return <div className="min-h-screen flex justify-center pt-20 text-gray-500">Carregando ficha...</div>;
  }

  if (loadError || !record) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-red-500 font-medium">{loadError ?? "Ficha não encontrada."}</p>
        <Link href={`/pacientes/${patientId}`} className="text-primary underline text-sm">
          Voltar para o prontuário
        </Link>
      </div>
    );
  }

  return (
    <RecordPageShell
      patientId={patientId}
      numSinan={record.numSinan}
      isEditing={isEditing}
      onToggleEdit={handleToggleEdit}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "ficha" && (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          <RecordSections
            sections={congenitalSections}
            isEditing={isEditing}
            register={register}
            control={control}
            errors={errors}
            record={record}
          />

          <FormSubmitError message={submitError} />

          {isEditing && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleToggleEdit}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          )}
        </form>
      )}

      {activeTab === "acompanhamento" && (
        <MonitoringTab recordId={recordId} tipoAgravo="congenita" record={record} />
      )}
    </RecordPageShell>
  );
}

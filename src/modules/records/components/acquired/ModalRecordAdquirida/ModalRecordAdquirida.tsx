"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recordAdquiridaSchema,
  type RecordAdquiridaForm,
  Cid10,
  StatusFicha,
  OpcoesSimNao,
  CompSexualEnum,
  TesteEnum,
  EsquemaTratamentoEnum,
  ClassClinicaEnum,
  ClassFinalEnum,
} from "@/modules/records/schemas/recordSchema";
import { RecordSections } from "@/modules/records/components/shared/RecordSections";
import { RecordModalShell } from "@/modules/records/components/shared/RecordModalShell";
import { omitEmpty } from "@/utils/payload";
import { acquiredSections } from "../acquiredSections";

interface ModalRecordAdquiridaProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSaveAction: (data: RecordAdquiridaForm & { patientId: string }) => void | Promise<void>;
}

// CID padrão da sífilis adquirida no SINAN (continua editável no formulário)
const DEFAULT_VALUES = { agravo: "Sífilis Adquirida", codeCid: Cid10.CID_A539 };

export function ModalRecordAdquirida({ isOpen, onClose, patientId, onSaveAction }: ModalRecordAdquiridaProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecordAdquiridaForm>({
    resolver: zodResolver(recordAdquiridaSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!isOpen) {
      reset(DEFAULT_VALUES);
      setSubmitError(null);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: RecordAdquiridaForm) => {
    setSubmitError(null);
    try {
      // Só limpa e fecha DEPOIS que a API confirmar; se falhar, o formulário continua preenchido
      await onSaveAction(omitEmpty({ ...data, patientId }));
      reset(DEFAULT_VALUES);
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível salvar. Os dados digitados foram mantidos, tente novamente."
      );
    }
  };

  const handleAutoFill = () => {
    reset({
      tipoNotificacao: "2",
      numSinan: "7654321",
      agravo: "Sífilis Adquirida",
      codeCid: Cid10.CID_A539,
      status: StatusFicha.AGUARDANDO_EXAME,
      dataNotificacao: "2026-10-14",
      dataDiagnostico: "2026-10-12",
      UF: "CE",
      municipio: "Sobral",
      codeIbge: "2312908",
      codeUnidadeSaude: "202020",
      detalhesAdquirida: {
        ocupacao: "Professor",
        antSifilis: OpcoesSimNao.NAO,
        seSimTratRealizado: OpcoesSimNao.NAO,
        compSexual: CompSexualEnum.MULHERES,
        testeNaoTreponico: TesteEnum.REAGENTE,
        titulo: "1:16",
        data: "2026-10-10",
        testeTreponico: TesteEnum.REAGENTE,
        esquemaTratAdquirida: EsquemaTratamentoEnum.PENICILINA_24,
        dataInicioTrat: "2026-10-12",
        classClinica: ClassClinicaEnum.PRIMARIA,
        classFinal: ClassFinalEnum.CONFIRMADO,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <RecordModalShell
      title="Nova Ficha de Investigação"
      subtitle="Sífilis Adquirida"
      submitLabel="Salvar Ficha Adquirida"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onAutoFill={handleAutoFill}
    >
      <RecordSections
        sections={acquiredSections}
        isEditing
        register={register}
        control={control}
        errors={errors}
      />
    </RecordModalShell>
  );
}

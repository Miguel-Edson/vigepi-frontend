"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recordCongenitaSchema,
  type RecordCongenitaForm,
  Cid10,
  StatusFicha,
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
} from "@/modules/records/schemas/recordSchema";
import { RecordSections } from "@/modules/records/components/shared/RecordSections";
import { RecordModalShell } from "@/modules/records/components/shared/RecordModalShell";
import { omitEmpty } from "@/utils/payload";
import { congenitalSections } from "../congenitalSections";

interface ModalRecordCongenitaProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSaveAction: (data: RecordCongenitaForm & { patientId: string }) => void | Promise<void>;
}

const NO_SIGNS = {
  ictericia: false,
  anemia: false,
  esplenomegalia: false,
  osteocondrite: false,
  riniteMucoSanguinolenta: false,
  hepatomegalia: false,
  lesoesCutaneas: false,
  pseudoparalisia: false,
};

// CID padrão da sífilis congênita no SINAN (continua editável no formulário)
const DEFAULT_VALUES = {
  agravo: "Sífilis Congênita",
  codeCid: Cid10.CID_A509,
  detalhesCongenita: NO_SIGNS,
};

export function ModalRecordCongenita({ isOpen, onClose, patientId, onSaveAction }: ModalRecordCongenitaProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecordCongenitaForm>({
    resolver: zodResolver(recordCongenitaSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!isOpen) {
      reset(DEFAULT_VALUES);
      setSubmitError(null);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: RecordCongenitaForm) => {
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
      numSinan: "1234567",
      agravo: "Sífilis Congênita",
      codeCid: Cid10.CID_A509,
      status: StatusFicha.AGUARDANDO_EXAME,
      dataNotificacao: "2026-10-14",
      dataDiagnostico: "2026-10-10",
      UF: "CE",
      municipio: "Sobral",
      codeIbge: "2312908",
      codeUnidadeSaude: "202020",
      detalhesCongenita: {
        idadeMae: 28,
        racaCorMae: "Parda",
        escolaridadeMae: "Médio Completo",
        preNatalGestacao: OpcoesSimNao.SIM,
        diagSifilisMat: DiagSifilisMatEnum.DURANTE_PRE_NATAL,
        testeNaoTreponemicoMae: TesteEnum.REAGENTE,
        testeTreponemicoMae: TesteEnum.REAGENTE,
        esquemaTratMae: EsquemaTratMaeEnum.ADEQUADO,
        parceiroTratado: OpcoesSimNao.SIM,
        testeNaoTreponemicoCrianca: TesteEnum.REAGENTE,
        testeTreponemicoCrianca: TesteEnum18mEnum.NAO_SE_APLICA,
        testeNaoTreponemicoLiquor: TesteEnum.NAO_REALIZADO,
        titulacaoAscendente: Options3Enum.NAO,
        evidenciaTreponema: Options3Enum.NAO,
        alteracaoLiquorica: Options3Enum.NAO,
        diagRadiologico: Options3Enum.NAO,
        diagClinico: DiagClinicoEnum.ASSINTOMATICO,
        sinaisSintomas: SinaisSintomasEnum.NAO,
        esquemaTratCrianca: EsquemaTratCriancaEnum.PENICILINA_BENZATINA,
        evolucaoCaso: EvolucaoEnum.VIVO,
        ...NO_SIGNS,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <RecordModalShell
      title="Nova Ficha de Investigação"
      subtitle="Sífilis Congênita"
      submitLabel="Salvar Ficha Congênita"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onAutoFill={handleAutoFill}
    >
      <RecordSections
        sections={congenitalSections}
        isEditing
        register={register}
        control={control}
        errors={errors}
      />
    </RecordModalShell>
  );
}

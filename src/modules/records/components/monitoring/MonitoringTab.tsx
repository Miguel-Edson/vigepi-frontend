"use client";

import { useState } from "react";
import { useIsAdmin } from "@/modules/auth/hooks/useIsAdmin";
import { recordService } from "@/modules/records/services/recordService";
import { useMonitoramento } from "@/modules/records/hooks/useMonitoramento";
import { hasTreatments, MAX_TREATMENTS, type MonitoramentoTipo } from "@/modules/records/monitoring/config";
import { getTreatmentStatus, readTreatments } from "@/modules/records/monitoring/treatment";
import { StatusFicha, type RecordAPI } from "@/modules/records/types/record";
import { TreatmentStatusBanner } from "./TreatmentStatusBanner";
import { TreatmentManager } from "./TreatmentManager";
import { MonitoringInfoForm } from "./MonitoringInfoForm";

interface MonitoringTabProps {
  recordId: string;
  tipoAgravo?: MonitoramentoTipo;
  /** Opcional: mostra Nº SINAN e nome do paciente no topo da aba. */
  record?: RecordAPI | null;
  /** Chamado quando o status da ficha muda (ex.: reabertura ao registrar dose). Recarrega a ficha. */
  onRecordChanged?: () => Promise<unknown> | void;
}

/** Aba "Acompanhamento": serve às fichas gestante, adquirida e congênita. */
export function MonitoringTab({ recordId, tipoAgravo = "gestante", record, onRecordChanged }: MonitoringTabProps) {
  const tipo = tipoAgravo;
  const canEdit = useIsAdmin(); // criar/alterar monitoramento exige perfil ADM no backend (RolesGuard)
  const [notice, setNotice] = useState<string | null>(null);
  const { monitoramento, isLoading, error, save } = useMonitoramento(tipo, recordId);

  // Registrar uma dose em ficha concluída/abandonada = novo tratamento: reabre a ficha
  const saveAndReopen = async (data: Record<string, unknown>) => {
    setNotice(null);
    await save(data);

    const registersDose = Object.entries(data).some(([key, value]) => /^dose\d+dataTrat\d+$/.test(key) && value);
    const isClosed = record?.status === StatusFicha.DESCONTINUADO || record?.status === StatusFicha.TRATAMENTO_FINALIZADO;
    if (!registersDose || !record || !isClosed) return;

    try {
      await recordService.update(record.id, { status: StatusFicha.AGUARDANDO_EXAME });
      await onRecordChanged?.();
    } catch (err) {
      console.error("Dose registrada, mas a ficha não foi reaberta:", err);
      setNotice("Dose registrada, mas não foi possível reabrir a ficha. Use o botão “Reabrir ficha” no topo da página.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando acompanhamento...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {record && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-wrap gap-x-8 gap-y-1 text-sm text-gray-600">
          <span>Nº SINAN: <strong className="text-gray-800">{record.numSinan}</strong></span>
          {record.patient?.nome && <span>Paciente: <strong className="text-gray-800">{record.patient.nome}</strong></span>}
        </div>
      )}

      {!canEdit && (
        <p className="text-xs text-gray-400">Somente administradores podem registrar ou alterar o acompanhamento.</p>
      )}

      {hasTreatments(tipo) && (
        <>
          <TreatmentStatusBanner
            status={getTreatmentStatus(readTreatments(monitoramento, MAX_TREATMENTS[tipo]), { recordStatus: record?.status })}
          />
          {notice && <p role="alert" className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">{notice}</p>}
          <TreatmentManager tipo={tipo} monitoramento={monitoramento} canEdit={canEdit} onSave={saveAndReopen} />
        </>
      )}

      <MonitoringInfoForm tipo={tipo} monitoramento={monitoramento} canEdit={canEdit} onSave={save} />
    </div>
  );
}

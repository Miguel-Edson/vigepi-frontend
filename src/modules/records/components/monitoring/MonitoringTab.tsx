"use client";

import { useEffect, useState } from "react";
import { authService } from "@/modules/auth/services/authService";
import { useMonitoramento } from "@/modules/records/hooks/useMonitoramento";
import { hasTreatments, MAX_TREATMENTS, type MonitoramentoTipo } from "@/modules/records/monitoring/config";
import { getTreatmentStatus, readTreatments } from "@/modules/records/monitoring/treatment";
import type { RecordAPI } from "@/modules/records/types/record";
import { TreatmentStatusBanner } from "./TreatmentStatusBanner";
import { TreatmentManager } from "./TreatmentManager";
import { MonitoringInfoForm } from "./MonitoringInfoForm";

interface MonitoringTabProps {
  recordId: string;
  tipoAgravo?: MonitoramentoTipo;
  /** Opcional: mostra Nº SINAN e nome do paciente no topo da aba. */
  record?: RecordAPI | null;
}

/** Aba "Acompanhamento": serve às fichas gestante, adquirida e congênita. */
export function MonitoringTab({ recordId, tipoAgravo = "gestante", record }: MonitoringTabProps) {
  const tipo = tipoAgravo;
  const [canEdit, setCanEdit] = useState(false);
  const { monitoramento, isLoading, error, save } = useMonitoramento(tipo, recordId);

  // Criar/alterar monitoramento exige perfil ADM no backend (RolesGuard)
  useEffect(() => {
    setCanEdit(authService.isAdmin());
  }, []);

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
          <TreatmentStatusBanner status={getTreatmentStatus(readTreatments(monitoramento, MAX_TREATMENTS[tipo]))} />
          <TreatmentManager tipo={tipo} monitoramento={monitoramento} canEdit={canEdit} onSave={save} />
        </>
      )}

      <MonitoringInfoForm tipo={tipo} monitoramento={monitoramento} canEdit={canEdit} onSave={save} />
    </div>
  );
}

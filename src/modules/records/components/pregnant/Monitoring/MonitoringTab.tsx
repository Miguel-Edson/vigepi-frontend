"use client";

import { useEffect, useState } from "react";
import { recordService } from "@/modules/records/services/recordService";
import { MonitoramentoGestanteAPI } from "@/modules/records/types/monitoring";

interface MonitoringTabProps {
  recordId: string;
  tipoAgravo?: string;
}

export function MonitoringTab({ recordId, tipoAgravo = "gestante" }: MonitoringTabProps) {
  const [monitoramentos, setMonitoramentos] = useState<MonitoramentoGestanteAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Controla qual ciclo/tratamento está em modo de edição
  const [editandoTratamento, setEditandoTratamento] = useState<number | null>(null);
  const [formDataDoses, setFormDataDoses] = useState({ dose1: "", dose2: "", dose3: "" });

  const fetchMonitoramentos = async () => {
    try {
      setIsLoading(true);
      const data = await recordService.getMonitoramentosByRecordId(tipoAgravo, recordId);
      setMonitoramentos(data);
    } catch (error) {
      console.error("Erro ao carregar monitoramentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoramentos();
  }, [recordId, tipoAgravo]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando acompanhamentos...</div>;
  }

  const monitoramentoAtual = monitoramentos[0];
  const recordData = (monitoramentoAtual as any)?.record;
  const patientData = recordData?.patient;

  // Extrai dinamicamente os tratamentos ativos do objeto
  const tratamentosAtivos = [];
  if (monitoramentoAtual) {
    if (monitoramentoAtual.dose1dataTrat1 || monitoramentoAtual.dose2dataTrat1 || monitoramentoAtual.dose3dataTrat1) {
      tratamentosAtivos.push({ numero: 1, doses: [monitoramentoAtual.dose1dataTrat1, monitoramentoAtual.dose2dataTrat1, monitoramentoAtual.dose3dataTrat1] });
    }
    if (monitoramentoAtual.dose1dataTrat2 || monitoramentoAtual.dose2dataTrat2 || monitoramentoAtual.dose3dataTrat2) {
      tratamentosAtivos.push({ numero: 2, doses: [monitoramentoAtual.dose1dataTrat2, monitoramentoAtual.dose2dataTrat2, monitoramentoAtual.dose3dataTrat2] });
    }
    if (monitoramentoAtual.dose1dataTrat3 || monitoramentoAtual.dose2dataTrat3 || monitoramentoAtual.dose3dataTrat3) {
      tratamentosAtivos.push({ numero: 3, doses: [monitoramentoAtual.dose1dataTrat3, monitoramentoAtual.dose2dataTrat3, monitoramentoAtual.dose3dataTrat3] });
    }
  }

  // Salvar alterações das doses do tratamento
  const handleSalvarDoses = async (numeroTratamento: number) => {
    try {
      const payloadKey1 = `dose1dataTrat${numeroTratamento}`;
      const payloadKey2 = `dose2dataTrat${numeroTratamento}`;
      const payloadKey3 = `dose3dataTrat${numeroTratamento}`;

      const payload = {
        [payloadKey1]: formDataDoses.dose1 || null,
        [payloadKey2]: formDataDoses.dose2 || null,
        [payloadKey3]: formDataDoses.dose3 || null,
      };

      await recordService.updateMonitoramento(monitoramentoAtual.id, payload);
      setEditandoTratamento(null);
      fetchMonitoramentos();
      alert("Doses atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar doses:", error);
      alert("Erro ao salvar as doses.");
    }
  };

  // Lógica para criar um Novo Tratamento (Abre o próximo ciclo liberando a 1ª dose)
  const handleNovoTratamento = async () => {
    const proximoCiclo = tratamentosAtivos.length + 1;
    if (proximoCiclo > 3) {
      alert("Limite máximo de 3 ciclos de tratamento atingido.");
      return;
    }

    try {
      const payloadKey1 = `dose1dataTrat${proximoCiclo}`;
      // Inicializa o novo ciclo salvando null na 1ª dose para abrir a linha no backend
      await recordService.updateMonitoramento(monitoramentoAtual.id, { [payloadKey1]: null });
      fetchMonitoramentos();
      
      // Abre automaticamente o modo de edição para este novo ciclo
      setEditandoTratamento(proximoCiclo);
      setFormDataDoses({ dose1: "", dose2: "", dose3: "" });
    } catch (error) {
      console.error("Erro ao criar novo tratamento:", error);
      alert("Erro ao iniciar novo tratamento.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* BLOCO 1: SEGUIMENTO DE SÍFILIS EM GESTANTES */}
      <div className="bg-white border border-primary rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-primary font-bold text-sm border-b pb-2 uppercase tracking-wide">
          Seguimento de Sífilis em Gestantes
        </h3>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Nº SINAM *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {recordData?.numSinan || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Nome da Gestante *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patientData?.nome || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Data do Diagnóstico *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {monitoramentoAtual?.dataDiagnostico || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Semana Gestacional *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {monitoramentoAtual?.semanaGestacional || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Data 1º Pré-Natal *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {monitoramentoAtual?.data1Prenatal || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Teste Rápido *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {monitoramentoAtual?.testeRapido || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-400 font-medium pl-1">Data Prevista do Parto *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {monitoramentoAtual?.dpp || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO 2: TTO DA GESTANTE */}
      <div className="bg-white border border-primary rounded-xl p-6 shadow-sm space-y-6">
        <h3 className="text-primary font-bold text-sm border-b pb-2 uppercase tracking-wide">
          TTO da Gestante
        </h3>

        {tratamentosAtivos.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-gray-400 text-sm">Nenhum tratamento registado.</p>
            <button
              type="button"
              onClick={handleNovoTratamento}
              className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
            >
              + Iniciar Primeiro Tratamento
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tratamentosAtivos.map((tto) => {
              const isEditing = editandoTratamento === tto.numero;

              return (
                <div key={tto.numero} className="bg-gray-50/60 border border-gray-200 rounded-xl p-5 space-y-4">
                  
                  <div className="text-center">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Data {tto.numero}º Tratamento
                    </span>
                  </div>

                  {/* Doses lado a lado */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Dose 1 */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium pl-1">Data da 1ª Dose *</label>
                      {isEditing ? (
                        <input 
                          type="date" 
                          value={formDataDoses.dose1} 
                          onChange={(e) => setFormDataDoses({ ...formDataDoses, dose1: e.target.value })}
                          className="w-full h-10 px-3 bg-white border border-primary rounded-md text-sm text-gray-800 focus:outline-hidden"
                        />
                      ) : (
                        <div className="w-full h-10 px-3 bg-white border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                          {tto.doses[0] || <span className="text-amber-600 italic">Dose não aplicada</span>}
                        </div>
                      )}
                    </div>

                    {/* Dose 2 */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium pl-1">Data da 2ª Dose *</label>
                      {isEditing ? (
                        <input 
                          type="date" 
                          value={formDataDoses.dose2} 
                          onChange={(e) => setFormDataDoses({ ...formDataDoses, dose2: e.target.value })}
                          className="w-full h-10 px-3 bg-white border border-primary rounded-md text-sm text-gray-800 focus:outline-hidden"
                        />
                      ) : (
                        <div className="w-full h-10 px-3 bg-white border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                          {tto.doses[1] || <span className="text-amber-600 italic">Dose não aplicada</span>}
                        </div>
                      )}
                    </div>

                    {/* Dose 3 */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium pl-1">Data da 3ª Dose *</label>
                      {isEditing ? (
                        <input 
                          type="date" 
                          value={formDataDoses.dose3} 
                          onChange={(e) => setFormDataDoses({ ...formDataDoses, dose3: e.target.value })}
                          className="w-full h-10 px-3 bg-white border border-primary rounded-md text-sm text-gray-800 focus:outline-hidden"
                        />
                      ) : (
                        <div className="w-full h-10 px-3 bg-white border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                          {tto.doses[2] || <span className="text-amber-600 italic">Dose não aplicada</span>}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Ações da linha */}
                  <div className="flex justify-end pt-2">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditandoTratamento(null)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSalvarDoses(tto.numero)}
                          className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark cursor-pointer"
                        >
                          Salvar Doses
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditandoTratamento(tto.numero);
                          setFormDataDoses({
                            dose1: tto.doses[0] || "",
                            dose2: tto.doses[1] || "",
                            dose3: tto.doses[2] || "",
                          });
                        }}
                        className="px-3 py-1.5 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary/5 cursor-pointer"
                      >
                        Editar Doses
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Botão de Novo Tratamento */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleNovoTratamento}
            className="px-4 py-2 border border-primary text-primary rounded-full text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>⊕ Novo Tratamento</span>
          </button>
        </div>

      </div>

    </div>
  );
}
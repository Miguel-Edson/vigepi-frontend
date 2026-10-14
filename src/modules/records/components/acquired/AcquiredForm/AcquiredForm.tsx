"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { recordService } from "@/modules/records/services/recordService";
import { RecordAPI } from "@/modules/records/types/record";

// Importação dos componentes com os nomes padronizados em inglês
import { GeneralData } from "../GeneralData/GeneralData";
import { ClinicalDetails } from "../ClinicalDetails/ClinicalDetails";
// import { LabAndTreatment } from "../LabAndTreatment/LabAndTreatment";

export function AcquiredForm() {
  const params = useParams();
  const pacienteId = params.id as string;

  const [activeTab, setActiveTab] = useState<"adquirida" | "acompanhamento" | "historico">("adquirida");
  const [ficha, setFicha] = useState<RecordAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Novo estado para tratar erros de API

  useEffect(() => {
    async function carregarFicha() {
      try {
        setLoading(true);
        setError(null);
        
        // IDEAL: Buscar apenas as fichas do paciente específico no backend!
        // Se o backend ainda não tiver essa rota, crie-a no serviço depois.
        const recordsDoPaciente = await recordService.getAllRecords(); 
        
        const fichaEncontrada = recordsDoPaciente.find(
          (r) => r.agravo === "Sífilis Adquirida"
        );
        
        setFicha(fichaEncontrada || null);
      } catch (err) {
        console.error("Erro ao carregar ficha adquirida:", err);
        setError("Não foi possível carregar os dados da ficha. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    
    if (pacienteId) {
      carregarFicha();
    }
  }, [pacienteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="text-primary underline text-sm">
          Tentar novamente
        </button>
      </div>
    );
  }
  
  if (!ficha) return (
    <div className="p-12 text-center space-y-4">
      <p className="text-red-500 font-medium">Ficha de Sífilis Adquirida não encontrada para este paciente.</p>
      <Link href={`/pacientes/${pacienteId}`} className="text-primary underline text-sm">
        Voltar para o prontuário
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div>
          <Link href={`/pacientes/${pacienteId}`} className="text-sm text-gray-400 hover:text-primary transition-colors">
            ← Voltar para o Prontuário
          </Link>
        </div>

        {/* CABEÇALHO E ABAS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <h1 className="text-xl font-bold text-gray-800">
              Ficha Epidemiológica <span className="text-primary font-normal">| N° SINAN: {ficha.numSinan}</span>
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                Status: {ficha.status}
              </span>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                Marcar como concluída
              </button>
            </div>
          </div>
          <div className="">
          <div className="flex items-center gap-8 border-b border-gray-100">
            <button
              onClick={() => setActiveTab("adquirida")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "adquirida" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Sífilis Adquirida
            </button>
            <button
              onClick={() => setActiveTab("acompanhamento")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "acompanhamento" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Acompanhamento
            </button>
          </div>
        </div>

        {/* CONTEÚDO DA ABA ATIVA */}
        {activeTab === "adquirida" && (
          <div className="space-y-6">
            <GeneralData ficha={ficha} />
            <ClinicalDetails ficha={ficha} />
            {/* <LabAndTreatment ficha={ficha} /> */}
          </div>
        )}

        {activeTab === "acompanhamento" && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
            Acompanhamento Clínico (Em desenvolvimento)
          </div>
        )}

      </div>
      </div>
    </div>
  );
}
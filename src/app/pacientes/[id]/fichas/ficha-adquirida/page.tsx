"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { recordService } from "@/services/recordService";
import { RecordAPI } from "@/types/record";

// Importação dos componentes modulares
import { DadosGerais } from "./components/DadosGerais/DadosGerais";
import { DetalhesClinicos } from "./components/DetalhesClinicos/DetalhesClinicos";
// import { DetalhesClinicos } from "./components/DetalhesClinicos/DetalhesClinicos";
// import { LaboratorioTratamento } from "./components/LaboratorioTratamento/LaboratorioTratamento";

export default function FichaAdquiridaPage() {
  const params = useParams();
  const pacienteId = params.id as string;

  const [activeTab, setActiveTab] = useState<"adquirida" | "acompanhamento" | "historico">("adquirida");
  const [ficha, setFicha] = useState<RecordAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarFicha() {
      try {
        const allRecords = await recordService.getAllRecords();
        const fichaEncontrada = allRecords.find(
          (r) => r.patient?.id === pacienteId && r.agravo === "Sífilis Adquirida"
        );
        setFicha(fichaEncontrada || null);
      } catch (error) {
        console.error("Erro ao carregar ficha adquirida:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarFicha();
  }, [pacienteId]);

  if (loading) return <div className="p-12 text-center text-gray-500">Carregando ficha...</div>;
  
  if (!ficha) return (
    <div className="p-12 text-center space-y-4">
      <p className="text-red-500 font-medium">Ficha não encontrada.</p>
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
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 cursor-pointer">
                Marcar como concluída
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8 border-b border-gray-100">
            <button
              onClick={() => setActiveTab("adquirida")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === "adquirida" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Sífilis Adquirida
            </button>
            <button
              onClick={() => setActiveTab("acompanhamento")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
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
            <DadosGerais ficha={ficha} />
            <DetalhesClinicos ficha={ficha} />
            {/* <LaboratorioTratamento ficha={ficha} /> */}
          </div>
        )}

        {activeTab === "acompanhamento" && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
            Acompanhamento Clínico (Em desenvolvimento)
          </div>
        )}

      </div>
    </div>
  );
}
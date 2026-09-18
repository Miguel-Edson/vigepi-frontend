"use client";
import Link from "next/link";
import { RecordAPI } from "@/types/record";

interface RecordCardProps {
  record: RecordAPI;
  isActive?: boolean;
}

export function RecordCard({ record, isActive = false }: RecordCardProps) {
  // Função que define qual a rota correta baseada no agravo da ficha
  const getFichaRoute = (agravo: string) => {
    if (agravo?.toLowerCase().includes("gestante")) {
      return `/pacientes/${record.patient?.id}/fichas/ficha-gestante`;
    }
    // Caso padrão ou Sífilis Adquirida
    return `/pacientes/${record.patient?.id}/fichas/ficha-adquirida`;
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white mb-6">  
      {/* Faixa Superior (Status da Ficha) */}
      <div className={`px-5 py-2 font-medium text-sm flex items-center justify-between ${
        isActive ? "bg-primary text-white" : "bg-gray-400 text-white"
      }`}>
        <span>{isActive ? "Ficha Ativa" : "Ficha Inativa"}</span>
        <span className="text-xs opacity-90">SINAM: {record.numSinan}</span>
      </div>

      {/* Corpo do Card com os campos da notificação */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-12 gap-4">
          
          {/* Linha 1 */}
          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Tipo de Notificação *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.tipoNotificacao || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Notificação Individual *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.agravo || "-"}
            </div>
          </div>

          {/* Linha 2 */}
          <div className="col-span-12 md:col-span-8 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Agravo / doença *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm font-bold text-gray-800 uppercase">
              {record.agravo || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Código *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.codeCid || "-"}
            </div>
          </div>

          {/* Linha 3 */}
          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Data da Notificação *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.dataNotificacao || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Data do Diagnóstico *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.dataDiagnostico || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">UF *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.UF || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Município de Notificação *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.municipio || "-"}
            </div>
          </div>

          {/* Linha 4 */}
          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Código (IBGE) *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.codeIbge || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Unidade de Saúde *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.codeUnidadeSaude || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Código *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {record.codeUnidadeSaude || "-"}
            </div>
          </div>

        </div>

        {/* Rodapé do Card com o Link real para a Ficha */}
      <div className="flex justify-end pt-2 p-5 bg-white">
        <Link 
          href={getFichaRoute(record.agravo)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Acessar Ficha
        </Link>
      </div>

    </div>
    </div>
  );
}
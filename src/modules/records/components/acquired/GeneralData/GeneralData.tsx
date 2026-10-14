"use client";

import { RecordAPI } from "@/modules/records/types/record";

interface GeneralDataProps {
  ficha: RecordAPI;
}

export function GeneralData({ ficha }: GeneralDataProps) {
  return (
    <div className="border border-primary rounded-xl p-5 relative bg-white shadow-sm">
      <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
        Dados Gerais
      </h3>
      
      <div className="grid grid-cols-12 gap-4 mt-2">
        {/* Linha 1 */}
        <div className="col-span-12 md:col-span-6 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Tipo de Notificação *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {ficha.tipoNotificacao || "-"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Agravo / Doença *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm font-bold text-gray-800 uppercase">
            {ficha.agravo || "-"}
          </div>
        </div>

        {/* Linha 2 */}
        <div className="col-span-12 md:col-span-3 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Código (CID) *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {ficha.codeCid || "-"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Data da Notificação *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {ficha.dataNotificacao || "-"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Data do Diagnóstico *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {ficha.dataDiagnostico || "-"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">UF *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {ficha.UF || "-"}
          </div>
        </div>

        {/* Linha 3 */}
        <div className="col-span-12 md:col-span-4 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Município de Notificação *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {ficha.municipio || "-"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Código (IBGE) *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {ficha.codeIbge || "-"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Unidade de Saúde *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {ficha.codeUnidadeSaude || "-"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-2 space-y-1">
          <label className="text-xs text-gray-500 font-medium pl-1">Cód. CNES *</label>
          <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
            {/* Como ainda não existe CNES na API, usamos o codeUnidadeSaude temporariamente */}
            {ficha.codeUnidadeSaude || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
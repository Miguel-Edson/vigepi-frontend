"use client";

import { RecordAPI } from "@/types/record";

interface DetalhesClinicosProps {
  ficha: RecordAPI;
}

export function DetalhesClinicos({ ficha }: DetalhesClinicosProps) {
  const detalhes = ficha.detalhesAdquirida || {};

  return (
    <div className="space-y-8 mt-10">
      
      {/* Divisor Central: Dados Complementares do Caso */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative bg-white px-4 text-sm font-bold text-gray-800">
          Dados Complementares do Caso
        </div>
      </div>

      {/* --- BLOCO 1: Antecedentes Clínicos e Epidemiológicos --- */}
      <div className="border border-primary rounded-xl p-5 relative bg-white">
        <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
          Antecedentes Clínicos e Epidemiológicos
        </h3>
        
        <div className="grid grid-cols-12 gap-4 mt-2">
          <div className="col-span-12 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Ocupação *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.ocupacao || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Antecedente de Sífilis *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.antSifilis || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Se sim, tratamento realizado? *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.seSimTratRealizado || "-"}
            </div>
          </div>

          <div className="col-span-12 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Comportamento sexual *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.compSexual || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* --- BLOCO 2: Dados Laboratoriais --- */}
      <div className="border border-primary rounded-xl p-5 relative bg-white">
        <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
          Dados Laboratoriais
        </h3>
        
        <div className="grid grid-cols-12 gap-4 mt-2">
          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Teste não treponêmico *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.testeNaoTreponico || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Título *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.titulo || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Data *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.data || "-"}
            </div>
          </div>

          <div className="col-span-12 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Teste treponêmico *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.testeTreponico || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* --- BLOCO 3: Tratamento / Encerramento --- */}
      <div className="border border-primary rounded-xl p-5 relative bg-white">
        <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
          Tratamento / Encerramento
        </h3>
        
        <div className="grid grid-cols-12 gap-4 mt-2">
          <div className="col-span-12 md:col-span-8 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Esquema de tratamento prescrito *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.esquemaTratAdquirida || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Data de início do tratamento *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.dataInicioTrat || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Classificação Clínica *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.classClinica || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Classificação Final *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {detalhes.classFinal || "-"} {detalhes.classFinalOutro ? `(${detalhes.classFinalOutro})` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Salvar Alterações (Aparecerá quando implementarmos a edição) */}
      <div className="flex justify-center mt-8">
        <button className="flex items-center gap-2 px-6 py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary/5 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Salvar Alterações
        </button>
      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function FichaGestantePage() {
  const params = useParams();
  const pacienteId = params.id as string;

  const [activeTab, setActiveTab] = useState<"gestante" | "acompanhamento" | "historico">("gestante");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-12 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navegação de Retorno */}
        <div>
          <Link href={`/pacientes/${pacienteId}`} className="text-sm text-gray-400 hover:text-primary transition-colors">
            ← Voltar para o Prontuário do Paciente
          </Link>
        </div>

        {/* CABEÇALHO E ABAS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <h1 className="text-xl font-bold text-gray-800">
              Ficha Epidemiológica <span className="text-primary font-normal">| N° SINAM: 0000000012</span>
            </h1>

            {/* Botões de Ação do Topo */}
            <div className="flex items-center gap-3 flex-wrap">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                {isEditing ? "Cancelar Edição" : "Editar Informações"}
              </button>
              <button 
                onClick={() => alert("Ficha marcada como concluída")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 cursor-pointer"
              >
                Marcar como concluída
              </button>
              <button 
                onClick={() => alert("Ficha marcada como abandonada")}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 cursor-pointer"
              >
                Marcar como abandonada
              </button>
            </div>
          </div>

          {/* Abas da Ficha (Conforme o PDF) */}
          <div className="flex items-center gap-8 border-b border-gray-100">
            <button
              onClick={() => setActiveTab("gestante")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === "gestante" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Sífilis em Gestante
            </button>
            <button
              onClick={() => setActiveTab("acompanhamento")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === "acompanhamento" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Acompanhamento
            </button>
            <button
              onClick={() => setActiveTab("historico")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === "historico" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Histórico de Alterações
            </button>
          </div>

        </div>

        {/* CONTEÚDO DA ABA: SÍFILIS EM GESTANTE */}
        {activeTab === "gestante" && (
          <div className="space-y-6">
            
            {/* Bloco 1: Dados Gerais */}
            <div className="border border-primary rounded-xl p-5 relative bg-white">
              <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
                Dados Gerais
              </h3>
              
              <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-12 md:col-span-6 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Tipo de Notificação *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    Individual
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Agravo / Doença *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm font-bold text-gray-800">
                    SÍFILIS EM GESTANTE
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Data da Notificação *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    2026-07-01
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Data do Diagnóstico *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    2026-06-28
                  </div>
                </div>

                <div className="col-span-12 md:col-span-2 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">UF *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    CE
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Município de Notificação *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    Sobral
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Dados Complementares do Caso (Específico da Gestante) */}
            <div className="border border-primary rounded-xl p-5 relative bg-white">
              <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
                Dados Complementares do Caso
              </h3>
              
              <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-12 md:col-span-6 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Ocupação da Mãe *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    Estudante / Do Lar
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Nº da Gestante do SISPRENATAL *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    123456789
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Teste não treponêmico no parto/curetagem *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    Reagente
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Título *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    1:32
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs text-gray-500 font-medium pl-1">Classificação Clínica *</label>
                  <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
                    Primária
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Salvar Alterações caso esteja editando */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => { alert("Alterações salvas!"); setIsEditing(false); }}
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
                >
                  Salvar Alterações
                </button>
              </div>
            )}

          </div>
        )}

        {/* ABA DE ACOMPANHAMENTO */}
        {activeTab === "acompanhamento" && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Acompanhamento da Gestante</h3>
            <p className="text-sm">Módulo de controle de consultas de pré-natal e evolução clínica.</p>
          </div>
        )}

        {/* ABA DE HISTÓRICO DE ALTERAÇÕES */}
        {activeTab === "historico" && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Histórico de Alterações</h3>
            <p className="text-sm">Registro de logs e modificações realizadas nesta ficha.</p>
          </div>
        )}

      </div>
    </div>
  );
}
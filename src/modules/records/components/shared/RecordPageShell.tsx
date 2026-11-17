"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export interface RecordTab {
  id: string;
  label: string;
}

interface RecordPageShellProps {
  patientId: string;
  numSinan: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  /** Botões extras no cabeçalho (ex.: concluir/abandonar). */
  actions?: ReactNode;
  tabs: RecordTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
}

/**
 * Moldura das 3 fichas (gestacional, adquirida e congênita): tudo dentro de UMA página branca
 * sobre o fundo cinza, igual à ficha geral do paciente (cabeçalho + abas + conteúdo).
 */
export function RecordPageShell({
  patientId,
  numSinan,
  isEditing,
  onToggleEdit,
  actions,
  tabs,
  activeTab,
  onTabChange,
  children,
}: RecordPageShellProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <Link href={`/pacientes/${patientId}`} className="text-sm text-gray-400 hover:text-primary transition-colors">
          ← Voltar para o Prontuário do Paciente
        </Link>
      </div>

      {/* A "página" */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <h1 className="text-xl font-bold text-gray-800">
            Ficha Epidemiológica <span className="text-primary font-normal">| N° SINAN: {numSinan}</span>
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={onToggleEdit}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {isEditing ? "Cancelar Edição" : "Editar Informações"}
            </button>
            {actions}
          </div>
        </div>

        <div className="flex items-center gap-8 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}

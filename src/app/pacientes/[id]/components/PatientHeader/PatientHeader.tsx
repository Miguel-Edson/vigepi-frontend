"use client";

import Link from "next/link";

interface PatientHeaderProps {
  patientName: string;
  patientId: string;
  onEditClick?: () => void;
  onAddRecordClick?: () => void;
}

export function PatientHeader({ 
  patientName, 
  onEditClick, 
  onAddRecordClick 
}: PatientHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      
      {/* Abas de Navegação Superior */}
      <div className="flex items-center gap-6 border-b border-gray-100 pb-3 mb-6">
        <Link 
          href="#" 
          className="text-sm font-semibold text-primary border-b-2 border-primary pb-3 -mb-3.5"
        >
          Ficha do Paciente
        </Link>
        {/* Outras abas futuras podem entrar aqui */}
      </div>

      {/* Linha Principal: Nome do Paciente e Botões de Ação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Nome do Fulano */}
        <h1 className="text-2xl font-bold text-gray-800">
          {patientName || "Carregando paciente..."}
        </h1>

        {/* Botões de Ação do Topo (Editar Informações e Adicionar Nova Ficha) */}
        <div className="flex items-center gap-3">
          
          <button 
            onClick={onEditClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Ícone de Lápis */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            Editar Informações
          </button>

          <button 
            onClick={onAddRecordClick}
            className="flex items-center gap-2 px-4 py-2 border border-primary/40 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors cursor-pointer"
          >
            {/* Ícone de Adicionar (+) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
            Adicionar Nova Ficha
          </button>

        </div>

      </div>
    </div>
  );
}
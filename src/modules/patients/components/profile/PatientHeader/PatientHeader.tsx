"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { authService } from "@/modules/auth/services/authService";

interface PatientHeaderProps {
  patientName: string;
  patientId: string;
  onEditClick?: () => void;
  // Agora a função recebe qual tipo de ficha queremos criar!
  onAddRecordClick?: (tipo: 'ADQUIRIDA' | 'GESTACIONAL' | 'CONGENITA') => void;
}

export function PatientHeader({ 
  patientName, 
  patientId,
  onEditClick, 
  onAddRecordClick 
}: PatientHeaderProps) {
  const [isAdministrador, setIsAdministrador] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Ref para fechar o dropdown se clicar fora
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAdministrador(authService.isAdmin());

    // Função para fechar o dropdown ao clicar fora dele
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      
      {/* Abas de Navegação */}
      <div className="flex items-center gap-6 border-b border-gray-100 pb-3 mb-6">
        <Link href="#" className="text-sm font-semibold text-primary border-b-2 border-primary pb-3 -mb-3.5">
          Ficha do Paciente
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <h1 className="text-2xl font-bold text-gray-800">
          {patientName || "Carregando paciente..."}
        </h1>

        <div className="flex items-center gap-3">
          
          {isAdministrador && (
            <button 
              onClick={onEditClick}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
              </svg>
              Editar Informações
            </button>
          )}

          {/* Wrapper do Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg text-sm font-medium hover:bg-primary transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
              </svg>
              Nova Ficha
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {/* O Menu Suspenso (Dropdown) */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="p-1">
                  <button 
                    onClick={() => { onAddRecordClick?.('ADQUIRIDA'); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors cursor-pointer"
                  >
                    Sífilis Adquirida
                  </button>
                  <button 
                    onClick={() => { onAddRecordClick?.('GESTACIONAL'); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors cursor-pointer"
                  >
                    Sífilis Gestacional
                  </button>
                  <button 
                    onClick={() => { onAddRecordClick?.('CONGENITA'); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors cursor-pointer"
                  >
                    Sífilis Congênita
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
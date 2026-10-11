"use client";

import { useState, useMemo } from "react";
import { columns } from "./columns"; 
import { PatientTable } from "@/types/patient"; 
import { DataTable } from "@/components/ui/dataTable";
import { ModalNewPatient } from "./modalNewPatient"; 
import { usePatients } from "@/hooks/usePatients";

// 1. Array base (sem as contagens, elas serão dinâmicas agora)
const BASE_TABS = [
  { id: "todas", label: "Todas" },
  { id: "Tratamento Finalizado", label: "Tratamento Finalizado" },
  { id: "Dose Atrasada", label: "Em Tratamento" },
  { id: "Descontinuado", label: "Descontinuado" },
  { id: "Aguardando Exame", label: "Aguardando Exame" }, 
  { id: "DPP", label: "Gestantes" }, 
  { id: "sem-ficha", label: "Sem Ficha (Pendentes)" }, 
];

export function PatientListContainer() {
  const [activeTab, setActiveTab] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const { patients, records, isLoading, error, refetch } = usePatients();

  // 2. Cria a lista formatada principal (Usa useMemo em vez de useEffect para evitar re-renders)
  const formattedPatients: PatientTable[] = useMemo(() => {
    if (!patients) return [];
    const safeRecords = records || [];

    return patients.map((patient) => {
      const patientRecord = safeRecords.find(r => 
        (r.patient && r.patient.id === patient.id) || 
        (r as any).pacienteId === patient.id
      );

      if (patientRecord) {
        return {
          id: patient.id,
          nome: patient.nome,
          cpf: patient.cpf,
          ultimaAtt: "Atualizado",
          sinam: patientRecord.numSinan || "Sem Nº SINAN", 
          unidade: patientRecord.codeUnidadeSaude || "Não informada",
          bairro: patient.bairro || "Não informado", 
          tipoFicha: patientRecord.agravo || "N/A",
          status: patientRecord.status || "Dose Atrasada" // Assumindo default se vazio
        };
      } else {
        return {
          id: patient.id,
          nome: patient.nome,
          cpf: patient.cpf,
          ultimaAtt: "N/A", 
          sinam: "Aguardando Ficha", 
          unidade: "Pendente",
          bairro: patient.bairro || "Não informado", 
          tipoFicha: "Nenhuma ficha criada",
          status: "sem-ficha" 
        };
      }
    });
  }, [patients, records]);

  // 3. Calcula dinamicamente as contagens com base na lista formatada
  const tabsWithCounts = useMemo(() => {
    return BASE_TABS.map(tab => {
      if (tab.id === "todas") {
        return { ...tab, count: formattedPatients.length };
      }
      return { 
        ...tab, 
        count: formattedPatients.filter(p => p.status === tab.id).length 
      };
    });
  }, [formattedPatients]);

  // 4. Aplica os filtros de aba e barra de pesquisa
  const tableData = useMemo(() => {
    return formattedPatients.filter((patient) => {
      const matchesTab = activeTab === "todas" || patient.status === activeTab;
      const matchesSearch = 
        patient.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.cpf.includes(searchQuery);
      
      return matchesTab && matchesSearch;
    });
  }, [formattedPatients, activeTab, searchQuery]);

  return (
    <main className="space-y-6 bg-white rounded-xl m-12 pb-6 shadow-sm border border-gray-100">
      
      {/* Abas de Navegação com as Contagens Dinâmicas */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto px-4">
        {tabsWithCounts.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }} 
              className={`cursor-pointer flex items-center gap-2 py-3 px-4 text-sm transition-colors border-b-2 whitespace-nowrap ${
                isActive ? "border-primary text-primary font-bold" : "border-transparent text-gray-500 hover:text-gray-800 font-medium"
              }`}
            >
              {tab.label} 
              {/* Bolhinha com o número */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Pesquisa e Botão Adicionar */}
      <div className="flex w-full items-center justify-center px-5 gap-4">
        <div className="group flex items-center w-full h-10 px-4 gap-2 bg-white border border-gray-300 rounded-xl transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">           
          <span className="text-gray-400 shrink-0 transition-colors group-focus-within:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Pesquisar por nome ou CPF..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full text-black text-sm bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 shrink-0 bg-white border border-primary rounded-full flex items-center justify-center text-primary transition-all shadow-sm cursor-pointer hover:bg-primary hover:text-white active:scale-95"
          aria-label="Adicionar Novo Paciente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Renderização da Tabela */}
      <div className="border-t border-gray-100 p-4 min-h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">Carregando dados...</div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-sm text-red-500">{error}</div>
        ) : tableData.length === 0 ? (
           <div className="h-full flex items-center justify-center text-sm text-gray-400">Nenhum paciente encontrado.</div>
        ) : (
          <DataTable columns={columns} data={tableData} />
        )}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between px-6 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">Mostrando página {currentPage} de {totalPages}</span>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Anterior
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Modal */}
      <ModalNewPatient 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
<<<<<<< Updated upstream
=======
"use client";

import { useState, useEffect } from "react";
import { columns } from "./columns"; 
import { PatientTable } from "@/types/patient"; 
import { DataTable } from "@/components/ui/dataTable";
import { ModalNewPatient } from "./modalNewPatient"; 
import { usePatients } from "@/hooks/usePatients";

// Adicionei a aba "Sem Ficha" para facilitar encontrar quem precisa de notificação
const TABS = [
  { id: "todas", label: "Todas", count: 0 },
  { id: "em-tratamento", label: "Em Tratamento", count: 0 },
  { id: "abandono", label: "Abandono", count: 0 },
  { id: "sem-ficha", label: "Sem Ficha (Pendentes)", count: 0 }, 
];

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState<PatientTable[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  // Pegamos os patients e os records que o nosso hook buscou
  const { patients, records, isLoading, error, refetch } = usePatients();

  useEffect(() => {
    if (!patients || !records) return;

    // 1. Cruzamento de Dados: Paciente + Ficha
    const formattedPatients: PatientTable[] = patients.map((patient) => {
      // Procura a ficha desse paciente (usando o ID)
      // Nota: Ajuste 'pacienteId' se a sua API chamar de outra forma
      const patientRecord = records.find(r => r.pacienteId === patient.id);

      if (patientRecord) {
        // Se ELE TEM ficha, preenchemos com os dados reais da ficha
        return {
          id: patient.id,
          nome: patient.nome,
          cpf: patient.cpf,
          ultimaAtt: "Atualizado", // Aqui você pode colocar a data da ficha depois
          sinam: patientRecord.sinam || "Sem Nº SINAM", 
          unidade: patientRecord.fonteNotificadora || "Não informada",
          bairro: patientRecord.bairro || "Não informado",
          tipoFicha: patientRecord.tipoFicha || "N/A",
          status: patientRecord.status || "em-tratamento" 
        };
      } else {
        // Se ELE NÃO TEM ficha, criamos o alerta visual
        return {
          id: patient.id,
          nome: patient.nome,
          cpf: patient.cpf,
          ultimaAtt: "N/A", 
          sinam: "⚠️ Aguardando Ficha", 
          unidade: "⚠️ Pendente",
          bairro: "⚠️ Pendente",
          tipoFicha: "Nenhuma ficha criada",
          status: "sem-ficha" // Status especial para criarmos a tag vermelha/amarela
        };
      }
    });

    // 2. Filtros de Aba e Pesquisa
    const filteredData = formattedPatients.filter((patient) => {
      const matchesTab = activeTab === "todas" || patient.status === activeTab;
      const matchesSearch = 
        patient.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.cpf.includes(searchQuery);
      
      return matchesTab && matchesSearch;
    });

    setTableData(filteredData);
  }, [patients, records, activeTab, searchQuery, currentPage]);


  return (
    <div className="min-h-screen bg-background relative py-12">
        

      <main className="space-y-6 bg-white rounded-xl mx-12 pb-6">
        <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }} 
                className={`cursor-pointer py-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${isActive ? "border-primary text-primary font-bold" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {tab.label} 
              </button>
            );
          })}
        </div>

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
            aria-label="Add New Patient"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className="shadow-sm border-t border-gray-200 p-4">
          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-sm text-gray-400">Carregando dados</div>
          ) : error ? (
            <div className="h-32 flex items-center justify-center text-sm text-red-500">{error}</div>
          ) : tableData.length === 0 ? (
             <div className="h-32 flex items-center justify-center text-sm text-gray-400">No patients found.</div>
          ) : (
            <DataTable columns={columns} data={tableData} />
          )}
        </div>

        <div className="flex items-center justify-between px-6 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Showing page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <ModalNewPatient 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()} 
      />
    </div>
  );
}
>>>>>>> Stashed changes

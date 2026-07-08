"use client";

import { useState, useEffect } from "react";
import { columns, PacienteTabela } from "./columns";
import { DataTable } from "@/components/ui/dataTable";
import { ModalNovoPaciente } from "./modalNovoPaciente";

// ... (Mantenha seus const DADOS_MOCK e ABAS aqui em cima como estavam)
const DADOS_MOCK: PacienteTabela[] = [
  { id: "1", ultimaAtt: "02/03/2026", sinam: "00000000000", nome: "Miguel Edson Ramos Lima", cpf: "000.000.000-00", unidade: "Posto de Saúde", bairro: "Alto da Brasília", tipoFicha: "Sífilis Adquirida", status: "em-tratamento" },
  { id: "2", ultimaAtt: "02/03/2026", sinam: "00000000000", nome: "Maria Oliveira Souza", cpf: "111.111.111-11", unidade: "Posto de Saúde", bairro: "Centro", tipoFicha: "Sífilis em Gestante", status: "gestante" },
  { id: "3", ultimaAtt: "01/03/2026", sinam: "00000000000", nome: "João Silva Santos", cpf: "222.222.222-22", unidade: "Hospital Municipal", bairro: "Sinfoniz", tipoFicha: "Sífilis Congênita", status: "abandono" },
];

const ABAS = [
  { id: "todas", label: "Todas", count: 30 },
  { id: "em-tratamento", label: "Em Tratamento", count: 15 },
  { id: "abandono", label: "Abandono", count: 6 },
  { id: "aguardando-exame", label: "Aguardando Exame", count: 4 },
  { id: "gestante", label: "Gestantes", count: 10 },
  { id: "dose-atrasada", label: "Dose Atrasada", count: 10 },
];

export default function PacientesPage() {
  const [activeTab, setActiveTab] = useState("todas");
  const [search, setSearch] = useState("");
  const [dadosTabela, setDadosTabela] = useState<PacienteTabela[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Novos Estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Simulação: quando tiver a API, ela vai retornar o total de páginas

  useEffect(() => {
    let isMounted = true;
    const fetchDados = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (isMounted) {
        const filtradoFake = DADOS_MOCK.filter((p) => {
          const passaAba = activeTab === "todas" || p.status === activeTab;
          const passaPesquisa = p.nome.toLowerCase().includes(search.toLowerCase()) || p.cpf.includes(search);
          return passaAba && passaPesquisa;
        });
        setDadosTabela(filtradoFake);
        setLoading(false);
      }
    };
    fetchDados();
    return () => { isMounted = false; };
  }, [activeTab, search, currentPage]); // Recarrega se mudar de página

  return (
    <div className="min-h-screen bg-background relative">
      <header className="bg-primary-dark text-white px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">VIGEP</h1>
          <p className="text-xs opacity-80">(Vigilância Epidemiológica)</p>
        </div>
      </header>

      <div className="bg-white px-8 py-2 border-b border-gray-200">
        <h2 className="text-page-title">Sistema de Monitoramento de Sífilis em Sobral</h2>
      </div>

      <main className="space-y-6 bg-white rounded-xl m-12 pb-6">
        <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
          {ABAS.map((aba) => {
            const isActive = activeTab === aba.id;
            return (
              <button
                key={aba.id}
                onClick={() => { setActiveTab(aba.id); setCurrentPage(1); }} // Volta pra pag 1 ao mudar de aba
                className={`cursor-pointer py-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${isActive ? "border-primary text-primary font-bold" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {aba.label} <span className="ml-1.5 text-xs opacity-70">({aba.count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex w-full items-center justify-center px-5 gap-4">

          {/* Barra de Pesquisa */}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-black text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
            
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 shrink-0 bg-white border border-primary rounded-full flex items-center justify-center text-primary transition-all shadow-sm cursor-pointer hover:bg-primary hover:text-white active:scale-95"
            aria-label="Adicionar Novo Paciente"
          >
            {/* Ícone de "+" em SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

        </div>

        <div className="shadow-sm border-t border-gray-200 p-4">
          {loading ? (
            <div className="h-32 flex items-center justify-center text-sm text-gray-400">Carregando dados dos pacientes...</div>
          ) : (
            <DataTable columns={columns} data={dadosTabela} />
          )}
        </div>

        {/* --- PAGINAÇÃO --- */}
        <div className="flex items-center justify-between px-6 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Mostrando página {currentPage} de {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      </main>

      {/* --- MODAL DE NOVO PACIENTE --- */}
      <ModalNovoPaciente 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
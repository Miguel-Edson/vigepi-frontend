"use client";

import { useState, useMemo } from "react";
import { getColumns } from "./columns"
import { PatientTable } from "@/modules/patients/types/patient"; 
import { DataTable } from "@/components/ui/dataTable";
import { ModalNewPatient } from "./ModalNewPatient"
import { usePatients } from "@/modules/patients/hooks/usePatients";
import { useRecords } from "@/modules/records/hooks/useRecords";
import { useTreatmentSummaries } from "@/modules/records/hooks/useTreatmentSummaries";
import { getListStatus, STATUS_EM_TRATAMENTO } from "@/modules/records/monitoring/listStatus";
import { getDppInfo } from "@/modules/records/monitoring/gestational";
import { Agravo } from "@/modules/records/types/record";
import { agravoToTipo, hasTreatments } from "@/modules/records/monitoring/config";
import { patientService } from "../../services/patientService";
import type { NovaFichaForm } from "@/modules/patients/schemas/patientSchema";
import { Gestante } from "@/modules/patients/types/patient";
import { latestTimestamp, pickTimestamp } from "@/utils/timestamps";

const ITEMS_PER_PAGE = 10; // Quantidade de itens por página

// 1. Array base (sem as contagens, elas serão dinâmicas agora)
const BASE_TABS = [
  { id: "todas", label: "Todas" },
  { id: "Dose Atrasada", label: "Dose Atrasada" },
  { id: "Tratamento Finalizado", label: "Tratamento Finalizado" },
  { id: "Descontinuado", label: "Descontinuado" },
  { id: "Aguardando Exame", label: "Aguardando Exame" }, 
  { id: "gestantes", label: "Gestantes" }, 
  { id: "sem-ficha", label: "Sem Ficha (Pendentes)" }, 
];

function matchesTab(patient: PatientTable, tabId: string): boolean {
  if (tabId === "todas") return true;
  if (tabId === "gestantes") return patient.gestante;
  return patient.status === tabId;
}

export function PatientListContainer() {
  const [activeTab, setActiveTab] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const columns = useMemo(() => getColumns({ showSensitive }), [showSensitive]);
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    patients, 
    isLoading: loadingPatients, 
    error: errorPatients, 
    refetch: refetchPatients 
  } = usePatients();

  const { 
    records, 
    isLoading: loadingRecords, 
    error: errorRecords 
  } = useRecords();

  const dosesByRecord = useTreatmentSummaries(records);

  const isLoading = loadingPatients || loadingRecords;
  const error = errorPatients || errorRecords;
  const refetch = refetchPatients;

  // 2. Cria a lista formatada principal
  const formattedPatients: PatientTable[] = useMemo(() => {
    if (!patients) return [];
    const safeRecords = records || [];

    return patients.map((patient) => {
      const belongsToPatient = (r: (typeof safeRecords)[number]) =>
        (r.patient && r.patient.id === patient.id) || (r as any).pacienteId === patient.id;

      const patientRecords = safeRecords.filter(belongsToPatient);
      const patientRecord = patientRecords[0];

      const ultimaAtt =
        latestTimestamp([
          pickTimestamp(patient, ["updatedAt", "updated_at"]),
          pickTimestamp(patient, ["createdAt", "created_at"]),
          ...patientRecords.flatMap((r) => [
            pickTimestamp(r, ["updatedAt", "updated_at"]),
            pickTimestamp(r, ["createdAt", "created_at"]),
            dosesByRecord[r.id]?.updatedAt,
          ]),
        ]) ?? "";

      const gestationalRecord = safeRecords.find(
        (r) => belongsToPatient(r) && r.agravo === Agravo.SIFILIS_GESTACIONAL
      );
      const dpp =
        patient.gestante === Gestante.SIM && gestationalRecord
          ? getDppInfo(gestationalRecord.statusGestacional, dosesByRecord[gestationalRecord.id]?.dpp)
          : undefined;

      if (patientRecord) {
        const tipo = agravoToTipo(patientRecord.agravo);
        const listStatus = getListStatus(
          patientRecord.status || "Dose Atrasada",
          tipo && hasTreatments(tipo) ? tipo : undefined,
          dosesByRecord[patientRecord.id]
        );

        return {
          id: patient.id,
          nome: patient.nome,
          cpf: patient.cpf,
          ultimaAtt,
          sinam: patientRecord.numSinan || "Sem Nº SINAN", 
          unidade: patientRecord.codeUnidadeSaude || "Não informada",
          bairro: patient.bairro || "Não informado", 
          tipoFicha: patientRecord.agravo || "N/A",
          status: listStatus.key,
          statusDetalhe: listStatus.detail,
          proximaDose: listStatus.nextDose,
          dpp,
          gestante: patient.gestante === Gestante.SIM
        };
      } else {
        return {
          id: patient.id,
          nome: patient.nome,
          cpf: patient.cpf,
          ultimaAtt,
          sinam: "Aguardando Ficha", 
          unidade: "Pendente",
          bairro: patient.bairro || "Não informado", 
          tipoFicha: "Nenhuma ficha criada",
          status: "sem-ficha",
          gestante: patient.gestante === Gestante.SIM
        };
      }
    });
  }, [patients, records, dosesByRecord]);

  // 3. Calcula dinamicamente as contagens
  const tabsWithCounts = useMemo(() => {
    return BASE_TABS.map(tab => {
      if (tab.id === "todas") {
        return { ...tab, count: formattedPatients.length };
      }
      return { 
        ...tab, 
        count: formattedPatients.filter(p => matchesTab(p, tab.id)).length 
      };
    });
  }, [formattedPatients]);

  // 4. Aplica os filtros de aba, barra de pesquisa e ordenação (Mais recentes no topo)
  const filteredPatients = useMemo(() => {
    const filtered = formattedPatients.filter((patient) => {
      const isInTab = matchesTab(patient, activeTab);
      const matchesSearch = 
        patient.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.cpf.includes(searchQuery);
      
      return isInTab && matchesSearch;
    });

    // Ordenação: Os criados/atualizados por último ficam no topo (decrescente por ultimaAtt)
    return [...filtered].sort((a, b) => {
      if (activeTab === STATUS_EM_TRATAMENTO || activeTab === "Dose Atrasada") {
        const far = "9999-12-31";
        const dateA = a.proximaDose?.date ?? far;
        const dateB = b.proximaDose?.date ?? far;
        if (dateA !== dateB) {
          return dateA.localeCompare(dateB);
        }
      }
      // Critério padrão: data mais recente (ultimaAtt maior) vem primeiro
      return (b.ultimaAtt || "").localeCompare(a.ultimaAtt || "");
    });
  }, [formattedPatients, activeTab, searchQuery]);

  // 5. Cálculo do Total de Páginas e Fatiamento dos Dados da Página Atual
  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPatients.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPatients, currentPage]);

  const handleCreatePatient = async (dadosNovos: NovaFichaForm) => {
    const { ibge, ...dadosValidos } = dadosNovos;

    const dadosTratados = {
      ...dadosValidos,
      cpf: dadosNovos.cpf?.replace(/\D/g, ''),
      cns: dadosNovos.cns?.replace(/\D/g, ''),
      cep: dadosNovos.cep?.replace(/\D/g, ''),
      telefone: dadosNovos.telefone?.replace(/\D/g, ''),
    };

    await patientService.create(dadosTratados);
    setIsModalOpen(false);
    await refetch();
    alert("Paciente criado com sucesso!");
  };

  return (
    <main className="space-y-6 bg-white rounded-xl m-12 pb-6 shadow-sm border border-gray-100">
      
      {/* Abas de Navegação com Contagens Dinâmicas */}
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
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Pesquisa e Botões */}
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
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full h-full text-black text-sm bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
        
        <button
          type="button"
          onClick={() => setShowSensitive((v) => !v)}
          aria-pressed={showSensitive}
          aria-label={showSensitive ? "Ocultar nome e CPF" : "Mostrar nome e CPF"}
          title={showSensitive ? "Ocultar nome e CPF" : "Mostrar nome e CPF"}
          className={`w-10 h-10 shrink-0 border rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer active:scale-95 ${
            showSensitive
              ? "bg-primary border-primary text-white hover:bg-primary-dark"
              : "bg-white border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
          }`}
        >
          {showSensitive ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          )}
        </button>

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

      {/* Renderização da Tabela com os dados paginados */}
      <div className="border-t border-gray-100 p-4 min-h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">Carregando dados...</div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-sm text-red-500">{error}</div>
        ) : paginatedData.length === 0 ? (
           <div className="h-full flex items-center justify-center text-sm text-gray-400">Nenhum paciente encontrado.</div>
        ) : (
          <DataTable columns={columns} data={paginatedData} />
        )}
      </div>

      {/* Paginação Dinâmica Real */}
      <div className="flex items-center justify-between px-6 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Mostrando página {currentPage} de {totalPages || 1} ({filteredPatients.length} registros)
        </span>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Anterior
          </button>
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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
        onSaveAction={handleCreatePatient}
      />
    </main>
  );
}
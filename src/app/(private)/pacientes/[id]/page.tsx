"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { patientService } from "@/modules/patients/services/patientService";
import { recordService } from "@/modules/records/services/recordService";
import { PatientAPI } from "@/modules/patients/types/patient";
import { RecordAPI } from "@/modules/records/types/record";

// Importações dos componentes usando o alias @ para ficar mais limpo
import { PatientHeader } from "@/modules/patients/components/profile/PatientHeader/PatientHeader";
import { PatientDetailsCard } from "@/modules/patients/components/profile/PatientDetailsCard/PatientDetailsCard";
import { PatientRecordsList } from "@/modules/patients/components/profile/PatientRecordsList/PatientRecordsList";
import { PatientComments } from "@/modules/patients/components/profile/PatientComments/PatientComments";

// Importa o Modal Inteligente
import { ModalNewPatient } from "@/modules/patients/components/list/ModalNewPatient";
import { NovaFichaForm } from "@/modules/patients/schemas/patientSchema";

export default function DetalhesPacientePage() {
  const params = useParams();
  const pacienteId = params.id as string;

  const [paciente, setPaciente] = useState<PatientAPI | null>(null);
  const [fichas, setFichas] = useState<RecordAPI[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar a abertura do modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Colocamos o fetch dentro do useCallback para podermos chamar várias vezes
  const carregarDados = useCallback(async () => {
    try {
      // Busca o paciente específico pelo ID
      const pacienteData = await patientService.getById(pacienteId);
      setPaciente(pacienteData);

      // Busca TODAS as fichas e filtra só as desse paciente
      const allRecords = await recordService.getAllRecords();
      const fichasDoPaciente = allRecords.filter(r => r.patient?.id === pacienteId);
      setFichas(fichasDoPaciente);
    } catch (error) {
      console.error("Erro ao carregar paciente:", error);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Função agora implementada! Ela será chamada após edições ou comentários
  // para atualizar a tela automaticamente.
  function refetchDadosDoPacienteOuFichas() {
    carregarDados();
  }

  // Função que o Modal vai disparar quando o ADM clicar em "Salvar Alterações"
// Função que o Modal vai disparar quando o ADM clicar em "Salvar Alterações"
  // Função que o Modal vai disparar quando o ADM clicar em "Salvar Alterações"
  const handleUpdatePatient = async (dadosEditados: NovaFichaForm) => {
    try {
      // 1. Separamos o "lixo" do frontend dos dados que realmente vão para a API
      const { 
        idade,
        unidadeIdade,
        ibge,
        cpf,
        cns,
        cep,
        telefone,
        ...dadosValidosParaAPI 
      } = dadosEditados;

      // Limpamos o CPF e CNS que vieram do formulário
      const cpfLimpo = cpf?.replace(/\D/g, '');
      const cnsLimpo = cns?.replace(/\D/g, '');

      // 2. Montamos o objeto base com os dados tratados
      const dadosTratados: any = {
        ...dadosValidosParaAPI, 
        cep: cep?.replace(/\D/g, ''),
        telefone: telefone?.replace(/\D/g, ''),
      };

      // 3. O TRUQUE DE MESTRE: Só enviamos CPF e CNS se forem diferentes dos originais!
      // Se o utilizador não os alterou, não enviamos, evitando o erro de "Já existe" do backend.
      if (cpfLimpo !== paciente?.cpf?.replace(/\D/g, '')) {
        dadosTratados.cpf = cpfLimpo;
      }

      if (cnsLimpo !== paciente?.cns?.replace(/\D/g, '')) {
        dadosTratados.cns = cnsLimpo;
      }

      // 4. ENVIO PARA A API
      await patientService.update(pacienteId, dadosTratados);
      
      // 5. SUCESSO: Fecha o modal e atualiza a tela
      setIsEditModalOpen(false);
      refetchDadosDoPacienteOuFichas(); 

    } catch (error: any) {
      console.error("Erro ao atualizar paciente:", error);
      alert(`Ocorreu um erro ao atualizar: ${error.message || "Campos inválidos."}`);
    }
  };

  if (loading) return <div className="p-8 flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!paciente) return <div className="p-8 text-center text-red-500">Paciente não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Chamando o componente do topo */}
        <PatientHeader 
          patientName={paciente?.nome || ""} 
          patientId={pacienteId}
          onEditClick={() => setIsEditModalOpen(true)} // Abre o Modal!
          onAddRecordClick={() => alert("Abrir opções de nova ficha")}
        />

        <PatientDetailsCard patient={paciente} />
        <PatientRecordsList records={fichas} />
        <PatientComments records={fichas} onObservationAdded={refetchDadosDoPacienteOuFichas} />
        
      </div>

      {/* O nosso Modal conectado (invisível até ser chamado) */}
      <ModalNewPatient 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        // O Partial permite passar o objeto paciente diretamente. O Hook Form pega só o que precisa.
        patientData={paciente as any} 
        onSaveAction={handleUpdatePatient}
      />

    </div>
  );
}
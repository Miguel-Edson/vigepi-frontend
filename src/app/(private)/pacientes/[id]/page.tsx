"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { patientService } from "@/modules/patients/services/patientService";
import { recordService } from "@/modules/records/services/recordService";
import { PatientAPI, Gestante } from "@/modules/patients/types/patient";
import { canHaveGestationalRecord, GESTATIONAL_ONLY_FEMALE_MESSAGE } from "@/modules/patients/rules";
import { RecordAPI, Agravo } from "@/modules/records/types/record";

// Importações dos componentes usando o alias @ para ficar mais limpo
import { PatientHeader } from "@/modules/patients/components/profile/PatientHeader/PatientHeader";
import { PatientDetailsCard } from "@/modules/patients/components/profile/PatientDetailsCard/PatientDetailsCard";
import { PatientRecordsList } from "@/modules/patients/components/profile/PatientRecordsList/PatientRecordsList";
import { PatientComments } from "@/modules/patients/components/profile/PatientComments/PatientComments";

// Importa o Modal Inteligente
import { ModalNewPatient } from "@/modules/patients/components/list/ModalNewPatient";
import { NovaFichaForm } from "@/modules/patients/schemas/patientSchema";

// Importações dos Modais
import { ModalRecordGestacional } from "@/modules/records/components/pregnant/ModalRecordGestacional/ModalRecordGestacional";
import { ModalRecordCongenita } from "@/modules/records/components/congenital/ModalRecordCongenita/ModalRecordCongenita";
import { ModalRecordAdquirida } from "@/modules/records/components/acquired/ModalRecordAdquirida/ModalRecordAdquirida";

export default function DetalhesPacientePage() {
  const params = useParams();
  const pacienteId = params.id as string;

  const [paciente, setPaciente] = useState<PatientAPI | null>(null);
  const [fichas, setFichas] = useState<RecordAPI[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar a abertura do modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGestacionalOpen, setIsGestacionalOpen] = useState(false);
  const [isCongenitaOpen, setIsCongenitaOpen] = useState(false);
  const [isAdquiridaOpen, setIsAdquiridaOpen] = useState(false);

  // Não captura erros de propósito: se a API falhar, o modal da ficha mostra a mensagem
  // dentro do formulário e mantém tudo que foi digitado.
  const handleCreateRecord = async (dadosDaFicha: any) => {
    // 0. Regra: ficha gestacional só para pacientes do sexo feminino
    //    (o backend também precisa validar; aqui só evitamos o envio e mostramos o motivo no modal)
    if (dadosDaFicha.agravo === Agravo.SIFILIS_GESTACIONAL && !canHaveGestationalRecord(paciente)) {
      throw new Error(GESTATIONAL_ONLY_FEMALE_MESSAGE);
    }

    // 1. Cria a ficha
    await recordService.create(dadosDaFicha);
    console.log("Ficha a ser enviada para a API:", dadosDaFicha);

    // 2. A ficha JÁ foi criada. Se marcar a paciente como gestante falhar, NÃO pode lançar erro,
    //    senão o modal continuaria aberto e o usuário enviaria de novo, duplicando a ficha.
    let avisoGestante = "";
    if (dadosDaFicha.agravo === Agravo.SIFILIS_GESTACIONAL) {
      try {
        // Marca a paciente como gestante: é este campo que alimenta a aba "Gestantes" da listagem
        await patientService.update(pacienteId, { gestante: Gestante.SIM });
      } catch (error) {
        console.error("Ficha criada, mas falhou ao marcar a paciente como gestante:", error);
        avisoGestante = "\n\nAtenção: não foi possível marcar a paciente como gestante. Edite o cadastro dela para corrigir.";
      }
    }

    // 3. Fechar os modais
    setIsGestacionalOpen(false);
    setIsCongenitaOpen(false);
    setIsAdquiridaOpen(false);

    // 4. Atualizar a lista de fichas do paciente na tela
    refetchDadosDoPacienteOuFichas();

    alert("Ficha criada com sucesso!" + avisoGestante);
  };

  // Colocamos o fetch dentro do useCallback para podermos chamar várias vezes
  const carregarDados = useCallback(async () => {
    try {
      // Busca o paciente específico pelo ID
      const pacienteData = await patientService.getById(pacienteId);
      setPaciente(pacienteData);

      // Busca só as fichas desse paciente (filtro feito no servidor)
      const fichasDoPaciente = await recordService.getRecordsByPatientId(pacienteId);
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
  // Não captura erros de propósito: se a API falhar, o ModalNewPatient mostra a mensagem
  // dentro do formulário e mantém tudo que foi digitado.
  const handleUpdatePatient = async (dadosEditados: NovaFichaForm) => {
    // 1. Separamos o "lixo" do frontend dos dados que realmente vão para a API
    const { 
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
  };

  if (loading) return <div className="p-8 flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!paciente) return <div className="p-8 text-center text-red-500">Paciente não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Chamando o componente do topo com a lógica do Dropdown */}
        <PatientHeader 
          patientName={paciente?.nome || ""} 
          patientId={pacienteId}
          onEditClick={() => setIsEditModalOpen(true)} 
          canAddGestational={canHaveGestationalRecord(paciente)}
          onAddRecordClick={(tipo) => {
            if (tipo === 'GESTACIONAL' && canHaveGestationalRecord(paciente)) setIsGestacionalOpen(true);
            if (tipo === 'CONGENITA') setIsCongenitaOpen(true);
            if (tipo === 'ADQUIRIDA') setIsAdquiridaOpen(true);
          }}
        />

        <PatientDetailsCard patient={paciente} />
        <PatientRecordsList records={fichas} />
        <PatientComments records={fichas} onObservationAdded={refetchDadosDoPacienteOuFichas} />
        
      </div>

      {/* Modal de Edição do Paciente */}
      <ModalNewPatient 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={paciente as any} 
        onSaveAction={handleUpdatePatient}
      />

      {/* NOVO: Modal da Ficha Gestacional */}
      <ModalRecordGestacional 
        isOpen={isGestacionalOpen}
        onClose={() => setIsGestacionalOpen(false)}
        patientId={pacienteId}
        onSaveAction={handleCreateRecord}
      />

      {/* Modal da Ficha Congênita */}
      <ModalRecordCongenita
        isOpen={isCongenitaOpen}
        onClose={() => setIsCongenitaOpen(false)}
        patientId={pacienteId}
        onSaveAction={handleCreateRecord}
      />

      {/* Modal da Ficha Adquirida */}
      <ModalRecordAdquirida
        isOpen={isAdquiridaOpen}
        onClose={() => setIsAdquiridaOpen(false)}
        patientId={pacienteId}
        onSaveAction={handleCreateRecord}
      />

    </div>
  );
}
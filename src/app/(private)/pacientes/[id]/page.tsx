"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { patientService } from "@/modules/patients/services/patientService";
import { recordService } from "@/modules/records/services/recordService";
import { PatientAPI } from "@/modules/patients/types/patient";
import { RecordAPI } from "@/modules/records/types/record";
import { PatientHeader } from "../../../../modules/patients/components/profile/PatientHeader/PatientHeader";
import { PatientDetailsCard } from "../../../../modules/patients/components/profile/PatientDetailsCard/PatientDetailsCard";
import { PatientRecordsList } from "@/modules/patients/components/profile/PatientRecordsList/PatientRecordsList";
import { PatientComments } from "../../../../modules/patients/components/profile/PatientComments/PatientComments";

export default function DetalhesPacientePage() {
  const params = useParams();
  const pacienteId = params.id as string;

  const [paciente, setPaciente] = useState<PatientAPI | null>(null);
  const [fichas, setFichas] = useState<RecordAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca o paciente específico pelo ID
        const pacienteData = await patientService.getById(pacienteId);
        setPaciente(pacienteData);

        // Busca TODAS as fichas e filtra só as desse paciente
        // (No futuro, sua API pode ter uma rota /record/patient/{id} para ficar mais rápido)
        const allRecords = await recordService.getAllRecords();
        const fichasDoPaciente = allRecords.filter(r => r.patient?.id === pacienteId);
        setFichas(fichasDoPaciente);
      } catch (error) {
        console.error("Erro ao carregar paciente:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [pacienteId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando prontuário...</div>;
  if (!paciente) return <div className="p-8 text-center text-red-500">Paciente não encontrado.</div>;

    function refetchDadosDoPacienteOuFichas(): void {
        throw new Error("Function not implemented.");
    }

 return (
  <div className="min-h-screen bg-gray-50 pb-12 p-6">
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      
      {/* Chamando o componente do topo */}
      <PatientHeader 
        patientName={paciente?.nome || ""} 
        patientId={pacienteId}
        onEditClick={() => alert("Abrir modal de edição")}
        onAddRecordClick={() => alert("Abrir opções de nova ficha")}
      />

        <PatientDetailsCard patient={paciente} />
        <PatientRecordsList records={fichas} />
        <PatientComments records={fichas} onObservationAdded={refetchDadosDoPacienteOuFichas} />
      {/* Próximo componente: PatientDetailsCard virá logo abaixo */}
      
    </div>
  </div>
);
}
"use client";

import { useParams } from "next/navigation";
import FichaGestante from "@/modules/records/components/pregnant/PregnantForm/PregnantForm";

export default function FichaGestantePage() {
  const params = useParams();
  const pacienteId = params.id as string;
  const recordId = params.recordId as string;

  return (
    <div className="min-h-screen bg-gray-50 relative pt-4 pb-12">
      {/* Agora sim estamos a passar os parâmetros exigidos pelo componente! */}
      <FichaGestante recordId={recordId} patientId={pacienteId} />
    </div>
  );
}
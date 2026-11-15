"use client";

import { useParams } from "next/navigation";
import { CongenitalForm } from "@/modules/records/components/congenital/CongenitalForm/CongenitalForm";

export default function FichaCongenitaPage() {
  const params = useParams();
  const pacienteId = params.id as string;
  const recordId = params.recordId as string;

  return (
    <div className="min-h-screen bg-gray-50 relative pt-4 pb-12">
      <CongenitalForm recordId={recordId} patientId={pacienteId} />
    </div>
  );
}

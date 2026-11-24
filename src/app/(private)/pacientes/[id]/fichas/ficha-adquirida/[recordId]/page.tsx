"use client";

import { useParams } from "next/navigation";
import { AcquiredForm } from "@/modules/records/components/acquired/AcquiredForm/AcquiredForm";

export default function FichaAdquiridaPage() {
  const params = useParams();
  const pacienteId = params.id as string;
  const recordId = params.recordId as string;

  return (
    <div className="min-h-screen bg-gray-50 relative pt-4 pb-12">
      <AcquiredForm recordId={recordId} patientId={pacienteId} />
    </div>
  );
}

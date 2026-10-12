// src/app/(private)/pacientes/page.tsx (ou onde quer que esteja sua page)
import FichaAdquirida from "../../../../../../modules/records/components/acquired/AcquiredForm/AcquiredForm";

export default function FichaAdquiridaPage() {
  return (
    <div className="min-h-screen bg-background relative pt-4">
      <FichaAdquirida />
    </div>
  );
}
// src/app/(private)/pacientes/page.tsx (ou onde quer que esteja sua page)
import FichaGestante from "../../../../../../modules/records/components/pregnant/PregnantForm/PregnantForm";

export default function FichaGestantePage() {
  return (
    <div className="min-h-screen bg-background relative pt-4">
      <FichaGestante />
    </div>
  );
}
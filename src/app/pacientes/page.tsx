// src/app/(private)/pacientes/page.tsx (ou onde quer que esteja sua page)
import { PatientListContainer } from "./components/PatientListContainer"; // Ajuste o caminho conforme onde você salvou

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-background relative pt-4">
      <PatientListContainer />
    </div>
  );
}
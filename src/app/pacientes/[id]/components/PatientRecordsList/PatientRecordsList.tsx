"use client";

import { RecordAPI } from "@/types/record";
import { RecordCard } from "./RecordCard/RecordCard";

interface PatientRecordsListProps {
  records: RecordAPI[];
}

export function PatientRecordsList({ records }: PatientRecordsListProps) {
  return (
    <div className="my-10 space-y-6">
      
      {/* Divisor Visual de Seção (Igual ao Figma) */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative bg-white px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
          Fichas do Paciente
        </div>
      </div>

      {records.length === 0 ? (
        <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm bg-white">
          Nenhuma ficha epidemiológica cadastrada para este paciente até o momento.
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record, index) => {
            // Regra visual: A primeira ficha do array (mais recente) tratamos como Ativa, as outras como Inativas
            const isActive = index === 0;

            return (
              <RecordCard 
                key={record.id} 
                record={record} 
                isActive={isActive}
                onViewDetails={() => alert(`Visualizar detalhes da ficha: ${record.id}`)}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
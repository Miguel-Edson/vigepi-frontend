"use client";

import { PatientAPI } from "@/types/patient";

interface PatientDetailsCardProps {
  patient: PatientAPI;
}

export function PatientDetailsCard({ patient }: PatientDetailsCardProps) {
  return (
    <div className="space-y-8 my-6">
      
      {/* --- SEÇÃO 1: NOTIFICAÇÃO INDIVIDUAL --- */}
      <div className="border border-primary rounded-xl p-5 relative bg-white">
        <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
          Notificação Individual
        </h3>
        
        <div className="grid grid-cols-12 gap-4 mt-2">
          
          {/* Linha 1 */}
          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Nome do paciente *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.nome || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Data de Nascimento *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.dataNascimento || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Cartão do SUS *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.cns || "-"}
            </div>
          </div>
          
          {/* Linha 2 */}
          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Idade *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.idade ?? "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Sexo *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.sexo || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Gestante</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.gestante || "Não"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Raça / Cor</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.raca || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">CPF *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.cpf || "-"}
            </div>
          </div>
          
          {/* Linha 3 */}
          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Nome da mãe *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.nomeDaMae || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Escolaridade *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.escolaridade || "-"}
            </div>
          </div>

        </div>
      </div>

      {/* --- SEÇÃO 2: DADOS DE RESIDÊNCIA --- */}
      <div className="border border-primary rounded-xl p-5 relative bg-white">
        <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
          Dados de Residência
        </h3>
        
        <div className="grid grid-cols-12 gap-4 mt-2">
          
          {/* Linha 1 */}
          <div className="col-span-12 md:col-span-1 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">UF *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.uf || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Município de Residência *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.municipio || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Código (IBGE) *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 text-gray-400">
              {patient.municipio === "Sobral" ? "2312908" : "--------"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Distrito *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.distrito || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Bairro *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.bairro || "-"}
            </div>
          </div>
          
          {/* Linha 2 */}
          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Logradouro *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.logradouro || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Código *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.codigo || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Número *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.numero || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Complemento *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.complemento || "-"}
            </div>
          </div>

          {/* Linha 3 */}
          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Ponto de Referência *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.pontoDeReferencia || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">CEP *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.cep || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Telefone *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.telefone || "-"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">Zona *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.zona || "-"}
            </div>
          </div>

          {/* Linha 4 */}
          <div className="col-span-12 space-y-1">
            <label className="text-xs text-gray-500 font-medium pl-1">País *</label>
            <div className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800">
              {patient.pais || "Brasil"}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
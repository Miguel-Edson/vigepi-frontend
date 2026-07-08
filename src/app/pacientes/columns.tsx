"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

// Molde dos Dados (Type)
export type PacienteTabela = {
  id: string;
  ultimaAtt: string;
  sinam: string;
  nome: string;
  cpf: string;
  unidade: string;
  bairro: string;
  tipoFicha: string;
  status: string; // Depois vamos transformar isso para lidar com as bolinhas coloridas
};

// Definição das Colunas

export const columns: ColumnDef<PacienteTabela>[] = [
  {
    accessorKey: "ultimaAtt",
    header: "Última atualização",
  },
  {
    accessorKey: "sinam",
    header: "Nº SINAM",
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "unidade",
    header: "Unidade Notificadora",
  },
  {
    accessorKey: "bairro",
    header: "Bairro",
  },
  {
    accessorKey: "tipoFicha",
    header: "Tipo de Ficha",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    // A coluna de ações geralmente não tem um 'accessorKey' atrelado a um dado específico do banco
   id: "acoes",
    header: "Ações",
    // Customizamos a renderização desta célula
    cell: ({ row }) => {
      const paciente = row.original; // Pega os dados da linha atual
      return (
        <Link 
          href={`/pacientes/${paciente.id}`} 
          className="text-primary hover:text-primary-dark transition-colors flex items-center justify-center"
          title="Editar Ficha"
        >
          {/* Ícone de Lápis (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </Link>
      );
    },
  },
];
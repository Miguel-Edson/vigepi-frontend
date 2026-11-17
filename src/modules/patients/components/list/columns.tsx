"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatDateTime } from "@/utils/formatters";

// Molde dos Dados (Type)
export type PacienteTabela = {
  id: string;
  ultimaAtt: string; // carimbo de tempo ISO (formatado na célula, assim a ordenação continua correta)
  sinam: string;
  nome: string;
  cpf: string;
  unidade: string;
  bairro: string;
  tipoFicha: string;
  status: string; // Depois vamos transformar isso para lidar com as bolinhas coloridas
  statusDetalhe?: string;
  dpp?: { text: string; title?: string; pending?: boolean };
};

// Valores mostrados no lugar do nome e do CPF quando o "olhinho" está fechado
const MASK_NOME = "••••••••••";
const MASK_CPF = "•••.•••.•••-••";

// Definição das Colunas
// `showSensitive` controla se nome e CPF aparecem ou ficam mascarados.
export function getColumns({ showSensitive }: { showSensitive: boolean }): ColumnDef<PacienteTabela>[] {
  return [
    {
      accessorKey: "ultimaAtt",
      header: "Última atualização",
      cell: ({ row }) => formatDateTime(row.original.ultimaAtt) || row.original.ultimaAtt || "-", // data fora do padrão: mostra como veio
    },
    {
      accessorKey: "sinam",
      header: "Nº SINAM",
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (showSensitive ? row.original.nome : MASK_NOME),
    },
    {
      accessorKey: "cpf",
      header: "CPF",
      cell: ({ row }) => (showSensitive ? row.original.cpf : MASK_CPF),
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
      cell: ({ row }) => {
        const { status, statusDetalhe, dpp } = row.original;
        return (
          <div>
            <span className="font-medium">{status === "sem-ficha" ? "Sem ficha" : status}</span>
            {statusDetalhe && <span className="block text-xs text-gray-500">{statusDetalhe}</span>}
            {dpp && (
              <span
                title={dpp.title}
                className={`block text-xs font-semibold ${dpp.pending ? "text-amber-600" : "text-pink-700"}`}
              >
                {dpp.text}
              </span>
            )}
          </div>
        );
      },
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
            {/* Ícone de Lupa (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
        );
      },
    },
  ];
}

// Versão com tudo visível (mantida para quem já importa `columns`)
export const columns = getColumns({ showSensitive: true });

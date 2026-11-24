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
  proximaDose?: { date: string; urgency: "late" | "urgent" | "normal"; when: string };
  dpp?: { text: string; title?: string; pending?: boolean };
};

// Alerta de proximidade da próxima dose (cor + símbolo, para não depender só da cor)
const DOSE_ALERT_STYLE = {
  late: { pill: "bg-red-600 text-white", text: "text-red-700 font-semibold", symbol: "⚠ " },
  urgent: { pill: "bg-red-100 text-red-700 ring-1 ring-red-300", text: "text-red-700 font-semibold", symbol: "⚠ " },
  normal: { pill: "bg-emerald-50 text-emerald-700", text: "text-gray-500", symbol: "" },
} as const;

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
      cell: ({ row }) => {
        const nome = row.original.nome;
        const textoExibido = showSensitive ? nome : MASK_NOME;
        return (
          <div 
            className="w-40 truncate" 
            title={showSensitive ? nome : undefined}
          >
            {textoExibido}
          </div>
        );
      },
    },
    {
      accessorKey: "cpf",
      header: "CPF",
      cell: ({ row }) => {
        const cpf = row.original.cpf;
        const textoExibido = showSensitive ? cpf : MASK_CPF;
        return (
          <div 
            className="w-24 truncate text-gray-600"
            title={showSensitive ? cpf : undefined}
          >
            {textoExibido}
          </div>
        );
      },
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
        const { status, statusDetalhe, dpp, proximaDose } = row.original;
        const alert = proximaDose ? DOSE_ALERT_STYLE[proximaDose.urgency] : undefined;
        return (
          <div>
            <span className="font-medium">{status === "sem-ficha" ? "Sem ficha" : status}</span>
            {statusDetalhe && (
              <span className={`block text-xs ${alert?.text ?? "text-gray-500"}`}>{statusDetalhe}</span>
            )}
            {proximaDose && alert && (
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${alert.pill}`}>
                {alert.symbol}
                {proximaDose.when}
              </span>
            )}
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

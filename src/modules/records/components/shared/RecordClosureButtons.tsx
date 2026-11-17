"use client";

import { useIsAdmin } from "@/modules/auth/hooks/useIsAdmin";
import type { RecordClosure } from "@/modules/records/hooks/useRecordClosure";
import { StatusFicha } from "@/modules/records/types/record";

/** "Marcar como concluída / abandonada" (ou "Reabrir ficha" se já estiver fechada). Só para ADM. */
export function RecordClosureButtons({ status, closure }: { status: string; closure: RecordClosure }) {
  const isAdmin = useIsAdmin();

  if (!isAdmin || status === StatusFicha.OBITO) return null;

  const isClosed = status === StatusFicha.TRATAMENTO_FINALIZADO || status === StatusFicha.DESCONTINUADO;
  const base = "px-4 py-2 text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <>
      {isClosed ? (
        <button type="button" disabled={closure.isBusy} onClick={closure.reopen} className={`${base} bg-gray-600 hover:bg-gray-700`}>
          Reabrir ficha
        </button>
      ) : (
        <>
          <button type="button" disabled={closure.isBusy} onClick={closure.conclude} className={`${base} bg-emerald-600 hover:bg-emerald-700`}>
            Marcar como concluída
          </button>
          <button type="button" disabled={closure.isBusy} onClick={closure.abandon} className={`${base} bg-amber-600 hover:bg-amber-700`}>
            Marcar como abandonada
          </button>
        </>
      )}
      {closure.error && (
        <p role="alert" className="basis-full text-sm font-medium text-red-600">
          {closure.error}
        </p>
      )}
    </>
  );
}

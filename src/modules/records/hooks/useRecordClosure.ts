import { useState } from "react";
import { recordService } from "@/modules/records/services/recordService";
import { StatusFicha, type RecordAPI } from "@/modules/records/types/record";

/**
 * Concluir / abandonar / reabrir a ficha. Tudo se resume a gravar o STATUS da ficha:
 *   concluída  -> "Tratamento Finalizado"  (aba Tratamento Finalizado)
 *   abandonada -> "Descontinuado"          (aba Descontinuado)
 *   reabrir    -> "Aguardando Exame"
 * A listagem de pacientes e o banner do acompanhamento já se guiam por esse status.
 * `onChanged` deve recarregar a ficha na tela.
 */
export function useRecordClosure(record: RecordAPI | null, onChanged: () => Promise<unknown> | void) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeStatus = async (status: StatusFicha, confirmMessage: string) => {
    if (!record || isBusy) return;
    if (!window.confirm(confirmMessage)) return;

    setIsBusy(true);
    setError(null);
    try {
      await recordService.update(record.id, { status });
      await onChanged();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Não foi possível alterar o status da ficha.");
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isBusy,
    error,
    conclude: () =>
      changeStatus(
        StatusFicha.TRATAMENTO_FINALIZADO,
        "Marcar o tratamento como CONCLUÍDO? A paciente passa para a aba “Tratamento Finalizado”."
      ),
    abandon: () =>
      changeStatus(
        StatusFicha.DESCONTINUADO,
        "Marcar o tratamento como ABANDONADO? A paciente passa para a aba “Descontinuado”."
      ),
    reopen: () =>
      changeStatus(StatusFicha.AGUARDANDO_EXAME, "Reabrir a ficha? Ela volta para “Aguardando Exame”."),
  };
}

export type RecordClosure = ReturnType<typeof useRecordClosure>;

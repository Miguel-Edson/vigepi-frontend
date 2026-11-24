"use client";

import { useEffect, useRef } from "react";

interface FormSubmitErrorProps {
  message: string | null;
}

/**
 * Mostra o erro devolvido pela API dentro do modal, mantendo o formulário preenchido.
 * Rola até a mensagem para ela não ficar escondida atrás do cabeçalho/rodapé fixos.
 */
export function FormSubmitError({ message }: FormSubmitErrorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={ref}
      role="alert"
      className="mx-6 mb-6 scroll-mb-28 whitespace-pre-line rounded-md border border-red-200 bg-red-100 p-3 text-sm font-medium text-red-700"
    >
      {message}
    </div>
  );
}

"use client";

import type { BaseSyntheticEvent, ReactNode } from "react";
import { FormSubmitError } from "@/components/form/FormSubmitError";

interface RecordModalShellProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => void | Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  onAutoFill?: () => void;
  children: ReactNode;
}

/** Moldura dos modais de nova ficha: cabeçalho, rodapé fixo, erro da API e botão de teste. */
export function RecordModalShell({
  title,
  subtitle,
  submitLabel,
  onClose,
  onSubmit,
  isSubmitting,
  submitError,
  onAutoFill,
  children,
}: RecordModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-primary font-medium">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none cursor-pointer">
            &times;
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-8 bg-gray-50">{children}</div>

        <FormSubmitError message={submitError} />

        {/* Rodapé */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white rounded-b-xl sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div>
            {onAutoFill && (
              <button
                type="button"
                onClick={onAutoFill}
                className="px-4 py-2 border border-dashed border-purple-400 text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors text-sm font-semibold cursor-pointer"
              >
                Auto-Preencher (Dev)
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 font-medium cursor-pointer">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Salvando..." : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

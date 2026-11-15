"use client";

import { Fragment } from "react";
import type { Control, FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { formatDate } from "@/utils/formatters";
import { getByPath } from "@/utils/objectPath";

// ----------------------------------------------------------------------------
// Descrição dos campos. A MESMA lista alimenta o modal de criação e a página da
// ficha (modo leitura/edição), então cada campo é declarado uma vez só.
// ----------------------------------------------------------------------------
export interface FieldOption {
  label: string;
  value: string;
}

export type FieldType = "text" | "date" | "number" | "select" | "checkbox";
export type FieldSpan = 2 | 3 | 4 | 5 | 6 | 8 | 12;

export interface FieldDef<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  type?: FieldType;
  options?: FieldOption[];
  span?: FieldSpan; // largura em colunas (de 12), a partir de telas médias
  placeholder?: string;
  heading?: string; // título exibido acima deste campo (ex.: grupo de checkboxes)
}

export interface SectionDef<T extends FieldValues = FieldValues> {
  title: string;
  fields: FieldDef<T>[];
}

// O Tailwind só gera classes escritas por extenso no código, então NÃO dá para montar
// `md:col-span-${n}` dinamicamente.
const SPAN_CLASS: Record<FieldSpan, string> = {
  2: "col-span-12 md:col-span-2",
  3: "col-span-12 md:col-span-3",
  4: "col-span-12 md:col-span-4",
  5: "col-span-12 md:col-span-5",
  6: "col-span-12 md:col-span-6",
  8: "col-span-12 md:col-span-8",
  12: "col-span-12",
};
const CHECKBOX_CLASS = "col-span-12 sm:col-span-6 md:col-span-3";

// Campo numérico em branco vira undefined (e não NaN), assim "opcional" e "obrigatório" funcionam no Zod
const toNumberOrUndefined = (v: unknown) => (v === "" || v === null || v === undefined ? undefined : Number(v));

function displayValue(field: FieldDef<any>, record: unknown): string {
  const raw = getByPath(record, field.name);
  if (raw === undefined || raw === null || raw === "") return "-";
  return field.type === "date" ? formatDate(String(raw)) : String(raw);
}

interface RecordSectionsProps<T extends FieldValues> {
  sections: SectionDef<T>[];
  isEditing: boolean;
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  /** Dados já salvos, mostrados no modo leitura. */
  record?: unknown;
}

export function RecordSections<T extends FieldValues>({
  sections,
  isEditing,
  register,
  control,
  errors,
  record,
}: RecordSectionsProps<T>) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.title} className="border border-primary rounded-xl p-5 relative bg-white">
          <h3 className="absolute -top-3 left-4 bg-white px-2 text-primary font-medium text-sm">
            {section.title}
          </h3>

          <div className="grid grid-cols-12 gap-4 mt-2">
            {section.fields.map((field) => {
              const type = field.type ?? "text";
              const error = (getByPath(errors, field.name) as { message?: string } | undefined)?.message;

              let item;

              if (type === "checkbox") {
                item = (
                  <label className={`${CHECKBOX_CLASS} flex items-center gap-2 text-sm text-gray-700`}>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        {...register(field.name)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={Boolean(getByPath(record, field.name))}
                        readOnly
                        disabled
                        className="w-4 h-4 rounded border-gray-300 text-primary"
                      />
                    )}
                    {field.label}
                  </label>
                );
              } else {
                item = (
                  <div className={`${SPAN_CLASS[field.span ?? 6]} space-y-1`}>
                    <label className="text-xs text-gray-500 font-medium pl-1">{field.label}</label>

                    {!isEditing ? (
                      <div className="w-full min-h-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-800 break-words">
                        {displayValue(field, record)}
                      </div>
                    ) : type === "select" ? (
                      <SelectField
                        name={field.name}
                        control={control}
                        options={field.options ?? []}
                        error={error}
                      />
                    ) : (
                      <InputField
                        type={type}
                        placeholder={field.placeholder}
                        error={error}
                        register={register(field.name, type === "number" ? { setValueAs: toNumberOrUndefined } : undefined)}
                      />
                    )}
                  </div>
                );
              }

              return (
                <Fragment key={field.name}>
                  {field.heading && (
                    <p className="col-span-12 mt-2 text-sm font-semibold text-gray-700">{field.heading}</p>
                  )}
                  {item}
                </Fragment>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

import { UseFormRegisterReturn } from "react-hook-form";

interface RadioFieldProps {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
  register: UseFormRegisterReturn;
  className?: string;
}

export function RadioField({ label, options, error, register, className }: RadioFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-form-label pl-1 block">{label}</label>
      <div className="flex items-center gap-4 h-10">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer text-sm text-black">
            <input
              type="radio"
              value={opt.value}
              {...register}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <span className="text-[10px] text-red-500 pl-1 block">{error}</span>}
    </div>
  );
}
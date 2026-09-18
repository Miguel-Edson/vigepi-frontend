// src/components/form/InputField.tsx
import { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  register: UseFormRegisterReturn;
  className?: string;
}

export function InputField({ label, placeholder, type = "text", error, disabled, register, className }: InputFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-form-label pl-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register}
        className={`w-full h-10 px-3 border rounded-md text-sm outline-none transition-all text-black
          ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}
          ${error ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"}`}
      />
      {error && <span className="text-[10px] text-red-500 pl-1 block">{error}</span>}
    </div>
  );
}
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
    <div className={`space-y-1 flex flex-col justify-center ${className}`}>
      <label className="text-form-label pl-1 block">{label}</label>
      
      {/* flex-wrap garante que, se não couber na tela, as opções desçam de linha sem quebrar o layout */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 min-h-[2.5rem] pt-0.5">
        
        {options.map((opt) => (
          <label 
            key={opt.value} 
            className="flex items-center gap-1.5 cursor-pointer text-[13px] text-gray-700 hover:text-black transition-colors group"
          >
            <div className="relative flex items-center justify-center">
              {/* O input real fica escondido (sr-only), mas ainda funciona para o formulário e acessibilidade */}
              <input
                type="radio"
                value={opt.value}
                {...register}
                className="peer sr-only" 
              />
              {/* Nosso círculo customizado: Menor (w-3.5) e usa a cor primary quando "checked" */}
              <div className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-white peer-checked:border-primary peer-checked:border-[4.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-primary ring-offset-1 transition-all"></div>
            </div>
            <span className="leading-none mt-px">{opt.label}</span>
          </label>
        ))}
        
      </div>
      
      {error && <span className="text-[10px] text-red-500 pl-1 block">{error}</span>}
    </div>
  );
}
import { useState, useRef, useEffect } from "react";

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  value: string; // Agora ele recebe o valor atual
  onChange: (value: string) => void; // E avisa o formulário quando mudar
  placeholder?: string;
  className?: string;
}

export function SelectField({ label, options, error, value, onChange, placeholder = "Selecionar...", className }: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Descobre qual é o texto da opção selecionada para mostrar na tela
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  // Lógica para fechar a caixinha se o usuário clicar fora dela
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`space-y-1 ${className}`} ref={dropdownRef}>
      <label className="text-form-label pl-1">{label}</label>
      
      <div className="relative">
        {/* O "Input" Falso (Botão que abre a caixa) */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full h-10 px-3 border rounded-md text-sm transition-all bg-white cursor-pointer select-none
            ${isOpen ? "border-primary ring-1 ring-primary" : "border-gray-300"}
            ${error ? "border-red-500 focus:ring-1 focus:ring-red-500" : ""}
          `}
        >
          {/* Se tiver valor mostra preto, se não, mostra o cinza do placeholder */}
          <span className={selectedLabel ? "text-black truncate" : "text-gray-400 truncate"}>
            {selectedLabel || placeholder}
          </span>
          
          {/* Setinha (Chevron) que vira de cabeça para baixo quando abre */}
          <svg className={`transition-transform duration-200 text-gray-400 ${isOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>

        {/* A Caixinha de Opções Customizada (Igual a sua referência) */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-[#F3F4F6] border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto py-2">
            {/* Opção vazia caso o usuário queira "limpar" o campo */}
            <div
              onClick={() => { onChange(""); setIsOpen(false); }}
              className="px-4 py-2 text-sm cursor-pointer text-gray-400 hover:bg-gray-200"
            >
              {placeholder}
            </div>
            
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false); // Fecha ao escolher
                }}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors
                  ${value === opt.value ? "bg-gray-200 font-medium text-black" : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"}
                `}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && <span className="text-[10px] text-red-500 pl-1 block">{error}</span>}
    </div>
  );
}
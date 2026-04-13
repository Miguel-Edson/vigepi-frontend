"use client"; // Obrigatório para o Hook Form e Zod funcionarem

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { normalizeCPF } from "@/utils/formatters";


//Esquema de validação com Zod
const loginSchema = z.object({
  cpf: z.string().min(14, "CPF incompleto"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  // 2. Inicializando o formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Função que será chamada ao clicar em "Acessar Plataforma"
  const onSubmit = (data: LoginForm) => {
    console.log("Dados do formulário válidos:", data);
  };

  return (
    <main className="flex min-h-screen bg-surface">

      <div className="relative hidden lg:block w-full">
        <Image
          src="/images/wallpaper.jpg" 
          alt="Profissional de saúde segurando a mão de um paciente"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay com a cor primária da VIGEPI e 60% de opacidade para dar o tom esverdeado */}
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
      </div>

      {/* --- COLUNA DIREITA: FORMULÁRIO --- */}
      <div className="flex flex-col items-center justify-center w-full px-8 lg:w-1/2">
        
        <div className="flex flex-col w-full max-w-sm gap-10">
          
          {/* Logo VIGEPI */}
          <div className="text-center">
            <h1 className="text-display tracking-tight text-primary-dark">VIGEPI</h1>
            <p className="text-sm font-medium text-primary -mt-1">
              (Vigilância Epidemiológica)
            </p>
          </div>

          {/* Textos de Boas Vindas */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-800">Seja Bem-Vindo(a)!</h2>
            <p className="text-sm text-gray-400">
              Insira suas credenciais para acessar a plataforma.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-1.5">
              <label htmlFor="cpf" className="text-form-label font-bold pl-2">C.P.F *</label>
              <input 
                id="cpf"
                type="text"
                maxLength={14}
                placeholder="000.000.000-00"
                {...register("cpf", {
                  onChange: (e) => {
                    e.target.value = normalizeCPF(e.target.value);
                  },
                })}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none transition-all placeholder:text-gray-300 text-gray-700 
                  ${errors.cpf ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"}`}
              />
              {/* Mensagem de erro */}
              {errors.cpf && <span className="text-xs text-red-500 pl-2">{errors.cpf.message}</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="senha" className="text-form-label font-bold pl-2">Senha *</label>
              <input 
                id="senha"
                type="password"
                placeholder="Inserir senha ..."
                {...register("senha")}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none transition-all placeholder:text-gray-300 text-gray-700 
                  ${errors.senha ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"}`}
              />
              {errors.senha && <span className="text-xs text-red-500 pl-2">{errors.senha.message}</span>}
            </div>

            <button 
              type="submit"
              className="w-full h-10 mt-2 text-sm font-medium text-white transition-colors rounded-md bg-primary-dark hover:bg-[#2c7a6c]"
            >
              Acessar Plataforma
            </button>
          </form>

          {/* Logos Rodapé */}
          <div className="flex items-center justify-between pt-8 opacity-90">
            <Image 
              src="/images/logo-pet.svg" 
              alt="PET-Saúde" 
              width={300} 
              height={300} 
              className="h-20 w-auto object-contain" 
            />
            <Image 
              src="/images/logo-ufc.png" 
              alt="UFC" 
              width={300} 
              height={300} 
              className="h-20 w-auto object-contain" 
            />
            <Image 
              src="/images/logo-prefeitura.png" 
              alt="Prefeitura de Sobral" 
              width={300} 
              height={300} 
              className="h-20 w-auto object-contain" 
            />
          </div>

        </div>
      </div>
    </main>
  );
}
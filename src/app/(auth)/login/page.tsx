"use client"; // Obrigatório para o Hook Form e Zod funcionarem

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { normalizeCPF } from "@/utils/formatters";

// Esquema de validação com Zod
const loginSchema = z.object({
  cpf: z.string().min(14, "CPF incompleto"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  
  // Estados para controle de feedback da API
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Inicializando o formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Função chamada ao enviar o formulário
  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setApiError(null);

    try {
      // Dica: A maioria das APIs espera o CPF limpo (apenas números). 
      // Se a sua API aceitar com pontuação, basta trocar `cleanCpf` por `data.cpf`
      const cleanCpf = data.cpf.replace(/\D/g, '');

      const response = await authService.login({
        cpf: cleanCpf,
        password: data.password,
      });

      // Salva o token retornado pela API
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }

      // Redireciona para a página principal (ajuste a rota se for diferente)
      router.push('/pacientes');
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      setApiError(
        error?.message || "Falha ao acessar a plataforma. Verifique suas credenciais."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-surface">

      {/* --- COLUNA ESQUERDA: IMAGEM --- */}
      <div className="relative hidden lg:block w-full">
        <Image
          src="/images/wallpaper.jpg" 
          alt="Profissional de saúde segurando a mão de um paciente"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay com a cor primária da VIGEPI */}
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
      </div>

      {/* --- COLUNA DIREITA: FORMULÁRIO --- */}
      <div className="flex flex-col items-center justify-center w-full px-8 lg:w-1/2">
        
        <div className="flex flex-col w-full max-w-sm gap-10">
          
          {/* Logo VIGEPI */}
          <div className="text-center mx-auto">
            <Image 
              src="/images/SIMOS_logo.svg" 
              alt="PET-Saúde" 
              width={300} 
              height={300} 
              className="h-20 w-auto object-contain" 
            />
          </div>

          {/* Textos de Boas Vindas */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-800">Seja Bem-Vindo(a).</h2>
            <p className="text-sm text-gray-400">
              Insira suas credenciais para acessar a plataforma.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Mensagem de Erro da API */}
            {apiError && (
              <div className="p-3 text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded-md text-center">
                {apiError}
              </div>
            )}

            {/* Campo CPF */}
            <div className="space-y-1.5">
              <label htmlFor="cpf" className="text-form-label font-bold pl-2">C.P.F *</label>
              <input 
                id="cpf"
                type="text"
                maxLength={14}
                placeholder="000.000.000-00"
                disabled={loading}
                {...register("cpf", {
                  onChange: (e) => {
                    e.target.value = normalizeCPF(e.target.value);
                  },
                })}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none transition-all placeholder:text-gray-300 text-gray-700 
                  ${errors.cpf ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"}
                  ${loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.cpf && <span className="text-xs text-red-500 pl-2">{errors.cpf.message}</span>}
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5">
              <label htmlFor="senha" className="text-form-label font-bold pl-2">Senha *</label>
              <input 
                id="senha"
                type="password"
                placeholder="Inserir senha"
                disabled={loading}
                {...register("password")}
                className={`w-full h-10 px-3 text-sm border rounded-md outline-none transition-all placeholder:text-gray-300 text-gray-700 
                  ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"}
                  ${loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.password && <span className="text-xs text-red-500 pl-2">{errors.password.message}</span>}
            </div>

            {/* Botão Submit */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 text-sm font-medium text-white transition-colors rounded-md bg-primary-dark hover:bg-[#2c7a6c] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Acessando...
                </>
              ) : (
                "Acessar Plataforma"
              )}
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
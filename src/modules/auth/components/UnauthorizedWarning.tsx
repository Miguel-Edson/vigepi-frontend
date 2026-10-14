import Link from "next/link";
import Image from "next/image";

export function UnauthorizedWarning() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      
      {/* 1. Imagem de Fundo (Mesma do Login) */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
      >
        <Image
            src="/images/error-wallpaper.jpg" 
            alt="Profissional de saúde segurando a mão de um paciente"
            fill
            className="object-cover"
            priority
        />
        {/* Overlay (uma camada escura por cima da imagem para o card branco destacar) */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* 2. Card Centralizado */}
      <div className="relative z-10 bg-white p-8 md:p-12 shadow-2xl w-2xl rounded-xl text-center mx-4">
        
        {/* Ícone de Alerta */}
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">Acesso Restrito</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Você não tem permissão ou sua sessão expirou. É necessário estar logado para visualizar os dados do SIMOS.
        </p>

        <Link 
  href="/login" 
  className="flex items-center justify-center w-full py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all active:scale-95 shadow-sm hover:shadow-md"
>
  Fazer Login
</Link>
      </div>
      
    </div>
  );
}
"use client";

import { usePathname } from "next/navigation";
import { publicPaths } from "@/config/routes"; 
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/modules/auth/services/authService";

export function Navbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Isto vai limpar o localStorage e forçar o redireccionamento para /login
    authService.logout();
  };

  // Se a URL atual estiver na lista de rotas públicas (ex: /login), esconde a Navbar
  if (publicPaths.includes(pathname)) {
    return null;
  }
  
  return (
    <header className=" text-white shadow-md">
      <div className="bg-primary mx-auto px-12 py-4 flex justify-between items-center">
        
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/pacientes" className="hover:underline opacity-90 hover:opacity-100">
            Menu Principal
          </Link>
        </nav>
        <Link href="/pacientes" className="text-xl font-bold tracking-wider flex items-center gap-2">
          <Image 
            src="/images/SIMOS_logo_branca.svg" 
            alt="PET-Saúde" 
            width={300} 
            height={300} 
            className="h-10 w-auto object-contain" 
          />
        </Link>

        {/* Botão de Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Sair do Sistema
      </button>
        
      </div>
      <div className="bg-white px-12">
        <h2 className="text-base text-primary">Sistema de Monitoramento de Sífilis em Sobral</h2>
      </div>
    </header>
  );
}
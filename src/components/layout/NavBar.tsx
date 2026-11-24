"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { publicPaths } from "@/config/routes"; 
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/modules/auth/services/authService";
import { SideMenu } from "./SideMenu";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Ao navegar para outra página, o menu fecha
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
          {/* Abre o menu lateral (Pacientes, Dashboard...) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="side-menu"
            className="flex items-center gap-2 rounded-lg px-2 py-1 opacity-90 hover:opacity-100 hover:bg-white/15 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Menu
          </button>
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
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white rounded-lg transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Logout
      </button>
        
      </div>
      <div className="bg-white px-12">
        <h2 className="text-base text-primary-dark font-bold">Sistema de Monitoramento de Sífilis em Sobral</h2>
      </div>

      <SideMenu isOpen={menuOpen} onClose={closeMenu} />
    </header>
  );
}

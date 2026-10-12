"use client";

import { useEffect, useState } from "react";
import { UnauthorizedWarning } from "@/modules/auth/components/UnauthorizedWarning";
import { Navbar } from "@/components/layout/NavBar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Checa se o token existe
    const token = localStorage.getItem("token"); // Ajuste o nome da chave se necessário

    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Estado de loading inicial para evitar flashs na tela
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver logado, exibe a tela bonita de erro que acabamos de criar
  if (isAuthenticated === false) {
    return <UnauthorizedWarning />;
  }

  // Se estiver logado, renderiza o sistema normalmente
  return (
    <div className="min-h-screen bg-gray-50">
      
      <Navbar/>
      <main>
        {children}
      </main>
    </div>
  );
}
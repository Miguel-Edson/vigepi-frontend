import { useEffect, useState } from "react";
import { authService } from "@/modules/auth/services/authService";

/**
 * Perfil administrador, lido do sessionStorage só depois da montagem (evita diferença entre
 * servidor e navegador). Serve para ESCONDER botões; a barreira real é o backend.
 */
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(authService.isAdmin());
  }, []);

  return isAdmin;
}

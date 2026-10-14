import { LoginDTO, LoginResponseAPI, UserAPI } from "../types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export const authService = {
  
  // 1. POST: Fazer Login
  async login(data: LoginDTO): Promise<LoginResponseAPI> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Se for 401, a senha ou CPF estão errados
      throw new Error("CPF ou senha inválidos.");
    }

    const result: LoginResponseAPI = await response.json();

    // Salva o token para as próximas requisições
    sessionStorage.setItem("token", result.token);
    
    // Salva os dados do usuário para sabermos se ele é ADM
    if (result.user) {
      sessionStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  },

  // 2. Método auxiliar para fazer Logout
  logout(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    // Redireciona para a página de login
    window.location.href = "/login";
  },

  // 3. Método auxiliar para pegar o usuário logado em qualquer componente
  getCurrentUser(): UserAPI | null {
    if (typeof window === "undefined") return null; // Evita erros no servidor (Next.js)
    
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as UserAPI;
    } catch {
      return null;
    }
  },

  // 4. Método rápido para saber se é administrador
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin === true;
  }
};
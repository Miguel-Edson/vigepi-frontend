export interface LoginCredentials {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    nome: string;
    email: string;
  };
}
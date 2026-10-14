export interface LoginDTO {
  cpf: string;
  password: string;
}

export interface UserAPI {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginResponseAPI {
  token: string;
  user?: UserAPI;
}
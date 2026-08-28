import { apiFetch } from '@/lib/api';
import { LoginCredentials, LoginResponse } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};
import { apiFetch } from '@/lib/api';
import { LoginCredentials, LoginResponse } from '@/modules/auth/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};
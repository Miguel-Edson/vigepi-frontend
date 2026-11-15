const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// O NestJS devolve `message` como string OU como array (erros do class-validator)
function extractMessage(data: { message?: string | string[] }, fallback: string): string {
  const msg = data?.message;
  if (Array.isArray(msg)) return msg.join('\n');
  return msg || fallback;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 1. Trocado para sessionStorage
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token'); 
      sessionStorage.removeItem('user');
      window.location.href = '/login';  
    }
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 403) {
      throw new ApiError(
        403,
        extractMessage(errorData, 'Você não tem permissão para realizar esta ação.')
      );
    }

    throw new ApiError(
      response.status,
      extractMessage(errorData, 'Erro ao conectar com o servidor')
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
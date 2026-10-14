const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    throw new Error(errorData.message || 'Erro ao conectar com o servidor');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
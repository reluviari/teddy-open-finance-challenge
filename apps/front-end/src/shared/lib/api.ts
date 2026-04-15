const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('teddy_auth');
      window.location.href = '/login?expired=true';
      throw new Error('Sessão expirada');
    }
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, { token }),

  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), token }),

  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body), token }),

  delete: <T>(path: string, token?: string) => request<T>(path, { method: 'DELETE', token }),
};

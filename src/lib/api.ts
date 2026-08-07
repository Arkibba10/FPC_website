const TOKEN_KEY = 'fpc_token';

// Deployed backend origin (e.g. https://fpc-backend.onrender.com). When unset,
// the app calls the same origin and relies on the Vite dev proxy for /api.
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined ?? '').replace(/\/+$/, '');

export const getApiUrl = (path: string): string => `${API_BASE}/api${path}`;

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers.Authorization = `Token ${token}`;

  let response: Response;
  try {
    response = await fetch(getApiUrl(path), { ...options, headers });
  } catch {
    throw new ApiError('Network error: backend unreachable.', 0);
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body === 'string') message = body;
      else if (body && typeof body.error === 'string') message = body.error;
    } catch {
      // keep default message
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
};

export const apiGet = <T>(path: string): Promise<T> => request<T>(path);

export const apiPost = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });

export const apiPut = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) });

export const apiDelete = <T>(path: string): Promise<T> =>
  request<T>(path, { method: 'DELETE' });

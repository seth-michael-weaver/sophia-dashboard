const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface TokenPair {
  access: string;
  refresh: string;
}

export function getTokens(): TokenPair | null {
  const access = localStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token');
  if (!access || !refresh) return null;
  return { access, refresh };
}

export function setTokens(tokens: TokenPair) {
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const tokens = getTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (tokens?.access) {
    headers['Authorization'] = `Bearer ${tokens.access}`;
  }

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // If 401, try refreshing the token
  if (res.status === 401 && tokens?.refresh) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers['Authorization'] = `Bearer ${newAccess}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || error.message || JSON.stringify(error));
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

// Auth endpoints
export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(error.detail || 'Invalid credentials');
  }
  const data = await res.json();
  setTokens({ access: data.access, refresh: data.refresh });
  return data.user;
}

export async function logout() {
  const tokens = getTokens();
  if (tokens?.refresh) {
    try {
      await apiFetch('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: tokens.refresh }),
      });
    } catch {
      // Ignore logout errors
    }
  }
  clearTokens();
}

export async function getProfile() {
  return apiFetch('/auth/profile/');
}

// Paginated response type
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

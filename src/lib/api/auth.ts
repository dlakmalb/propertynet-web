import { apiFetch } from './client';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LoginResponse = {
  user: AuthUser;
};

export async function login(email: string, password: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function me() {
  return apiFetch<{ user: AuthUser }>('/auth/me');
}

export async function logout() {
  return apiFetch<void>('/auth/logout', { method: 'POST' });
}

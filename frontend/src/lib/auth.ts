export const TOKEN_KEY = 'brandforge_token';
export const USER_KEY = 'brandforge_user';

export interface User {
  id: string;
  username: string;
  email: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch (e) {
    return null;
  }
}

export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

const API = 'http://localhost:3000'
const TOKEN_KEY = 'auth-jwt-token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function api(path: string, options: RequestInit = {}) {
  // en JWT no se usa credentials: el token va en Authorization header
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(API + path, { ...options, headers })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(Array.isArray(data?.message) ? data.message.join(', ') : (data?.message ?? res.statusText))
  return data
}
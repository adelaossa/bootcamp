const API = 'http://localhost:3000'

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(API + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    // clave en sesiones: el navegador debe enviar la cookie
    credentials: 'include',
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(Array.isArray(data?.message) ? data.message.join(', ') : (data?.message ?? res.statusText))
  return data
}
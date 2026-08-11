import { useState } from 'react'
import { api } from './api'

interface Usuario { id: number; email: string; role: string }

export default function App() {
  const [email, setEmail] = useState('ana@x.com')
  const [password, setPassword] = useState('1234')
  const [user, setUser] = useState<Usuario | null>(null)
  const [msg, setMsg] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null)
  const [perfil, setPerfil] = useState<unknown>(null)
  const [productos, setProductos] = useState<unknown>(null)

  async function login(e: React.FormEvent) {
    e.preventDefault()
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setUser(data.user)
      setMsg({ text: `logueado como ${data.user.email} (${data.user.role})`, kind: 'ok' })
      setPerfil(null)
      setProductos(null)
    } catch (err) {
      setUser(null)
      setMsg({ text: (err as Error).message, kind: 'err' })
    }
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' })
    setUser(null)
    setPerfil(null)
    setProductos(null)
    setMsg({ text: 'sesion cerrada', kind: 'ok' })
  }

  async function verPerfil() {
    try {
      const data = await api('/auth/perfil')
      setPerfil(data)
      setMsg(null)
    } catch (err) {
      setPerfil(null)
      setMsg({ text: (err as Error).message, kind: 'err' })
    }
  }

  async function listarProductos() {
    try {
      const data = await api('/productos')
      setProductos(data)
      setMsg(null)
    } catch (err) {
      setProductos(null)
      setMsg({ text: (err as Error).message, kind: 'err' })
    }
  }

  async function borrarProducto(id: number) {
    try {
      const data = await api(`/productos/${id}`, { method: 'DELETE' })
      setMsg({ text: data.message, kind: 'ok' })
      await listarProductos()
    } catch (err) {
      setMsg({ text: (err as Error).message, kind: 'err' })
    }
  }

  return (
    <div className="card">
      <h1>Auth por Sesión 🍪</h1>
      <p className="info">
        Estado en el servidor + cookie <code>HttpOnly</code>. Prueba: <code>ana@x.com</code> (admin) / <code>1234</code> y <code>bob@x.com</code> (user) / <code>1234</code>.
      </p>

      {!user ? (
        <form onSubmit={login}>
          <label>email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Entrar</button>
        </form>
      ) : (
        <div>
          <p>Logueado: <span className="ok">{user.email} ({user.role})</span></p>
          <button onClick={verPerfil}>GET /auth/perfil</button>
          <button onClick={listarProductos}>GET /productos</button>
          <button className="danger" onClick={() => borrarProducto(1)}>DELETE /productos/1 (admin)</button>
          <button className="danger" onClick={logout}>Logout</button>
        </div>
      )}

      {msg && <p className={msg.kind}>{msg.text}</p>}
      {Boolean(perfil) && <pre className="muted">{JSON.stringify(perfil, null, 2)}</pre>}
      {Boolean(productos) && <pre className="muted">{JSON.stringify(productos, null, 2)}</pre>}
    </div>
  )
}
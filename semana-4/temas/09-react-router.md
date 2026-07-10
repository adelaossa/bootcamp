# 9 — React Router

---

## ?Por que necesitas rutas?

Sin router, tu app React es una sola pagina. Todo vive en `App.tsx` y muestras/ocultas cosas con estado.

Con React Router, cada URL muestra componentes distintos, igual que en un sitio web tradicional, pero **sin recargar la pagina** (SPA).

---

## Instalacion

```bash
npm install react-router-dom
```

---

## Configuracion basica

```tsx
// main.tsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

```tsx
// App.tsx
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegacion */}
      <nav className="bg-white shadow p-4 flex gap-4">
        <Link to="/" className="text-blue-500 hover:underline">Inicio</Link>
        <Link to="/productos" className="text-blue-500 hover:underline">Productos</Link>
      </nav>

      {/* Contenido segun la ruta */}
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}
```

---

## Componentes principales

| Componente | Que hace |
|---|---|
| `<BrowserRouter>` | Envuelve toda la app, provee el contexto de navegacion |
| `<Routes>` | Contenedor de rutas |
| `<Route path="/" element={...} />` | Renderiza un componente cuando la URL coincide |
| `<Link to="/">` | Navega a una ruta (como `<a>` pero sin recargar) |
| `<NavLink to="/">` | Como `Link` pero con clase activa si coincide |
| `useParams()` | Obtiene parametros de la URL (`:id`) |
| `useNavigate()` | Navega programaticamente (redirects) |

---

## Parametros de ruta

```tsx
// Ruta definida con parametro
<Route path="/productos/:id" element={<ProductDetailPage />} />

// Componente que lee el parametro
import { useParams } from 'react-router-dom'

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [producto, setProducto] = useState<Producto | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:3000/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
  }, [id])

  if (!producto) return <p>Cargando...</p>

  return (
    <div>
      <Link to="/productos" className="text-blue-500">← Volver</Link>
      <h1 className="text-2xl font-bold mt-4">{producto.nombre}</h1>
      <p className="text-xl text-gray-600">${producto.precio}</p>
    </div>
  )
}
```

---

## Navegacion programatica

```tsx
import { useNavigate } from 'react-router-dom'

function ProductForm() {
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const response = await fetch("http://localhost:3000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    if (response.ok) {
      navigate("/productos")  // ← redirige sin recargar
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## NavLink: resaltar la ruta activa

```tsx
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex gap-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-blue-600 font-bold" : "text-gray-600"
        }
      >
        Inicio
      </NavLink>
      <NavLink
        to="/productos"
        className={({ isActive }) =>
          isActive ? "text-blue-600 font-bold" : "text-gray-600"
        }
      >
        Productos
      </NavLink>
    </nav>
  )
}
```

---

## Estructura tipica con rutas

```
src/
├── pages/
│   ├── HomePage.tsx          ← ruta "/"
│   ├── ProductsPage.tsx      ← ruta "/productos"
│   ├── ProductDetailPage.tsx ← ruta "/productos/:id"
│   └── NotFoundPage.tsx      ← ruta "*" (404)
├── components/
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   └── Navbar.tsx
├── App.tsx                   ← Routes
└── main.tsx                  ← BrowserRouter
```

---

## Ruta 404

```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/productos" element={<ProductsPage />} />
  <Route path="/productos/:id" element={<ProductDetailPage />} />
  <Route path="*" element={<NotFoundPage />} />  {/* ← captura todo lo demas */}
</Routes>
```

```tsx
function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500 mt-2">Pagina no encontrada</p>
      <Link to="/" className="text-blue-500 mt-4 inline-block">Volver al inicio</Link>
    </div>
  )
}
```

# 6 — useEffect: efectos secundarios

---

## ?Que es un efecto secundario?

Todo lo que no es renderizar UI es un efecto secundario:
- Llamar a una API (`fetch`)
- Guardar en `localStorage`
- Manipular el DOM directamente
- Suscribirse a eventos o WebSockets
- Timers (`setTimeout`, `setInterval`)

---

## Sintaxis basica

```tsx
useEffect(() => {
  // Codigo del efecto
  console.log("El componente se monto o actualizo")

  // Cleanup opcional
  return () => {
    console.log("El componente se desmonta o cambian dependencias")
  }
}, [dependencias])
```

El array de dependencias controla cuando se ejecuta:

| Dependencias | Cuando se ejecuta |
|---|---|
| `[]` (vacio) | Solo al montar (1 vez) |
| `[productoId]` | Al montar y cuando `productoId` cambia |
| Sin array | En cada render (raro, casi nunca) |

---

## Fetch de datos al montar

El caso mas comun:

```tsx
function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarProductos() {
      try {
        setCargando(true)
        const response = await fetch("http://localhost:3000/productos")

        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }

        const data = await response.json()
        setProductos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])  // ← solo al montar

  if (cargando) return <p>Cargando productos...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <ul>
      {productos.map(p => (
        <li key={p.id}>{p.nombre}</li>
      ))}
    </ul>
  )
}
```

---

## Fetch con dependencia

Cuando el fetch depende de un valor que cambia:

```tsx
function ProductDetail({ id }: { id: number }) {
  const [producto, setProducto] = useState<Producto | null>(null)

  useEffect(() => {
    async function cargar() {
      const response = await fetch(`http://localhost:3000/productos/${id}`)
      const data = await response.json()
      setProducto(data)
    }

    cargar()
  }, [id])  // ← se ejecuta cada vez que cambia el id

  if (!producto) return <p>Cargando...</p>

  return <h1>{producto.nombre}</h1>
}
```

---

## Cleanup: limpiar antes de desmontar

Si tu efecto crea algo que necesita limpiarse (timer, suscripcion):

```tsx
function Reloj() {
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date())
    }, 1000)

    // Cleanup: React llama esta funcion antes de desmontar
    // o antes de re-ejecutar el efecto si cambian dependencias
    return () => {
      clearInterval(timer)
    }
  }, [])

  return <p>{hora.toLocaleTimeString()}</p>
}
```

---

## El problema del fetch y el componente desmontado

Si el componente se desmonta antes de que el fetch termine, intentara actualizar el estado de un componente que ya no existe:

```tsx
// React 19 maneja esto automaticamente (no necesitas banderas).
// En React 18-, necesitas un flag:
useEffect(() => {
  let ignorar = false

  async function cargar() {
    const response = await fetch("http://localhost:3000/productos")
    const data = await response.json()

    if (!ignorar) {
      setProductos(data)
    }
  }

  cargar()

  return () => {
    ignorar = true
  }
}, [])
```

---

## Mas alla de fetch: otros efectos comunes

```tsx
// Guardar en localStorage
useEffect(() => {
  localStorage.setItem("carrito", JSON.stringify(carrito))
}, [carrito])

// Sincronizar el titulo de la pestana
useEffect(() => {
  document.title = `${producto?.nombre ?? "Cargando..."} | Mi Tienda`
}, [producto])

// Escuchar eventos del teclado
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") setModalAbierto(false)
  }

  window.addEventListener("keydown", handleKeyDown)

  return () => window.removeEventListener("keydown", handleKeyDown)
}, [])
```

---

## Reglas de useEffect

1. **No lo uses para todo**. Si puedes calcular algo durante el render, no uses un efecto.
2. **Siempre declara las dependencias**. ESLint te avisara si falta alguna.
3. **Cada efecto hace una sola cosa**. Prefiere multiples `useEffect` a uno gigante.
4. **No pongas `setState` sincrono en un efecto sin dependencias** → loop infinito.

```tsx
// ❌ Loop infinito: setProductos → re-render → useEffect → setProductos → ...
useEffect(() => {
  setProductos([...productos, nuevoProducto])
})  // sin dependencias = en cada render
```

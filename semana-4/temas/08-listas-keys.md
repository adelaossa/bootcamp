# 8 — Listas y keys

---

## Renderizar listas con `.map()`

```tsx
const productos = [
  { id: 1, nombre: "Laptop", precio: 999 },
  { id: 2, nombre: "Mouse", precio: 29 },
  { id: 3, nombre: "Teclado", precio: 89 }
]

function ProductList() {
  return (
    <ul>
      {productos.map(producto => (
        <li key={producto.id}>
          {producto.nombre} - ${producto.precio}
        </li>
      ))}
    </ul>
  )
}
```

---

## La prop `key`: por que es obligatoria

React usa `key` para identificar que elementos de la lista cambiaron, se agregaron o se eliminaron. Sin key, React no sabe cual es cual y puede:

- Renderizar incorrectamente (estado de un item pasa a otro)
- Re-renderizar mas elementos de los necesarios
- Tener bugs visuales con animaciones

```tsx
// ❌ Sin key: React adivina
{productos.map(p => <li>{p.nombre}</li>)}

// ? Con key estable
{productos.map(p => <li key={p.id}>{p.nombre}</li>)}
```

---

## Keys deben ser estables y unicas

| Key | Es correcto? | Por que |
|---|---|---|
| `key={p.id}` | ? Ideal | id unico y estable de BD |
| `key={p.email}` | ? Ok | Email es unico y no cambia |
| `key={index}` | ❌ Peligroso | Si la lista se reordena, filtra o modifica, los indices cambian |
| `key={Math.random()}` | ❌ Pesimo | Cambia en cada render, pierdes todo beneficio |

### ?Por que no usar el indice del array?

```tsx
// Estado inicial
[{ id: 1, nombre: "A" }, { id: 2, nombre: "B" }, { id: 3, nombre: "C" }]

// Eliminas el item 2 (indice 1)
// Con key={index}: React piensa que el item 2 cambio a ser "C",
// y que el item 3 desaparecio. Bug visual.
// Con key={id}: React sabe exactamente cual se elimino.
```

---

## Listas con componentes

```tsx
function ProductList({ productos }: { productos: Producto[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {productos.map(p => (
        <ProductCard
          key={p.id}        // ← key va en el componente, no en el div interno
          nombre={p.nombre}
          precio={p.precio}
        />
      ))}
    </div>
  )
}
```

> La key va en el **elemento que se repite** (el componente o tag mas externo del `.map()`).

---

## Listas vacias

Siempre maneja el caso de lista vacia:

```tsx
function ProductList({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return <p className="text-gray-500">No hay productos disponibles</p>
  }

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

## Listas con estado de carga y error

El patron completo que usaras siempre:

```tsx
function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar")
        return res.json()
      })
      .then(data => setProductos(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <p>Cargando productos...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (productos.length === 0) return <p>No hay productos</p>

  return (
    <div className="grid grid-cols-3 gap-4">
      {productos.map(p => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}
```

---

## Eliminar un elemento de la lista

```tsx
function ProductList({ productos, onDelete }: Props) {
  return (
    <ul>
      {productos.map(p => (
        <li key={p.id} className="flex justify-between items-center">
          <span>{p.nombre}</span>
          <button
            onClick={() => onDelete(p.id)}
            className="text-red-500"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  )
}

// En el padre:
async function handleDelete(id: number) {
  await fetch(`http://localhost:3000/productos/${id}`, { method: "DELETE" })

  // Actualizar estado local (sin recargar toda la lista)
  setProductos(prev => prev.filter(p => p.id !== id))
}
```

---

## Filtrar y ordenar listas

```tsx
function ProductList({ productos }: { productos: Producto[] }) {
  const [search, setSearch] = useState("")
  const [orden, setOrden] = useState<"asc" | "desc">("asc")

  // Filtrar y ordenar (derivado del estado, no necesita useEffect)
  const filtrados = productos
    .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => orden === "asc"
      ? a.precio - b.precio
      : b.precio - a.precio
    )

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar..."
      />
      <button onClick={() => setOrden(prev => prev === "asc" ? "desc" : "asc")}>
        Orden: {orden === "asc" ? "↑" : "↓"}
      </button>

      {filtrados.map(p => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}
```

> No uses `useEffect` para filtrar/ordenar. Calculalo directamente durante el render a partir del estado.

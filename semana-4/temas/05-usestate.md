# 5 — useState: estado local

---

## ?Que es el estado?

El estado son los datos que **cambian** durante la vida de un componente y que, al cambiar, hacen que React **re-renderice** la UI.

```tsx
function Contador() {
  const [count, setCount] = useState(0)
  //      ↑        ↑              ↑
  //    valor    funcion     valor inicial
  //    actual   para
  //            cambiarlo

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicks: {count}
    </button>
  )
}
```

Cada vez que llamas `setCount`, React:
1. Actualiza el valor de `count`
2. Re-renderiza el componente
3. El DOM se actualiza automaticamente

---

## useState con TypeScript

```tsx
// string
const [nombre, setNombre] = useState<string>("")

// number
const [edad, setEdad] = useState<number>(0)

// boolean
const [activo, setActivo] = useState<boolean>(true)

// array
const [productos, setProductos] = useState<Producto[]>([])

// objeto
const [form, setForm] = useState<FormData>({
  nombre: "",
  precio: 0
})

// union type (puede ser uno u otro)
const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando")

// nullable
const [producto, setProducto] = useState<Producto | null>(null)
```

---

## Actualizar estado inmutablemente

**Nunca modifiques el estado directamente.** Siempre crea uno nuevo:

```tsx
// ❌ Mutar (React no detecta el cambio)
productos.push(nuevo)
setProductos(productos)

// ? Inmutable (nuevo array)
setProductos([...productos, nuevo])

// O usando el callback cuando el nuevo estado depende del anterior
setProductos(prev => [...prev, nuevo])
```

### Con arrays

```tsx
// Agregar
setItems(prev => [...prev, nuevoItem])

// Eliminar
setItems(prev => prev.filter(item => item.id !== id))

// Actualizar
setItems(prev => prev.map(item =>
  item.id === id ? { ...item, nombre: "Nuevo" } : item
))

// Reemplazar
setItems(nuevosItems)
```

### Con objetos

```tsx
// Actualizar una propiedad
setForm(prev => ({ ...prev, nombre: "Nuevo nombre" }))

// Actualizar objeto anidado
setForm(prev => ({
  ...prev,
  direccion: { ...prev.direccion, ciudad: "Lima" }
}))
```

### Regla de oro del estado

> Si React no detecta el cambio, es porque estas mutando en vez de crear uno nuevo.

---

## El estado es asincrono

Las actualizaciones de estado se **acumulan** (batching). No leas el estado justo despues de actualizarlo:

```tsx
// ❌ count no ha cambiado aun
setCount(count + 1)
console.log(count)  // valor viejo

// ? Usa el callback si necesitas el valor anterior
setCount(prev => prev + 1)
```

---

## Estados comunes que usaras siempre

```tsx
function ProductsPage() {
  // Datos de la API
  const [productos, setProductos] = useState<Producto[]>([])

  // Estado de carga
  const [cargando, setCargando] = useState(true)

  // Estado de error
  const [error, setError] = useState<string | null>(null)

  // Formulario
  const [form, setForm] = useState({ nombre: "", precio: 0 })

  // Modal / toggle
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  return (
    <div>
      {cargando && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* ... */}
    </div>
  )
}
```

---

## Lifting state up (subir el estado)

Cuando dos componentes necesitan compartir estado, "subes" el estado al ancestro comun:

```tsx
// Padre: tiene el estado y lo pasa hacia abajo
function ProductsPage() {
  const [search, setSearch] = useState("")

  return (
    <div>
      <SearchBar search={search} onSearchChange={setSearch} />
      <ProductList search={search} />
    </div>
  )
}

// Hijo 1: recibe valor y callback
function SearchBar({ search, onSearchChange }: Props) {
  return (
    <input
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  )
}

// Hijo 2: recibe el valor filtrado
function ProductList({ search }: { search: string }) {
  // filtrar productos basado en search...
}
```

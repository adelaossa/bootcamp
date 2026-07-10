# 7 — Eventos y formularios

---

## Eventos en React

Los eventos en React usan camelCase y reciben una funcion (no un string):

```tsx
// Vanilla JS
<button onclick="handleClick()">Click</button>

// React
<button onClick={handleClick}>Click</button>
```

---

## Eventos comunes

```tsx
function EventExamples() {
  return (
    <div>
      {/* Click */}
      <button onClick={() => console.log("click")}>
        Click
      </button>

      {/* Input change */}
      <input
        type="text"
        onChange={(e) => console.log(e.target.value)}
      />

      {/* Form submit */}
      <form onSubmit={(e) => {
        e.preventDefault()
        console.log("Form enviado")
      }}>
        <button type="submit">Enviar</button>
      </form>

      {/* Key down */}
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") console.log("Enter presionado")
        }}
      />

      {/* Focus / Blur */}
      <input
        onFocus={() => console.log("focus")}
        onBlur={() => console.log("blur")}
      />
    </div>
  )
}
```

---

## Formularios controlados

En React, los inputs deben ser **controlados**: el valor del input viene del estado, y el `onChange` actualiza el estado.

```tsx
function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Iniciar sesion</button>
    </form>
  )
}
```

---

## Formulario con un solo objeto de estado

Para formularios con muchos campos:

```tsx
interface FormData {
  nombre: string
  precio: number
  stock: number
  categoria_id: number | null
}

function ProductForm() {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    precio: 0,
    stock: 0,
    categoria_id: null
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === "nombre" ? value : Number(value)
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Datos a enviar:", form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del producto"
      />
      <input
        name="precio"
        type="number"
        value={form.precio}
        onChange={handleChange}
        placeholder="Precio"
      />
      <select name="categoria_id" value={form.categoria_id ?? ""} onChange={handleChange}>
        <option value="">Sin categoria</option>
        <option value="1">Electronica</option>
        <option value="2">Hogar</option>
      </select>
      <button type="submit">Guardar</button>
    </form>
  )
}
```

---

## Validacion basica

```tsx
function ProductForm() {
  const [form, setForm] = useState({ nombre: "", precio: 0 })
  const [errores, setErrores] = useState<Record<string, string>>({})

  function validar(): boolean {
    const nuevosErrores: Record<string, string> = {}

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio"
    }

    if (form.precio <= 0) {
      nuevosErrores.precio = "El precio debe ser mayor a 0"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validar()) {
      console.log("Enviar:", form)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={form.nombre}
          onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))}
        />
        {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
      </div>

      <div>
        <input
          type="number"
          value={form.precio}
          onChange={(e) => setForm(prev => ({ ...prev, precio: Number(e.target.value) }))}
        />
        {errores.precio && <p className="text-red-500 text-sm">{errores.precio}</p>}
      </div>

      <button type="submit">Guardar</button>
    </form>
  )
}
```

---

## Conectar formulario con POST a la API

```tsx
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  if (!validar()) return

  try {
    const response = await fetch("http://localhost:3000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Error al crear")
    }

    const creado = await response.json()
    console.log("Producto creado:", creado)

    // Limpiar formulario
    setForm({ nombre: "", precio: 0, stock: 0, categoria_id: null })

    // Opcional: recargar lista de productos
    // recargarProductos()
  } catch (err) {
    alert(err instanceof Error ? err.message : "Error desconocido")
  }
}
```

---

## Patron comun: componente Form

```tsx
interface ProductFormProps {
  onSubmit: (data: FormData) => Promise<void>
  categorias: Categoria[]
  cargando?: boolean
  error?: string | null
}

function ProductForm({ onSubmit, categorias, cargando, error }: ProductFormProps) {
  // ... estado, validacion, etc.

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* campos */}
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={cargando}>
        {cargando ? "Guardando..." : "Guardar"}
      </button>
    </form>
  )
}
```

> El componente Form no hace fetch directamente. Recibe `onSubmit` como prop. El padre decide que hacer con los datos (crear, actualizar, etc.).

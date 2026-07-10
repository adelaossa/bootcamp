# 4 — JSX a fondo

---

## ?Que es JSX?

JSX parece HTML pero es **JavaScript**. Cada etiqueta JSX se compila a llamadas de funcion:

```tsx
// Lo que escribes
const elemento = <h1 className="titulo">Hola</h1>

// En que se compila (simplificado)
const elemento = React.createElement("h1", { className: "titulo" }, "Hola")
```

Por eso:
- `className` en vez de `class` (class es palabra reservada en JS)
- `htmlFor` en vez de `for`
- Los atributos usan camelCase: `onClick`, `onChange`, `maxLength`

---

## Expresiones con `{}`

Todo lo que esta entre llaves es JavaScript evaluado:

```tsx
const nombre = "Ana"
const edad = 25
const activo = true

<div>
  {/* Variables */}
  <p>Hola {nombre}</p>

  {/* Expresiones */}
  <p>En 5 anios tendras {edad + 5}</p>

  {/* Llamadas a funciones */}
  <p>{nombre.toUpperCase()}</p>

  {/* Template literals */}
  <p className={`text-${activo ? 'green' : 'red'}-500`}>
    {activo ? 'Activo' : 'Inactivo'}
  </p>
</div>
```

### Lo que NO puedes poner en `{}`

```tsx
// ❌ Statements (if, for, while)
<p>{if (activo) { return "Activo" }}</p>

// ❌ Objetos como children
<p>{{ nombre: "Ana" }}</p>

// ? Si: expresiones (ternario, &&, .map())
<p>{activo ? "Activo" : "Inactivo"}</p>
```

---

## Renderizado condicional

### Ternario

```tsx
function EstadoBadge({ activo }: { activo: boolean }) {
  return (
    <span className={activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
      {activo ? "Activo" : "Inactivo"}
    </span>
  )
}
```

### AND logico (`&&`)

```tsx
function ProductCard({ nombre, descuento }: Props) {
  return (
    <div>
      <h3>{nombre}</h3>
      {descuento && <span className="bg-red-500 text-white">-{descuento}%</span>}
    </div>
  )
}
```

> Cuidado con `0`: en JS `0 && <Algo />` renderiza `0`. Usa `descuento > 0 &&` o ternario.

### if/else con early return

```tsx
function ProductDetail({ producto }: { producto?: Producto }) {
  if (!producto) {
    return <p className="text-gray-500">Producto no encontrado</p>
  }

  return (
    <div>
      <h1>{producto.nombre}</h1>
      <p>${producto.precio}</p>
    </div>
  )
}
```

---

## Estilos en JSX

### className (recomendado con Tailwind)

```tsx
<button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
  Guardar
</button>
```

### Clases condicionales

```tsx
<button className={`py-2 px-4 rounded ${
  variant === 'primary'
    ? 'bg-blue-500 text-white'
    : 'bg-gray-200 text-gray-800'
}`}>
  Guardar
</button>
```

### Estilos en linea (raro, evitalo)

```tsx
<button style={{ backgroundColor: 'blue', color: 'white' }}>
  Guardar
</button>
```

---

## Eventos

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <button onClick={() => setCount(0)}>
        Reiniciar
      </button>
    </div>
  )
}
```

Nombres en camelCase: `onClick`, `onChange`, `onSubmit`, `onKeyDown`, `onFocus`, `onBlur`.

---

## Comentarios en JSX

```tsx
<div>
  {/* Comentario de una linea */}

  {/*
    Comentario
    multi-linea
  */}

  // ❌ Esto NO es un comentario JSX, se renderiza como texto
</div>
```

---

## Imagenes

```tsx
// Imagen en public/ (servida directamente)
<img src="/logo.png" alt="Logo" />

// Imagen importada (Vite la optimiza)
import logo from './assets/logo.png'
<img src={logo} alt="Logo" />
```

---

## Diferencias clave HTML vs JSX

| HTML | JSX | Razon |
|---|---|---|
| `<div class="card">` | `<div className="card">` | `class` es palabra reservada |
| `<label for="email">` | `<label htmlFor="email">` | `for` es palabra reservada |
| `<input readonly>` | `<input readOnly>` | camelCase |
| `<!-- comentario -->` | `{/* comentario */}` | JSX es JavaScript |
| `<br>` | `<br />` | JSX requiere cierre |
| `<img src="...">` | `<img src="..." />` | Autocerrables deben cerrarse |
| `style="color: red"` | `style={{ color: 'red' }}` | Objeto JS, camelCase |
| `onclick="handler()"` | `onClick={handler}` | camelCase, funcion, no string |

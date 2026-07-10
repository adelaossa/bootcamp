# 3 — Componentes y Props

---

## ?Que es un componente?

Un componente en React es una **funcion** que retorna JSX. Su nombre empieza con mayuscula.

```tsx
function Saludar() {
  return <h1>Hola Mundo</h1>
}

// Uso:
<Saludar />
```

### Reglas

- El nombre debe empezar con **mayuscula** (React usa esto para distinguir componentes de elementos HTML)
- Retorna **un solo elemento raiz** (o un Fragment `<>...</>`)
- Puede recibir **props** (parametros)
- Puede tener **estado** (con hooks)

---

## Props: pasar datos de padre a hijo

Las props son el equivalente a los parametros de una funcion. El padre le pasa datos al hijo:

```tsx
// Padre
function App() {
  return <Saludar nombre="Ana" edad={25} />
}

// Hijo
interface SaludarProps {
  nombre: string
  edad: number
}

function Saludar({ nombre, edad }: SaludarProps) {
  return <p>Hola {nombre}, tienes {edad} anios</p>
}
```

### Props tipadas con TypeScript

```tsx
interface ProductCardProps {
  nombre: string
  precio: number
  stock: number
  disponible?: boolean  // opcional
}

function ProductCard({ nombre, precio, stock, disponible = true }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{nombre}</h3>
      <p className="text-gray-600">${precio}</p>
      <p className="text-sm">Stock: {stock}</p>
      {!disponible && <span className="text-red-500">Agotado</span>}
    </div>
  )
}
```

---

## Composicion: componentes dentro de componentes

La verdadera potencia de React: construir UIs complejas combinando componentes simples.

```tsx
function ProductList() {
  const productos = [
    { id: 1, nombre: "Laptop", precio: 999 },
    { id: 2, nombre: "Mouse", precio: 29 },
    { id: 3, nombre: "Teclado", precio: 89 }
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {productos.map(p => (
        <ProductCard
          key={p.id}
          nombre={p.nombre}
          precio={p.precio}
        />
      ))}
    </div>
  )
}
```

---

## Children: contenido entre etiquetas

`children` es una prop especial que contiene lo que pongas entre la apertura y el cierre del componente:

```tsx
interface CardProps {
  children: React.ReactNode
  titulo?: string
}

function Card({ children, titulo }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {titulo && <h2 className="text-lg font-bold mb-4">{titulo}</h2>}
      {children}
    </div>
  )
}

// Uso:
<Card titulo="Producto del dia">
  <ProductCard nombre="Laptop" precio={999} />
  <p className="text-sm text-gray-500 mt-2">Envio gratis</p>
</Card>
```

---

## Fragmentos: `<>...</>`

Un componente debe retornar un solo elemento raiz. Si necesitas retornar varios:

```tsx
// ❌ Error: dos elementos raiz
function Items() {
  return (
    <li>Item 1</li>
    <li>Item 2</li>
  )
}

// ? Con Fragment
function Items() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  )
}
```

El Fragment (`<>...</>`) no genera ningun elemento en el DOM. Es invisible.

---

## Buenas practicas

### 1. Un componente, una responsabilidad

```tsx
// ❌ Componente que hace demasiado
function ProductPage() {
  // fetch, estado, validacion, renderizado... todo junto
}

// ? Separar en componentes con una sola responsabilidad
function ProductPage() {
  return (
    <div>
      <ProductSearch />
      <ProductList />
      <Pagination />
    </div>
  )
}
```

### 2. Props explicitas, no objetos completos

```tsx
// ❌ Pasas un objeto entero
<ProductCard producto={producto} />

// ? Pasas solo lo que el componente necesita
<ProductCard
  nombre={producto.nombre}
  precio={producto.precio}
  stock={producto.stock}
/>
```

### 3. Nombres descriptivos

```tsx
// ❌
function Btn1() { ... }
function Card2() { ... }

// ?
function AddToCartButton() { ... }
function ProductCard() { ... }
```

---

## Organizacion de archivos

```
src/
├── components/           ← componentes reutilizables
│   ├── Card.tsx
│   ├── Button.tsx
│   └── ProductCard.tsx
├── pages/               ← componentes de pagina (con React Router)
│   ├── HomePage.tsx
│   └── ProductsPage.tsx
├── types/               ← interfaces y tipos compartidos
│   └── index.ts
├── App.tsx              ← componente raiz con las rutas
├── main.tsx             ← punto de entrada
└── index.css            ← estilos globales
```

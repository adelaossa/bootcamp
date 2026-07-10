# 10 — Mini-proyecto 4: Frontend React + API NestJS

---

## Objetivo

Construir un frontend en React que consuma la API NestJS de productos y categorias de la semana 3. Trabajar en parejas usando Gitflow.

---

## Stack

| Capa | Tecnologia |
|---|---|
| Lenguaje | TypeScript |
| Build tool | Vite |
| UI | React 19 |
| Estilos | TailwindCSS |
| Ruteo | React Router v7 |
| API | La API NestJS de la semana 3 (`localhost:3000`) |
| Control de versiones | Git + GitHub |

---

## Paginas requeridas (3 rutas)

| Ruta | Pagina | Descripcion |
|---|---|---|
| `/` | `HomePage` | Bienvenida con resumen: total de productos y categorias (fetch de `/productos` y `/categorias` al montar) |
| `/productos` | `ProductsPage` | Lista de productos con formulario para crear y boton para eliminar |
| `/productos/:id` | `ProductDetailPage` | Detalle de un producto con sus datos completos y la categoria a la que pertenece |

---

## Componentes minimos

| Componente | Props | Responsabilidad |
|---|---|---|
| `Navbar` | — | Links a Inicio y Productos con `NavLink`, activo resaltado |
| `ProductCard` | `producto: Producto`, `onDelete?: (id: number) => void` | Muestra nombre, precio, stock, categoria. Boton eliminar opcional |
| `ProductForm` | `categorias: Categoria[]`, `onSubmit: (data) => Promise<void>`, `cargando?: boolean` | Formulario controlado con validacion para crear producto |
| `LoadingSpinner` | — | Indicador de carga reutilizable |
| `ErrorMessage` | `message: string` | Mensaje de error estilizado |
| `EmptyState` | `message: string` | Mensaje cuando una lista esta vacia |

---

## Requisitos tecnicos

- [ ] Proyecto creado con `npm create vite@latest` (template `react-ts`)
- [ ] TailwindCSS instalado y funcionando
- [ ] React Router configurado con las 3 rutas + 404
- [ ] **ProductsPage**:
  - `useEffect` al montar: fetch `GET /productos`
  - `useEffect` al montar: fetch `GET /categorias` (para el select del formulario)
  - Estados: `cargando`, `error`, `productos`, `categorias`
  - `ProductForm` para crear producto (POST)
  - `ProductCard` con boton eliminar (DELETE)
  - Al crear, se actualiza la lista inmediatamente (limpia formulario, no recarga toda la pagina)
  - Al eliminar, se remueve de la lista local
- [ ] **ProductDetailPage**:
  - `useParams` para obtener el `id`
  - `useEffect` con dependencia `id` para fetch `GET /productos/:id`
  - Estados: `cargando`, `error`, `producto`
  - Muestra todos los campos del producto + nombre de la categoria
- [ ] **HomePage**: fetch rapido para mostrar conteos
- [ ] `Navbar` con `NavLink` y clase activa
- [ ] `.env` con `VITE_API_URL=http://localhost:3000` (no hardcodear la URL en los fetch)
- [ ] `interfaces` en archivo `src/types/index.ts` (Producto, Categoria)
- [ ] `.gitignore` (node_modules, dist)
- [ ] `npm run dev` en `localhost:5173`

---

## Estructura esperada

```
mi-app-react/
├── src/
│   ├── main.tsx                ← BrowserRouter + Tailwind
│   ├── App.tsx                 ← Navbar + Routes
│   ├── index.css               ← @import "tailwindcss"
│   ├── types/
│   │   └── index.ts            ← interfaces Producto, Categoria, CreateProductoDto
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── NotFoundPage.tsx
│   └── components/
│       ├── Navbar.tsx
│       ├── ProductCard.tsx
│       ├── ProductForm.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       └── EmptyState.tsx
├── .env                        ← VITE_API_URL=http://localhost:3000
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Flujo de trabajo por parejas

1. **Estudiante A**: crea el repositorio y agrega a Estudiante B
2. Ambos clonan

3. **Estudiante A**: rama `feature/proyecto-base` → `npm create vite`, Tailwind, Router, `Navbar`, `types/index.ts`
4. **Estudiante B**: rama `feature/componentes-ui` → `ProductCard`, `LoadingSpinner`, `ErrorMessage`, `EmptyState`
5. Code review mutuo, mergean

6. **Estudiante A**: rama `feature/lista-productos` → `ProductsPage` con fetch, lista, eliminar
7. **Estudiante B**: rama `feature/formulario` → `ProductForm` con validacion, crear producto
8. Ambos PR, code review, merge

9. **Estudiante A**: rama `feature/detalle-producto` → `ProductDetailPage` con fetch por ID
10. **Estudiante B**: rama `feature/home-y-404` → `HomePage`, `NotFoundPage`, README.md, pulir estilos

> Si son 3 personas, el tercero toma `HomePage` + `NotFoundPage` + README como rama separada y ayuda con estilos.

---

## Variables de entorno

```env
# .env
VITE_API_URL=http://localhost:3000
```

Para usar en el codigo:

```tsx
const API_URL = import.meta.env.VITE_API_URL

fetch(`${API_URL}/productos`)
```

---

## Evaluacion

| Criterio | Peso |
|---|---|
| ProductsPage funcional (listar, crear, eliminar) | 35% |
| ProductDetailPage funcional | 15% |
| React Router con 3 rutas + 404 | 15% |
| Componentes reutilizables y bien tipados | 15% |
| Estados de carga, error y vacio manejados | 10% |
| Gitflow (PRs, code review, conventional commits) | 10% |

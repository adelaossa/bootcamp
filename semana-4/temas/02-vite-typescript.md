# 2 — Vite + TypeScript + TailwindCSS

---

## ?Que es Vite?

Vite es un **build tool** y **dev server** creado por el autor de Vue.js. Es el reemplazo moderno de Create React App (CRA, ya obsoleto).

```
npm create vite@latest    ← 1 comando, proyecto listo
vs
npx create-react-app      ← lento, Webpack pesado, legacy
```

Ventajas de Vite:
- Dev server inicia en **milisegundos** (vs 30-60s de CRA)
- HMR (Hot Module Replacement) instantaneo
- Usa ES modules nativos en desarrollo
- Build de produccion con Rollup (rapido y optimizado)

---

## Crear proyecto

```bash
npm create vite@latest mi-app-react -- --template react-ts
cd mi-app-react
npm install
npm run dev
```

Esto crea un proyecto con:
- React 19
- TypeScript
- Vite como build tool
- ESLint configurado

### Estructura generada

```
mi-app-react/
├── index.html              ← punto de entrada HTML
├── src/
│   ├── main.tsx            ← ReactDOM.createRoot, monta <App />
│   ├── App.tsx             ← componente raiz
│   ├── App.css
│   ├── index.css
│   └── vite-env.d.ts      ← tipos de Vite
├── public/
├── tsconfig.json
├── tsconfig.app.json
├── package.json
└── vite.config.ts
```

---

## Instalar TailwindCSS

```bash
npm install tailwindcss @tailwindcss/vite
```

Configurar en `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
})
```

Reemplazar `src/index.css`:

```css
@import "tailwindcss";
```

---

## El modelo de TailwindCSS

Tailwind es un framework CSS **utilitario**. En vez de escribir CSS personalizado para cada componente, usas clases atomicas predefinidas:

```jsx
// CSS tradicional
<div className="card">
  <h2 className="card-title">Producto</h2>
</div>

// TailwindCSS
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-bold text-gray-800">Producto</h2>
</div>
```

### Clases mas comunes

| Categoria | Clases |
|---|---|
| **Layout** | `flex`, `grid`, `block`, `inline`, `container`, `mx-auto` |
| **Espaciado** | `p-4`, `px-6`, `m-2`, `mt-4`, `gap-4` |
| **Colores** | `bg-white`, `text-gray-800`, `border-blue-500` |
| **Tipografia** | `text-xl`, `font-bold`, `text-center`, `truncate` |
| **Bordes** | `border`, `rounded-lg`, `shadow-md` |
| **Responsive** | `md:flex`, `lg:w-1/2`, `sm:text-sm` |
| **Hover/Focus** | `hover:bg-blue-600`, `focus:ring-2` |

### Ventajas de Tailwind

1. No inventas nombres de clases (`card-title`, `product-list-item-header`...)
2. El CSS que no usas se elimina en produccion (tree-shaking automatico)
3. Los valores estan limitados a una escala consistente (no hay `font-size: 17px`)
4. Responsive es trivial: `md:flex-col lg:flex-row`
5. Iteras mas rapido: no cambias de archivo para ajustar un estilo

---

## index.html en Vite

A diferencia de CRA, el `index.html` esta en la raiz (no en `public/`):

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi App React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

El div `#root` es donde React monta toda la aplicacion.

---

## main.tsx: el punto de entrada

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`createRoot` crea la raiz de React. `render` monta `<App />` en el DOM. `StrictMode` activa verificaciones adicionales en desarrollo.

---

## Scripts

| Comando | Descripcion |
|---|---|
| `npm run dev` | Dev server con HMR en `localhost:5173` |
| `npm run build` | Build de produccion en `dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm run lint` | Ejecuta ESLint |

---

## Vite vs NestJS: mismo TypeScript, diferente runtime

| | Vite (React) | NestJS |
|---|---|---|
| **Donde corre** | Navegador | Node.js |
| **TS compila a** | JS para el navegador (ES modules) | JS para Node.js (CommonJS) |
| **tsconfig** | `tsconfig.app.json` (DOM, ES2020) | `tsconfig.json` (Node, ES2021) |
| **Variables de entorno** | `import.meta.env.VITE_*` | `process.env.*` con `@nestjs/config` |
| **Comunicacion** | fetch a la API | Expone la API |

Una app Vite + React tipicamente se comunica con un backend NestJS corriendo en otro puerto via HTTP:

```
[Vite :5173] ── fetch ──> [NestJS :3000] ──> [PostgreSQL :5432]
```

# 2 — Configuracion de TypeScript (tsconfig.json)

---

## Crear un proyecto TypeScript

```bash
mkdir mi-proyecto-ts
cd mi-proyecto-ts
npm init -y
npm install -D typescript @types/node tsx
npx tsc --init
```

Esto genera un `tsconfig.json` con todas las opciones comentadas.

---

## tsconfig.json esencial

```json
{
  "compilerOptions": {
    // ─── Destino de compilacion ───
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    // ─── Carpetas ───
    "rootDir": "./src",
    "outDir": "./dist",

    // ─── Modo estricto ───
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,

    // ─── Compatibilidad ───
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,

    // ─── Opcional pero recomendado ───
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Opciones clave explicadas

| Opcion | Que hace | Recomendacion |
|---|---|---|
| `target` | Version de JS a la que compila | `ES2022` |
| `module` | Sistema de modulos de salida | `NodeNext` para Node.js |
| `rootDir` | Carpeta raiz del codigo fuente | `./src` |
| `outDir` | Carpeta donde va el JS compilado | `./dist` |
| `strict` | Activa TODAS las verificaciones estrictas | `true` (siempre) |
| `noUncheckedIndexedAccess` | Arrays/objetos indexados pueden ser undefined | `true` |
| `noImplicitReturns` | Obliga a que todas las ramas retornen algo | `true` |
| `esModuleInterop` | Mejor compatibilidad con modulos CommonJS | `true` |
| `skipLibCheck` | No verifica tipos de `.d.ts` de librerias | `true` (mas rapido) |
| `declaration` | Genera archivos `.d.ts` | `true` si es libreria |
| `sourceMap` | Genera source maps para debuggear | `true` |

---

## Modo estricto (strict: true)

Cuando `strict: true`, se activan automaticamente:

| Sub-opcion | Que verifica |
|---|---|
| `strictNullChecks` | `null` y `undefined` tienen sus propios tipos |
| `strictFunctionTypes` | Verificacion mas estricta de parametros de funcion |
| `strictBindCallApply` | Verifica argumentos de `bind`, `call`, `apply` |
| `strictPropertyInitialization` | Propiedades de clase deben inicializarse |
| `noImplicitAny` | Error si TS no puede inferir un tipo |
| `alwaysStrict` | Agrega `"use strict"` a la salida |

**Ejemplo de strictNullChecks:**

```typescript
// strictNullChecks: false (no estricto)
let nombre: string = null  // ? permitido (peligroso)

// strictNullChecks: true (estricto)
let nombre: string = null  // ❌ Error
let nombre: string | null = null  // ? Correcto, reconoces que puede ser null
```

---

## Ejecutar TypeScript

Tienes tres opciones:

```bash
# 1. Compilar y luego ejecutar
npx tsc
node dist/index.js

# 2. Compilar en modo watch (recompila al guardar)
npx tsc --watch

# 3. Ejecutar TS directamente sin compilar (con tsx)
npx tsx src/index.ts

# 4. Modo watch con tsx
npx tsx --watch src/index.ts
```

> Para desarrollo usa `tsx`. Para produccion, compila con `tsc` y ejecuta el JS.

---

## package.json con scripts

```json
{
  "name": "mi-proyecto-ts",
  "type": "module",
  "scripts": {
    "dev": "tsx --watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.7.0"
  }
}
```

| Script | Que hace |
|---|---|
| `npm run dev` | Ejecuta en modo desarrollo con recarga automatica |
| `npm run build` | Compila TS a JS en `dist/` |
| `npm start` | Ejecuta la version compilada |
| `npm run typecheck` | Verifica tipos sin emitir archivos (util en CI) |

---

## Estructura tipica del proyecto

```
mi-proyecto-ts/
├── src/
│   ├── index.ts        ← punto de entrada
│   ├── types.ts        ← interfaces y tipos compartidos
│   └── db.ts           ← conexion a BD, queries
├── dist/               ← JS compilado (generado, no se sube a git)
├── tsconfig.json
├── package.json
├── .gitignore
└── README.md
```

---

## .gitignore para proyectos TypeScript

```
node_modules/
dist/
.env
*.js.map
```

# 8 — TypeScript + PostgreSQL con `pg`

`pg` (node-postgres) es la libreria mas usada para conectar Node.js/TypeScript con PostgreSQL. A diferencia de TypeORM (que veremos en la semana 3), `pg` ejecuta **SQL crudo**. Esto te da control total y te obliga a entender que esta pasando.

---

## Instalacion

```bash
npm install pg
npm install -D @types/pg
```

---

## Conexion basica

```typescript
import { Pool } from "pg"

const pool = new Pool({
  user: "estudiante",
  password: "pass123",
  host: "localhost",
  port: 5432,
  database: "bootcamp"
})

// Probar conexion
const client = await pool.connect()
console.log("Conectado a PostgreSQL")
client.release()
```

---

## Pool vs Client

| | Pool | Client |
|---|---|---|
| Que es | Conjunto de conexiones reutilizables | Una sola conexion |
| Uso | Produccion (maneja multiples requests) | Scripts simples, pruebas |
| Manejo | `pool.query()`, libera automaticamente | `client.connect()`, `client.release()` manual |

> Usa **siempre Pool** en aplicaciones. Client solo para scripts puntuales.

---

## Ejecutar queries

```typescript
import { Pool } from "pg"

const pool = new Pool({
  user: "estudiante",
  password: "pass123",
  host: "localhost",
  port: 5432,
  database: "bootcamp"
})

interface Usuario {
  id: number
  nombre: string
  email: string
  edad: number
}

// SELECT
async function listarUsuarios(): Promise<Usuario[]> {
  const result = await pool.query("SELECT * FROM usuarios ORDER BY id")
  return result.rows
}

// SELECT con parametros (evita SQL injection)
async function buscarPorId(id: number): Promise<Usuario | null> {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE id = $1",
    [id]  // $1, $2, $3... reemplazan los ? de otras BD
  )

  return result.rows[0] ?? null
}

// INSERT
async function crearUsuario(nombre: string, email: string, edad: number): Promise<Usuario> {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, edad)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [nombre, email, edad]
  )

  return result.rows[0]
}

// UPDATE
async function actualizarUsuario(id: number, nombre: string, email: string): Promise<Usuario | null> {
  const result = await pool.query(
    `UPDATE usuarios
     SET nombre = $1, email = $2
     WHERE id = $3
     RETURNING *`,
    [nombre, email, id]
  )

  return result.rows[0] ?? null
}

// DELETE
async function eliminarUsuario(id: number): Promise<boolean> {
  const result = await pool.query(
    "DELETE FROM usuarios WHERE id = $1 RETURNING id",
    [id]
  )

  return result.rowCount > 0
}
```

---

## SQL Injection y como evitarlo

**NUNCA** concatenes strings del usuario directamente en la query:

```typescript
// ❌ PELIGROSO: SQL Injection
const nombre = req.body.nombre
await pool.query(`SELECT * FROM usuarios WHERE nombre = '${nombre}'`)
// Si nombre = "'; DROP TABLE usuarios; --" → desastre

// ? SEGURO: parametros con $1, $2, etc.
await pool.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre])
// pg escapa el valor automaticamente
```

---

## Variables de entorno (.env)

Nunca hardcodees credenciales en el codigo:

```bash
# .env
DB_USER=estudiante
DB_PASSWORD=pass123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bootcamp
```

```bash
npm install dotenv
```

```typescript
// db.ts
import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME
})

export default pool
```

---

## CRUD completo tipado

```typescript
// db.ts — conexion
import { Pool } from "pg"
import dotenv from "dotenv"
dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME
})

export default pool
```

```typescript
// productos.repository.ts — capa de acceso a datos
import pool from "./db.js"

export interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  categoria_id: number
}

export interface CrearProducto {
  nombre: string
  precio: number
  stock: number
  categoria_id: number
}

export async function findAll(): Promise<Producto[]> {
  const { rows } = await pool.query(
    "SELECT * FROM productos ORDER BY nombre"
  )
  return rows
}

export async function findById(id: number): Promise<Producto | null> {
  const { rows } = await pool.query(
    "SELECT * FROM productos WHERE id = $1",
    [id]
  )
  return rows[0] ?? null
}

export async function create(data: CrearProducto): Promise<Producto> {
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, precio, stock, categoria_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.nombre, data.precio, data.stock, data.categoria_id]
  )
  return rows[0]
}

export async function update(id: number, data: Partial<CrearProducto>): Promise<Producto | null> {
  // Construir SET dinamicamente
  const campos: string[] = []
  const valores: any[] = []
  let contador = 1

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      campos.push(`${key} = $${contador}`)
      valores.push(value)
      contador++
    }
  }

  if (campos.length === 0) return null

  valores.push(id)
  const { rows } = await pool.query(
    `UPDATE productos SET ${campos.join(", ")} WHERE id = $${contador} RETURNING *`,
    valores
  )
  return rows[0] ?? null
}

export async function remove(id: number): Promise<boolean> {
  const { rowCount } = await pool.query(
    "DELETE FROM productos WHERE id = $1",
    [id]
  )
  return rowCount > 0
}
```

---

## Estructura del proyecto

```
mi-proyecto/
├── src/
│   ├── index.ts                  ← punto de entrada (CLI)
│   ├── db.ts                     ← conexion a PostgreSQL
│   ├── productos.repository.ts   ← queries de productos
│   ├── productos.controller.ts   ← logica de negocio
│   └── tipos.ts                  ← interfaces compartidas
├── .env                          ← variables de entorno (no se sube)
├── .env.example                  ← ejemplo sin valores reales
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## Probar queries desde la terminal

```typescript
// test-db.ts
import pool from "./db.js"

async function probar() {
  const { rows } = await pool.query("SELECT NOW()")
  console.log("Hora del servidor:", rows[0].now)

  // Insertar
  const insert = await pool.query(
    "INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES ($1, $2, $3, $4) RETURNING *",
    ["Teclado mecanico", 89.99, 50, 1]
  )
  console.log("Insertado:", insert.rows[0])

  // Listar
  const todos = await pool.query("SELECT * FROM productos")
  console.log("Total productos:", todos.rowCount)

  await pool.end()  // cerrar pool
}

probar()
```

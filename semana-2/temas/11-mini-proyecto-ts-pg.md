# 9 — Mini-proyecto: CLI CRUD con TypeScript + PostgreSQL

---

## Objetivo

Construir una aplicacion de linea de comandos en TypeScript que se conecte a PostgreSQL y permita hacer CRUD de un recurso. Trabajar en parejas usando Gitflow.

---

## Stack

| Capa | Tecnologia |
|---|---|
| Lenguaje | TypeScript |
| Runtime | Node.js + tsx |
| Base de datos | PostgreSQL |
| Libreria | `pg` (node-postgres, SQL crudo) |
| Variables de entorno | dotenv |
| Control de versiones | Git + GitHub |

**Sin frameworks, sin Express, sin frontend.** Solo terminal y base de datos.

---

## Recursos que pueden elegir

| Opcion | Tablas | Relaciones |
|---|---|---|
| **Tareas** | `tareas` | Simple, sin relaciones |
| **Productos + Categorias** | `productos`, `categorias` | 1:N (producto pertenece a categoria) |
| **Libros + Prestamos + Socios** | `libros`, `socios`, `prestamos` | N:M via tabla intermedia |

> Pueden elegir otro recurso si lo prefieren (peliculas, recetas, mascotas, etc.)

---

## Requisitos minimos

### Base de datos

- [ ] Crear la BD en PostgreSQL
- [ ] Crear todas las tablas necesarias con sus PK, FK, constraints
- [ ] Poblar con datos de ejemplo (INSERT de semilla)

### Codigo TypeScript

- [ ] `db.ts`: conexion a PostgreSQL usando `Pool` y variables de entorno
- [ ] `tipos.ts`: interfaces para cada entidad
- [ ] Repositorio con funciones CRUD tipadas (findAll, findById, create, update, remove)
- [ ] Las queries usan parametros (`$1`, `$2`) — nunca concatenacion
- [ ] `index.ts`: CLI que recibe comandos por `process.argv`

### CLI

El programa debe aceptar comandos asi:

```bash
# Listar
npx tsx src/index.ts listar
npx tsx src/index.ts listar --categoria 3

# Buscar por ID
npx tsx src/index.ts buscar 5

# Crear
npx tsx src/index.ts crear --nombre "Teclado" --precio 89.99 --stock 50 --categoria 1

# Actualizar
npx tsx src/index.ts actualizar 5 --precio 79.99

# Eliminar
npx tsx src/index.ts eliminar 5
```

Pueden usar `process.argv` directamente o una libreria como `yargs` o `commander` para parsear argumentos.

### Variables de entorno

- [ ] `.env` con las credenciales (NO se sube a git)
- [ ] `.env.example` con las claves sin valores reales

---

## Flujo de trabajo por parejas

1. **Ambos**: diseñan el esquema de la BD juntos (diagrama ER)
2. **Estudiante A**: crea el repo en GitHub y agrega al Estudiante B
3. Ambos clonan
4. **Estudiante A**: rama `feature/db-setup` → `db.ts`, `.env.example`, script `schema.sql`
5. **Estudiante B**: rama `feature/tipos` → `tipos.ts` con todas las interfaces
6. Ambos abren PR, revisan, mergean

Luego se dividen los repositorios:

7. **Estudiante A**: rama `feature/repositorio-usuarios` (o lo que aplique)
8. **Estudiante B**: rama `feature/repositorio-productos`
9. **Estudiante A**: rama `feature/cli-comandos-lectura` (listar, buscar)
10. **Estudiante B**: rama `feature/cli-comandos-escritura` (crear, actualizar, eliminar)
11. **Ambos**: rama `feature/pulir` → validaciones, mensajes de error, README

---

## Estructura esperada

```
cli-crud/
├── src/
│   ├── index.ts              ← CLI (parsea comandos, orquesta)
│   ├── db.ts                 ← Pool de conexion
│   ├── tipos.ts              ← interfaces compartidas
│   └── repositorios/
│       ├── productos.repo.ts  ← queries SQL de productos
│       └── categorias.repo.ts ← queries SQL de categorias
├── sql/
│   ├── schema.sql            ← CREATE TABLEs
│   └── seed.sql              ← INSERTs de prueba
├── .env.example
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```

---

## .env.example

```
DB_USER=estudiante
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bootcamp
```

---

## .gitignore

```
node_modules/
dist/
.env
```

---

## README.md

Debe incluir:

- Descripcion del proyecto
- Diagrama ER del esquema
- Requisitos (PostgreSQL instalado)
- Instrucciones para crear la BD: `psql -U postgres -f sql/schema.sql`
- Instrucciones para instalar dependencias: `npm install`
- Copiar `.env.example` a `.env` y configurar credenciales
- Copiar `.env.example` a `.env` y configurar
- Ejemplos de uso del CLI
- Autores

---

## Entregables

- Repositorio en GitHub con conventional commits
- Al menos 6 PRs mergeados
- Codigo funcional: todos los comandos del CLI operan contra PostgreSQL real
- Archivo `sql/schema.sql` con la estructura de la BD
- `.env.example` con las variables necesarias
- README.md completo con instrucciones y diagrama ER

---

## Comandos utiles

```bash
# Ejecutar en desarrollo
npx tsx src/index.ts listar

# Ejecutar SQL desde archivo
psql -U estudiante -d bootcamp -f sql/schema.sql
psql -U estudiante -d bootcamp -f sql/seed.sql

# Verificar tipos sin ejecutar
npx tsc --noEmit
```

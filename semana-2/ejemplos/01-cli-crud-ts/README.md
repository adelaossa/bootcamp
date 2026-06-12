# CLI CRUD — TypeScript + PostgreSQL

Ejemplo de aplicacion CLI en TypeScript que se conecta a PostgreSQL con la libreria `pg` y hace CRUD de productos con categorias usando SQL crudo.

## Requisitos

- Node.js 18+
- Docker y Docker Compose (o PostgreSQL instalado localmente)

## Como ejecutar

### Con Docker (recomendado)

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar PostgreSQL con Docker
docker compose up -d

# 3. Ejecutar comandos (la primera vez crea tablas y datos automaticamente)

# Modo desarrollo (TS directo con tsx):
npm run dev -- listar
npm run dev -- listar --categoria 1
npm run dev -- crear --nombre "Audifonos" --precio 49.99 --stock 30 --categoria 1
npm run dev -- buscar 1

# Modo produccion (compilar y ejecutar JS):
npm run build
npm start -- listar
npm start -- buscar 1

# 4. Detener PostgreSQL
docker compose down
```

> La primera vez que ejecutas cualquier comando, el programa detecta que las tablas no existen y las crea junto con los datos de ejemplo. Los datos persisten en un volumen aunque detengas el contenedor. Si quieres reiniciar desde cero: `docker compose down -v`.

### Sin Docker

Si tienes PostgreSQL instalado localmente, las tablas y datos tambien se crean automaticamente en la primera ejecucion. Solo asegurate de tener una BD llamada `bootcamp` accesible con usuario `estudiante` y password `pass123` (o ajusta `db.ts`).

## Estructura

```
├── src/
│   ├── index.ts                    ← CLI (comandos, orquesta)
│   ├── init.ts                     ← inicializa BD si esta vacia
│   ├── db.ts                       ← conexion PostgreSQL
│   ├── tipos.ts                    ← interfaces TypeScript
│   └── repositorios/
│       ├── productos.repo.ts        ← queries SQL de productos
│       └── categorias.repo.ts       ← queries SQL de categorias
├── sql/
│   ├── schema.sql                  ← CREATE TABLEs
│   └── seed.sql                    ← datos de ejemplo
├── docker-compose.yml              ← PostgreSQL listo para usar
├── tsconfig.json
└── package.json
```

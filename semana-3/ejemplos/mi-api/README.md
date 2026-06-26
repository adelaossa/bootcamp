# Mi API — NestJS + TypeORM + PostgreSQL + Swagger

API REST de ejemplo con NestJS que gestiona productos y categorias.

## Requisitos

- Node.js 18+
- Docker y Docker Compose

## Como ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env desde la plantilla
cp .env_template .env

# 3. Levantar PostgreSQL con Docker
docker compose up -d

# 4. Iniciar en modo desarrollo
npm run start:dev
```

Abre http://localhost:3000/docs para ver Swagger.

> La base de datos se sincroniza automaticamente (`synchronize: true`). Al iniciar, TypeORM crea las tablas basandose en las entidades si no existen.

## Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run start:dev` | Modo desarrollo con recarga automatica |
| `npm run start:prod` | Modo produccion (requiere `npm run build` primero) |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm run test` | Tests unitarios |
| `npm run test:e2e` | Tests end-to-end |
| `npm run lint` | Ejecuta ESLint |

## Variables de entorno

Copia `.env_template` a `.env`. El archivo `.env` no se sube a Git.

| Variable | Descripcion | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de PostgreSQL | `nestuser` |
| `DB_PASSWORD` | Password de PostgreSQL | `nestpassword` |
| `DB_DATABASE` | Nombre de la BD | `nestdb` |

Los valores por defecto coinciden con el `docker-compose.yml`.

## Endpoints

### Productos

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/productos` | Listar todos los productos |
| `GET` | `/productos/:id` | Obtener un producto por ID |
| `POST` | `/productos` | Crear un producto |
| `PATCH` | `/productos/:id` | Actualizar un producto parcialmente |
| `DELETE` | `/productos/:id` | Eliminar un producto |

### Categorias

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/categorias` | Listar todas las categorias |
| `GET` | `/categorias/:id` | Obtener una categoria con sus productos |
| `POST` | `/categorias` | Crear una categoria |
| `PATCH` | `/categorias/:id` | Actualizar una categoria |
| `DELETE` | `/categorias/:id` | Eliminar una categoria |

## Estructura

```
├── src/
│   ├── main.ts                        ← bootstrap + ValidationPipe + Swagger
│   ├── app.module.ts                  ← ConfigModule + TypeOrmModule + modulos
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── productos/
│   │   ├── productos.module.ts
│   │   ├── productos.controller.ts
│   │   ├── productos.service.ts
│   │   ├── dto/
│   │   │   ├── create-producto.dto.ts
│   │   │   └── update-producto.dto.ts
│   │   └── entities/
│   │       └── producto.entity.ts
│   └── categorias/
│       ├── categorias.module.ts
│       ├── categorias.controller.ts
│       ├── categorias.service.ts
│       ├── dto/
│       │   ├── create-categoria.dto.ts
│       │   └── update-categoria.dto.ts
│       └── entities/
│           └── categoria.entity.ts
├── test/
├── docker-compose.yml
├── .env_template
├── .gitignore
├── nest-cli.json
├── tsconfig.json
└── package.json
```

# 10 — Mini-proyecto 3: API REST con NestJS

---

## Objetivo

Construir una API REST completa con NestJS + TypeORM + PostgreSQL para un recurso con relaciones. Trabajar en parejas usando Gitflow.

---

## Stack

| Capa | Tecnologia |
|---|---|
| Lenguaje | TypeScript |
| Framework | NestJS |
| ORM | TypeORM (con `synchronize: true`) |
| Base de datos | PostgreSQL |
| Validacion | class-validator + DTOs |
| Documentacion | Swagger |
| Control de versiones | Git + GitHub |

**Sin autenticacion. Sin migraciones. Sin tests.** Eso viene en la semana 4.

---

## Dominio: Productos + Categorias

Todos los equipos trabajan sobre el mismo dominio para poder comparar soluciones en la code review.

### Entidades

**Categoria**: `id`, `nombre` (unico), `descripcion` (opcional)

**Producto**: `id`, `nombre`, `precio` (positivo), `stock` (>= 0), `categoria` (relacion ManyToOne), `creado_en`

### Relacion

```
[Categoria] 1 ──── N [Producto]
```

---

## Endpoints requeridos

| Metodo | Ruta | Descripcion | Validacion |
|---|---|---|---|
| `GET` | `/productos` | Listar todos (incluye categoria) | — |
| `GET` | `/productos/:id` | Obtener uno con su categoria | 404 si no existe |
| `POST` | `/productos` | Crear producto | DTO con class-validator |
| `PATCH` | `/productos/:id` | Actualizar producto parcial | PartialType DTO |
| `DELETE` | `/productos/:id` | Eliminar producto | 404 si no existe |
| `GET` | `/categorias` | Listar categorias | — |
| `GET` | `/categorias/:id` | Obtener categoria con sus productos | 404 si no existe |
| `POST` | `/categorias` | Crear categoria | DTO con class-validator |

---

## Requisitos tecnicos

- [ ] Proyecto creado con NestJS CLI (`nest new`)
- [ ] TypeORM configurado con `synchronize: true`
- [ ] `docker-compose.yml` con PostgreSQL (mismas credenciales de siempre)
- [ ] `ValidationPipe` global con `whitelist: true` y `transform: true`
- [ ] DTOs con `class-validator` para crear/actualizar
- [ ] Filtro de excepcion global que devuelva respuestas consistentes
- [ ] Swagger configurado en `/api/docs`
- [ ] `seed.sql` con datos de ejemplo (al menos 4 categorias y 10 productos)
- [ ] Auto-inicializacion: al arrancar, si las tablas estan vacias, ejecutar el seed (via `entityManager.query()`)
- [ ] `.gitignore` (node_modules, dist)
- [ ] `npm run start:dev` / `npm run build` / `npm run start:prod`

---

## Estructura esperada

```
proyecto-api-nestjs/
├── src/
│   ├── main.ts                     ← bootstrap + Swagger + ValidationPipe + filtro global
│   ├── app.module.ts               ← TypeOrmModule.forRoot + imports de modulos
│   ├── productos/
│   │   ├── productos.module.ts
│   │   ├── productos.controller.ts
│   │   ├── productos.service.ts
│   │   ├── dto/
│   │   │   ├── crear-producto.dto.ts
│   │   │   └── actualizar-producto.dto.ts
│   │   └── entities/
│   │       └── producto.entity.ts
│   ├── categorias/
│   │   ├── categorias.module.ts
│   │   ├── categorias.controller.ts
│   │   ├── categorias.service.ts
│   │   ├── dto/
│   │   │   └── crear-categoria.dto.ts
│   │   └── entities/
│   │       └── categoria.entity.ts
│   └── common/
│       └── filtros/
│           └── http-exception.filter.ts
├── sql/
│   └── seed.sql                   ← INSERTs de ejemplo
├── docker-compose.yml
├── .gitignore
├── package.json
└── README.md
```

---

## Flujo de trabajo por parejas

1. **Estudiante A**: crea el repositorio en GitHub y agrega al Estudiante B
2. Ambos clonan

3. **Estudiante A**: rama `feature/proyecto-base` → `nest new`, `app.module.ts` con TypeORM, `docker-compose.yml`, `main.ts` con Swagger + ValidationPipe + filtro
4. **Estudiante B**: rama `feature/entidades` → `producto.entity.ts`, `categoria.entity.ts`, `schema.sql`
5. Code review mutuo, mergean

6. **Estudiante A**: rama `feature/productos-crud` → `productos.module.ts`, `productos.controller.ts`, `productos.service.ts`, DTOs
7. **Estudiante B**: rama `feature/categorias-crud` → `categorias.module.ts`, `categorias.controller.ts`, `categorias.service.ts`, DTOs
8. Ambos PR, code review, merge

9. **Estudiante A**: rama `feature/seed-y-docs` → `seed.sql`, seed runner, puntas Swagger
10. **Estudiante B**: rama `feature/readme-y-pulido` → README.md, validaciones extra, manejo de errores

---

## Evaluacion

| Criterio | Peso |
|---|---|
| CRUD de productos funcional | 25% |
| CRUD de categorias funcional | 15% |
| TypeORM bien configurado (relaciones, sincronizar) | 15% |
| DTOs con validacion | 15% |
| Swagger documentando la API | 10% |
| Filtro de excepcion global | 10% |
| Gitflow (PRs, code review, conventional commits) | 10% |

---

## Comandos utiles

```bash
# Crear proyecto
nest new proyecto-api

# Generar recursos
nest generate resource productos
nest generate resource categorias

# Desarrollo
npm run start:dev

# Docker
docker compose up -d
docker compose down
docker compose down -v   # reiniciar BD desde cero
```

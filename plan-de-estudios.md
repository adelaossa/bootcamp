# Bootcamp Full-Stack Web — Plan de Estudios

**Duración**: 10 semanas  
**Stack**: NestJS · PostgreSQL · React · Angular  
**Prerequisitos**: Estructuras de datos y POO en C, Java o Python  
**Modalidad**: Mini-proyectos semanales + proyecto final en equipos  

---

## Semana 1 — Git, la Web y JavaScript

### Conceptos (sin frameworks)

- Cómo funciona internet: HTTP, DNS, cliente-servidor, request/response
- Diferencias entre frontend y backend
- REST: qué es, recursos, verbos HTTP, códigos de estado
- JSON como formato de intercambio

### Herramientas

- Git: clone, add, commit, branch, merge, pull, push, rebase
- GitHub: issues, pull requests, code review, GitHub Projects
- VS Code y extensiones clave (Prettier, ESLint, GitLens, Thunder Client)

### Lenguaje

- JavaScript moderno (ES6+):
  - `let` / `const`, arrow functions, template literals
  - Destructuring, spread/rest operators
  - Promesas, async/await, try/catch
  - fetch API
  - Módulos (import/export)
- Node.js runtime, npm, package.json, nvm

### Backend basico

- Express: rutas, req/res, `express.json()`, `express.static()`, CORS
- CRUD con array en memoria (sin base de datos)

### Frontend basico

- HTML, CSS y JavaScript vanilla
- Consumir API con `fetch` desde el navegador
- Manipulacion del DOM

✅ **Mini-proyecto 1**: CRUD de Tareas con Express + HTML vanilla (datos en memoria, Gitflow en parejas)

| Recurso | Enlace |
|---|---|
| Learn Git Branching | https://learngitbranching.js.org |
| MDN JavaScript Guide | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide |
| Express Docs | https://expressjs.com |

---

## Semana 2 — TypeScript + Bases de Datos

### TypeScript

- Tipos básicos, interfaces vs types, enums, union/intersection types
- Genéricos, utility types
- tsconfig.json, strict mode, estructura de proyecto TS

### Evolucion de la persistencia de datos

- Archivos planos vs bases de datos
- Modelo cliente-servidor
- Caracteristicas de las BD: persistencia, concurrencia, integridad, ACID
- Tipos de BD: relacionales vs NoSQL

### PostgreSQL

- Instalación, pgAdmin / DBeaver / psql
- DDL: CREATE TABLE, constraints (PK, FK, UNIQUE, CHECK), índices
- DML: INSERT, UPDATE, DELETE
- SELECT, WHERE, JOINs (INNER, LEFT, RIGHT), GROUP BY, HAVING
- Subconsultas y CTEs básicos
- Diseño de esquemas, normalización (1FN, 2FN, 3FN)

### TypeScript + PostgreSQL

- Libreria `pg` (node-postgres) para ejecutar SQL crudo
- Parametros (`$1`, `$2`) para prevenir SQL injection
- Variables de entorno con dotenv

✅ **Mini-proyecto 2**: CLI CRUD en TypeScript conectado a PostgreSQL (sin frameworks, SQL crudo)

| Recurso | Enlace |
|---|---|
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook |
| PostgreSQL Tutorial | https://www.postgresqltutorial.com |
| node-postgres (pg) | https://node-postgres.com |

---

## Semana 3 — Backend NestJS: Fundamentos

### NestJS Core

- Estructura del proyecto: módulos, controladores, providers (servicios)
- Decoradores: `@Module`, `@Controller`, `@Get`, `@Post`, `@Put`, `@Delete`
- Inyección de dependencias
- Pipes: transformación y validación

### TypeORM + PostgreSQL

- Entities y decoradores (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`)
- Repositorios y patrones de consulta
- Migraciones
- Relaciones: OneToMany, ManyToOne

### Buenas prácticas

- DTOs con class-validator
- Filtros de excepción globales
- Estructura modular del proyecto

✅ **Mini-proyecto 3**: API REST CRUD (ej: catálogo de productos, lista de tareas) con PostgreSQL

| Recurso | Enlace |
|---|---|
| NestJS Docs | https://docs.nestjs.com |
| TypeORM Docs | https://typeorm.io |

---

## Semana 4 — Backend NestJS: Autenticación y Avanzado

### Autenticación y Autorización

- JWT (JSON Web Tokens): estructura, firma, refresh tokens
- Passport.js integrado con NestJS
- Guards y decoradores personalizados
- Roles y RBAC (Role-Based Access Control)

### Avanzado

- Relaciones ManyToMany
- Paginación, filtros, ordenamiento
- Swagger/OpenAPI para documentar la API
- Tests unitarios con Jest y @nestjs/testing

✅ **Mini-proyecto 4**: API con auth (login/register), roles (admin/user), documentación Swagger

| Recurso | Enlace |
|---|---|
| JWT.io | https://jwt.io |
| NestJS Authentication | https://docs.nestjs.com/security/authentication |

---

## Semana 5 — Frontend React

### Fundamentos

- JSX, componentes funcionales, props, children
- Hooks esenciales: `useState`, `useEffect`, `useContext`, `useRef`
- Custom hooks
- React Router: `BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`
- Consumo de APIs: fetch / axios con `useEffect`
- Manejo de formularios: controlados vs uncontrolled
- Manejo de estado global con Context API o Zustand

### Estilos

- TailwindCSS o CSS Modules
- Layouts responsivos básicos

✅ **Mini-proyecto 5**: App React que consuma la API de la semana 4 (login, CRUD protegido por roles)

| Recurso | Enlace |
|---|---|
| React Docs (beta) | https://react.dev |
| React Router | https://reactrouter.com |

---

## Semana 6 — Frontend Angular

### Fundamentos

- TypeScript en Angular: configuración y tipado estricto
- Componentes standalone: `@Component`, templates, estilos
- Data binding: interpolación, property binding, event binding, two-way
- Directivas estructurales: `*ngIf`, `*ngFor`, `@if`, `@for` (control flow)
- Servicios e inyección de dependencias
- Angular Router: `RouterModule`, `routerLink`, `ActivatedRoute`
- HttpClient: consumo de APIs REST

### Formularios

- Formularios reactivos: `FormGroup`, `FormControl`, validators
- Formularios template-driven (overview)

✅ **Mini-proyecto 6**: Misma app de la semana 5, ahora en Angular

| Recurso | Enlace |
|---|---|
| Angular Docs | https://angular.dev |
| Tour of Heroes | https://angular.dev/tutorials/first-app |

---

## Semana 7 — Arquitectura Full-Stack e Integración

### Integración

- Variables de entorno (`.env`, configuración por ambiente)
- CORS, CSRF, helmet (seguridad básica)
- Manejo de archivos estáticos y uploads

### Docker

- Dockerfile para NestJS, React y Angular
- docker-compose: backend + PostgreSQL + frontend
- Volúmenes, redes, healthchecks

### Buenas prácticas de código

- ESLint, Prettier
- Husky + lint-staged (git hooks)
- Estructura de monorepo con npm workspaces o Nx (overview)

✅ **Mini-proyecto 7**: Dockerizar la app completa (frontend + NestJS + PostgreSQL)

| Recurso | Enlace |
|---|---|
| Docker Docs | https://docs.docker.com |
| ESLint | https://eslint.org |

---

## Semana 8 — DevOps y Despliegue

### Despliegue

- Frontend: Vercel / Netlify
- Backend + PostgreSQL: Railway / Render / Fly.io
- Variables de entorno en producción

### CI/CD

- GitHub Actions: workflows, jobs, steps
- Pipeline: lint → test → build → deploy
- Secrets y entornos en GitHub

### Testing E2E

- Introducción a Playwright o Cypress
- Test de flujo completo: login → crear recurso → verificar

✅ **Mini-proyecto 8**: App desplegada en producción con CI/CD funcional

| Recurso | Enlace |
|---|---|
| Railway Docs | https://docs.railway.com |
| GitHub Actions | https://docs.github.com/en/actions |
| Playwright | https://playwright.dev |

---

## Semanas 9–10 — Proyecto Final en Equipos

### Organización

- Equipos de 3–4 personas
- Cada equipo elige frontend (React o Angular) para profundizar
- Backend compartido: NestJS + PostgreSQL
- Planificación con GitHub Projects: issues, milestones, asignaciones

### Metodología

- 2 sprints de 5 días
- Daily standups (15 min)
- Code review entre equipos (cada equipo revisa al otro)
- Retrospectiva al final de cada sprint

### Entregables finales

- Repositorio GitHub con README completo
- Aplicación desplegada y funcional
- Documentación Swagger del API
- Presentación final (10 min): demo + arquitectura + aprendizajes

---

## Ideas de Proyectos Finales

| Proyecto | Features clave |
|---|---|
| **Task Manager** (tipo Trello) | Tableros, columnas, tarjetas, drag & drop, usuarios, roles board/admin |
| **E-commerce básico** | Catálogo de productos, carrito, checkout (sin pago real), panel admin |
| **Blog / CMS** | Posts con markdown, comentarios, roles autor/editor/admin, búsqueda |
| **Sistema de reservas** | Slots horarios, disponibilidad, reservas, calendario interactivo |
| **Red social simple** | Posts, likes, follows, feed personalizado, perfiles de usuario |
| **Gestor de gastos** | Registro de gastos/ingresos, categorías, reportes, presupuesto mensual |

---

## Evaluación

| Criterio | Peso |
|---|---|
| Mini-proyectos completados (8) | 40% |
| Participación en code reviews y daily standups | 10% |
| Proyecto final | 50% |
| ▶ Funcionalidad | 20% |
| ▶ Código limpio y buenas prácticas | 10% |
| ▶ Trabajo en equipo (commits, PRs, issues) | 10% |
| ▶ Presentación y demo | 10% |

---

## Reglas

- Todo el código se entrega vía pull request, nunca por push directo a `main`
- Cada mini-proyecto tiene su propio repositorio
- Los commits deben ser en inglés y con mensajes descriptivos (conventional commits: `feat:`, `fix:`, `refactor:`, etc.)
- Prohibido subir secretos o `.env` al repositorio (usar `.env.example`)

---

> **Este documento se actualizará conforme avance el bootcamp con fechas, enlaces, ajustes y notas de cada semana.**

# AGENTS.md

## What this repo is

Teaching material for a 10-week full-stack bootcamp (NestJS · PostgreSQL · React · Angular). Content is in Spanish; commit messages are expected in English conventional-commit style (`feat:`, `fix:`, ...) per `plan-de-estudios.md` — note that existing history does not follow this.

There is **no root `package.json`, no workspace, no CI, no root lint/test setup**. Each `semana-N/ejemplos/<project>/` is an independent npm project with its own `package.json` and lockfile. Only weeks 1–5 exist so far; the repo grows over time. Always `cd` into the specific example before running anything.

## Running the examples

Every DB-backed project follows the same pattern: `npm install` → `docker compose up -d` → run.

| Project | Dev command | Notes |
|---|---|---|
| `semana-1/ejemplos/01-hola-mundo-csr` | `npm run dev` | Plain Express, `node --watch`, no DB |
| `semana-1/ejemplos/02-ssr-ejs` | `npm run dev` | Express + EJS, no DB |
| `semana-2/ejemplos/01-cli-crud-ts` | `npm run dev -- listar` | CLI; pass args after `--`. Auto-creates tables+seed on first run |
| `semana-2/ejemplos/02-muro-mensajes-pg` | `npm run dev` | Express+TS on port 3000, auto-initializes `mensajes` table |
| `semana-3/ejemplos/mi-api` | `npm run start:dev` (NOT `npm run dev`) | NestJS; needs `.env` first: `cp .env_template .env`. Swagger at `/docs` |
| `semana-4/ejemplos/mi-app-react` | `npm run dev` | Vite + React 19 + Tailwind v4 |
| `semana-5/ejemplos/01-auth-sesion` | `cd backend && npm run start:dev` + `cd frontend && npm run dev` | NestJS + React. **Two terminals, no DB.** Backend uses `express-session`, cookie `HttpOnly`, CORS `credentials:true`, port 3000; frontend `credentials:"include"`, port 5173 |
| `semana-5/ejemplos/02-auth-jwt` | `cd backend && npm run start:dev` + `cd frontend && npm run dev` | NestJS + React. **Two terminals, no DB.** Backend uses `@nestjs/jwt` (JwtModule is `global: true` so guards can inject `JwtService` from any module); frontend stores token in `localStorage`, sends `Authorization: Bearer`. No logout endpoint (client-side only) |

TypeScript examples: `npm run typecheck` (`tsc --noEmit`) exists only in semana-2 projects; `npm run build && npm start` for production mode.

### PostgreSQL gotchas

- All `docker-compose.yml` files bind **host port 5432** — only one can run at a time.
- Credentials differ per project: semana-2 uses `estudiante`/`pass123`, semana-3 uses `nestuser`/`nestpassword` (matches its `.env_template`).
- Data persists in named volumes; `docker compose down -v` resets a DB and re-runs init scripts / auto-seed.
- `semana-2/ejercicios/` auto-loads `tienda-schema.sql` + `tienda-seed.sql` (~800 rows) on first container start; connect with `psql -h localhost -U estudiante -d tienda`.

## Verification

Only `semana-3/ejemplos/mi-api` has lint/format/tests:

- `npm run lint` (ESLint flat config, `recommendedTypeChecked`, Prettier via `eslint-plugin-prettier`)
- `npm run test` — Jest unit tests (`rootDir: src`, `*.spec.ts` only)
- `npm run test:e2e` — separate config `test/jest-e2e.json`; needs the DB running

Other projects have no tests or linters — verification is `npm run typecheck` where available, otherwise manual run.

## Conventions

- Example projects auto-initialize their schema/seed at startup (CLI and muro-mensajes) or via `synchronize: true` (NestJS, no migrations) — never add migration tooling to these.
- NestJS API: global `ValidationPipe` with `forbidNonWhitelisted: true`; DTOs use class-validator; CORS enabled for the React frontend.
- Semana-2 TS projects use strict mode plus `noUncheckedIndexedAccess`; module system is `NodeNext` ESM (`"type": "module"`).
- Env files: never commit `.env`; use `.env_template` (note: not the usual `.env.example`).
- Rule from `plan-de-estudios.md`: changes land via pull requests, no direct pushes to `main`.

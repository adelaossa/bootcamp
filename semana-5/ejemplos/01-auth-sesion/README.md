# 01 — Auth por Sesión (Express + NestJS)

Ejemplo de autenticación **con sesiones server-side** usando `express-session` + cookie `HttpOnly`.

- Backend: NestJS, **sin base de datos** (usuarios en memoria).
- Frontend: React + Vite.
- Dos usuarios: `ana@x.com` (admin) / `1234` y `bob@x.com` (user) / `1234`.

## Cómo correr

Necesitas **dos terminales** (backend y frontend).

```bash
# Terminal 1 — backend (http://localhost:3000)
cd backend
npm install
cp .env_template .env
npm run start:dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173 e inicia sesión. Prueba con `ana` y con `bob` para ver la diferencia de autorización en `DELETE /productos/1` (solo admin).

## Qué observar

- En DevTools → Application → Cookies: verás la cookie `sessionId` con `HttpOnly` activado (no se puede leer con `document.cookie`).
- El `fetch` del frontend usa `credentials: "include"` para que el navegador envíe la cookie.
- El backend tiene `cors({ origin, credentials: true })` — sin esto, el navegador descarta la cookie entre orígenes.
- Después de logout, `GET /auth/perfil` devuelve 401 inmediatamente (la sesión se destruye en el servidor).

## Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/login` | público | crea sesión + cookie |
| POST | `/auth/logout` | público | destruye sesión |
| GET | `/auth/perfil` | autenticado | devuelve identidad |
| GET | `/productos` | cualquier autenticado | lista productos |
| DELETE | `/productos/:id` | admin | borra producto |
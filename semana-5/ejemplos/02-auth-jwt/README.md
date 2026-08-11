# 02 — Auth por JWT (NestJS)

Ejemplo de autenticación **stateless con JWT** usando `@nestjs/jwt`. El token va en la cabecera `Authorization: Bearer`.

- Backend: NestJS, **sin base de datos** (usuarios en memoria).
- Frontend: React + Vite, guarda el token en `localStorage`.
- Dos usuarios: `ana@x.com` (admin) / `1234` y `bob@x.com` (user) / `1234`.
- El token expira en 1 hora (`signOptions.expiresIn`).

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

## Qué observar (comparado con el ejemplo de sesiones)

- No hay cookie. El `fetch` no usa `credentials: "include"`, solo la cabecera `Authorization: Bearer <token>`.
- No hay endpoint de logout en el backend: cerrar sesión = borrar el token del `localStorage` (cliente). El token sigue siendo válido hasta que expira (`exp`) —**este es el "problema de revocación" de JWT**.
- En DevTools → Application → Local Storage verás el `auth-jwt-token`. Puedes modificarlo en jwt.io para inspeccionar el payload (recuerda: es base64, **no encriptación**).
- Reiniciar el backend **no invalida** tokens firmados con el secreto (stateless).

## Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/login` | público | valida credenciales y devuelve `{ token }` |
| GET | `/auth/perfil` | autenticado (Bearer) | devuelve identidad desde el payload |
| GET | `/productos` | cualquier autenticado | lista productos |
| DELETE | `/productos/:id` | admin | borra producto |

> No hay `POST /auth/logout`: en JWT puro el logout es del lado del cliente. Para invalidación real se necesita un store de revocación o refresh tokens (ver `temas/05-sesiones-vs-jwt.md`).
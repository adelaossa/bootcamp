# 6 — Mini-proyecto 5: auth con sesiones y JWT

> **Cambio de plan:** esta semana se adelantó la autenticación (originalmente semana 6). Angular pasa a la semana 6.

---

## Objetivo

Construir **dos** apps de ejemplo que hacen exactamente lo mismo (login con dos usuarios, un endpoint protegido y un endpoint solo para admin) para **sentir la diferencia** entre sesiones y JWT.

| Ejemplo | Mecanismo | Transporte |
|---|---|---|
| `ejemplos/01-auth-sesion` | `express-session` (estado server-side) | cookie `HttpOnly` |
| `ejemplos/02-auth-jwt` | `@nestjs/jwt` (stateless) | cabecera `Authorization: Bearer` |

Ambos:

- Backend NestJS, **sin base de datos** (usuarios en memoria).
- Frontend React + Vite + TypeScript, sencillo.
- Dos usuarios de prueba:
  - `ana@x.com` / `1234` -> rol `admin`
  - `bob@x.com` / `1234` -> rol `user`
- Endpoints:
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/perfil` (protegido, cualquier autenticado)
  - `DELETE /productos/1` (protegido, solo `admin`) -> devuelve 403 para `bob`

---

## Como correr cada ejemplo

En cada carpeta hay un `README.md` con el detalle, pero el patron es:

```bash
# terminal 1 - backend
cd semana-5/ejemplos/01-auth-sesion/backend
npm install
cp .env_template .env
npm run start:dev          # http://localhost:3000

# terminal 2 - frontend
cd semana-5/ejemplos/01-auth-sesion/frontend
npm install
npm run dev                 # http://localhost:5173
```

Para el ejemplo JWT, igual pero en `02-auth-jwt/`.

---

## Lo que debes observar al compararlas

1. **Backend sesion:** despues de logout, `GET /perfil` falla inmediatamente (401). La sesion destruida en el servidor.
2. **Backend JWT:** despues de logout, el token sigue siendo tecnica y valido por el cliente hasta que expira `exp`. El frontend lo borro, pero si yo lo guardo el servidor igual lo acepta. Esto ilustra el problema de revocacion.
3. **CORS:** el frontend en sesion requiere `credentials: true` en el backend y `credentials: "include"` en el `fetch`. El de JWT no: solo una cabecera.
4. **DevTools:** con sesion, mira la cookie `HttpOnly` (no se puede leer con `document.cookie`). Con JWT, mira el token en `localStorage`.

---

## Entregable

- Las dos apps corriendo localmente
- Poder login con `ana` y con `bob`, ver /productos-protegido y probar el endpoint admin
- Una explicacion breve (en tu README o en voz alta): una diferencia concreta que notaste entre sesiones y JWT al implementarlo
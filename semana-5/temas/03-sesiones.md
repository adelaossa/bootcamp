# 3 — Sesiones tradicionales (server-side + cookies)

---

## Idea

El servidor guarda un “diccionario” de sesiones. Cada sesion tiene un ID y ahi se guarda quien es el usuario (y los datos que quieras: rol, etc.). El cliente solo recibe el **ID opaco**.

```
┌──────────────────────────────────────────────┐
│  SERVIDOR                                     │
│  sesiones = {                                 │
│    "abc123": { userId: 1, role: "admin" },   │
│    "def456": { userId: 2, role: "user"  },   │
│  }                                            │
└──────────────────────────────────────────────┘
            ▲                       │
   ID viaja en cookie      (1) login crea sesion
   "abc123" opaco          (2) Set-Cookie: sessionId=abc123
            │
┌──────────────────────────────────────────────┐
│  CLIENTE (navegador)                          │
│  Cookie: sessionId = abc123                  │
└──────────────────────────────────────────────┘
```

Importante: el ID **no contiene datos**. Es solo una llave aleatoria. Si alguien intercepta el ID no sabe nada; necesita que el servidor lo valide.

---

## Flujo completo

```
1. POST /login { email, password }
   servidor valida credenciales
   servidor crea sesion en memoria:  sesiones["abc123"] = { userId: 1 }
   servidor responde:  Set-Cookie: sessionId=abc123; HttpOnly

2. (el navegador guarda la cookie y la enviara en cada peticion a este dominio)

3. GET /perfil
   peticion incluye:  Cookie: sessionId=abc123
   servidor busca sesiones["abc123"]  -> { userId: 1 }
   servidor sabe: eres el usuario 1  (authN)
   servidor carga el perfil del usuario 1  -> 200 OK

4. POST /logout
   servidor destruye sesiones["abc123"]
   responde:  Set-Cookie: sessionId=; Max-Age=0   (borra la cookie)
```

---

## En NestJS con `express-session`

```bash
npm install express-session
npm install -D @types/express-session
```

### Configurar el middleware (en `main.ts`)

```typescript
import { NestFactory } from "@nestjs/common"
import { json } from "express"
import session from "express-session"

import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(
    session({
      name: "sessionId",                // nombre de la cookie
      secret: process.env.SESSION_SECRET ?? "secreto-dev",  // firma la cookie
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,                 // JS del navegador NO puede leerla
        secure: false,                  // en prod va true (solo HTTPS)
        maxAge: 1000 * 60 * 60,         // 1 hora
      },
    }),
  )

  app.enableCors({
    origin: "http://localhost:5173",    // el frontend de Vite
    credentials: true,                  // !! clave para que el navegador envie cookies entre origenes
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

> `credentials: true` es **obligatorio** cuando el frontend y el backend estan en origenes distintos (puertos distintos) y quieres que la cookie viaje. Sin esto el navegador descarta la cookie de la respuesta.

### Login: crear la sesion

```typescript
// auth.controller.ts
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common"
import type { Request } from "express"
import type { SessionData } from "express-session"

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const user = this.auth.validate(dto.email, dto.password)  // authN
    // guardar la identidad en la sesion (estado server-side)
    req.session.user = { id: user.id, role: user.role } satisfies SessionData["user"]
    return { message: "ok", user: { id: user.id, email: user.email, role: user.role } }
  }

  @Post("logout")
  logout(@Req() req: Request) {
    req.session.destroy(() => {})
    return { message: "sesion cerrada" }
  }
}
```

### Guard: proteger rutas

Un **guard** en NestJS decide si una peticion pasa. Aqui comprobamos que exista `req.session.user`.

```typescript
// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import type { Request } from "express"

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>()
    if (!req.session?.user) throw new UnauthorizedException("no autenticado")
    return true
  }
}
```

Uso:

```typescript
@Get("perfil")
@UseGuards(SessionAuthGuard)
perfil(@Req() req: Request) {
  return req.session.user
}
```

### Guard de roles (authZ)

```typescript
import { Reflector } from "@nestjs/core"

// decorador: marca que rol exige un endpoint
export const ROLES_KEY = "roles"
export const Roles = (...roles: string[]) => (target, key, desc) =>
  Reflect.metadata(ROLES_KEY, roles)(target, key, desc)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]) ?? []
    if (required.length === 0) return true

    const req = ctx.switchToHttp().getRequest<Request>()
    const role = req.session?.user?.role
    if (!role || !required.includes(role)) return false
    return true
  }
}
```

```typescript
@Delete("productos/:id")
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles("admin")
borrar() { ... }
```

---

## Estado en memoria

Esta semana **sin base de datos**. Las sesiones y los usuarios viven en memoria:

```typescript
// users.service.ts  (en memoria)
const usuarios = [
  { id: 1, email: "ana@x.com", password: "1234", role: "admin" },
  { id: 2, email: "bob@x.com", password: "1234", role: "user"  },
]
```

> Importante: al reiniciar el servidor, **todas las sesiones se pierden**. En produccion usarias un **session store** externo (Redis, etc.) para que las sesiones sobrevivan a reinicios y se compartan entre instancias. `express-session` por defecto usa `MemoryStore`, que es solo para desarrollo.

---

## Pros y contras de las sesiones

| Pros | Contras |
|---|---|
| El ID es opaco: no expone datos del usuario | El servidor guarda estado (memoria / store) |
| Invalidar una sesion es trivial: borrarla del servidor | Dificil de escalar horizontalmente sin store compartido (Redis) |
| Cookies `HttpOnly` no son accesibles por JS (mas fuertes contra XSS) | Vulnerable a **CSRF** porque el navegador envia la cookie automaticamente |
| El frontend no necesita manejar el token | CORS con credenciales entre origenes requiere configuracion exacta |

---

## Resumen

```
  sesion = estado en el servidor + ID opaco en cookie
  el ID no tiene datos, solo apunta a una sesion
  express-session maneja el store y la cookie por ti
  HttpOnly endurece contra XSS; hay que mitigar CSRF
```
# 4 — JSON Web Tokens (JWT)

---

## Idea

En vez de guardar el estado en el servidor, el servidor **firma** un token que contiene los datos del usuario (claims). El cliente lo guarda y lo envia en cada peticion. El servidor verifica la **firma** sin guardar nada.

```
┌──────────────────────────────────────────────┐
│  SERVIDOR                                     │
│  secreto = "mi-secreto"                       │
│  (NO guarda sesiones)                         │
└──────────────────────────────────────────────┘
        ▲ firma con el secreto        │ verifica con el secreto
        │                              │
        │   [CLIENTE]                  │
        │   token JWT =                │
        │   header.payload.signature   │
        └──lo guarda y lo envia────────┘
```

El token es **stateless**: el servidor no necesita recordar nada. Todo esta en el token y la firma garantiza que no fue alterado.

---

## Estructura del token

Un JWT son tres strings base64 separados por puntos:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   .   eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIn0   .   s9K3...fGk=
            HEADER                            PAYLOAD                      SIGNATURE
```

```
HEADER    = { "alg": "HS256", "typ": "JWT" }      -> como se firma
PAYLOAD   = { "sub": "1", "role": "admin" }      -> los datos (claims)
SIGNATURE = HMAC-SHA256(base64(header) + "." + base64(payload), secreto)
```

> ?Por que se puede leer el payload? **Base64 no es encriptacion.** Cualquiera puede decodificarlo en jwt.io. La firma no oculta los datos, solo **evita que alguien los altere**. Por eso nunca pongas secretos en un JWT.

Claims mas comunes:

| Claim | Significado |
|---|---|
| `sub` | Subject: id del usuario |
| `iat` | Issued At: cuando se emitio |
| `exp` | Expiration: cuando caduca |
| `role` | (custom) rol del usuario |

---

## Flujo completo

```
1. POST /login { email, password }
   servidor valida credenciales
   servidor FIRMA un JWT:  jwt.sign({ sub: id, role }, secreto, { expiresIn: "1h" })
   responde:  { token: "eyJhbGciOi..." }

2. (el frontend guarda el token, p.ej. en localStorage)

3. GET /perfil
   peticion incluye la cabecera:  Authorization: Bearer eyJhbGciOi...
   servidor:
     - extrae el token de la cabecera
     - verifica la firma con el secreto   -> invalido? 401
     - lee { sub: 1, role: "admin" }      -> ya sabe quien eres (authN)
   responde con el perfil

4. POST /logout
   ?no hace nada en el servidor! el estado es del cliente.
   el frontend simplemente borra el token del localStorage
   (para invalidacion real en el server, ver tema 5)
```

---

## En NestJS con `@nestjs/jwt`

```bash
npm install @nestjs/jwt
```

### Modulo JWT

```typescript
import { JwtModule } from "@nestjs/jwt"
import { Module } from "@nestjs/common"

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "secreto-dev",  # clave simetrica para firmar
      signOptions: { expiresIn: "1h" },
    }),
  ],
  ...
})
export class AuthModule {}
```

### Login: firmar el token

```typescript
// auth.service.ts
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  login(email: string, password: string) {
    const user = this.users.find(u => u.email === email)
    if (!user || user.password !== password) throw new UnauthorizedException()

    # authN hecha -> firmamos el token (stateless: el servidor no guardara nada)
    const token = this.jwt.sign({ sub: user.id, role: user.role })
    return { token, user: { id: user.id, email: user.email, role: user.role } }
  }
}
```

### Guard: verificar el token

```typescript
// jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import type { Request } from "express"

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>()
    const auth = req.headers.authorization ?? ""
    const match = auth.match(/^Bearer (.+)$/)
    if (!match) throw new UnauthorizedException("falta token")

    try {
      # verifica firma + exp  (si expiro o fue alterado, lanza)
      const payload = await this.jwt.verifyAsync(match[1])
      # dejamos el payload disponible para los handlers/guards siguientes
      ;(req as any).user = payload
      return true
    } catch {
      throw new UnauthorizedException("token invalido")
    }
  }
}
```

### Guard de roles (authZ)

```typescript
import { Reflector, Injectable, CanActivate, ExecutionContext } from "@nestjs/core"
import type { Request } from "express"

export const ROLES_KEY = "roles"
export const Roles = (...roles: string[]) => Reflect.metadata(ROLES_KEY, roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(), ctx.getClass(),
    ]) ?? []
    if (required.length === 0) return true

    const req = ctx.switchToHttp().getRequest<Request>()
    const role = (req as any).user?.role
    if (!role || !required.includes(role)) return false
    return true
  }
}
```

```typescript
@Delete("productos/:id")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
borrar() { ... }
```

---

## ?Donde guarda el token el frontend?

| Lugar | Pros | Contras |
|---|---|---|
| `localStorage` | Sencillo, sobrevive recargas | Accesible por JS -> vulnerable a **XSS** |
| Memoria (JS) | Otra XSS lo roba menos, pero se pierde al recargar | Molesto (login cada recarga) |
| Cookie `HttpOnly` | No accesible por JS (mas fuerte contra XSS) | Vuelve el riesgo de **CSRF** (como las sesiones) |

No hay opcion perfecta. La debilidad de JWT suele ser **XSS** (si el token esta en localStorage y una inyeccion de JS lo lee). Sesiones en cookie `HttpOnly` debilitan XSS pero exponen a **CSRF**.

---

## Estado en memoria (sin BD)

```typescript
// users.service.ts
const usuarios = [
  { id: 1, email: "ana@x.com", password: "1234", role: "admin" },
  { id: 2, email: "bob@x.com", password: "1234", role: "user"  },
]
```

Reiniciar el servidor **no invalida los tokens**: como el servidor no guarda estado, cualquier token firmado con el secreto sigue siendo valido hasta que caduque (`exp`). Esto es a la vez una virtud (stateless) y un problema (revocar un token requiere un store -> ver tema 5).

---

## Pros y contras de JWT

| Pros | Contras |
|---|---|
| Stateless: el servidor no guarda nada, escala facil | No se pueden invalidar sin store (problema para logout real) |
| Natural para APIs / microservicios: cualquier servicio con el secreto puede verificar | El payload es legible por cualquiera (no es encriptacion) |
| No requiere CORS con credenciales (va en Authorization header) | Si se usa en localStorage, vulnerable a XSS |
| Autocontenido: incluye los datos (rol, etc.) | Si el secreto se filtra, se pueden forjar tokens |

---

## Resumen

```
  JWT = header.payload.signature  (base64 + HMAC)
  el servidor FIRMA, el cliente guarda y envia (Bearer)
  stateless: el servidor no guarda sesiones
  la firma evita alteraciones, PERO no oculta los datos
  debilidad tipica: XSS si se guarda en localStorage
```
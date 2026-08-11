# Semana 5 — Autenticacion y Autorizacion: sesiones vs JWT

## Objetivos de la semana

Al finalizar esta semana los estudiantes podran:

- Explicar la diferencia entre autenticacion (quien eres) y autorizacion (que puedes hacer)
- Entender por que HTTP necesita un mecanismo para recordar al usuario entre peticiones
- Implementar autenticacion con sesiones server-side usando cookies (`express-session`)
- Implementar autenticacion stateless con JSON Web Tokens (JWT)
- Comparar sesiones y JWT: ventajas, desventajas y casos de uso
- Aplicar autorizacion basada en roles en el backend
- Entender los riesgos de seguridad clave: CSRF (sesiones) y XSS (JWT en localStorage)

## Temas

| # | Tema | Archivo |
|---|---|---|
| 1 | Autenticacion vs autorizacion | [01-autenticacion-vs-autorizacion.md](temas/01-autenticacion-vs-autorizacion.md) |
| 2 | HTTP es stateless: ?como recordamos al usuario? | [02-http-stateless.md](temas/02-http-stateless.md) |
| 3 | Sesiones tradicionales (server-side + cookies) | [03-sesiones.md](temas/03-sesiones.md) |
| 4 | JSON Web Tokens (JWT) | [04-jwt.md](temas/04-jwt.md) |
| 5 | Sesiones vs JWT: comparacion y seguridad | [05-sesiones-vs-jwt.md](temas/05-sesiones-vs-jwt.md) |
| 6 | Mini-proyecto 5: auth con sesiones y JWT | [06-mini-proyecto-auth.md](temas/06-mini-proyecto-auth.md) |

## Recursos complementarios

| Recurso | Enlace |
|---|---|
| OWASP Authentication Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html |
| JWT.io (debugger de tokens) | https://jwt.io |
| RFC 7519 (JWT) | https://datatracker.ietf.org/doc/html/rfc7519 |
| express-session | https://github.com/expressjs/session |
| NestJS Authentication | https://docs.nestjs.com/security/authentication |
| @nestjs/jwt | https://docs.nestjs.com/security/authentication#jwt-token |

## Glosario

| Termino | Definicion |
|---|---|
| **Autenticacion (authN)** | Verificar **quien** eres (login, credenciales) |
| **Autorizacion (authZ)** | Verificar **que** puedes hacer (permisos, roles) |
| **Sesion** | Estado guardado en el servidor que identifica a un usuario entre peticiones |
| **Cookie** | Cabecera HTTP que el navegador envia automaticamente en cada peticion al mismo origen |
| **Session ID** | Identificador opaco (aleatorio) que la cookie envia al servidor para vincular una peticion con una sesion |
| **JWT** | JSON Web Token: token firmado que contiene claims (datos) y es verificable sin guardar estado en el servidor |
| **Stateless** | El servidor no guarda estado entre peticiones; cada peticion contiene todo lo necesario para validarse |
| **Claim** | Una declaracion sobre un sujeto dentro de un JWT (ej: `sub`, `role`, `exp`) |
| **Firma (signature)** | Parte del JWT que garantiza que el token no fue alterado, generada con una clave secreta |
| **Guard** | En NestJS, clase que decide si una peticion puede继续 (`canActivate`) |
| **CSRF** | Cross-Site Request Forgery: ataque que abusa de cookies enviadas automaticamente |
| **XSS** | Cross-Site Scripting: inyeccion de JS que roba datos del navegador (ej: tokens en localStorage) |
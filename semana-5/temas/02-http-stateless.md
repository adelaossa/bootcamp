# 2 — HTTP es stateless: ?como recordamos al usuario?

---

## El problema

HTTP **no tiene memoria**. Cada peticion es independiente.

```
Peticion 1:  POST /login    { email, password }   -> servidor responde 200 OK
Peticion 2:  GET /perfil                          -> el servidor ?sabe quien eres? NO.
```

Para el servidor, la peticion 2 podria venir de cualquier persona. No hay relacion automatica entre la 1 y la 2.

```
[Cliente] --peticion--> [Servidor]   ...respuesta...
[Cliente] --peticion--> [Servidor]   ( olvido todo de la peticion anterior )
```

> Es como un mesero con amnesia: cada vez que lo llamas, no recuerda tu pedido anterior.

---

## La solucion general

Para recordar al usuario entre peticiones, necesitamos **algo** que el cliente envie en cada peticion para identificarse. Ese “algo” es un **identificador**.

```
1. Login OK -> servidor entrega al cliente un IDENTIFICADOR
2. Cliente guarda ese identificador (cookie o localStorage)
3. En cada peticion siguiente, cliente lo envia de vuelta
4. Servidor lo reconoce y reconstruye la identidad
```

Hay dos formas principales de implementar este identificador:

| Forma | Identificador | ?Donde se guarda el estado? |
|---|---|---|
| **Sesion** | un session ID opaco (aleatorio) | En el **servidor** |
| **JWT** | un token con datos (claims) firmado | En el **cliente** (no hay estado server-side) |

Esta diferencia (quien guarda el estado) es el origen de todas las demas diferencias.

---

## El transporte: ?como viaja el identificador?

El identificador debe llegar del cliente al servidor en cada peticion. Hay dos mecanismos estandar:

### 1. Cookies

El navegador mantiene un almacen de claves-valor por dominio. Cuando el servidor responde con `Set-Cookie`, el navegador la guarda y **la envia automaticamente** en cada peticion al mismo dominio.

```
Respuesta del servidor:
  Set-Cookie: sessionId=abc123; HttpOnly; Path=/

Peticiones siguientes del navegador (automatico):
  Cookie: sessionId=abc123
```

Pros: el navegador se encarga de enviarla. Contras: vulnerable a **CSRF** (el navegador la envia aun en peticiones que el usuario no inicio).

### 2. Cabecera Authorization

El cliente decide explicitamente incluir el token en una cabecera.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Pros: no se envia automaticamente (no hay CSRF). Contras: hay que guardarlo en JS (típicamente `localStorage`), expuesto a **XSS**.

> Regla general: sesiones van en **cookies**, JWT suele ir en la **cabecera Authorization** (aunque JWT tambien puede ir en cookie).

---

## Comparacion rapida del transporte

| | Cookie | Authorization header |
|---|---|---|
| ?Quien la envia? | El navegador, automatica | El codigo JS, explicita |
| ?Se envia en CSRF? | Si (riesgo) | No |
| ?Accesible por JS? | No, si es `HttpOnly` | Si |
| ?XSS la roba? | Dificil (HttpOnly) | Si, si esta en localStorage |

A lo largo de esta semana veremos por que sesiones combinan bien con cookies y JWT con Authorization header, y como mitigar los riesgos de cada una.

---

## Resumen

```
  HTTP no recuerda a nadie.
  Para recordar al usuario: cliente envia un IDENTIFICADOR en cada peticion.
  ?Quien guarda el estado?
     sesion -> el servidor   (identificador opaco)
     JWT    -> el cliente    (token firmado con datos)
  ?Como viaja?
     cookie    (automatica, riesgo CSRF)
     header    (explicita, riesgo XSS)
```
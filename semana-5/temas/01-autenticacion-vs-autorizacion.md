# 1 — Autenticacion vs autorizacion

Dos conceptos que se confunden todo el tiempo, pero son distintos.

---

## La analogia del edificio

```
                ┌─────────────────────────────┐
                │         EDIFICIO            │
                │                             │
   1. AUTHN     │  Recepcion                  │
   "?Quien es   │  "Muéstrame tu credencial" │
    usted?"     │  -> Te dan una tarjeta      │
                │                             │
   2. AUTHZ     │  Piso 12: sala de juntas    │
   "?Que puede  │  "Solo gerentes entran"    │
    hacer?"     │  -> Tu tarjeta dice "gerente"? pasa
                │                             │
                └─────────────────────────────┘
```

- **Autenticacion (authN)**: La recepcion verifica tu identidad. “?Eres quien dices ser?”
- **Autorizacion (authZ)**: El guarda decide si puedes entrar a esa sala. “?Tienes permiso para hacer esto?”

---

## Definiciones

| | Autenticacion (authN) | Autorizacion (authZ) |
|---|---|---|
| **Pregunta** | ?Quien eres? | ?Que puedes hacer? |
| **Cuando** | Al inicio (login) | En cada accion protegida |
| **Input** | Credenciales (email + password) | Identidad + reglas de permiso |
| **Output** | Una identidad verificada (sesion o token) | Si / No (permitir o denegar) |
| **Ejemplo** | `POST /login` con email/password | `DELETE /productos/5` -> solo admin |

> La N y la Z vienen de la palabra completa: auth**N**tication / auth**Z**orization. Es notacion comun en seguridad.

---

## Flujo completo

```
1. Cliente: POST /login  { email, password }
2. Servidor: verifica password contra la BD
   -> correcto?  Ahora el servidor SABE quien eres (authN hecha)
   -> te entrega algo que prueba tu identidad (sesionID o JWT)

3. Cliente: DELETE /productos/5  + (cookie o Authorization: Bearer ...)
4. Servidor:
   a) Identifica quien eres a partir de la cookie/token (authN de nuevo)
   b) Revisa si ESE usuario puede borrar productos (authZ)
   -> si es admin: 200 OK
   -> si no: 403 Forbidden
```

Fijate que la authN se repite: cada peticion nueva, el servidor vuelve a identificar quién eres a partir de lo que le enviaste. La authZ es la pregunta de permisos usando esa identidad.

---

## Autorizacion basada en roles (RBAC)

El modelo mas simple: cada usuario tiene uno o mas **roles**, y cada endpoint exige un rol.

```typescript
// Usuario (en memoria, sin BD esta semana)
const users = [
  { id: 1, email: "ana@x.com",  password: "1234", role: "admin" },
  { id: 2, email: "bob@x.com",  password: "1234", role: "user"  },
]
```

```
GET    /perfil          -> cualquier autenticado  (authZ: cualquier rol)
DELETE /productos/:id   -> solo admin             (authZ: role "admin")
```

El flujo de authZ:

```
[peticion] -> [identificar usuario] -> [leer su role] -> [comparar con el rol requerido]
                                                      -> no coincide? 403 Forbidden
```

---

## Resumen

```
  authN: ?quien eres?      -> te da una identidad (sesion / token)
  authZ: ?que puedes hacer? -> usa esa identidad + reglas para permitir o no
```

Sin authN no hay authZ: no puedes decidir si alguien puede hacer algo si no sabes quien es.
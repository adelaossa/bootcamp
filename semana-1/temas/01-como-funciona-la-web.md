# 1 — Como funciona la Web

---

## El modelo cliente-servidor

Imaginen un restaurante:

| Rol | En la web |
|---|---|
| **Cliente** (tu navegador) | Hace el pedido |
| **Mesero** (HTTP) | Lleva y trae la orden |
| **Cocina** (servidor) | Prepara la respuesta |
| **Platillo** (HTML/JSON) | Lo que recibes |

```
[ Navegador ] --- request HTTP ---> [ Servidor ]
[ Navegador ] <-- response HTTP --- [ Servidor ]
```

Tu navegador (Chrome, Firefox, Edge) es el **cliente**. Cuando escribes una URL, el navegador envia una solicitud (request) a un **servidor** que esta en alguna parte del mundo. El servidor procesa esa solicitud y devuelve una respuesta.

---

## DNS: la guia telefonica de internet

Las computadoras se identifican con direcciones IP (ej: `142.250.80.46`), pero los humanos recordamos nombres como `google.com`. El **DNS** (Domain Name System) traduce nombres a IPs.

```
google.com  ---> DNS ---> 142.250.80.46
```

Pasos de una resolucion DNS:

1. Escribes `google.com` en el navegador
2. El navegador pregunta al DNS: "?Cual es la IP de google.com?"
3. El DNS responde: `142.250.80.46`
4. El navegador se conecta a esa IP por el puerto 443 (HTTPS)

---

## HTTP: el lenguaje que hablan cliente y servidor

HTTP (HyperText Transfer Protocol) es el protocolo que define como se comunican cliente y servidor.

### Estructura de una solicitud HTTP

```
POST /api/usuarios HTTP/1.1
Host: miapp.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{
  "nombre": "Ana",
  "email": "ana@email.com"
}
```

| Parte | Que es |
|---|---|
| `POST` | Metodo HTTP (verbo) |
| `/api/usuarios` | Ruta (path, endpoint) |
| `HTTP/1.1` | Version del protocolo |
| `Host`, `Content-Type`, etc. | Headers (metadatos) |
| `{ "nombre": "Ana" }` | Body (cuerpo, datos) |

### Estructura de una respuesta HTTP

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 42,
  "nombre": "Ana",
  "email": "ana@email.com"
}
```

| Parte | Que es |
|---|---|
| `201` | Codigo de estado |
| `Created` | Texto descriptivo |
| Headers | Metadatos de la respuesta |
| Body | Datos de la respuesta |

### Codigos de estado mas comunes

| Codigo | Significado | Ejemplo |
|---|---|---|
| 200 OK | Todo bien | GET de un recurso que existe |
| 201 Created | Recurso creado | POST exitoso |
| 204 No Content | Exito sin body | DELETE exitoso |
| 400 Bad Request | El cliente mando datos invalidos | Falta un campo requerido |
| 401 Unauthorized | No estas autenticado | No enviaste token |
| 403 Forbidden | No tienes permisos | Eres usuario, intentas acceder como admin |
| 404 Not Found | El recurso no existe | GET a `/users/99999` que no existe |
| 500 Internal Server Error | Error en el servidor | Bug en el codigo, BD caida |

---

## JSON: el formato universal de datos

JSON (JavaScript Object Notation) es como todas las APIs se comunican hoy:

```json
{
  "nombre": "Carlos",
  "edad": 28,
  "activo": true,
  "hobbies": ["programar", "futbol", "leer"],
  "direccion": {
    "calle": "Av. Siempre Viva 742",
    "ciudad": "Springfield"
  }
}
```

Reglas:
- Las claves van entre comillas dobles
- Los valores pueden ser: string, number, boolean, null, array, objeto
- No admite comentarios
- No admite trailing commas (coma al final del ultimo elemento)

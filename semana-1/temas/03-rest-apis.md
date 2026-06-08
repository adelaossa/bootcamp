# 3 — REST: APIs que tienen sentido

REST (Representational State Transfer) es un estilo de arquitectura para disenar APIs. No es un protocolo, es una serie de principios.

---

## Principios de REST

1. **Recursos, no acciones**: todo es un recurso (usuarios, productos, ordenes) identificado por una URL
2. **Los verbos HTTP definen la accion**: no creas endpoints como `/crearUsuario`, usas `POST /usuarios`
3. **Stateless**: cada solicitud contiene toda la informacion necesaria, el servidor no guarda estado entre solicitudes
4. **Representaciones**: un mismo recurso puede devolverse en diferentes formatos (JSON, XML), pero JSON es el estandar

---

## Metodos HTTP (verbos)

| Verbo | Accion | Idempotente? | Ejemplo |
|---|---|---|---|
| GET | Leer/Obtener | Si | `GET /productos/5` |
| POST | Crear | No | `POST /productos` |
| PUT | Reemplazar/Actualizar completo | Si | `PUT /productos/5` |
| PATCH | Actualizar parcial | No | `PATCH /productos/5` |
| DELETE | Eliminar | Si | `DELETE /productos/5` |

> **Idempotente**: hacer la misma solicitud varias veces produce el mismo resultado. `DELETE` es idempotente: si borras algo 10 veces, sigue estando borrado. `POST` no lo es: cada vez que haces POST creas un nuevo recurso.

---

## Convencion de endpoints REST

```
GET    /productos        → Listar todos los productos
GET    /productos/5      → Obtener el producto con id 5
POST   /productos        → Crear un nuevo producto
PUT    /productos/5      → Reemplazar el producto 5
PATCH  /productos/5      → Actualizar parcialmente el producto 5
DELETE /productos/5      → Eliminar el producto 5

GET    /productos/5/reviews  → Listar reviews del producto 5
POST   /productos/5/reviews  → Agregar review al producto 5
```

# 3 — Evolucion de la persistencia de datos

---

## ?Como se guardaban los datos antes de las bases de datos?

### Archivos planos

La forma mas simple de persistir datos: escribir a un archivo.

```javascript
// Guardar datos en un archivo
import { writeFile, readFile } from "node:fs/promises"

const usuarios = [
  { id: 1, nombre: "Ana", email: "ana@email.com" },
  { id: 2, nombre: "Carlos", email: "carlos@email.com" }
]

await writeFile("usuarios.json", JSON.stringify(usuarios, null, 2))

// Leerlos despues
const datos = JSON.parse(await readFile("usuarios.json", "utf-8"))
```

Esto funcionaba en los anos 80 y 90. Pero tiene problemas graves:

```
══════ Modelo de archivos planos ══════
                                              
[App] ──lee/escribe──> [usuarios.json]        
                                              
Limitaciones:                                   
• Una sola app puede escribir a la vez         
• Buscar un usuario requiere leer TODO el archivo
• Si la app crashea mientras escribe → datos corruptos
• No hay reglas: email puede estar vacio, duplicado...
• 1000 usuarios → el archivo crece, todo se vuelve lento
```

### Problemas concretos de los archivos planos

| Problema | Ejemplo |
|---|---|
| **Concurrencia** | Dos apps escriben `usuarios.json` al mismo tiempo. Una pisa los cambios de la otra. El archivo queda corrupto. |
| **Busqueda** | "Buscar el usuario con email `ana@email.com`". Hay que leer el archivo entero, parsearlo, recorrer 100.000 registros uno por uno. |
| **Integridad** | Nada impide guardar `{ id: 1, email: null }`. Nada impide tener dos usuarios con el mismo `id`. |
| **Atomicidad** | Transfieres $100 de Ana a Carlos. Restas de Ana, el sistema crashea, NUNCA sumaste a Carlos. Dinero perdido. |
| **Escalabilidad** | El archivo crece a 10GB. Todo se vuelve lentisimo. No hay forma de consultar solo una parte sin cargarlo entero. |

---

## El salto al modelo cliente-servidor

En vez de que cada app lea/escriba archivos directamente, aparece un proceso especializado que **solo** se dedica a gestionar datos: el **servidor de base de datos**.

```
══════ Modelo cliente-servidor ══════

[App 1] ──┐
[App 2] ──┼── TCP :5432 ──> [PostgreSQL] ──> [disco]
[App 3] ──┘                    ▲
                          Solo el servidor BD
                          toca los archivos
```

| Antes | Ahora |
|---|---|
| Cada app abre el archivo directamente | Las apps envian queries al servidor via red |
| El sistema de archivos decide quien escribe | El servidor BD maneja la concurrencia |
| Sin validacion | Constraints, tipos de datos, triggers |
| Busqueda secuencial | Indices (B-trees, hash) |

**Analogia**:

Imagina una biblioteca. Antes cada persona entraba al deposito, buscaba entre todas las cajas, agarraba libros y los modificaba. Caos.

Ahora hay un **bibliotecario** (el servidor BD). Tu le pides "dame los libros de Stephen King". El sabe exactamente donde estan, los trae, y se asegura de que nadie mas los modifique mientras los tienes.

---

## ?Que aporta un sistema de base de datos?

### 1. Persistencia

Los datos sobreviven aunque la aplicacion se detenga o el servidor se reinicie. La BD los guarda en disco con journaling (registro de cambios).

### 2. Concurrencia

Cientos de apps pueden consultar y modificar datos simultaneamente. La BD usa **bloqueos** y **control de concurrencia multiversion (MVCC)** para que cada transaccion vea una vista consistente sin bloquear a las demas.

```
[App 1] UPDATE usuarios SET saldo = saldo - 100 WHERE id = 1  ──┐
[App 2] SELECT saldo FROM usuarios WHERE id = 1               ──┤ PostgreSQL
[App 3] UPDATE usuarios SET saldo = saldo + 100 WHERE id = 2  ──┘
                                                                  maneja las 3
                                                                  sin conflictos
```

### 3. Integridad

La BD hace cumplir reglas:

```sql
-- El email no puede ser null ni duplicado
CREATE TABLE usuarios (
  id    SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  edad  INTEGER CHECK (edad >= 0 AND edad <= 150)
);

-- Si intentas INSERT con email NULL → ERROR
-- Si intentas INSERT con email duplicado → ERROR
-- Si intentas INSERT con edad -5 → ERROR
```

### 4. Consultas complejas

En vez de recorrer arrays en JavaScript, le pides exactamente lo que necesitas:

```sql
-- Top 5 categorias con mayor gasto promedio de usuarios activos
SELECT c.nombre,
       COUNT(p.id) AS total_productos,
       AVG(p.precio) AS precio_promedio
FROM categorias c
JOIN productos p ON p.categoria_id = c.id
GROUP BY c.id, c.nombre
HAVING COUNT(p.id) > 2
ORDER BY precio_promedio DESC
LIMIT 5;
```

En un archivo JSON esto requeriria leer todo, parsearlo y filtrar con codigo propio.

### 5. Atomicidad y transacciones (ACID)

```sql
-- Transferir $100 de Ana a Carlos
BEGIN;
  UPDATE cuentas SET saldo = saldo - 100 WHERE usuario = 'Ana';
  UPDATE cuentas SET saldo = saldo + 100 WHERE usuario = 'Carlos';
COMMIT;
-- Si algo falla en medio, ROLLBACK deshace todo
-- Carlos NUNCA se queda sin sus $100 si Ana ya los perdio
```

| Letra | Significa | Garantiza que... |
|---|---|---|
| **A**tomicidad | Todo o nada | Si falla a la mitad, se deshace todo |
| **C**onsistencia | Reglas siempre validas | Las constraints se cumplen antes y despues |
| **I**solation | Transacciones no se pisan | Dos transacciones simultaneas no se interfieren |
| **D**urabilidad | Datos no se pierden | Si la BD confirma (COMMIT), el dato sobrevive a un apagon |

### 6. Seguridad

```sql
-- Crear roles con permisos especificos
CREATE ROLE lector WITH LOGIN PASSWORD 'pass123';
GRANT SELECT ON productos TO lector;        -- Solo puede leer
GRANT INSERT, UPDATE ON productos TO editor; -- Puede crear y editar
REVOKE DELETE ON productos FROM editor;      -- Pero no eliminar
```

### 7. Indices: busqueda instantanea

Sin indice:
```
Buscar usuario con email = "ana@email.com"
→ Recorrer 1,000,000 de filas una por una
→ Tiempo: ~500ms
```

Con indice:
```
CREATE INDEX idx_email ON usuarios(email);
Buscar usuario con email = "ana@email.com"
→ El indice (estructura B-tree) apunta directo a la fila
→ Tiempo: ~0.5ms
```

---

## ?Por que no seguir usando archivos?

| | Archivo JSON | Base de datos |
|---|---|---|
| **Buscar un registro** | Leer todo, parsear, recorrer | `SELECT WHERE id = 5` (indice, instantaneo) |
| **Validar datos** | Codigo manual en cada app | Constraints declarativas |
| **Dos apps escribiendo** | Archivo corrupto | BD maneja concurrencia |
| **Transaccion fallida** | Datos inconsistentes | ROLLBACK automatico |
| **Permisos** | Todo o nada (permisos de archivo) | Granular: por tabla, por operacion, por usuario |
| **Backups** | Copia manual del archivo | `pg_dump`, replication, point-in-time recovery |
| **Consultas complejas** | Codigo imperativo | SQL declarativo |
| **Escalar** | Imposible | Replicas, particionamiento |

---

## Tipos de bases de datos (panorama)

```
══════ Relacionales (SQL) ══════       ══════ NoSQL ══════
                                        
PostgreSQL, MySQL, SQLite               • Documentos: MongoDB
                                        • Clave-valor: Redis
• Datos estructurados en tablas          • Grafos: Neo4j
• Esquema rigido (schema first)          • Columnas anchas: Cassandra
• SQL estandar
• ACID                                  • Schemaless o esquema flexible
• JOINs, constraints, FK                • Escalabilidad horizontal simple
                                        • Casos especificos (cache, analytics)
    Usa relacional cuando:                  Usa NoSQL cuando:
    • Los datos tienen estructura clara     • La estructura cambia mucho
    • Necesitas integridad estricta         • Necesitas muchisima velocidad
    • Hay relaciones entre entidades        • Los datos no tienen relaciones
    • Transacciones complejas               • Escalas a miles de servidores
```

> En el 80% de los casos, una base de datos relacional como PostgreSQL es la eleccion correcta. En este bootcamp trabajaremos exclusivamente con PostgreSQL.

---

## Resumen visual

```
╔═══════════════════════════════════════════════════════════╗
║               EVOLUCION DE LA PERSISTENCIA               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  1970s             1990s              2000s               ║
║  Archivos      →   SQL DBs      →    NoSQL + Cloud        ║
║  (txt, csv)        (Oracle,         (MongoDB, Redis,      ║
║   problemas         PostgreSQL)       DynamoDB)            ║
║                     ↑                                     ║
║                     ESTAMOS AQUI                          ║
║                                                           ║
║  Ventajas de PostgreSQL sobre archivos:                   ║
║  ✓ Consultas SQL complejas en milisegundos               ║
║  ✓ Indices B-tree para busqueda instantanea              ║
║  ✓ Transacciones ACID (no pierdes datos)                 ║
║  ✓ Concurrencia: cientos de apps a la vez                ║
║  ✓ Constraints para integridad de datos                  ║
║  ✓ Roles y permisos granulares                           ║
║  ✓ Backups, replicacion, alta disponibilidad             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

# Ejercicios SQL — Base de datos `tienda`

Antes de empezar:

```bash
# 1. Levantar PostgreSQL con Docker
#    La primera vez crea las tablas y carga ~800 registros automaticamente
docker compose up -d

# 2. Conectarse
psql -h localhost -U estudiante -d tienda

# 3. Si necesitas reiniciar desde cero
docker compose down -v
docker compose up -d

# 4. Detener PostgreSQL al terminar
docker compose down
```

> Los archivos `tienda-schema.sql` y `tienda-seed.sql` se ejecutan automaticamente al iniciar el contenedor por primera vez. Los datos persisten en un volumen. `docker compose down -v` destruye el volumen y la proxima vez que subas se recreara todo.

> La BD `tienda` ya viene creada por el `POSTGRES_DB` del docker-compose. Los datos persisten en un volumen aunque detengas el contenedor. Para borrar todo: `docker compose down -v`.

---

## Nivel 1 — Basico: SELECT, WHERE, ORDER BY, LIMIT

### Ejercicio 1

Lista todos los productos de la categoria `Electronica` ordenados por precio de mayor a menor, mostrando solo `nombre` y `precio`.

<details><summary>Pista</summary>
Necesitas JOIN con `categorias` o usar una subconsulta para obtener el `id` de Electronica.
</details>

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 2

Muestra los 10 clientes mas recientes (por `fecha_registro`), mostrando `nombre`, `email` y `ciudad`.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 3

Lista todos los productos con stock menor a 20, ordenados de menor a mayor stock. Muestra `nombre`, `stock` y `precio`.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 4

Encuentra todos los clientes cuyo nombre **contenga** la letra "ez" (ej: Hernandez, Lopez) y que sean de `Ciudad de Mexico`. Muestra `nombre` y `email`.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 5

Muestra todas las ordenes realizadas en el mes de **marzo de 2024**, con su `id`, `fecha`, `total` y `estado`. Ordenalas por fecha.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 6

Lista los productos cuyo precio este entre $20 y $50 (inclusive) y que pertenezcan a la categoria `Hogar y Cocina`. Muestra `nombre` y `precio`.

```sql
-- Escribe tu query aqui:

```

---

## Nivel 2 — Medio: Agregaciones, JOINs

### Ejercicio 7

?Cuantos productos hay en cada categoria? Muestra el `nombre` de la categoria y el `total` de productos, ordenado de mayor a menor.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 8

?Cual es el precio promedio, el mas caro y el mas barato de los productos **activos** de la categoria `Libros`?

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 9

Muestra todas las ordenes con el **nombre del cliente** y su **ciudad**. Incluye ordenes de todos los estados.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 10

Lista el detalle completo de la orden con `id = 42`: el nombre del producto, cantidad, precio unitario y subtotal.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 11

?Cuantas ordenes ha hecho cada cliente? Muestra `nombre` del cliente, `email`, `ciudad` y su `total de ordenes`. Incluye clientes que **no** hayan hecho ninguna orden.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 12

Muestra el top 5 de ciudades con **mayor cantidad de clientes registrados**, indicando cuantos clientes hay en cada una.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 13

?Cuales son los clientes que han gastado mas de $500 en total (suma de todas sus ordenes)? Muestra `nombre`, `email` y `total_gastado`, ordenado de mayor a menor.

```sql
-- Escribe tu query aqui:

```

---

## Nivel 3 — Avanzado: HAVING, Subconsultas, CTEs

### Ejercicio 14

Encuentra las categorias que tienen **mas de 8 productos**. Muestra el nombre de la categoria y el total de productos.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 15

?Que productos tienen un precio **mayor al precio promedio** de todos los productos? Muestra `nombre` y `precio`, ordenados de mayor a menor precio.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 16

?Cuales son los productos que **nunca** han sido vendidos (no aparecen en `detalle_orden`)? Muestra `nombre`, `precio` y `stock`.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 17

Muestra el producto mas vendido (el que aparece mas veces en `detalle_orden`, sumando sus cantidades). Muestra el nombre y la cantidad total vendida.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 18

Para cada cliente, muestra su nombre y el `nombre` del producto mas caro que ha comprado (busca en `detalle_orden` el `precio_unitario` mas alto de ese cliente). Usa una CTE.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 19

Encuentra las ordenes cuyo total es mayor al **promedio de totales** de todas las ordenes de su mismo cliente. Muestra `orden_id`, `cliente_nombre`, `total_orden` y `promedio_cliente`.

```sql
-- Escribe tu query aqui:

```

---

### Ejercicio 20

Muestra un resumen por categoria que incluya: nombre de categoria, cantidad de productos, precio promedio, producto mas caro y producto mas barato. Usa una CTE y JOINs.

```sql
-- Escribe tu query aqui:

```

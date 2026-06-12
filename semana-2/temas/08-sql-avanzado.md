# 6 — SQL: JOINs, GROUP BY y subconsultas

---

## JOINs — combinando tablas

Los JOINs permiten consultar datos de varias tablas relacionadas en una sola query.

### Diagrama visual

```
   usuarios               pedidos
 ┌────┬────────┐      ┌────┬───────────┬────────────┐
 │ id │ nombre │      │ id │ usuario_id│ total      │
 ├────┼────────┤      ├────┼───────────┼────────────┤
 │ 1  │ Ana    │      │ 1  │ 1         │ 100.00     │
 │ 2  │ Carlos │      │ 2  │ 1         │ 50.00      │
 │ 3  │ Maria  │      │ 3  │ 2         │ 75.00      │
 └────┴────────┘      └────┴───────────┴────────────┘
```

---

## INNER JOIN

Solo devuelve filas que tienen coincidencia en **ambas** tablas.

```sql
SELECT u.nombre, p.total
FROM usuarios u
INNER JOIN pedidos p ON u.id = p.usuario_id;
```

Resultado:

```
 nombre  | total
---------+-------
 Ana     | 100.00
 Ana     | 50.00
 Carlos  | 75.00
```

> Maria no aparece porque no tiene pedidos.

---

## LEFT JOIN

Devuelve **todas** las filas de la izquierda + las coincidencias de la derecha. Si no hay match, las columnas derechas son NULL.

```sql
SELECT u.nombre, p.total
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.usuario_id;
```

Resultado:

```
 nombre  | total
---------+-------
 Ana     | 100.00
 Ana     | 50.00
 Carlos  | 75.00
 Maria   | NULL      ← sin pedidos, pero aparece
```

---

## RIGHT JOIN

Igual que LEFT pero al reves. Menos usado (puedes lograr lo mismo con LEFT cambiando el orden de las tablas).

---

## FULL OUTER JOIN

Devuelve todas las filas de ambas tablas. Donde no hay match, NULL.

```sql
SELECT u.nombre, p.total
FROM usuarios u
FULL OUTER JOIN pedidos p ON u.id = p.usuario_id;
```

---

## JOIN con multiples tablas

```sql
-- Usuarios → Pedidos → Productos (via tabla intermedia)
SELECT u.nombre AS usuario,
       pr.nombre AS producto,
       dp.cantidad,
       dp.precio_unitario
FROM usuarios u
JOIN pedidos p ON u.id = p.usuario_id
JOIN detalle_pedido dp ON p.id = dp.pedido_id
JOIN productos pr ON dp.producto_id = pr.id;
```

---

## Sintaxis con alias

```sql
-- Sin alias (verboso)
SELECT usuarios.nombre, pedidos.total
FROM usuarios
INNER JOIN pedidos ON usuarios.id = pedidos.usuario_id;

-- Con alias (recomendado)
SELECT u.nombre, p.total
FROM usuarios u
INNER JOIN pedidos p ON u.id = p.usuario_id;
```

> La palabra `INNER` es opcional: `JOIN` solo ya es INNER JOIN.

---

## GROUP BY — agrupar filas

Agrupa filas que tienen el mismo valor en una o mas columnas para aplicar funciones de agregacion.

```sql
-- Total gastado por cada usuario
SELECT u.nombre, SUM(p.total) AS total_gastado
FROM usuarios u
JOIN pedidos p ON u.id = p.usuario_id
GROUP BY u.id, u.nombre
ORDER BY total_gastado DESC;

-- Cantidad de pedidos por usuario
SELECT u.nombre, COUNT(p.id) AS num_pedidos
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.usuario_id
GROUP BY u.id, u.nombre;
```

**Regla**: toda columna en SELECT que NO este en una funcion de agregacion debe aparecer en GROUP BY.

```sql
-- ❌ Error
SELECT categoria_id, nombre, COUNT(*) FROM productos GROUP BY categoria_id;
-- 'nombre' no esta en GROUP BY ni en funcion de agregacion

-- ? Correcto
SELECT categoria_id, COUNT(*) FROM productos GROUP BY categoria_id;
```

---

## HAVING — filtrar grupos

WHERE filtra filas, HAVING filtra grupos (despues del GROUP BY).

```sql
-- Categorias con mas de 5 productos
SELECT c.nombre, COUNT(p.id) AS total
FROM categorias c
JOIN productos p ON p.categoria_id = c.id
GROUP BY c.id, c.nombre
HAVING COUNT(p.id) > 5;

-- Usuarios que han gastado mas de 1000
SELECT u.nombre, SUM(p.total) AS gastado
FROM usuarios u
JOIN pedidos p ON u.id = p.usuario_id
GROUP BY u.id, u.nombre
HAVING SUM(p.total) > 1000;
```

Orden de ejecucion logico de una query:

```
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

---

## Subconsultas

Una subconsulta es un SELECT dentro de otro SELECT, INSERT, UPDATE o DELETE.

### En WHERE

```sql
-- Productos con precio mayor al promedio
SELECT nombre, precio
FROM productos
WHERE precio > (SELECT AVG(precio) FROM productos);

-- Usuarios que han hecho al menos un pedido
SELECT nombre
FROM usuarios
WHERE id IN (SELECT DISTINCT usuario_id FROM pedidos);
```

### En FROM (derived table)

```sql
-- Promedio de gasto por ciudad
SELECT ciudad, AVG(total_gastado) AS promedio
FROM (
  SELECT u.ciudad, SUM(p.total) AS total_gastado
  FROM usuarios u
  JOIN pedidos p ON u.id = p.usuario_id
  GROUP BY u.id, u.ciudad
) AS gastos_por_usuario
GROUP BY ciudad;
```

### En SELECT (scalar subquery)

```sql
SELECT nombre,
       (SELECT COUNT(*) FROM pedidos WHERE usuario_id = u.id) AS num_pedidos
FROM usuarios u;
```

### Correlacionadas

La subconsulta depende de la consulta externa:

```sql
-- Productos cuyo precio es mayor al promedio de su categoria
SELECT p.nombre, p.precio, p.categoria_id
FROM productos p
WHERE p.precio > (
  SELECT AVG(precio)
  FROM productos
  WHERE categoria_id = p.categoria_id
);
```

---

## CTEs (Common Table Expressions)

Alternativa mas legible a las subconsultas:

```sql
WITH ventas_por_usuario AS (
  SELECT usuario_id, SUM(total) AS total_gastado
  FROM pedidos
  GROUP BY usuario_id
)
SELECT u.nombre, COALESCE(v.total_gastado, 0) AS gastado
FROM usuarios u
LEFT JOIN ventas_por_usuario v ON u.id = v.usuario_id
ORDER BY gastado DESC;
```

`COALESCE` reemplaza NULL por el valor indicado (0 en este caso).

---

## UNION / INTERSECT / EXCEPT

```sql
-- UNION: combinar resultados (elimina duplicados)
SELECT email FROM usuarios
UNION
SELECT email FROM newsletter;

-- UNION ALL: combinar (mantiene duplicados)
SELECT email FROM usuarios
UNION ALL
SELECT email FROM newsletter;

-- INTERSECT: filas que estan en ambas consultas
SELECT email FROM usuarios
INTERSECT
SELECT email FROM newsletter;

-- EXCEPT: filas de la primera que NO estan en la segunda
SELECT email FROM usuarios
EXCEPT
SELECT email FROM newsletter;
```

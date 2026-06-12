# 5 — SQL: DML y consultas basicas

DML (Data Manipulation Language) son los comandos para **trabajar con los datos**: insertar, consultar, actualizar y eliminar.

---

## INSERT

```sql
-- Insertar una fila
INSERT INTO usuarios (nombre, email, edad)
VALUES ('Ana Garcia', 'ana@email.com', 28);

-- Insertar varias filas a la vez
INSERT INTO usuarios (nombre, email, edad) VALUES
  ('Carlos Lopez', 'carlos@email.com', 35),
  ('Maria Torres', 'maria@email.com', 22);

-- Insertar con RETURNING (devuelve lo insertado)
INSERT INTO usuarios (nombre, email, edad)
VALUES ('Pedro Ruiz', 'pedro@email.com', 30)
RETURNING id, nombre, creado_en;
```

> Si omites una columna, se usa su valor DEFAULT o NULL.

---

## SELECT basico

```sql
-- Seleccionar todas las columnas
SELECT * FROM usuarios;

-- Seleccionar columnas especificas
SELECT nombre, email FROM usuarios;

-- Alias de columna
SELECT nombre AS nombre_completo, email AS correo FROM usuarios;

-- Limitar resultados
SELECT * FROM usuarios LIMIT 5;

-- Saltar resultados (paginacion)
SELECT * FROM usuarios LIMIT 10 OFFSET 20;  -- pagina 3 (10 por pagina)

-- Ordenar
SELECT * FROM usuarios ORDER BY nombre ASC;   -- ascendente (default)
SELECT * FROM usuarios ORDER BY creado_en DESC; -- mas reciente primero
SELECT * FROM usuarios ORDER BY edad DESC, nombre ASC; -- multiple
```

---

## WHERE (filtrar)

```sql
-- Igualdad
SELECT * FROM usuarios WHERE edad = 25;

-- Comparaciones
SELECT * FROM usuarios WHERE edad > 18;
SELECT * FROM usuarios WHERE edad >= 18 AND edad <= 30;
SELECT * FROM usuarios WHERE edad BETWEEN 18 AND 30;  -- equivalente

-- Texto con LIKE
SELECT * FROM usuarios WHERE nombre LIKE 'A%';    -- empieza con A
SELECT * FROM usuarios WHERE email LIKE '%@gmail.com';  -- termina con
SELECT * FROM usuarios WHERE nombre LIKE '%ar%';  -- contiene "ar"

-- ILIKE (case-insensitive, PostgreSQL)
SELECT * FROM usuarios WHERE nombre ILIKE 'ana%';  -- Ana, ANA, ana

-- Lista de valores
SELECT * FROM usuarios WHERE id IN (1, 3, 5);
SELECT * FROM usuarios WHERE edad NOT IN (18, 21);

-- Valores nulos
SELECT * FROM usuarios WHERE telefono IS NULL;
SELECT * FROM usuarios WHERE telefono IS NOT NULL;

-- Combinar condiciones
SELECT * FROM usuarios
WHERE activo = true AND (edad > 25 OR email LIKE '%@empresa.com');
```

---

## UPDATE

```sql
-- Actualizar una columna
UPDATE usuarios SET activo = false WHERE id = 5;

-- Actualizar varias columnas
UPDATE usuarios
SET nombre = 'Ana Maria Garcia', edad = 29
WHERE id = 1;

-- Actualizar con RETURNING
UPDATE usuarios
SET activo = false
WHERE ultimo_acceso < '2024-01-01'
RETURNING id, nombre;

-- ⚠️ Sin WHERE actualiza TODAS las filas
-- UPDATE usuarios SET activo = false;  -- PELIGROSO
```

---

## DELETE

```sql
-- Eliminar una fila
DELETE FROM usuarios WHERE id = 10;

-- Eliminar varias
DELETE FROM usuarios WHERE activo = false AND ultimo_acceso < '2023-01-01';

-- Eliminar con RETURNING
DELETE FROM usuarios WHERE id = 10 RETURNING nombre;

-- ⚠️ Sin WHERE elimina TODAS las filas
-- DELETE FROM usuarios;  -- PELIGROSO

-- TRUNCATE: eliminar todo mas rapido (no se puede deshacer)
TRUNCATE TABLE usuarios;
```

---

## Funciones de agregacion

```sql
-- Contar filas
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM usuarios WHERE activo = true;

-- Suma, promedio, minimo, maximo
SELECT
  SUM(precio) AS total,
  AVG(precio) AS promedio,
  MIN(precio) AS mas_barato,
  MAX(precio) AS mas_caro
FROM productos;

-- Contar valores distintos
SELECT COUNT(DISTINCT categoria_id) FROM productos;
```

---

## DISTINCT

```sql
-- Valores unicos de una columna
SELECT DISTINCT ciudad FROM usuarios;

-- Combinaciones unicas de varias columnas
SELECT DISTINCT ciudad, pais FROM usuarios;
```

---

## Ejemplo: queries tipicas de un sistema

```sql
-- Productos mas caros que el promedio
SELECT nombre, precio
FROM productos
WHERE precio > (SELECT AVG(precio) FROM productos)
ORDER BY precio DESC;

-- Top 5 productos mas vendidos
SELECT p.nombre, COUNT(*) AS total_ventas
FROM productos p
JOIN ventas v ON v.producto_id = p.id
GROUP BY p.id, p.nombre
ORDER BY total_ventas DESC
LIMIT 5;

-- Usuarios que no han hecho pedidos en los ultimos 30 dias
SELECT u.nombre, u.email
FROM usuarios u
WHERE u.id NOT IN (
  SELECT DISTINCT usuario_id
  FROM pedidos
  WHERE fecha > NOW() - INTERVAL '30 days'
);
```

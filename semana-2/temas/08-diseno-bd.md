# 7 — Diseño de bases de datos

---

## ?Por que diseñar bien?

Una base de datos mal diseñada causa:

- **Datos duplicados** que se desincronizan
- **Anomalias de actualizacion** (cambias algo en un lado pero no en otro)
- **Consultas lentas** por falta de indices o estructura forzada
- **Dificultad para agregar features** nuevas

---

## Normalizacion

Proceso de organizar los datos para eliminar redundancia. Se divide en **formas normales** (1FN, 2FN, 3FN). En la practica, llegar a 3FN suele ser suficiente.

---

### Primera Forma Normal (1FN)

Cada columna debe contener un **solo valor atomico**. No arrays, no listas.

```sql
-- ❌ No normalizado
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  telefonos VARCHAR(500)  -- "555-1001, 555-1002, 555-1003"
);

-- ? 1FN
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE telefonos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  numero VARCHAR(20)
);
```

---

### Segunda Forma Normal (2FN)

Primero debe cumplir 1FN. Ademas, cada columna no-clave debe depender de **toda** la clave primaria (no solo de una parte).

```sql
-- ❌ No normalizado (PK compuesta: pedido_id + producto_id)
CREATE TABLE detalle_pedido (
  pedido_id INTEGER,
  producto_id INTEGER,
  nombre_producto VARCHAR(200),  -- depende solo de producto_id, no de pedido_id
  cantidad INTEGER,               -- depende de la PK completa
  PRIMARY KEY (pedido_id, producto_id)
);

-- ? 2FN: separar lo que depende parcialmente
CREATE TABLE detalle_pedido (
  pedido_id INTEGER REFERENCES pedidos(id),
  producto_id INTEGER REFERENCES productos(id),
  cantidad INTEGER,
  PRIMARY KEY (pedido_id, producto_id)
);
-- nombre_producto ya esta en la tabla productos
```

---

### Tercera Forma Normal (3FN)

Primero debe cumplir 2FN. Ninguna columna no-clave debe depender de **otra columna no-clave** (dependencia transitiva).

```sql
-- ❌ No normalizado
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  ciudad VARCHAR(100),
  pais VARCHAR(100),       -- pais depende de ciudad, no de id
  codigo_postal VARCHAR(10) -- depende de ciudad, no de id
);

-- ? 3FN
CREATE TABLE ciudades (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  pais VARCHAR(100),
  codigo_postal VARCHAR(10)
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  ciudad_id INTEGER REFERENCES ciudades(id)
);
```

---

## Relaciones entre tablas

### Uno a Uno (1:1)

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE perfiles (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER UNIQUE REFERENCES usuarios(id),  -- UNIQUE = 1:1
  bio TEXT,
  avatar_url VARCHAR(255)
);
```

### Uno a Muchos (1:N)

La relacion mas comun. Un usuario tiene muchos pedidos.

```sql
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  total NUMERIC(10, 2)
);
```

### Muchos a Muchos (N:M)

Un estudiante puede estar en varios cursos. Un curso tiene varios estudiantes. Se usa una **tabla intermedia**.

```sql
CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200)
);

-- Tabla intermedia (junction table)
CREATE TABLE inscripciones (
  estudiante_id INTEGER REFERENCES estudiantes(id) ON DELETE CASCADE,
  curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
  fecha_inscripcion DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (estudiante_id, curso_id)
);

-- Consultar estudiantes de un curso
SELECT e.nombre
FROM estudiantes e
JOIN inscripciones i ON e.id = i.estudiante_id
WHERE i.curso_id = 5;
```

---

## Diagramas ER (Entidad-Relacion)

Convencion para dibujar esquemas:

```
[usuarios] 1 ──── N [pedidos] N ──── M [productos]
  │                     │                   │
  │ id PK               │ id PK             │ id PK
  │ nombre               │ usuario_id FK     │ nombre
  │ email                │ total             │ precio
                          │ fecha
```

| Simbolo | Significado |
|---|---|
| `1 ──── 1` | Uno a uno |
| `1 ──── N` | Uno a muchos |
| `N ──── M` | Muchos a muchos |
| **PK** | Primary Key |
| **FK** | Foreign Key |

Herramienta gratuita para diagramas: https://dbdiagram.io

---

## Ejemplo: diseño de un sistema de biblioteca

### Requisitos

- Hay libros con titulo, autor, ISBN, año
- Hay socios (nombre, email, telefono)
- Un socio puede pedir prestados varios libros
- Un libro puede ser prestado a un socio a la vez
- Registramos fecha de prestamo y fecha de devolucion
- Un libro pertenece a una categoria

### Esquema normalizado

```sql
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE libros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  autor VARCHAR(200) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  anio INTEGER,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  disponible BOOLEAN DEFAULT true
);

CREATE TABLE socios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  activo BOOLEAN DEFAULT true
);

CREATE TABLE prestamos (
  id SERIAL PRIMARY KEY,
  libro_id INTEGER NOT NULL REFERENCES libros(id),
  socio_id INTEGER NOT NULL REFERENCES socios(id),
  fecha_prestamo DATE DEFAULT CURRENT_DATE,
  fecha_devolucion DATE,
  fecha_limite DATE NOT NULL
);
```

### Relaciones

```
[categorias] 1 ──── N [libros] N ──── M [socios]
                                  │
                            [prestamos]
                         (tabla intermedia
                          con datos extra)
```

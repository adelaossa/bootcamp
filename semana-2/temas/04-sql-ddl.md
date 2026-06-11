# 4 — SQL: DDL (Data Definition Language)

DDL son los comandos que definen la **estructura** de la base de datos: crear, modificar y eliminar tablas.

---

## CREATE TABLE

```sql
CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  edad        INTEGER CHECK (edad >= 0 AND edad <= 120),
  activo      BOOLEAN DEFAULT true,
  creado_en   TIMESTAMP DEFAULT NOW()
);
```

Explicacion de cada parte:

| Elemento | Que hace |
|---|---|
| `SERIAL` | Auto-incrementa: 1, 2, 3... |
| `PRIMARY KEY` | Identificador unico de cada fila + indice + NOT NULL |
| `NOT NULL` | No permite valores nulos |
| `UNIQUE` | No permite valores duplicados |
| `CHECK` | Restriccion personalizada |
| `DEFAULT` | Valor por defecto si no se especifica |
| `VARCHAR(100)` | Maximo 100 caracteres |

---

## Constraints (restricciones)

Las restricciones mantienen la integridad de los datos:

```sql
CREATE TABLE productos (
  id          SERIAL PRIMARY KEY,                          -- PK
  nombre      VARCHAR(200) NOT NULL,                        -- NOT NULL
  sku         VARCHAR(50) UNIQUE,                           -- UNIQUE
  precio      NUMERIC(10, 2) CHECK (precio > 0),            -- CHECK
  stock       INTEGER DEFAULT 0 CHECK (stock >= 0),         -- CHECK + DEFAULT
  categoria_id INTEGER REFERENCES categorias(id)            -- FK
);
```

### Foreign Key (FK)

Una FK referencia la PK de otra tabla:

```sql
CREATE TABLE categorias (
  id    SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE productos (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(200) NOT NULL,
  precio        NUMERIC(10, 2),
  categoria_id  INTEGER REFERENCES categorias(id) ON DELETE SET NULL
);
```

`ON DELETE` define que pasa cuando se elimina la fila referenciada:

| Accion | Efecto |
|---|---|
| `ON DELETE CASCADE` | Elimina las filas hijas automaticamente |
| `ON DELETE SET NULL` | Pone la FK a NULL |
| `ON DELETE RESTRICT` | Impide eliminar si hay hijos (default) |
| `ON DELETE NO ACTION` | Similar a RESTRICT |

---

## ALTER TABLE

Modificar una tabla existente:

```sql
-- Agregar columna
ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20);

-- Agregar restriccion
ALTER TABLE usuarios ADD CONSTRAINT email_unico UNIQUE (email);

-- Renombrar columna
ALTER TABLE usuarios RENAME COLUMN telefono TO celular;

-- Cambiar tipo de dato
ALTER TABLE usuarios ALTER COLUMN celular TYPE VARCHAR(30);

-- Eliminar columna
ALTER TABLE usuarios DROP COLUMN celular;

-- Agregar FK
ALTER TABLE productos
  ADD CONSTRAINT fk_categoria
  FOREIGN KEY (categoria_id) REFERENCES categorias(id);
```

---

## DROP TABLE

```sql
-- Eliminar tabla (si existe)
DROP TABLE IF EXISTS productos;

-- Eliminar con CASCADE (elimina tambien objetos dependientes)
DROP TABLE categorias CASCADE;
```

---

## Indices

Mejoran la velocidad de busqueda en columnas consultadas frecuentemente:

```sql
-- Indice simple
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Indice unico
CREATE UNIQUE INDEX idx_usuarios_username ON usuarios(username);

-- Indice compuesto (para consultas que filtran por varias columnas)
CREATE INDEX idx_productos_categoria_precio ON productos(categoria_id, precio);
```

Los indices aceleran SELECT pero ralentizan INSERT/UPDATE/DELETE (porque deben actualizarse). Crea indices solo en columnas que usas frecuentemente en WHERE, JOIN y ORDER BY.

---

## Ejemplo completo: esquema de un blog

```sql
CREATE TABLE autores (
  id    SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email  VARCHAR(255) UNIQUE NOT NULL,
  bio    TEXT
);

CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(255) NOT NULL,
  contenido   TEXT NOT NULL,
  autor_id    INTEGER NOT NULL REFERENCES autores(id) ON DELETE CASCADE,
  publicado   BOOLEAN DEFAULT false,
  creado_en   TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comentarios (
  id        SERIAL PRIMARY KEY,
  contenido TEXT NOT NULL,
  autor     VARCHAR(100) NOT NULL,
  post_id   INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Indices utiles
CREATE INDEX idx_posts_autor ON posts(autor_id);
CREATE INDEX idx_posts_publicado ON posts(publicado);
CREATE INDEX idx_comentarios_post ON comentarios(post_id);
```

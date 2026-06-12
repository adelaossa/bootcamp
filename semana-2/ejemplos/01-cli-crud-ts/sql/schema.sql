-- Crear tabla de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id    SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(200) NOT NULL,
  precio        NUMERIC(10, 2) NOT NULL CHECK (precio > 0),
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria_id  INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  creado_en     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);

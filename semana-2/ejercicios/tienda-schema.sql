-- ═══════════════════════════════════════
-- Base de datos: tienda
-- Tablas: categorias, productos, clientes, ordenes, detalle_orden
-- ═══════════════════════════════════════

CREATE TABLE categorias (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

CREATE TABLE productos (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(200) NOT NULL,
  descripcion   TEXT,
  precio        NUMERIC(10, 2) NOT NULL CHECK (precio > 0),
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria_id  INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  activo        BOOLEAN DEFAULT true,
  creado_en     DATE DEFAULT CURRENT_DATE
);

CREATE TABLE clientes (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  telefono    VARCHAR(20),
  ciudad      VARCHAR(100),
  fecha_registro DATE DEFAULT CURRENT_DATE,
  activo      BOOLEAN DEFAULT true
);

CREATE TABLE ordenes (
  id          SERIAL PRIMARY KEY,
  cliente_id  INTEGER NOT NULL REFERENCES clientes(id),
  fecha       DATE DEFAULT CURRENT_DATE,
  total       NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  estado      VARCHAR(20) DEFAULT 'pendiente'
               CHECK (estado IN ('pendiente', 'enviado', 'entregado', 'cancelado'))
);

CREATE TABLE detalle_orden (
  id            SERIAL PRIMARY KEY,
  orden_id      INTEGER NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id   INTEGER NOT NULL REFERENCES productos(id),
  cantidad      INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario > 0),
  subtotal       NUMERIC(12, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

-- Indices
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_ordenes_cliente ON ordenes(cliente_id);
CREATE INDEX idx_ordenes_fecha ON ordenes(fecha);
CREATE INDEX idx_detalle_orden ON detalle_orden(orden_id);
CREATE INDEX idx_detalle_producto ON detalle_orden(producto_id);

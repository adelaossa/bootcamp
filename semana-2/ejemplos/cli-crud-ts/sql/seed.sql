-- Datos de ejemplo

INSERT INTO categorias (nombre) VALUES
  ('Electronica'),
  ('Hogar'),
  ('Deportes'),
  ('Libros')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES
  ('Laptop Pro', 999.99, 25, 1),
  ('Mouse inalambrico', 29.99, 100, 1),
  ('Teclado mecanico', 89.99, 50, 1),
  ('Lampara LED', 34.99, 75, 2),
  ('Silla ergonomica', 249.99, 15, 2),
  ('Balon de futbol', 19.99, 40, 3),
  ('Bicicleta montañera', 450.00, 10, 3),
  ('Clean Code', 39.99, 60, 4),
  ('Design Patterns', 44.99, 35, 4);

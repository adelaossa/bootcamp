-- Reiniciar la base de datos tienda
-- Si usas Docker, es mas facil: docker compose down -v && docker compose up -d
-- Si usas PostgreSQL local, ejecuta:
--   psql -U estudiante -d tienda -f tienda-reset.sql
--   psql -U estudiante -d tienda -f tienda-schema.sql
--   psql -U estudiante -d tienda -f tienda-seed.sql

DROP TABLE IF EXISTS detalle_orden CASCADE;
DROP TABLE IF EXISTS ordenes CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;

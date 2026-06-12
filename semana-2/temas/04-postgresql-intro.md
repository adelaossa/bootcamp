# 3 — PostgreSQL: instalacion y primeros pasos

---

## Instalacion

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-client
sudo systemctl start postgresql
sudo systemctl enable postgresql   # iniciar automaticamente al arrancar
```

### macOS

```bash
brew install postgresql@16
brew services start postgresql@16
```

---

## Acceder a PostgreSQL

PostgreSQL crea un usuario `postgres` (superadmin) al instalarse.

```bash
# Acceder como superadmin
sudo -u postgres psql

# Si estas en macOS con brew:
psql postgres
```

Dentro de `psql` veras un prompt asi:

```
postgres=#
```

---

## Comandos basicos de psql

| Comando | Que hace |
|---|---|
| `\l` | Listar todas las bases de datos |
| `\c nombre_bd` | Conectarse a una base de datos |
| `\dt` | Listar tablas de la BD actual |
| `\d nombre_tabla` | Describir estructura de una tabla |
| `\du` | Listar usuarios/roles |
| `\q` | Salir de psql |

---

## Crear una base de datos

```sql
-- Desde psql
CREATE DATABASE bootcamp;

-- Conectarse a ella
\c bootcamp
```

El prompt cambia a:

```
bootcamp=#
```

---

## Crear un usuario (rol)

Por seguridad, no uses `postgres` para tus aplicaciones. Crea un usuario especifico:

```sql
CREATE USER estudiante WITH PASSWORD 'pass123';
GRANT ALL PRIVILEGES ON DATABASE bootcamp TO estudiante;

-- Dar permisos sobre las tablas futuras
ALTER DATABASE bootcamp OWNER TO estudiante;
```

Ahora puedes conectarte con ese usuario:

```bash
psql -U estudiante -d bootcamp -h localhost
```

> Si pide password y no lo acepta, revisa el archivo `pg_hba.conf`:
> ```bash
> sudo nano /etc/postgresql/16/main/pg_hba.conf
> ```
> Cambia `peer` por `md5` en las conexiones locales y reinicia: `sudo systemctl restart postgresql`

---

## Alternativa grafica: DBeaver

Si prefieres una interfaz grafica en vez de la terminal:

```bash
# Instalar DBeaver (Linux)
wget https://dbeaver.io/files/dbeaver-ce-latest-linux.gtk.x86_64.tar.gz
tar -xzf dbeaver-ce-*.tar.gz
./dbeaver/dbeaver
```

O descargalo desde https://dbeaver.io

---

## Tipos de datos mas comunes

| Tipo | Descripcion | Ejemplo |
|---|---|---|
| `SERIAL` | Entero autoincremental (para IDs) | `id SERIAL PRIMARY KEY` |
| `INTEGER` | Entero de 4 bytes | `edad INTEGER` |
| `BIGINT` | Entero de 8 bytes | `poblacion BIGINT` |
| `VARCHAR(n)` | Texto de longitud variable (max n) | `nombre VARCHAR(100)` |
| `TEXT` | Texto de longitud ilimitada | `descripcion TEXT` |
| `BOOLEAN` | Verdadero/falso | `activo BOOLEAN DEFAULT true` |
| `DATE` | Fecha (sin hora) | `fecha_nacimiento DATE` |
| `TIMESTAMP` | Fecha y hora | `creado_en TIMESTAMP DEFAULT NOW()` |
| `NUMERIC(p, s)` | Decimal exacto (p digitos, s decimales) | `precio NUMERIC(10, 2)` |
| `UUID` | Identificador universal | `id UUID DEFAULT gen_random_uuid()` |

---

## Comandos utiles desde la terminal

```bash
# Crear BD desde terminal (sin entrar a psql)
createdb -U postgres nombre_bd

# Eliminar BD
dropdb -U postgres nombre_bd

# Ejecutar un archivo .sql
psql -U estudiante -d bootcamp -f archivo.sql

# Hacer un dump (backup)
pg_dump -U estudiante bootcamp > backup.sql

# Restaurar un dump
psql -U estudiante -d bootcamp < backup.sql
```

# Muro de Mensajes — Express + PostgreSQL

Ejemplo basado en el muro de mensajes de la semana 1, pero con PostgreSQL en vez de array en memoria.

## Que demuestra

- Misma app, mismo frontend (HTML/CSS/JS identico), pero los datos persisten en PostgreSQL
- El frontend no sabe ni necesita saber donde se guardan los datos
- Conexion a PostgreSQL con `pg` (node-postgres)
- Auto-inicializacion: si la tabla no existe, se crea y se puebla con datos de ejemplo

## Requisitos

- Node.js 18+
- Docker y Docker Compose

## Como ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar PostgreSQL con Docker
docker compose up -d

# 3. Iniciar el servidor (la primera vez crea tablas y datos)
node server.js

# 4. Abrir http://localhost:3000
```

> La primera vez que arranca, el servidor detecta que la tabla `mensajes` no existe y la crea junto con datos de ejemplo. Los datos persisten en un volumen aunque detengas el contenedor. Para reiniciar desde cero: `docker compose down -v`.

## Comparacion con el ejemplo de la semana 1

| | Semana 1 | Semana 2 |
|---|---|---|
| **Donde se guardan los datos** | Array en memoria (`let mensajes = []`) | PostgreSQL (`SELECT`/`INSERT`) |
| **Persistencia** | Se pierde al reiniciar el server | Los datos sobreviven |
| **GET /api/mensajes** | `res.json(mensajes)` | `pool.query("SELECT * FROM mensajes ORDER BY id DESC")` |
| **POST /api/mensajes** | `mensajes.push(...)` | `pool.query("INSERT INTO mensajes ... RETURNING *")` |
| **Frontend** | `fetch` + DOM | `fetch` + DOM **(identico)** |
| **Docker** | No | `docker compose up -d` |

## Estructura

```
├── server.js              ← Express + pg + auto-init
├── public/
│   ├── index.html         ← formulario + lista
│   ├── style.css          ← estilos
│   └── app.js             ← fetch + DOM
├── sql/
│   ├── schema.sql         ← CREATE TABLE mensajes
│   └── seed.sql           ← datos de ejemplo
├── docker-compose.yml     ← PostgreSQL
├── package.json
└── .gitignore
```

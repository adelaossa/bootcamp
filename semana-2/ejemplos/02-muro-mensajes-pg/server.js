import express from "express"
import cors from "cors"
import pg from "pg"
import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// ─── Conexion a PostgreSQL ───

const pool = new pg.Pool({
  user: "estudiante",
  password: "pass123",
  host: "localhost",
  port: 5432,
  database: "bootcamp"
})

pool.on("error", (err) => {
  console.error("Error en el pool de PostgreSQL:", err)
  process.exit(-1)
})

// ─── Inicializar la base de datos ───

async function inicializarBD() {
  const { rows } = await pool.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'mensajes'
    ) AS existe`
  )

  if (rows[0]?.existe) return

  console.log("Creando tablas y datos de ejemplo...")

  const schemaSQL = await readFile(join(__dirname, "sql", "schema.sql"), "utf-8")
  await pool.query(schemaSQL)

  const seedSQL = await readFile(join(__dirname, "sql", "seed.sql"), "utf-8")
  await pool.query(seedSQL)

  console.log("Base de datos inicializada.")
}

// ─── API REST ───

// GET /api/mensajes → listar todos
app.get("/api/mensajes", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM mensajes ORDER BY id DESC"
    )
    res.json(rows)
  } catch (error) {
    console.error("Error al listar mensajes:", error)
    res.status(500).json({ error: "Error al obtener los mensajes" })
  }
})

// POST /api/mensajes → crear un nuevo mensaje
app.post("/api/mensajes", async (req, res) => {
  const { texto, autor } = req.body

  if (!texto || !texto.trim()) {
    return res.status(400).json({ error: "El campo 'texto' es requerido" })
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO mensajes (texto, autor)
       VALUES ($1, $2)
       RETURNING *`,
      [texto.trim(), autor?.trim() || "Anonimo"]
    )

    res.status(201).json(rows[0])
  } catch (error) {
    console.error("Error al crear mensaje:", error)
    res.status(500).json({ error: "Error al crear el mensaje" })
  }
})

// ─── Iniciar servidor ───

inicializarBD()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Error al inicializar la BD:", err)
    process.exit(1)
  })

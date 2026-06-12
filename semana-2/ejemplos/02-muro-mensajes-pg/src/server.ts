import express from "express"
import cors from "cors"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import pool from "./db.js"
import { inicializarBD } from "./init.js"
import type { Mensaje } from "./tipos.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.static(join(__dirname, "..", "public")))

// ─── API REST ───

app.get("/api/mensajes", async (_req, res) => {
  try {
    const { rows } = await pool.query<Mensaje>(
      "SELECT * FROM mensajes ORDER BY id DESC"
    )
    res.json(rows)
  } catch (error) {
    console.error("Error al listar mensajes:", error)
    res.status(500).json({ error: "Error al obtener los mensajes" })
  }
})

app.post("/api/mensajes", async (req, res) => {
  const { texto, autor } = req.body as { texto: string; autor?: string }

  if (!texto || !texto.trim()) {
    res.status(400).json({ error: "El campo 'texto' es requerido" })
    return
  }

  try {
    const { rows } = await pool.query<Mensaje>(
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

import express from "express"
import cors from "cors"

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Servir archivos estaticos desde la carpeta public/
app.use(express.static("public"))

// ─── Datos en memoria ───

let mensajes = []
let nextId = 1

// ─── API REST ───

// GET /api/mensajes → obtener todos los mensajes
app.get("/api/mensajes", (req, res) => {
  res.json(mensajes)
})

// POST /api/mensajes → crear un nuevo mensaje
app.post("/api/mensajes", (req, res) => {
  const { texto, autor } = req.body

  if (!texto || !texto.trim()) {
    return res.status(400).json({ error: "El campo 'texto' es requerido" })
  }

  const nuevoMensaje = {
    id: nextId++,
    texto: texto.trim(),
    autor: autor?.trim() || "Anonimo",
    fecha: new Date().toISOString()
  }

  mensajes.push(nuevoMensaje)
  res.status(201).json(nuevoMensaje)
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

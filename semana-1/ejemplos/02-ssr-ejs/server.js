import express from "express"

const app = express()
const PORT = 3000

// Configurar EJS como motor de plantillas
app.set("view engine", "ejs")

// Servir archivos estaticos (CSS, imagenes, JS del lado del cliente)
app.use(express.static("public"))

// Parsear formularios HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }))

// ─── Datos en memoria ───

let tareas = [
  { id: 1, titulo: "Aprender que es CSR", completada: true },
  { id: 2, titulo: "Aprender que es SSR", completada: false },
  { id: 3, titulo: "Hacer el mini-proyecto", completada: false }
]
let nextId = 4

// ─── Rutas ───

// GET / → pagina principal con lista de tareas
app.get("/", (req, res) => {
  res.render("index", { tareas })
})

// GET /tareas/nueva → formulario para crear tarea
app.get("/tareas/nueva", (req, res) => {
  res.render("formulario", { error: null })
})

// POST /tareas → crear tarea (desde formulario HTML)
app.post("/tareas", (req, res) => {
  const { titulo } = req.body

  if (!titulo || !titulo.trim()) {
    return res.render("formulario", { error: "El titulo es requerido" })
  }

  tareas.push({
    id: nextId++,
    titulo: titulo.trim(),
    completada: false
  })

  // Post/Redirect/Get: redirigir para evitar reenvio del formulario
  res.redirect("/")
})

// POST /tareas/:id/completar → toggle completada
app.post("/tareas/:id/completar", (req, res) => {
  const id = Number(req.params.id)
  const tarea = tareas.find(t => t.id === id)

  if (tarea) {
    tarea.completada = !tarea.completada
  }

  res.redirect("/")
})

// POST /tareas/:id/eliminar → eliminar tarea
app.post("/tareas/:id/eliminar", (req, res) => {
  const id = Number(req.params.id)
  tareas = tareas.filter(t => t.id !== id)

  res.redirect("/")
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor SSR corriendo en http://localhost:${PORT}`)
})

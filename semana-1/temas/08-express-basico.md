# 8 — Express basico

Express es un framework minimalista para Node.js que permite crear servidores HTTP y APIs REST de forma sencilla.

---

## Instalacion

```bash
npm init -y
npm install express
```

> Asegurate de tener `"type": "module"` en tu `package.json` para usar `import`/`export`.

---

## Tu primer servidor

```javascript
// server.js
import express from "express"

const app = express()
const PORT = 3000

// Middleware para parsear JSON en el body de las solicitudes
app.use(express.json())

// Ruta raiz
app.get("/", (req, res) => {
  res.send("Hola mundo!")
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
```

Ejecutar:
```bash
node server.js
```

Abre `http://localhost:3000` en el navegador. Veras "Hola mundo!".

---

## Anatomia de una ruta

```javascript
app.get("/api/usuarios", (req, res) => {
  // req = request  (lo que llega del cliente)
  // res = response (lo que le enviamos de vuelta)
  
  const usuarios = [
    { id: 1, nombre: "Ana" },
    { id: 2, nombre: "Carlos" }
  ]
  
  res.json(usuarios)   // Envia JSON con status 200
})
```

---

## CRUD completo (datos en memoria)

```javascript
import express from "express"

const app = express()
const PORT = 3000

app.use(express.json())

let tareas = [
  { id: 1, titulo: "Estudiar Express", completada: false },
  { id: 2, titulo: "Hacer el mini-proyecto", completada: false }
]
let nextId = 3

// GET /tareas — listar todas
app.get("/tareas", (req, res) => {
  res.json(tareas)
})

// GET /tareas/:id — obtener una
app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id)
  const tarea = tareas.find(t => t.id === id)
  
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }
  
  res.json(tarea)
})

// POST /tareas — crear
app.post("/tareas", (req, res) => {
  const { titulo } = req.body
  
  if (!titulo) {
    return res.status(400).json({ error: "El campo 'titulo' es requerido" })
  }
  
  const nuevaTarea = {
    id: nextId++,
    titulo,
    completada: false
  }
  
  tareas.push(nuevaTarea)
  res.status(201).json(nuevaTarea)
})

// PUT /tareas/:id — actualizar
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id)
  const tarea = tareas.find(t => t.id === id)
  
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }
  
  const { titulo, completada } = req.body
  
  if (titulo !== undefined) tarea.titulo = titulo
  if (completada !== undefined) tarea.completada = completada
  
  res.json(tarea)
})

// DELETE /tareas/:id — eliminar
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id)
  const index = tareas.findIndex(t => t.id === id)
  
  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }
  
  tareas.splice(index, 1)
  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})
```

---

## Conceptos importantes

### req (request)

| Propiedad | Descripcion | Ejemplo |
|---|---|---|
| `req.params` | Parametros de ruta (`:id`) | `/tareas/5` → `{ id: "5" }` |
| `req.query` | Query string (`?key=value`) | `/tareas?completada=true` → `{ completada: "true" }` |
| `req.body` | Cuerpo de la solicitud (JSON) | `{ titulo: "Nueva tarea" }` |
| `req.headers` | Headers HTTP | `{ "content-type": "application/json" }` |

> Para que `req.body` funcione, necesitas el middleware `app.use(express.json())`.

### res (response)

| Metodo | Uso |
|---|---|
| `res.json(datos)` | Enviar datos en formato JSON (status 200) |
| `res.status(codigo).json(datos)` | Enviar JSON con un codigo de estado especifico |
| `res.status(codigo).send()` | Enviar respuesta sin cuerpo (ej: 204) |
| `res.status(codigo).json({ error: "..." })` | Enviar un mensaje de error |

### Codigos de estado que debes usar

| Situacion | Codigo |
|---|---|
| Recurso obtenido exitosamente | `200 OK` |
| Recurso creado | `201 Created` |
| Recurso eliminado (sin body) | `204 No Content` |
| Datos invalidos del cliente | `400 Bad Request` |
| Recurso no encontrado | `404 Not Found` |
| Error inesperado del servidor | `500 Internal Server Error` |

---

## Servir archivos estaticos (HTML, CSS, JS)

Para que el servidor tambien entregue tu frontend:

```javascript
import express from "express"
import path from "node:path"

const app = express()

// Servir archivos estaticos desde la carpeta "public"
app.use(express.static("public"))

// Todas las rutas de la API...
app.get("/tareas", (req, res) => { /* ... */ })

app.listen(3000)
```

Estructura del proyecto:
```
mi-proyecto/
├── server.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── package.json
```

Con esto, al abrir `http://localhost:3000` el navegador recibe `public/index.html`.

---

## CORS (Cross-Origin Resource Sharing)

Si el frontend y el backend estan en dominios/puertos diferentes, el navegador bloquea las peticiones por seguridad. Para permitirlo durante desarrollo:

```bash
npm install cors
```

```javascript
import cors from "cors"

app.use(cors())  // Permitir todas las origenes (solo para desarrollo)
```

---

## Probar la API sin frontend

Mientras desarrollas, puedes probar los endpoints con:

- **Thunder Client** (extension de VS Code)
- **Postman**
- **curl** desde la terminal:

```bash
curl http://localhost:3000/tareas
curl -X POST http://localhost:3000/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Aprender Express"}'
curl -X DELETE http://localhost:3000/tareas/1
```

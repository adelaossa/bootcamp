# 10 — Renderizado del lado del servidor (SSR)

Hasta ahora vimos como el frontend (HTML + JS) consume la API con `fetch` y actualiza el DOM. A esto se le llama **Client-Side Rendering (CSR)**: el navegador recibe una pagina casi vacia, luego JavaScript pide datos al servidor y arma el HTML.

Existe otro enfoque: **Server-Side Rendering (SSR)**. El servidor arma el HTML completo con los datos incluidos y se lo envia al navegador. El navegador solo lo muestra.

---

## CSR vs SSR

```
═══ Client-Side Rendering (CSR) ═══
1. Navegador pide la pagina
2. Servidor responde HTML casi vacio
3. Navegador ejecuta JS (fetch)
4. JS pide datos a la API
5. JS construye HTML y lo inyecta

[Servidor]  ── index.html (vacio) ──>  [Navegador]
[Servidor]  <── fetch /tareas ────────  [Navegador]
[Servidor]  ── JSON datos ───────────>  [Navegador]
                                     →  JS arma <li>, <table>, etc.
```

```
═══ Server-Side Rendering (SSR) ═══
1. Navegador pide la pagina
2. Servidor consulta los datos
3. Servidor arma HTML completo con datos
4. Servidor envia HTML listo
5. Navegador lo muestra (sin esperar JS)

[Servidor]  <── GET /tareas ────────── [Navegador]
[Servidor]  ── HTML con datos ───────> [Navegador]
               <li>Comprar pan</li>
               <li>Estudiar</li>
```

| CSR (lo que hicimos) | SSR (lo que veremos ahora) |
|---|---|
| HTML se construye en el navegador | HTML se construye en el servidor |
| Primera carga mas lenta (doble viaje) | Primera carga mas rapida |
| Interaccion fluida (no recarga la pagina) | Cada accion recarga la pagina |
| Ideal para apps interactivas (SPA) | Ideal para paginas con mucho contenido |
| La API devuelve JSON | El servidor devuelve HTML |

Ninguno es mejor que el otro: son herramientas distintas para problemas distintos.

---

## SSR con Express y EJS

EJS (Embedded JavaScript) es un motor de plantillas para Express. Permite escribir HTML con codigo JavaScript embebido usando etiquetas `<% %>`.

### Instalacion

```bash
npm install ejs
```

Express reconoce EJS automaticamente si esta instalado. Solo necesitas configurar:

```javascript
app.set("view engine", "ejs")
```

Por defecto busca las vistas en la carpeta `views/`.

### Estructura del proyecto

```
mi-proyecto/
├── server.js
├── views/
│   ├── index.ejs        ← Pagina principal (lista de tareas)
│   └── detalle.ejs      ← Pagina de detalle de una tarea
├── public/
│   └── style.css        ← CSS (se sigue sirviendo estatico)
└── package.json
```

---

## Tu primer template EJS

```html
<!-- views/index.ejs -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Lista de Tareas</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Mis Tareas</h1>
  
  <ul>
    <% tareas.forEach(tarea => { %>
      <li>
        <span class="<%= tarea.completada ? 'completada' : '' %>">
          <%= tarea.titulo %>
        </span>
      </li>
    <% }) %>
  </ul>
</body>
</html>
```

Tres tipos de etiquetas EJS:

| Etiqueta | Proposito | Ejemplo |
|---|---|---|
| `<%= variable %>` | Imprime el valor escapado (seguro contra XSS) | `<%= tarea.titulo %>` |
| `<%- html %>` | Imprime HTML sin escapar (cuidado) | `<%- "<strong>Hola</strong>" %>` |
| `<% codigo %>` | Ejecuta JavaScript (no imprime nada) | `<% if (condicion) { %>` |

---

## Enviando datos al template

```javascript
// server.js
import express from "express"

const app = express()
app.set("view engine", "ejs")

app.use(express.static("public"))   // CSS, imagenes
app.use(express.urlencoded({ extended: true }))  // Parsear formularios HTML

let tareas = [
  { id: 1, titulo: "Estudiar Express", completada: false },
  { id: 2, titulo: "Hacer el mini-proyecto", completada: false }
]
let nextId = 3

// GET / → renderizar la vista con los datos
app.get("/", (req, res) => {
  res.render("index", { tareas: tareas })
  //             │         └── datos que recibe el template
  //             └── nombre del archivo en views/
})

app.listen(3000)
```

`res.render("vista", datos)` busca `views/vista.ejs`, le pasa los datos y envia el HTML resultante.

---

## CRUD completo con SSR

A diferencia del CSR (donde el frontend hace fetch), aca **cada accion del usuario genera una nueva solicitud HTTP al servidor**, que responde con una pagina HTML completa. Esto es como funcionaba la web antes de los SPAs.

```javascript
// server.js
import express from "express"

const app = express()
const PORT = 3000

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

let tareas = [
  { id: 1, titulo: "Estudiar Express", completada: false },
  { id: 2, titulo: "Hacer el mini-proyecto", completada: false }
]
let nextId = 3

// Mostrar todas las tareas
app.get("/", (req, res) => {
  res.render("index", { tareas })
})

// Formulario para crear tarea (pagina aparte)
app.get("/tareas/nueva", (req, res) => {
  res.render("formulario")
})

// Procesar el formulario (POST desde HTML, no JSON)
app.post("/tareas", (req, res) => {
  const { titulo } = req.body
  
  if (!titulo) {
    return res.render("formulario", { error: "El titulo es requerido" })
  }
  
  tareas.push({ id: nextId++, titulo, completada: false })
  res.redirect("/")   // Redirige al listado
})

// Marcar como completada
app.post("/tareas/:id/completar", (req, res) => {
  const id = Number(req.params.id)
  const tarea = tareas.find(t => t.id === id)
  
  if (tarea) {
    tarea.completada = !tarea.completada
  }
  
  res.redirect("/")
})

// Eliminar
app.post("/tareas/:id/eliminar", (req, res) => {
  const id = Number(req.params.id)
  tareas = tareas.filter(t => t.id !== id)
  res.redirect("/")
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
```

> Nota: usamos `POST` para completar y eliminar porque los formularios HTML solo soportan `GET` y `POST`. No pueden enviar `PUT` ni `DELETE`.

---

## Templates necesarios

### `views/index.ejs` — Lista de tareas

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mis Tareas</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Mis Tareas</h1>
  
  <a href="/tareas/nueva">+ Nueva tarea</a>
  
  <ul>
    <% if (tareas.length === 0) { %>
      <li>No hay tareas pendientes</li>
    <% } %>
    
    <% tareas.forEach(tarea => { %>
      <li>
        <span class="<%= tarea.completada ? 'completada' : '' %>">
          <%= tarea.titulo %>
        </span>
        
        <form action="/tareas/<%= tarea.id %>/completar" method="POST" style="display:inline">
          <button type="submit">
            <%= tarea.completada ? 'Desmarcar' : 'Completar' %>
          </button>
        </form>
        
        <form action="/tareas/<%= tarea.id %>/eliminar" method="POST" style="display:inline">
          <button type="submit">Eliminar</button>
        </form>
      </li>
    <% }) %>
  </ul>
</body>
</html>
```

### `views/formulario.ejs` — Crear tarea

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nueva Tarea</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Nueva Tarea</h1>
  
  <% if (locals.error) { %>
    <p style="color:red"><%= error %></p>
  <% } %>
  
  <form action="/tareas" method="POST">
    <input type="text" name="titulo" placeholder="Titulo de la tarea" required>
    <button type="submit">Crear</button>
  </form>
  
  <a href="/">← Volver</a>
</body>
</html>
```

---

## Punto clave: `res.redirect()` vs `res.render()`

```javascript
// Despues de CREAR, EDITAR o ELIMINAR → redirect
app.post("/tareas", (req, res) => {
  // Guardar...
  res.redirect("/")   // El navegador hace un GET a /
})

// Para MOSTRAR una pagina → render
app.get("/tareas/nueva", (req, res) => {
  res.render("formulario")
})
```

**?Por que redirect despues de modificar datos?**

Si hicieras `res.render("index", { tareas })` despues de un POST, la URL del navegador quedaria como `/tareas` y si el usuario recarga la pagina, re-enviaria el POST (creando otra tarea duplicada). Con `redirect`, la URL cambia a `/` y recargar solo hace un GET.

Este patron se llama **Post/Redirect/Get (PRG)**.

---

## ?CSR o SSR para el mini-proyecto?

Para el mini-proyecto de esta semana, pueden elegir cualquiera de los dos enfoques:

| Enfoque | Archivos clave | Ventaja |
|---|---|---|
| **CSR** (fetch + DOM) | `server.js` + `public/index.html` + `public/app.js` | Mas parecido a como trabajaran con React/Angular despues |
| **SSR** (EJS) | `server.js` + `views/index.ejs` + `views/formulario.ejs` | Mas simple, menos archivos, entienden como funciona la web clasica |
| **Hibrido** | Combinar ambos | La mejor comprension: SSR para la carga inicial, fetch para interacciones sin recarga |

Si eligen hibrido, el flujo es:
1. `GET /` → servidor renderiza EJS con los datos iniciales
2. Crear/editar/eliminar → formularios HTML normales (POST, redirect)
3. Bonus: agregar un boton de "marcar completada" que use `fetch` para no recargar la pagina

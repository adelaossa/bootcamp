# 9 — HTML + fetch: frontend sin frameworks

Vamos a construir un frontend para nuestra API usando solo HTML, CSS y JavaScript vanilla. Sin React, sin Angular, sin bundlers.

---

## Estructura base de un HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Tareas</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Mis Tareas</h1>

  <!-- Formulario para crear tareas -->
  <form id="form-tarea">
    <input type="text" id="titulo" placeholder="Nueva tarea..." required>
    <button type="submit">Agregar</button>
  </form>

  <!-- Lista de tareas -->
  <ul id="lista-tareas"></ul>

  <script src="app.js"></script>
</body>
</html>
```

---

## Consumir la API con fetch

El objeto `fetch` hace solicitudes HTTP desde el navegador. Devuelve una promesa.

### GET: obtener datos y renderizarlos

```javascript
// app.js

const API_URL = "http://localhost:3000/tareas"
const listaTareas = document.getElementById("lista-tareas")

async function cargarTareas() {
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    const tareas = await response.json()
    renderizarTareas(tareas)
  } catch (error) {
    console.error("No se pudieron cargar las tareas:", error)
    listaTareas.innerHTML = "<li>Error al cargar tareas</li>"
  }
}

function renderizarTareas(tareas) {
  listaTareas.innerHTML = ""  // Limpiar lista
  
  tareas.forEach(tarea => {
    const li = document.createElement("li")
    li.innerHTML = `
      <span class="${tarea.completada ? 'completada' : ''}">${tarea.titulo}</span>
      <button onclick="marcarCompletada(${tarea.id}, ${!tarea.completada})">
        ${tarea.completada ? 'Desmarcar' : 'Completar'}
      </button>
      <button onclick="eliminarTarea(${tarea.id})">Eliminar</button>
    `
    listaTareas.appendChild(li)
  })
}
```

### POST: crear un recurso

```javascript
async function crearTarea(titulo) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo })
    })
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    await cargarTareas()  // Recargar la lista
  } catch (error) {
    console.error("Error al crear tarea:", error)
  }
}

// Escuchar el formulario
const form = document.getElementById("form-tarea")
const inputTitulo = document.getElementById("titulo")

form.addEventListener("submit", (event) => {
  event.preventDefault()  // Evitar que la pagina se recargue
  const titulo = inputTitulo.value.trim()
  
  if (titulo) {
    crearTarea(titulo)
    inputTitulo.value = ""  // Limpiar input
  }
})
```

### PUT: actualizar un recurso

```javascript
async function marcarCompletada(id, completada) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada })
    })
    
    await cargarTareas()
  } catch (error) {
    console.error("Error al actualizar:", error)
  }
}
```

### DELETE: eliminar un recurso

```javascript
async function eliminarTarea(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
    
    await cargarTareas()
  } catch (error) {
    console.error("Error al eliminar:", error)
  }
}
```

---

## Flujo completo: init

```javascript
// Ejecutar al cargar la pagina
cargarTareas()
```

---

## Estilos basicos (style.css)

```css
body {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
}

#form-tarea {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

#form-tarea input {
  flex: 1;
  padding: 8px;
  font-size: 16px;
}

#form-tarea button {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}

#lista-tareas {
  list-style: none;
  padding: 0;
}

#lista-tareas li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

#lista-tareas li span {
  flex: 1;
}

.completada {
  text-decoration: line-through;
  color: gray;
}
```

---

## Errores comunes (y como evitarlos)

| Error | Causa | Solucion |
|---|---|---|
| `Failed to fetch` | Backend no esta corriendo | Arrancar el servidor: `node server.js` |
| CORS bloqueado | Frontend y backend en dominios distintos | Instalar y usar `cors` en Express |
| `req.body` es `undefined` | Falta `express.json()` | Agregar `app.use(express.json())` |
| Boton recarga la pagina | El `<button>` dentro de un `<form>` hace submit | Usar `event.preventDefault()` |

---

## Patron que se repite SIEMPRE

Cada vez que hagas una operacion CRUD en el frontend, el patron es identico:

```
1. Usuario interactua  →  click, submit, etc.
2. Llamar fetch        →  GET, POST, PUT, DELETE
3. Esperar respuesta   →  await, verificar response.ok
4. Actualizar la UI    →  recargar datos, cambiar DOM
5. Manejar errores     →  try/catch, mostrar mensaje
```

Internaliza este patron: lo repetiras en **todos** los frameworks (React, Angular) con ligeras variaciones sintacticas.

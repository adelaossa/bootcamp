const API_URL = "/api/mensajes"

const formMensaje = document.getElementById("form-mensaje")
const inputAutor = document.getElementById("input-autor")
const inputTexto = document.getElementById("input-texto")
const listaMensajes = document.getElementById("lista-mensajes")
const contador = document.getElementById("contador")

// ─── Cargar mensajes al iniciar ───

async function cargarMensajes() {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`Error ${response.status}`)
    }

    const mensajes = await response.json()
    mostrarMensajes(mensajes)
  } catch (error) {
    listaMensajes.innerHTML =
      `<li class="vacio">Error al cargar mensajes: ${error.message}</li>`
  }
}

// ─── Renderizar mensajes en el DOM ───

function mostrarMensajes(mensajes) {
  contador.textContent = mensajes.length

  if (mensajes.length === 0) {
    listaMensajes.innerHTML =
      '<li class="vacio">No hay mensajes todavia. Se el primero en escribir!</li>'
    return
  }

  listaMensajes.innerHTML = ""

  mensajes.forEach(mensaje => {
    const fecha = new Date(mensaje.fecha).toLocaleString("es-MX")

    const li = document.createElement("li")
    li.innerHTML = `
      <div class="autor">${mensaje.autor}</div>
      <div class="texto">${mensaje.texto}</div>
      <span class="fecha">${fecha}</span>
    `
    listaMensajes.appendChild(li)
  })
}

// ─── Crear un nuevo mensaje ───

async function crearMensaje(texto, autor) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, autor })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error ${response.status}`)
    }

    await cargarMensajes()
  } catch (error) {
    alert(error.message)
  }
}

// ─── Escuchar el formulario ───

formMensaje.addEventListener("submit", (event) => {
  event.preventDefault()

  const texto = inputTexto.value.trim()
  const autor = inputAutor.value.trim()

  if (!texto) return

  crearMensaje(texto, autor)

  inputTexto.value = ""
  inputAutor.value = ""
  inputTexto.focus()
})

// ─── Cargar al abrir la pagina ───

cargarMensajes()

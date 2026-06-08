# 11 — Mini-proyecto: CRUD de Tareas (Express + HTML)

---

## Objetivo

Construir una aplicacion web de lista de tareas con backend en Express (API REST) y frontend en HTML/CSS/JS vanilla que consuma la API con `fetch`. Trabajar en parejas usando Gitflow completo.

---

## Stack

| Capa | Tecnologia |
|---|---|
| Backend | Node.js + Express (API REST JSON) |
| Datos | Array en memoria (sin base de datos) |
| Frontend | HTML + CSS + JavaScript vanilla (fetch + DOM) |
| Control de versiones | Git + GitHub |

---

## API REST que deben implementar

| Metodo | Ruta | Body esperado | Respuesta |
|---|---|---|---|
| `GET` | `/tareas` | — | Array de tareas |
| `GET` | `/tareas/:id` | — | Una tarea |
| `POST` | `/tareas` | `{ titulo: string }` | Tarea creada (201) |
| `PUT` | `/tareas/:id` | `{ titulo?, completada? }` | Tarea actualizada |
| `DELETE` | `/tareas/:id` | — | 204 No Content |

---

## Ejemplo de datos

```javascript
// Cada tarea tiene esta forma:
{
  id: 1,
  titulo: "Aprender Express",
  completada: false
}
```

Los `id` se generan automaticamente (incremental). No se reciben del cliente.

---

## Requisitos minimos

### Backend (server.js)

- [ ] Servidor Express corriendo en puerto 3000
- [ ] Middleware `express.json()`
- [ ] Middleware `cors`
- [ ] CRUD completo de tareas con array en memoria (rutas `/tareas`)
- [ ] Validacion: `titulo` es requerido al crear (400 si falta)
- [ ] Validacion: devolver 404 si la tarea no existe
- [ ] Servir archivos estaticos desde carpeta `public/`

### Frontend (public/)

- [ ] `index.html` con formulario para crear tareas
- [ ] Lista de tareas que se carga al entrar a la pagina
- [ ] Boton para marcar/desmarcar como completada
- [ ] Boton para eliminar tarea
- [ ] Estilos basicos (tarea completada = tachada)
- [ ] Manejo de errores (mostrar mensaje si falla la conexion)

---

## Flujo de trabajo por parejas

1. **Estudiante A**: crea el repositorio en GitHub y agrega al Estudiante B
2. Ambos clonan el repo
3. **Estudiante A**: rama `feature/servidor-base` → crea `server.js` con Express, `express.json()`, `cors`, carpeta `public/` y `express.static`
4. **Estudiante B**: rama `feature/frontend-base` → crea `public/index.html`, `public/style.css`, `public/app.js` con la estructura HTML y el formulario
5. Ambos abren PR, el otro revisa, mergean a `main`
6. **Estudiante A**: rama `feature/endpoints-get` → `GET /tareas` y `GET /tareas/:id`
7. **Estudiante B**: rama `feature/endpoints-post` → `POST /tareas`
8. **Estudiante A**: rama `feature/endpoints-put-delete` → `PUT` y `DELETE`
9. **Estudiante B**: rama `feature/conectar-frontend` → implementa `fetch` en `app.js` para GET, POST, PUT, DELETE
10. **Estudiante A**: rama `feature/estilos-y-validaciones` → mejora CSS, manejo de errores, validaciones

> Si son 3 personas, el tercero puede tomar los endpoints de actualizacion y eliminacion por separado.

---

## Estructura esperada del proyecto

```
crud-tareas/
├── server.js          ← API REST (JSON) + archivos estaticos
├── public/
│   ├── index.html     ← HTML base
│   ├── style.css      ← estilos
│   └── app.js         ← fetch + manipulacion del DOM
├── package.json
├── .gitignore
└── README.md
```

---

## .gitignore

```
node_modules/
.env
```

---

## README.md

Debe incluir:

- Nombre del proyecto
- Instrucciones para instalar: `npm install`
- Instrucciones para ejecutar: `node server.js`
- Endpoints de la API
- Autores

---

## Entregables

- Repositorio en GitHub con historial de commits claro usando conventional commits
- Al menos 6 PRs mergeados (los listados en el flujo)
- Codigo funcional: crear, listar, completar y eliminar tareas desde el navegador
- README.md completo

---

## Comandos utiles para probar

```bash
# Arrancar el servidor
node server.js

# Probar endpoints manualmente
curl http://localhost:3000/tareas
curl -X POST http://localhost:3000/tareas -H "Content-Type: application/json" -d '{"titulo":"Comprar pan"}'
curl -X PUT http://localhost:3000/tareas/1 -H "Content-Type: application/json" -d '{"completada":true}'
curl -X DELETE http://localhost:3000/tareas/1
```

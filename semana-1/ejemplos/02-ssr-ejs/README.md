# Ejemplo 2 — SSR (Server-Side Rendering) con EJS

**Lista de Tareas**: Express + EJS + formularios HTML + array en memoria.

## Como ejecutar

```bash
npm install
node server.js
```

Abrir http://localhost:3000

## Que demuestra

- Renderizado del lado del servidor con el motor de plantillas EJS
- `res.render()` para enviar HTML con datos incrustados
- Formularios HTML tradicionales (`method="POST"`)
- Patron Post/Redirect/Get (PRG) para evitar reenvio de formularios
- Diferencia con CSR: el servidor arma el HTML, el navegador solo lo muestra

## Estructura

```
├── server.js          ← rutas que renderizan EJS
├── views/
│   ├── index.ejs      ← lista de tareas con datos incrustados
│   └── formulario.ejs ← formulario de creacion
├── public/
│   └── style.css      ← estilos
├── package.json
└── .gitignore
```

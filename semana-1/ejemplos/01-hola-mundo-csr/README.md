# Ejemplo 1 — CRUD CSR (Client-Side Rendering)

**Muro de Mensajes**: Express + HTML vanilla + fetch + array en memoria.

## Como ejecutar

```bash
npm install
node server.js
```

Abrir http://localhost:3000

## Que demuestra

- API REST con Express (`GET /api/mensajes`, `POST /api/mensajes`)
- Datos guardados en un array del servidor (sin base de datos)
- Frontend con HTML, CSS y JS vanilla
- Consumo de la API con `fetch` desde el navegador
- Manipulacion del DOM para mostrar datos dinamicos

## Estructura

```
├── server.js          ← API REST + archivos estaticos
├── public/
│   ├── index.html     ← pagina web
│   ├── style.css      ← estilos
│   └── app.js         ← fetch + DOM
├── package.json
└── .gitignore
```

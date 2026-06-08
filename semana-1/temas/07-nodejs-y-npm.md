# 7 — Node.js y npm

---

## ?Que es Node.js?

Node.js es un runtime de JavaScript que corre **fuera del navegador**. Permite ejecutar JavaScript en el servidor, linea de comandos, scripts, etc.

```
Antes: JavaScript solo en el navegador
Ahora: JavaScript en el navegador Y en el servidor con Node.js
```

---

## npm: Node Package Manager

npm es el gestor de paquetes de Node.js. Es como `pip` de Python o `maven` de Java.

```bash
# Iniciar un proyecto (crea package.json)
npm init -y

# Instalar una dependencia
npm install axios

# Instalar como dependencia de desarrollo
npm install -D typescript

# Instalar globalmente
npm install -g nodemon

# Ejecutar scripts definidos en package.json
npm run dev
npm run build
npm test
```

---

## package.json

```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "test": "node --test"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

| Campo | Proposito |
|---|---|
| `dependencies` | Librerias necesarias en produccion |
| `devDependencies` | Librerias solo para desarrollo (testing, types, linters) |
| `scripts` | Comandos que puedes ejecutar con `npm run <nombre>` |
| `type: "module"` | Activa `import`/`export` de ES6 |

---

## node_modules y .gitignore

`node_modules` contiene todas las dependencias instaladas. **NUNCA se sube a Git**. Es enorme y se regenera con `npm install`.

Crea un archivo `.gitignore` en la raiz del proyecto:

```
node_modules/
.env
dist/
```

Cuando clonas un proyecto:
```bash
git clone <url>
cd proyecto
npm install   # instala todo lo que esta en package.json
```

---

## Ejemplo: script CLI con Node.js

```javascript
// index.js
import fs from "node:fs/promises"

const argumentos = process.argv.slice(2)
const comando = argumentos[0]

switch (comando) {
  case "saludar": {
    const nombre = argumentos[1] || "mundo"
    console.log(`Hola, ${nombre}!`)
    break
  }
  case "leer": {
    const ruta = argumentos[1]
    if (!ruta) {
      console.error("Debes especificar una ruta de archivo")
      process.exit(1)
    }
    const contenido = await fs.readFile(ruta, "utf-8")
    console.log(contenido)
    break
  }
  default:
    console.log("Comandos disponibles: saludar, leer")
}
```

Ejecutar:
```bash
node index.js saludar Ana
node index.js leer archivo.txt
```

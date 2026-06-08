# 6 — JavaScript moderno (ES6+)

Como ya programan en C, Java y Python, veamos JavaScript enfocandonos en lo que lo hace diferente.

---

## Variables: `let` y `const`

```javascript
// NO usar var (queda en desuso)
// let: para variables que cambian
let contador = 0
contador = contador + 1

// const: para valores que NO cambian
const PI = 3.1416
const usuario = { nombre: "Ana" }

// Pero ojo: const no congela objetos
usuario.nombre = "Carlos"   // Esto SI funciona
usuario = { nombre: "X" }   // Esto NO, estas reasignando la variable
```

> **Regla de oro**: siempre declara con `const`. Solo usa `let` cuando sepas que el valor va a cambiar.

---

## Arrow functions

```javascript
// Funcion tradicional
function sumar(a, b) {
  return a + b
}

// Arrow function (equivalente)
const sumar = (a, b) => {
  return a + b
}

// Si solo tiene una expresion, puedes omitir llaves y return
const sumar = (a, b) => a + b

// Si solo tiene un parametro, puedes omitir parentesis
const cuadrado = x => x * x

// Sin parametros
const saludar = () => "Hola!"
```

**Diferencia clave**: las arrow functions no tienen su propio `this`. Heredan el `this` del contexto donde se definen. Esto las hace ideales para callbacks y metodos de arrays.

---

## Template literals

```javascript
const nombre = "Ana"
const edad = 25

// Vieja forma (concatenacion)
const mensaje = "Hola, me llamo " + nombre + " y tengo " + edad + " anios."

// Template literal (backticks ``)
const mensaje = `Hola, me llamo ${nombre} y tengo ${edad} anios.`

// Multilinea sin \n
const html = `
  <div>
    <h1>${nombre}</h1>
    <p>Edad: ${edad}</p>
  </div>
`
```

---

## Destructuring

```javascript
// Con objetos
const usuario = {
  nombre: "Carlos",
  email: "carlos@email.com",
  direccion: {
    ciudad: "Lima",
    pais: "Peru"
  }
}

const { nombre, email } = usuario
console.log(nombre)  // "Carlos"

// Destructuring anidado + alias
const { direccion: { ciudad: ciudadUsuario } } = usuario
console.log(ciudadUsuario)  // "Lima"

// Con arrays
const colores = ["rojo", "verde", "azul"]
const [primero, segundo] = colores
console.log(primero)  // "rojo"
console.log(segundo)  // "verde"

// Saltar elementos
const [, , tercero] = colores
console.log(tercero)  // "azul"
```

---

## Spread y Rest operators

```javascript
// Spread: "esparcir" elementos de un array u objeto
const numeros = [1, 2, 3]
const masNumeros = [...numeros, 4, 5]  // [1, 2, 3, 4, 5]

const usuarioBase = { nombre: "Ana", email: "ana@email.com" }
const usuarioCompleto = { ...usuarioBase, edad: 25, activo: true }

// Rest: "agrupar" argumentos sobrantes
const sumarTodos = (...numeros) => {
  return numeros.reduce((total, n) => total + n, 0)
}
sumarTodos(1, 2, 3, 4, 5)  // 15

// Rest en destructuring
const [primero, ...resto] = [1, 2, 3, 4, 5]
console.log(primero)  // 1
console.log(resto)    // [2, 3, 4, 5]
```

---

## Metodos de array que debes conocer

```javascript
const numeros = [1, 2, 3, 4, 5, 6]

// map: transforma cada elemento (devuelve nuevo array)
const dobles = numeros.map(n => n * 2)
// [2, 4, 6, 8, 10, 12]

// filter: filtra elementos que cumplen una condicion
const pares = numeros.filter(n => n % 2 === 0)
// [2, 4, 6]

// find: encuentra el PRIMER elemento que cumple la condicion
const primeraCoincidencia = numeros.find(n => n > 3)
// 4

// reduce: reduce el array a un solo valor
const suma = numeros.reduce((acum, n) => acum + n, 0)
// 21

// some: verifica si AL MENOS UN elemento cumple
const hayPares = numeros.some(n => n % 2 === 0)  // true

// every: verifica si TODOS los elementos cumplen
const todosPares = numeros.every(n => n % 2 === 0)  // false

// forEach: ejecuta una funcion por cada elemento (no devuelve nada)
numeros.forEach(n => console.log(n))
```

---

## Promesas y async/await

JavaScript es **single-threaded** pero **asincrono**. No se bloquea esperando operaciones lentas (llamadas a API, lectura de archivos).

```javascript
// fetch devuelve una Promesa
// Antes se usaba .then() / .catch()
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error))

// Hoy se usa async/await (mucho mas legible)
async function obtenerUsuario(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }
    
    const usuario = await response.json()
    return usuario
  } catch (error) {
    console.error("Error al obtener usuario:", error.message)
    throw error
  }
}

// Usar la funcion
const usuario = await obtenerUsuario(1)
console.log(usuario.name)  // "Leanne Graham"
```

> **Regla**: una funcion declarada con `async` siempre devuelve una promesa. `await` solo se puede usar dentro de funciones `async`.

---

## Modulos (import/export)

```javascript
// ─── matematicas.js ───
export function sumar(a, b) {
  return a + b
}

export function restar(a, b) {
  return a - b
}

export const PI = 3.1416

// Export default (uno por archivo)
export default function multiplicar(a, b) {
  return a * b
}

// ─── app.js ───
// Import con nombre
import { sumar, restar, PI } from "./matematicas.js"

// Import default (puedes ponerle el nombre que quieras)
import multiplicar from "./matematicas.js"

// Importar todo junto
import * as mate from "./matematicas.js"
console.log(mate.sumar(2, 3))
console.log(mate.PI)
```

> En Node.js, para usar `import`/`export` en lugar de `require`, necesitas `"type": "module"` en tu `package.json`.

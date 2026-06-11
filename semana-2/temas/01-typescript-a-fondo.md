# 1 — TypeScript a fondo

---

## ?Que es TypeScript?

TypeScript es un **superset tipado** de JavaScript. Todo codigo JavaScript valido es TypeScript valido. La diferencia: TypeScript agrega un sistema de tipos estatico.

```typescript
// JavaScript (valido en TS)
function sumar(a, b) {
  return a + b
}
sumar(5, "3")  // "53" — no falla, pero probablemente no quieres eso

// TypeScript
function sumar(a: number, b: number): number {
  return a + b
}
sumar(5, "3")  // ❌ Error en compilacion: Argument of type 'string'
```

El tipado de TS **solo existe en tiempo de compilacion**. Al compilar a JS, los tipos desaparecen. No hay verificacion en runtime.

---

## Tipos basicos

```typescript
// Primitivos
let nombre: string = "Ana"
let edad: number = 25
let activo: boolean = true
let nada: null = null
let indefinido: undefined = undefined

// Arrays
let numeros: number[] = [1, 2, 3]
let nombres: Array<string> = ["Ana", "Carlos"]

// Tuplas (array con longitud y tipos fijos)
let par: [string, number] = ["Ana", 25]

// any (desactiva el tipado — evitar)
let cualquiera: any = "hola"
cualquiera = 42       // ? permitido pero peligroso
cualquiera = true     // ? permitido pero peligroso

// unknown (similar a any pero mas seguro)
let desconocido: unknown = 4
// desconocido.toFixed()  // ❌ Error: debes verificar el tipo primero

// never (funcion que nunca retorna)
function error(mensaje: string): never {
  throw new Error(mensaje)
}

// void (funcion que no retorna nada)
function saludar(nombre: string): void {
  console.log(`Hola ${nombre}`)
}
```

---

## Interfaces

Definen la **forma** que debe tener un objeto.

```typescript
interface Usuario {
  id: number
  nombre: string
  email: string
  edad?: number           // opcional
  readonly creadoEn: Date  // solo lectura (no se puede reasignar)
}

function registrar(usuario: Usuario): void {
  console.log(`Registrando a ${usuario.nombre} (${usuario.email})`)
}

const ana: Usuario = {
  id: 1,
  nombre: "Ana",
  email: "ana@email.com",
  creadoEn: new Date()
}

registrar(ana)  // ?
// ana.creadoEn = new Date()  // ❌ Error: readonly
```

### Interfaces vs Types

```typescript
// interface: extensible (puede declararse varias veces y se fusiona)
interface Animal {
  nombre: string
}
interface Animal {
  edad: number
}
// Animal ahora tiene nombre Y edad

// type: no extensible pero mas flexible (union, intersection)
type ID = string | number
type Punto = { x: number; y: number }
type UsuarioConRol = Usuario & { rol: "admin" | "user" }
```

> **Regla general**: usa `interface` para objetos. Usa `type` para uniones, intersecciones y alias de primitivos.

---

## Enums

Agrupan constantes relacionadas con nombres legibles.

```typescript
enum EstadoTarea {
  Pendiente,    // 0
  EnProgreso,   // 1
  Completada    // 2
}

const estado: EstadoTarea = EstadoTarea.EnProgreso
console.log(estado)  // 1

// Con valores personalizados
enum Rol {
  Admin = "admin",
  Editor = "editor",
  Lector = "lector"
}

function tieneAcceso(rol: Rol): boolean {
  return rol === Rol.Admin || rol === Rol.Editor
}
```

> Enums se compilan a objetos JavaScript. Si no necesitas el objeto en runtime, usa `const enum` o union types (`"admin" | "editor"`).

---

## Generics

Permiten escribir codigo que funciona con **cualquier tipo**, manteniendo el tipado.

```typescript
// Sin generics (pierdes el tipo)
function primerElemento(array: any[]): any {
  return array[0]
}
const elemento = primerElemento([1, 2, 3])  // tipo: any

// Con generics (conservas el tipo)
function primerElemento<T>(array: T[]): T {
  return array[0]
}
const numero = primerElemento([1, 2, 3])    // tipo: number
const texto = primerElemento(["a", "b"])    // tipo: string

// Generics en interfaces
interface RespuestaAPI<T> {
  ok: boolean
  data: T
  error?: string
}

const resp: RespuestaAPI<Usuario> = {
  ok: true,
  data: { id: 1, nombre: "Ana", email: "ana@email.com", creadoEn: new Date() }
}
// resp.data es de tipo Usuario (autocompletado asegurado)

// Generics con restricciones
function obtenerPropiedad<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const u = { nombre: "Ana", edad: 25 }
obtenerPropiedad(u, "nombre")  // "Ana" (tipo string)
// obtenerPropiedad(u, "email")  ❌ Error: 'email' no existe en el tipo
```

---

## Union e Intersection types

```typescript
// Union (|): puede ser uno u otro
type Estado = "activo" | "inactivo" | "baneado"

function cambiarEstado(estado: Estado) {
  // estado solo puede ser uno de esos tres strings
}

// Union con discriminacion
type Exito = { tipo: "exito"; datos: Usuario }
type Error = { tipo: "error"; mensaje: string }
type Resultado = Exito | Error

function manejarResultado(r: Resultado) {
  if (r.tipo === "exito") {
    console.log(r.datos.nombre)  // TS sabe que es Exito
  } else {
    console.error(r.mensaje)     // TS sabe que es Error
  }
}

// Intersection (&): combina multiples tipos
interface ConTimestamps {
  creadoEn: Date
  actualizadoEn: Date
}

type TareaConTimestamps = {
  id: number
  titulo: string
} & ConTimestamps
```

---

## Utility types integrados

TypeScript incluye tipos utilitarios muy utiles:

```typescript
interface Usuario {
  id: number
  nombre: string
  email: string
  edad: number
  activo: boolean
}

// Partial: todas las propiedades opcionales
type UsuarioParcial = Partial<Usuario>
// { id?: number; nombre?: string; ... }

// Required: todas las propiedades obligatorias
type UsuarioCompleto = Required<Usuario>

// Pick: seleccionar propiedades
type UsuarioResumen = Pick<Usuario, "id" | "nombre">
// { id: number; nombre: string }

// Omit: excluir propiedades
type UsuarioSinId = Omit<Usuario, "id" | "activo">
// { nombre: string; email: string; edad: number }

// Record: objeto con claves y valores tipados
type Roles = "admin" | "user" | "guest"
type PermisosPorRol = Record<Roles, string[]>
// { admin: string[]; user: string[]; guest: string[] }

// Readonly: todas las propiedades de solo lectura
type UsuarioInmutable = Readonly<Usuario>

// ReturnType: tipo de retorno de una funcion
function crearUsuario() {
  return { id: 1, nombre: "Ana" }
}
type TipoUsuario = ReturnType<typeof crearUsuario>
// { id: number; nombre: string }
```

---

## Tipos vs runtime

Recuerda: TypeScript NO existe en runtime. Esto funciona en compilacion pero no en ejecucion:

```typescript
interface Gato {
  maullar(): void
}

function esGato(obj: any): obj is Gato {
  // Esto es un type guard personalizado
  return typeof obj.maullar === "function"
}

const mascota: unknown = { maullar: () => console.log("miau") }

if (esGato(mascota)) {
  mascota.maullar()  // TS confia en el type guard
}
```

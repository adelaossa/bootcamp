# 1 — ?Que es TypeScript y como encaja en el ecosistema?

---

## ?Como se ejecuta el codigo que escribes?

Antes de entender TypeScript, necesitas entender **que pasa** entre que escribes codigo y la computadora lo ejecuta.

Hay 4 formas principales:

```
══════ Compilado a binario ══════
[main.c] ── gcc/clang ──> [a.out / main.exe] ── CPU ejecuta
           compilador         binario nativo
           (una sola vez)     (especifico de SO/arquitectura)

══════ Compilado a bytecode ══════
[Main.java] ── javac ──> [Main.class] ── JVM ── CPU
             compilador    bytecode        JIT
             (una vez)     (portable)      (compila en caliente)

══════ Interpretado ══════
[app.py] ── python ── CPU
           (lee y ejecuta linea por linea, sin paso previo)

══════ Transpilado ══════
[index.ts] ── tsc ──> [index.js] ── Node.js ── CPU
            transpilador    JS         runtime
            (traduce a otro lenguaje del mismo nivel)
```

---

## Compilados a binario (lenguajes de sistema)

El compilador convierte el codigo fuente directamente a **instrucciones de maquina** que el CPU entiende.

```c
// main.c
#include <stdio.h>
int main() {
    printf("Hola\n");
    return 0;
}
```

```bash
gcc main.c -o hola   # compila a binario
./hola                # el CPU ejecuta directamente
```

| Caracteristica | C, C++, Rust, Go, Zig |
|---|---|
| **Velocidad** | La mas alta. El CPU ejecuta instrucciones nativas sin intermediarios |
| **Deteccion de errores** | En compilacion (errores de tipo, sintaxis). Pero no hay chequeo en runtime |
| **Portabilidad** | Recompilar por SO y arquitectura. `main.exe` (Windows) es distinto a `main` (Linux) |
| **Uso tipico** | Sistemas operativos, motores graficos, DBs, software de alto rendimiento |

---

## Compilados a bytecode / lenguaje intermedio

El compilador genera un **formato intermedio** (bytecode, IL) que no es binario nativo. Un runtime (JVM, CLR, BEAM) lo ejecuta con **JIT** (Just-In-Time compilation).

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hola");
    }
}
```

```bash
javac Main.java          # compila a Main.class (bytecode)
java Main                # la JVM interpreta + compila en caliente
```

| Caracteristica | Java, C#, Kotlin, Scala |
|---|---|
| **Velocidad** | Alta (el JIT optimiza el bytecode a binario en caliente) |
| **Deteccion de errores** | En compilacion (tipos estrictos) + excepciones en runtime |
| **Portabilidad** | Compila una vez, corre en cualquier SO que tenga el runtime (JVM, CLR) |
| **Uso tipico** | Aplicaciones empresariales, Android, servicios backend |

> "Write once, run anywhere" — el lema de Java.

---

## Interpretados

No hay paso de compilacion. Un **interprete** lee el codigo fuente y lo ejecuta linea por linea.

```python
# app.py
print("Hola")
```

```bash
python app.py   # el interprete lee, parsea y ejecuta en el mismo paso
```

| Caracteristica | Python, Ruby, PHP, Bash |
|---|---|
| **Velocidad** | La mas baja. Cada linea se parsea, se traduce y se ejecuta en caliente |
| **Deteccion de errores** | Solo en runtime. Un typo en una funcion puede no descubrirse hasta que se ejecute |
| **Portabilidad** | Maxima. Solo necesitas el interprete instalado. El mismo `app.py` corre en cualquier SO |
| **Uso tipico** | Scripts, prototipado rapido, data science, automatizacion |

---

## Transpilados

Un **transpilador** convierte codigo fuente de un lenguaje de alto nivel a **otro lenguaje de alto nivel**.

```
[TypeScript] ── tsc ──> [JavaScript]
[SCSS]       ── sass ─> [CSS]
[JSX]        ── babel ─> [JavaScript]
```

A diferencia de un compilador (que baja el nivel hacia el hardware), un transpilador se mantiene en el mismo nivel de abstraccion.

---

## ?Y JavaScript donde queda?

JavaScript historicamente es **interpretado**. Hoy los motores modernos (V8 en Chrome/Node.js, SpiderMonkey en Firefox, JavaScriptCore en Safari) usan **JIT**: compilan partes del codigo a binario en tiempo de ejecucion.

```
[index.js] ── Node.js (V8) ── CPU
             parsea, compila en caliente (JIT), ejecuta
```

Esto hace que JavaScript sea mucho mas rapido que Python puro, aunque sigue sin verificacion de tipos en desarrollo.

---

## TypeScript: transpilado + type checker

TypeScript agrega **dos cosas** sobre JavaScript:

### 1. Transpilador (`tsc`)

Convierte TypeScript a JavaScript. **Los tipos desaparecen** en el output.

```typescript
// index.ts
function saludar(nombre: string): string {
  return `Hola, ${nombre}`
}

console.log(saludar("Ana"))
```

```bash
npx tsc          # transpila index.ts → index.js
```

```javascript
// index.js (output)
function saludar(nombre) {
    return `Hola, ${nombre}`;
}
console.log(saludar("Ana"));
```

Los tipos (`: string`) se borraron. No generan codigo. No existen en runtime.

### 2. Type checker (analizador estatico)

Antes de transpilar, `tsc` verifica los tipos y reporta errores **sin ejecutar el codigo**.

```typescript
function sumar(a: number, b: number): number {
  return a + b
}

sumar(5, "3")  // ❌ Error en el editor / al transpilar
//      ~~~
// Argument of type 'string' is not assignable to parameter of type 'number'.
```

```bash
npx tsc --noEmit   # verifica tipos sin generar archivos
```

---

## El ciclo completo de TypeScript

```
┌────────────────────────────────────────────────────────┐
│                  1. Escribes TypeScript                │
│  function sumar(a: number, b: number): number {        │
│    return a + b                                        │
│  }                                                     │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│              2. tsc verifica tipos (type check)        │
│  sumar(5, "hola")  →  ❌ ERROR (no compila)            │
│  sumar(5, 3)       →  ? pasa                           │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│              3. tsc transpila (borra tipos)            │
│  function sumar(a, b) { return a + b }                 │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│         4. Node.js ejecuta el JavaScript                │
│  V8 parsea, JIT compila, CPU ejecuta                   │
└────────────────────────────────────────────────────────┘
```

---

## Tabla comparativa

| | C | Java | Python | JavaScript | TypeScript |
|---|---|---|---|---|---|
| **Modelo** | Compilado a binario | Compilado a bytecode | Interpretado | JIT (hibrido) | **Transpilado a JS** |
| **Deteccion de errores** | Compilacion | Compilacion | Runtime | Runtime | **Compilacion + runtime** |
| **Velocidad de ejecucion** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★★☆ (es JS al final) |
| **Tipado** | Estatico | Estatico | Dinamico | Dinamico | **Estatico (solo en dev)** |
| **Portabilidad** | Recompilar por SO | Un binario, cualquier SO con runtime | Cualquier SO con interprete | Navegador o Node.js | Cualquier SO con Node.js |

---

## ?Por que usar TypeScript entonces?

Si los tipos se borran y al final lo que corre es JavaScript igual... ?que ganas?

### 1. Errores en desarrollo, no en produccion

```javascript
// JavaScript — error silencioso hasta que el usuario lo descubre
function aplicarDescuento(precio) {
  return precio * 0.9
}
aplicarDescuento("100")  // "100" * 0.9 = 90... ?pero era un string!
```

```typescript
// TypeScript — error antes de que llegue a produccion
function aplicarDescuento(precio: number): number {
  return precio * 0.9
}
aplicarDescuento("100")  // ❌ Error: 'string' no es 'number'
```

### 2. Autocompletado y documentacion via tipos

```typescript
interface Usuario {
  id: number
  nombre: string
  email: string
  edad: number
}

function registrar(usuario: Usuario) {
  // En el editor: al escribir "usuario." sale autocompletado:
  // usuario.id, usuario.nombre, usuario.email, usuario.edad
}
```

### 3. Refactoring seguro

Renombras una propiedad y TypeScript te marca **todos** los lugares donde se usa. Sin TS, hacer un rename en JavaScript es buscar y rezar.

### 4. Los tipos son documentacion viva

```typescript
function calcularImpuesto(monto: number, tasa: number): number
```
Sin leer el codigo, ya sabes que recibe y que devuelve. En JS necesitas leer la implementacion o un comentario que probablemente este desactualizado.

---

## Resumen

```
┌──────────────────────────────────────────────────────────┐
│               DONDE ENCAJA TYPESCRIPT                     │
│                                                          │
│  Compilado a binario          Interpretado               │
│  ┌──────────┐                ┌──────────┐                │
│  │ C, Rust  │                │ Python   │                │
│  │ Go, Zig  │                │ Ruby, PHP│                │
│  └──────────┘                └──────────┘                │
│                                                          │
│  ┌──────────┐                ┌──────────┐                │
│  │ Java, C# │                │TypeScript│ ← transpilado  │
│  │ Kotlin   │                │  SCSS    │   a JS         │
│  └──────────┘                │  JSX     │                │
│  Compilado a bytecode        └──────────┘                │
│                                                          │
│  TypeScript = Tipos estaticos + Transpilacion a JS        │
│  Los tipos mueren al compilar. La seguridad queda.       │
└──────────────────────────────────────────────────────────┘
```

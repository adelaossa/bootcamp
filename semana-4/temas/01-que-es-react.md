# 1 — ?Que es React y por que existe?

---

## El problema: manipular el DOM a mano

En la semana 1 hiciste esto:

```javascript
// Vanilla JS: tu manipulas el DOM directamente
function mostrarMensajes(mensajes) {
  listaMensajes.innerHTML = ""

  mensajes.forEach(mensaje => {
    const li = document.createElement("li")
    li.innerHTML = `
      <div class="autor">${mensaje.autor}</div>
      <div class="texto">${mensaje.texto}</div>
    `
    listaMensajes.appendChild(li)
  })
}
```

Esto funciona con 50 lineas. Pero en aplicaciones reales con cientos de componentes, se vuelve caotico:

- Tu codigo describe **COMO** construir la UI (crea un `li`, asignale `innerHTML`, agrega al `ul`)
- Si los datos cambian, tienes que actualizar manualmente el DOM
- Mezclas logica de negocio con manipulacion del DOM
- Es dificil reutilizar codigo entre paginas

---

## React: declara QUE quieres ver, no COMO construirlo

```jsx
// React: tu declaras QUE quieres mostrar
function ListaMensajes({ mensajes }) {
  return (
    <ul>
      {mensajes.map(mensaje => (
        <li key={mensaje.id}>
          <div className="autor">{mensaje.autor}</div>
          <div className="texto">{mensaje.texto}</div>
        </li>
      ))}
    </ul>
  )
}
```

Tu solo describes como deberia verse la UI para un estado dado. React se encarga de:
1. Construir el DOM la primera vez
2. Cuando los datos cambian, calcular la diferencia minima
3. Actualizar SOLO lo que cambio

---

## Imperativo vs Declarativo

```
═══ Imperativo (Vanilla JS) ═══
"Creame un div. Ahora ponle clase 'autor'.
 Metele el texto dentro. Ahora agregalo al DOM.
 Ahora si cambia el autor, buscame ese div,
 cambiale el texto, y actualiza."

═══ Declarativo (React) ═══
"Para estos datos, la UI se ve asi."
(datos cambian)
"Para estos NUEVOS datos, la UI se ve asi."
React calcula la diferencia y actualiza solo lo necesario.
```

**Analogia**: pedir un taxi vs manejar tu mismo.

- **Imperativo (manejar)**: girar el volante, acelerar, frenar, poner direccionales, mirar espejos
- **Declarativo (taxi)**: "Llevame a Reforma 222"

---

## El Virtual DOM

React no modifica el DOM del navegador directamente. Usa un intermediario:

```
[Tu componente] ──> [Virtual DOM (JS)] ──> [DOM real (navegador)]
                        │
                        │ React compara version anterior vs nueva
                        │ Encuentra la diferencia minima (diffing)
                        │
                        └──> Solo actualiza lo que cambio (reconciliation)
```

Esto es mas rapido porque:
- El Virtual DOM es un objeto JavaScript (manipular objetos es barato)
- El DOM real es costoso de modificar
- React minimiza las operaciones sobre el DOM real

---

## React NO es un framework

React es una **libreria** para construir interfaces. No te impone:

- Como hacer las rutas (usa React Router)
- Como manejar estado global (Context, Zustand, Redux)
- Como hacer fetching de datos (fetch, React Query)
- Como estructurar el proyecto

Esto te da flexibilidad, pero requiere tomar decisiones. Es el "Express del frontend".

| | React (libreria) | Angular (framework) |
|---|---|---|
| **Enfoque** | Solo la UI | Aplicacion completa |
| **Ruteo** | Libreria externa | Incluido |
| **Estado global** | Context o librerias externas | Servicios + RxJS |
| **Formularios** | Controlados manualmente | Reactive Forms |
| **Estructura** | Libre | Opinionada (modulos, componentes, servicios) |

---

## Componentes: los bloques de React

Toda app React se construye con componentes. Un componente es una funcion que retorna JSX.

```
┌──────────────────────────────────────┐
│              App                      │
│  ┌──────────────┐ ┌───────────────┐  │
│  │   Header      │ │  ListaProductos│  │
│  │ ┌──────────┐ │ │ ┌───────────┐ │  │
│  │ │ NavLink  │ │ │ │ProductCard│ │  │
│  │ │ NavLink  │ │ │ │ProductCard│ │  │
│  │ │ NavLink  │ │ │ │ProductCard│ │  │
│  │ └──────────┘ │ │ └───────────┘ │  │
│  └──────────────┘ └───────────────┘  │
└──────────────────────────────────────┘
```

Cada rectangulo es un componente. Los componentes se componen entre si, como legos.

---

## Flujo de datos: un solo sentido

En React, los datos fluyen hacia **abajo** (de padre a hijo via props):

```
[App] ── datos ──> [ListaProductos] ── producto ──> [ProductCard]
                      (recibe array)                 (recibe un item)
```

- El padre le pasa datos al hijo mediante **props**
- El hijo NUNCA modifica las props directamente
- Si el hijo necesita comunicarse con el padre, usa **callbacks** (funciones que el padre le pasa)

Este flujo unidireccional hace que el codigo sea predecible: para entender un componente, solo necesitas ver que props recibe.

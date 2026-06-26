# 1 — ?Que es un framework?

---

## La diferencia clave: inversion de control

Imagina que construyes una casa. Tienes dos opciones:

### Opcion A: hacerlo todo a mano

Compras terreno, ladrillos, cemento, tuberias, cables electricos. Disenas los planos tu mismo. Construyes pared por pared. Cada decision es tuya: donde va el bano, que tipo de ventanas, como pasan los cables.

Ventaja: control total. Desventaja: tardas meses, puedes cometer errores graves, el resultado depende 100% de tu experiencia.

Esto es programar **sin framework**. Usas librerias (ladrillos, cemento), pero la arquitectura la defines tu.

### Opcion B: usar un sistema prefabricado

Compras una casa modular. Ya viene con estructura, instalaciones electricas, tuberias. Tu eliges acabados, colores, muebles. Los planos vienen hechos y probados. Solo sigues las instrucciones.

Ventaja: en semanas tienes casa habitable, probada, que cumple normas. Desventaja: menos flexibilidad, tienes que seguir las reglas del sistema.

Esto es programar **con framework**.

---

## Libreria vs Framework

```
╔══════════════════════════════════════════════════════╗
║                    LIBRERIA                          ║
║  TU codigo llama a la libreria cuando la necesitas   ║
║                                                      ║
║  [Tu app] ──> llama ──> [libreria]                  ║
║                                                      ║
║  Ejemplo: Express                                    ║
║  app.get("/", (req, res) => { ... })                ║
║  Tu decides la estructura de carpetas,               ║
║  como organizar el codigo, como validar...           ║
╚══════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════╗
║                    FRAMEWORK                         ║
║  El framework llama a TU codigo cuando lo necesita   ║
║                                                      ║
║  [Framework] ──> llama ──> [Tu codigo]               ║
║                                                      ║
║  Ejemplo: NestJS                                     ║
║  @Controller("usuarios")                             ║
║  class UsuariosController {                          ║
║    @Get()                                            ║
║    listar() { ... }    ← NestJS decide CUANDO        ║
║  }                         llamar a esta funcion     ║
╚══════════════════════════════════════════════════════╝
```

| | Libreria | Framework |
|---|---|---|
| **Quien controla el flujo** | Tu | El framework |
| **Flexibilidad** | Maxima | Limitada por las reglas del framework |
| **Velocidad inicial** | Mas lento (decides todo) | Mas rapido (estructura predefinida) |
| **Curva de aprendizaje** | Baja | Alta (tienes que aprender sus reglas) |
| **Ejemplos** | Express, pg, axios | NestJS, Angular, Ruby on Rails, Django, Spring Boot |

---

## ?Que problemas resuelve un framework?

### 1. Estructura y organizacion

Sin framework, cada proyecto tiene su propia estructura. Entrar a un proyecto nuevo significa aprender donde esta cada cosa. Con framework, la estructura es predecible.

```
// Express (sin framework): tu decides
proyecto/
├── routes/
├── controllers/
├── models/
├── middlewares/
└── utils/

// NestJS (con framework): el framework impone
src/
├── usuarios/
│   ├── usuarios.module.ts
│   ├── usuarios.controller.ts
│   ├── usuarios.service.ts
│   └── entities/usuario.entity.ts
├── productos/
│   └── ...
└── app.module.ts
```

### 2. Codigo repetitivo (boilerplate)

```typescript
// Express: tu escribes todo esto cada vez
app.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await pool.query("SELECT * FROM usuarios")
    res.json(usuarios.rows)
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" })
  }
})

// NestJS: el framework maneja el boilerplate
@Get()
async listar() {
  return this.usuariosService.findAll()
}
// NestJS automaticamente:
// - Convierte el retorno a JSON
// - Maneja try/catch
// - Asigna status 200
// - Serializa la respuesta
```

### 3. Convenciones

Cuando todo el equipo sigue las mismas convenciones:
- El onboarding es mas rapido
- Las code reviews son mas eficientes
- El codigo es predecible

### 4. Soluciones integradas

Un framework incluye soluciones para problemas comunes:

| Problema | Sin framework | Con NestJS |
|---|---|---|
| Validar datos | Lo escribes a mano en cada ruta | `class-validator` + DTOs |
| Manejar errores | `try/catch` en cada ruta | Filtros de excepcion globales |
| Autenticacion | Implementas desde cero | Passport + Guards integrados |
| Documentar API | La escribes a mano | Swagger con decoradores |
| Testear | Configuras todo manualmente | Testing module integrado con Jest |
| Logging | `console.log()` | Logger integrado con niveles |

### 5. Seguridad

Los frameworks incluyen protecciones que tendrias que implementar manualmente:
- Proteccion contra CSRF
- Helmet (headers de seguridad HTTP)
- Rate limiting
- Validacion de entrada

---

## El espectro: de libreria a framework

No es blanco o negro. Es un espectro:

```
Libreria pura                    "Framework no opinado"           Framework opinado
    │                                    │                              │
    pg                              Express                            NestJS
    axios                           (tu decides casi todo)         Angular
    (haces una cosa)                                                 Spring Boot
                                                                     Ruby on Rails
                                                                     (muchas reglas, mucha magia)
```

Express esta en un punto medio: te da un router y middleware, pero no te obliga a una estructura. NestJS esta mas a la derecha: te da estructura, patrones y reglas claras.

---

## Ventajas y desventajas de usar un framework

### Ventajas

- **Productividad**: empiezas a producir valor mas rapido
- **Consistencia**: todos los proyectos se ven similares
- **Comunidad**: soluciones probadas para problemas comunes
- **Documentacion**: patrones bien documentados
- **Menos errores**: el framework ya resolvio los casos borde

### Desventajas

- **Curva de aprendizaje**: hay que aprender las reglas del framework
- **Rigidez**: a veces tienes que "luchar contra el framework"
- **Magia**: cosas que pasan sin que entiendas como
- **Actualizaciones**: mantener el framework actualizado puede ser doloroso
- **Sobre-ingenieria**: para proyectos muy simples, un framework es demasiado

---

## Analogia final

| Sin framework | Con framework |
|---|---|
| Construir una casa desde cero | Comprar departamento en edificio |
| Cocinar con ingredientes sueltos | Usar una mezcla para pastel |
| Escribir una novela en hoja en blanco | Usar una plantilla de guion |
| Armar un auto pieza por pieza | Comprar un auto armado y personalizarlo |

> Un framework NO es magia. Es codigo que alguien mas escribio siguiendo patrones probados. Tu trabajo es aprender esos patrones y usarlos a tu favor.

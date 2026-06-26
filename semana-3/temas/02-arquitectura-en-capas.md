# 2 — Arquitectura en capas modernas

---

## El software como un edificio

Una aplicacion web moderna no es un solo bloque de codigo. Es un sistema distribuido en **capas**, cada una con responsabilidades especificas, corriendo en lugares distintos y usando herramientas distintas.

```
╔══════════════════════════════════════════════════════╗
║                   FRONTEND                           ║
║  Capa de presentacion                                ║
║  Se ejecuta en: Navegador del usuario                ║
║  Herramientas: React, Angular, Vue, HTML/CSS/JS      ║
║                                                      ║
║  Responsabilidades:                                  ║
║  • Mostrar datos al usuario                          ║
║  • Capturar interacciones (clicks, formularios)      ║
║  • Navegacion entre vistas                           ║
║  • Validacion visual inmediata                       ║
║  • Experiencia de usuario (UX/UI)                    ║
╠══════════════════════════════════════════════════════╣
║               HTTP / JSON                            ║
╠══════════════════════════════════════════════════════╣
║                   BACKEND (API)                      ║
║  Capa de logica de negocio                           ║
║  Se ejecuta en: Servidor (Node.js, etc.)             ║
║  Herramientas: NestJS, Express, Fastify              ║
║                                                      ║
║  Responsabilidades:                                  ║
║  • Procesar solicitudes del frontend                 ║
║  • Validar datos de entrada                          ║
║  • Aplicar reglas de negocio                         ║
║  • Autenticar y autorizar usuarios                   ║
║  • Devolver respuestas estructuradas (JSON)          ║
╠══════════════════════════════════════════════════════╣
║               SQL / TCP                              ║
╠══════════════════════════════════════════════════════╣
║               PERSISTENCIA                           ║
║  Capa de almacenamiento de datos                     ║
║  Se ejecuta en: Servidor de base de datos            ║
║  Herramientas: PostgreSQL, TypeORM, pg               ║
║                                                      ║
║  Responsabilidades:                                  ║
║  • Guardar datos de forma duradera                   ║
║  • Garantizar integridad (constraints, ACID)         ║
║  • Consultar datos eficientemente (indices)          ║
║  • Manejar concurrencia                              ║
╠══════════════════════════════════════════════════════╣
║               TCP/HTTP                               ║
╠══════════════════════════════════════════════════════╣
║               INFRAESTRUCTURA                        ║
║  Capa de despliegue y operaciones                    ║
║  Se ejecuta en: Contenedores, maquinas virtuales     ║
║  Herramientas: Docker, GitHub Actions, Railway       ║
║                                                      ║
║  Responsabilidades:                                  ║
║  • Empaquetar la aplicacion                          ║
║  • Desplegar en servidores                           ║
║  • Escalar horizontalmente                           ║
║  • Monitorear salud y logs                           ║
╚══════════════════════════════════════════════════════╝
```

---

## Por que separar en capas?

### 1. Especializacion

Cada capa se enfoca en UNA responsabilidad. El frontend no deberia saber como se guardan los datos. La BD no deberia saber de colores ni diseno.

### 2. Reutilizacion

Un mismo backend puede servir a:

```
[Movil Android] ──┐
[Movil iOS]     ──┼──> [API NestJS] ──> [PostgreSQL]
[Web React]     ──┤
[Web Angular]   ──┘
```

Si la logica estuviera mezclada con la presentacion, tendrias que reescribirla para cada plataforma.

### 3. Escalabilidad

Puedes escalar cada capa segun su demanda:

```
[Frontend × 10] ──> [Backend × 5] ──> [PostgreSQL × 2 (replicas)]
                     (mas trafico aqui)
```

### 4. Equipos independientes

| Equipo | Se enfoca en | Tecnologias |
|---|---|---|
| Frontend | Experiencia de usuario | React, CSS, Figma |
| Backend | Logica de negocio, API | NestJS, TypeScript |
| Datos | Base de datos, queries | PostgreSQL, SQL |
| DevOps | Infraestructura, CI/CD | Docker, k8s, GitHub Actions |

Cada equipo puede trabajar en paralelo sin pisarse. La API es el contrato que los une.

---

## Terminologia: libreria, framework, plataforma

```
Libreria                        Framework                   Plataforma
   │                                │                            │
   pg                          Express, NestJS              Vercel, Railway
   axios                       React, Angular               Docker, Kubernetes
   lodash                      Django, Spring               AWS, GCP
   │                                │                            │
   Hace una cosa               Estructura tu app            Ejecuta tu app
   Tu la llamas                Te llama a ti                Abstrae el hardware
```

---

## El stack que usamos en este bootcamp

```
┌──────────────────────────────────────────────┐
│                  FRONTEND                    │
│  React · Angular · TypeScript                │
│  (semanas 5 y 6)                             │
├──────────────────────────────────────────────┤
│                  BACKEND                     │
│  NestJS · Express · TypeScript               │
│  (semanas 3 y 4)                             │
├──────────────────────────────────────────────┤
│               PERSISTENCIA                   │
│  PostgreSQL · TypeORM · pg                   │
│  (semanas 2 y 3)                             │
├──────────────────────────────────────────────┤
│             INFRAESTRUCTURA                  │
│  Docker · Railway · GitHub Actions           │
│  (semanas 7 y 8)                             │
└──────────────────────────────────────────────┘
```

---

## Un dia en la vida de una solicitud HTTP

```
1. Usuario hace click en "Ver productos"
   ↓
2. [React] hace fetch("https://miapi.com/api/productos")
   ↓
3. [Internet] enruta la solicitud al servidor
   ↓
4. [NestJS] recibe GET /api/productos
   → El controller recibe la solicitud
   → El service aplica logica de negocio
   ↓
5. [TypeORM] traduce a SQL:
   SELECT * FROM productos JOIN categorias...
   ↓
6. [PostgreSQL] ejecuta la query, usa indices
   ↓
7. La respuesta viaja de regreso:
   PostgreSQL → TypeORM → NestJS → JSON → Internet → React → DOM
   ↓
8. El usuario ve la lista de productos en pantalla
```

Cada capa agrega valor: React lo renderiza bonito, NestJS asegura que el usuario tiene permisos, TypeORM convierte filas en objetos tipados, PostgreSQL encuentra los datos en milisegundos gracias a los indices.

---

## ?Que aprendiste en las semanas 1 y 2?

| Semana | Que construiste | Capa |
|---|---|---|
| 1 | Muro de mensajes con Express + HTML | Backend + Frontend (sin BD) |
| 2 | CLI CRUD + Muro con pg + SQL | Persistencia (sin framework) |

En esta semana 3, juntas TODO lo aprendido en un solo proyecto estructurado:

```
[Frontend]  (lo haras en semanas 5-6)
     │
[Backend NestJS]  ← SEMANA 3 (con framework)
     │
[TypeORM]  ← SEMANA 3 (con ORM)
     │
[PostgreSQL]  ← ya lo sabes (semana 2)
```

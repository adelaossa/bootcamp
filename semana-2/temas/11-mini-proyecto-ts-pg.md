# 11 — Mini-proyecto: Diseno de BD + Consultas SQL + API con TypeScript

---

## Objetivo

Diseñar e implementar un sistema completo que demuestre las 3 competencias clave de la semana: diseno de bases de datos, consultas SQL avanzadas y construccion de una API REST con Node.js + TypeScript + Express conectada a PostgreSQL.

Trabajar en parejas usando Gitflow completo.

---

## Stack

| Capa | Tecnologia |
|---|---|
| Lenguaje | TypeScript |
| Runtime | Node.js + tsx |
| Backend | Express |
| Base de datos | PostgreSQL |
| Libreria BD | `pg` (node-postgres, SQL crudo) |
| Control de versiones | Git + GitHub |

**Sin TypeORM, sin Prisma, sin frontend.** Solo SQL crudo, Express y PostgreSQL real.

---

## Dominios a elegir

Cada equipo elige uno de los siguientes dominios (o propone uno propio con aprobacion previa).

---

### Opcion 1 — Biblioteca Municipal

Sistema para gestionar el catalogo y los prestamos de una biblioteca publica.

**Entidades y requerimientos funcionales**

**Autores**
- Tiene nombre, nacionalidad y fecha de nacimiento
- No pueden existir dos autores con el mismo nombre y la misma fecha de nacimiento. El nombre es obligatorio
- Un autor puede haber escrito varios libros, y un libro puede estar escrito por varios autores
- La relacion entre libro y autor no debe permitir duplicados

**Libros**
- Tiene titulo, codigo ISBN, anio de publicacion, genero literario y una bandera que indica si esta disponible para prestamo
- El ISBN debe ser unico
- El anio de publicacion debe ser razonable (no menor a 1000 ni mayor al anio actual)
- Por defecto, un libro nuevo esta disponible
- El genero debe ser uno de: Ficcion, No Ficcion, Ciencia Ficcion, Fantasia, Terror, Romance, Biografia, Historia, Infantil, Poesia, Otro

**Socios**
- Tiene nombre, correo electronico, telefono, ciudad, fecha de registro y estado activo/inactivo
- El correo debe ser unico. Nombre y correo son obligatorios
- Por defecto un socio esta activo y su fecha de registro es la fecha actual

**Prestamos**
- Representa un libro prestado a un socio. Involucra exactamente un libro y un socio
- Tiene fecha de prestamo, fecha limite de devolucion y fecha real de devolucion
- La fecha de prestamo por defecto es la fecha actual
- La fecha de devolucion puede estar vacia si aun no se ha devuelto
- Si se elimina un libro o un socio, sus prestamos deben eliminarse automaticamente
- Debe ser eficiente buscar prestamos por socio y por libro

---

### Opcion 2 — Clinica Medica

Sistema para administrar pacientes, doctores, especialidades, citas y recetas de una clinica.

**Entidades y requerimientos funcionales**

**Pacientes**
- Tiene nombre, correo, telefono, fecha de nacimiento y fecha de registro
- El correo debe ser unico. Nombre y correo son obligatorios
- La fecha de registro por defecto es la fecha actual

**Doctores**
- Tiene nombre, correo, telefono y numero de consultorio
- El correo debe ser unico. El nombre es obligatorio

**Especialidades**
- Tiene un nombre unico y una descripcion
- Un doctor puede tener varias especialidades, y una especialidad puede ser ejercida por varios doctores
- No debe permitirse la misma relacion doctor-especialidad duplicada

**Citas**
- Pertenece a un paciente y a un doctor
- Tiene fecha y hora, un motivo de consulta y un estado
- El estado solo puede ser: pendiente, realizada, cancelada
- Por defecto una cita nueva esta en estado pendiente
- Si se elimina un paciente o un doctor, sus citas deben eliminarse

**Recetas**
- Pertenece a una cita especifica
- Contiene el nombre del medicamento, la dosis, las instrucciones y la fecha de emision
- El medicamento es obligatorio. La fecha de emision por defecto es la fecha actual
- Si se elimina una cita, sus recetas deben eliminarse

**Acceso rapido**
- Debe ser eficiente buscar citas por paciente y por doctor

---

### Opcion 3 — Universidad

Sistema para gestionar estudiantes, profesores, cursos, inscripciones y notas.

**Entidades y requerimientos funcionales**

**Estudiantes**
- Tiene nombre, correo, carrera, semestre actual, fecha de ingreso y estado activo/inactivo
- El correo debe ser unico. Nombre y carrera son obligatorios
- El semestre debe estar entre 1 y 10
- Por defecto un estudiante esta activo y su fecha de ingreso es la fecha actual

**Profesores**
- Tiene nombre, correo, departamento y fecha de contratacion
- El correo debe ser unico. Nombre y departamento son obligatorios

**Cursos**
- Tiene nombre, cantidad de creditos, un profesor asignado y un cupo maximo de estudiantes
- Los creditos deben ser un valor positivo
- El cupo maximo debe ser mayor a cero
- Si un profesor deja la universidad, sus cursos no deben eliminarse pero quedan sin profesor

**Inscripciones**
- Relaciona a un estudiante con un curso
- Tiene fecha de inscripcion y un estado
- El estado solo puede ser: activa, aprobada, reprobada
- Por defecto una inscripcion nueva esta en estado activa
- No se puede inscribir al mismo estudiante dos veces en el mismo curso
- Si se elimina un estudiante o un curso, sus inscripciones deben eliminarse

**Notas**
- Pertenece a una inscripcion
- Tiene un tipo de evaluacion, un valor numerico y una fecha
- El tipo de evaluacion solo puede ser: parcial, trabajo, final
- El valor debe estar entre 0 y 100
- Si no se indica la fecha, se usa la fecha actual
- Si se elimina una inscripcion, sus notas deben eliminarse

**Acceso rapido**
- Debe ser eficiente buscar inscripciones por estudiante y por curso

---

## Estructura del proyecto en 3 partes

### Parte 1 — Diseno de la base de datos (40%)

Con base en la descripcion funcional del dominio elegido, el equipo debe:

- [ ] Deducir e implementar el `schema.sql` con todas las tablas, constraints, claves primarias, claves foraneas y restricciones necesarias
- [ ] Incluir al menos **2 indices** en columnas que se consultaran frecuentemente
- [ ] Dibujar un **diagrama Entidad-Relacion** indicando las cardinalidades (1:1, 1:N, N:M) que deduzcan de la descripcion
- [ ] El diagrama puede ser a mano (foto legible), ASCII, dbdiagram.io, draw.io o cualquier herramienta
- [ ] `schema.sql` debe ejecutarse sin errores en PostgreSQL

**Entregable**: `sql/schema.sql` + diagrama ER (imagen/ASCII en el README)

---

### Parte 2 — Consultas SQL (30%)

Escribir las siguientes 10 consultas en un archivo `sql/consultas.sql`. Cada query debe ir precedida de un comentario con el numero y una breve explicacion de lo que hace.

#### Para el dominio Biblioteca

| # | Tema | Enunciado |
|---|---|---|
| 1 | WHERE + ORDER BY + LIMIT | Top 10 libros mas recientes por anio de publicacion, mostrando titulo, anio y si estan disponibles |
| 2 | LIKE / IN | Libros del genero Ciencia Ficcion o Fantasia cuyo titulo contenga "el" o "la" (sin distinguir mayusculas/minusculas) |
| 3 | COUNT + GROUP BY | Cantidad de prestamos realizados por cada socio, mostrando nombre del socio y total, ordenado de mayor a menor |
| 4 | INNER JOIN (2 tablas) | Prestamos activos (aun no devueltos) con el titulo del libro y el nombre del socio que lo tiene |
| 5 | LEFT JOIN (3 tablas) | Todos los libros con los nombres de sus autores. Deben aparecer incluso los libros que no tengan autor registrado y los autores que no tengan libros |
| 6 | GROUP BY + HAVING | Autores que tienen 3 o mas libros registrados en la biblioteca, mostrando nombre y cantidad |
| 7 | Subconsulta en WHERE | Libros que nunca han sido prestados |
| 8 | Funciones de agregacion | Para los prestamos ya devueltos: minimo, maximo y promedio de dias que tardo cada socio en devolver sus libros |
| 9 | CTE | Socios que han realizado mas prestamos que el promedio general de prestamos por socio |
| 10 | UPDATE con subconsulta | Marcar `disponible = false` para todos los libros que actualmente estan prestados (sin fecha de devolucion) |

#### Para el dominio Clinica

| # | Tema | Enunciado |
|---|---|---|
| 1 | WHERE + ORDER BY + LIMIT | Top 5 pacientes mas recientes por fecha de registro, mostrando nombre y correo |
| 2 | LIKE / BETWEEN | Citas agendadas entre el 1 de junio y el 30 de junio de 2024 cuyo motivo contenga la palabra "dolor" (sin distinguir mayusculas/minusculas) |
| 3 | COUNT + GROUP BY | Cantidad de citas realizadas por cada doctor, mostrando nombre del doctor y total, orden descendente |
| 4 | INNER JOIN (2 tablas) | Citas pendientes con el nombre del paciente, nombre del doctor, fecha y hora |
| 5 | LEFT JOIN (3 tablas) | Todos los doctores con los nombres de sus especialidades. Deben aparecer doctores sin especialidad y especialidades sin doctores |
| 6 | GROUP BY + HAVING | Especialidades que tienen 2 o mas doctores asignados, mostrando nombre y cantidad |
| 7 | Subconsulta en WHERE | Pacientes que nunca han tenido una cita |
| 8 | Funciones de agregacion | Por cada doctor: total de recetas emitidas, promedio de medicamentos por receta y fecha de su ultima cita realizada |
| 9 | CTE | Doctores que han atendido mas citas que el promedio general de citas por doctor |
| 10 | DELETE con subconsulta | Eliminar todas las recetas cuyas citas fueron canceladas |

#### Para el dominio Universidad

| # | Tema | Enunciado |
|---|---|---|
| 1 | WHERE + ORDER BY + LIMIT | Top 10 estudiantes de semestres mas avanzados, mostrando nombre, carrera y semestre |
| 2 | LIKE / BETWEEN | Cursos cuyo nombre contenga "Programacion" o "Matematicas" (sin distinguir mayusculas/minusculas) y que tengan entre 3 y 5 creditos inclusive |
| 3 | COUNT + GROUP BY | Cantidad de estudiantes inscritos por cada curso, mostrando nombre del curso y total, orden descendente |
| 4 | INNER JOIN (2 tablas) | Estudiantes con inscripciones activas mostrando nombre del estudiante y nombre del curso |
| 5 | LEFT JOIN (3 tablas) | Todos los estudiantes con los cursos en los que estan inscritos. Deben aparecer estudiantes sin ninguna inscripcion |
| 6 | GROUP BY + HAVING | Profesores que imparten 3 o mas cursos, mostrando nombre y cantidad |
| 7 | Subconsulta en WHERE | Cursos que tienen cupo disponible (inscritos actuales menor al cupo maximo) |
| 8 | Funciones de agregacion | Por cada estudiante: promedio general de notas, nota mas alta y nota mas baja |
| 9 | CTE | Estudiantes cuyo promedio general supera el promedio general de todos los estudiantes |
| 10 | UPDATE con subconsulta | Cambiar el estado a reprobada para todas las inscripciones cuyo promedio de notas sea menor a 60 |

**Entregable**: `sql/consultas.sql` con las 10 queries documentadas

---

### Parte 3 — API con TypeScript + Express (30%)

Construir una API REST funcional conectada a PostgreSQL que exponga los datos del dominio elegido.

#### Estructura del proyecto

```
proyecto-<dominio>/
├── src/
│   ├── server.ts          ← Express + rutas
│   ├── db.ts              ← Pool pg (conexion fija)
│   ├── init.ts            ← auto-init (ejecuta schema + seed si BD vacia)
│   └── tipos.ts           ← interfaces TypeScript para cada entidad
├── sql/
│   ├── schema.sql         ← el mismo de la Parte 1
│   ├── seed.sql           ← al menos 20 registros de ejemplo entre todas las tablas
│   └── consultas.sql      ← el mismo de la Parte 2
├── docker-compose.yml     ← PostgreSQL 16 Alpine
├── tsconfig.json
├── package.json
├── .gitignore
└── README.md
```

#### Conexion

- `db.ts` debe exportar un `Pool` de `pg` con los datos de conexion fijos (sin `.env`)
- Debe coincidir con las credenciales del `docker-compose.yml`

#### Auto-inicializacion

- Al arrancar el servidor, `init.ts` verifica si las tablas existen
- Si no existen, ejecuta `schema.sql` y `seed.sql` usando `readFile` + `pool.query`
- Si ya existen, no hace nada

#### Requisitos minimos de la API

- [ ] **5 endpoints** como minimo que cubran GET, POST sobre al menos 2 entidades
- [ ] Las queries usan parametros (`$1`, `$2`). Nunca concatenacion de strings
- [ ] Validacion de datos de entrada y codigos de estado HTTP correctos (201, 400, 404, 500)
- [ ] Manejo de errores con `try/catch` en cada endpoint
- [ ] `docker-compose.yml` funcional
- [ ] `npm run dev` (tsx), `npm run build` (tsc), `npm start` (compilado), `npm run typecheck`

**Entregable**: proyecto TypeScript funcional con la API corriendo

---

## Flujo de trabajo en parejas

1. **Ambos**: leen el dominio, discuten el diseno y dibujan el diagrama ER juntos
2. **Estudiante A**: crea el repositorio en GitHub y agrega al Estudiante B
3. Ambos clonan

**Parte 1 — Schema y tipos**
4. **Estudiante A**: rama `feature/schema` → `sql/schema.sql` con todas las tablas
5. **Estudiante B**: rama `feature/seed-y-consultas` → `sql/seed.sql` + `sql/consultas.sql` (10 queries)
6. Code review mutuo, mergean a `main`

**Parte 2 — API**
7. **Estudiante A**: rama `feature/api-base` → `server.ts`, `db.ts`, `init.ts`, `tipos.ts`, docker-compose, `package.json`, `tsconfig.json`
8. **Estudiante B**: rama `feature/endpoints-get` → implementa 2 endpoints GET
9. **Estudiante A**: rama `feature/endpoints-post` → implementa 2 endpoints POST
10. **Estudiante B**: rama `feature/pulir` → validaciones, manejo de errores, README.md, diagrama ER en el README

> Si son 3 personas, el tercero toma `seed.sql` + `consultas.sql` como rama separada y ayuda con endpoints adicionales.

---

## docker-compose.yml

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: bootcamp-db-proyecto
    environment:
      POSTGRES_USER: estudiante
      POSTGRES_PASSWORD: pass123
      POSTGRES_DB: bootcamp
    ports:
      - "5432:5432"
    volumes:
      - pgdata-proyecto:/var/lib/postgresql/data

volumes:
  pgdata-proyecto:
```

---

## .gitignore

```
node_modules/
dist/
```

---

## README.md

Debe incluir:

- Nombre del proyecto y dominio elegido
- Diagrama Entidad-Relacion (imagen o ASCII)
- Explicacion de cada tabla y sus relaciones
- Requisitos (Docker)
- Instrucciones para ejecutar: `npm install`, `docker compose up -d`, `npm run dev`
- Documentacion de los endpoints de la API
- Autores

---

## Evaluacion

| Criterio | Peso | Que se evalua |
|---|---|---|
| **Schema** | 20% | Tablas correctas, constraints bien deducidos, tipos de datos adecuados, indices pertinentes |
| **Diagrama ER** | 10% | Entidades, atributos, relaciones y cardinalidades correctas |
| **Consultas SQL** | 25% | Las 10 queries funcionan, cada una usa el tema requerido, estan documentadas |
| **API funcional** | 25% | Endpoints funcionan, validaciones, manejo de errores, tipos de TypeScript bien usados |
| **Git + README** | 20% | Conventional commits, PRs con code review, documentacion clara y completa |

---

## Comandos utiles

```bash
# Desarrollo
npm run dev              # ejecutar servidor con tsx
npm run typecheck        # verificar tipos sin compilar

# Produccion
npm run build            # compilar TS a JS
npm start                # ejecutar JS compilado

# PostgreSQL (directo, sin la API)
docker compose up -d     # levantar BD
docker compose down      # detener BD
docker compose down -v   # destruir BD y datos (reiniciar desde cero)
```

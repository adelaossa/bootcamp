# Semana 2 — TypeScript + Bases de Datos

## Objetivos de la semana

Al finalizar esta semana los estudiantes podran:

- Entender la diferencia entre lenguajes compilados, transpilados e interpretados
- Explicar que es TypeScript, como funciona y por que se usa
- Escribir codigo TypeScript con tipos, interfaces, generics y enums
- Configurar un proyecto TypeScript desde cero (tsconfig.json, strict mode)
- Entender la evolucion de la persistencia: de archivos planos a sistemas de BD
- Instalar PostgreSQL, crear bases de datos y tablas via SQL
- Escribir consultas SQL: SELECT, JOINs, GROUP BY, subconsultas
- Diseñar un esquema de base de datos normalizado
- Conectar TypeScript con PostgreSQL usando la libreria `pg` y ejecutar queries crudos

## Temas

| # | Tema | Archivo |
|---|---|---|
| 1 | ?Que es TypeScript? Compilado vs transpilado | [01-que-es-typescript.md](temas/01-que-es-typescript.md) |
| 2 | TypeScript a fondo: tipos, interfaces, generics | [02-typescript-a-fondo.md](temas/02-typescript-a-fondo.md) |
| 3 | Configuracion de TypeScript (tsconfig.json) | [03-tsconfig.md](temas/03-tsconfig.md) |
| 4 | Evolucion de la persistencia de datos | [04-evolucion-persistencia.md](temas/04-evolucion-persistencia.md) |
| 5 | PostgreSQL: instalacion y primeros pasos | [05-postgresql-intro.md](temas/05-postgresql-intro.md) |
| 6 | SQL: DDL | [06-sql-ddl.md](temas/06-sql-ddl.md) |
| 7 | SQL: DML y consultas basicas | [07-sql-dml.md](temas/07-sql-dml.md) |
| 8 | SQL: JOINs, GROUP BY y subconsultas | [08-sql-avanzado.md](temas/08-sql-avanzado.md) |
| 9 | Diseño de bases de datos | [09-diseno-bd.md](temas/09-diseno-bd.md) |
| 10 | TypeScript + PostgreSQL con `pg` | [10-ts-pg.md](temas/10-ts-pg.md) |
| 11 | Mini-proyecto: CLI CRUD con PostgreSQL | [11-mini-proyecto-ts-pg.md](temas/11-mini-proyecto-ts-pg.md) |

## Recursos complementarios

| Recurso | Enlace |
|---|---|
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook |
| PostgreSQL Tutorial | https://www.postgresqltutorial.com |
| node-postgres (pg) | https://node-postgres.com |
| DB Diagram (diseño visual) | https://dbdiagram.io |

## Ejemplos

| # | Proyecto | Descripcion |
|---|---|---|
| 1 | `cli-crud-ts/` | CLI en TypeScript: CRUD de productos + categorias con PostgreSQL |
| 2 | `muro-mensajes-pg/` | Muro de mensajes con Express + PostgreSQL (mismo frontend que semana 1) |

## Comandos clave de la semana

```bash
# TypeScript
npm install -D typescript @types/node
npx tsc --init
npx tsc              # compilar
npx tsc --watch      # compilar en modo watch
node dist/index.js   # ejecutar JS compilado
npx tsx src/index.ts # ejecutar TS directamente (sin compilar)

# PostgreSQL (psql)
sudo -u postgres psql
\l                   # listar bases de datos
\c nombre_bd         # conectarse a una BD
\dt                  # listar tablas
\d nombre_tabla      # describir tabla
\q                   # salir
```

## Glosario

| Termino | Definicion |
|---|---|
| **TypeScript** | Superset tipado de JavaScript que compila a JS |
| **Interface** | Define la forma de un objeto en TypeScript |
| **Generic** | Tipo parametrizado que funciona con cualquier tipo |
| **tsconfig.json** | Archivo de configuracion del compilador de TypeScript |
| **DDL** | Data Definition Language: CREATE, ALTER, DROP |
| **DML** | Data Manipulation Language: SELECT, INSERT, UPDATE, DELETE |
| **PK (Primary Key)** | Identificador unico de cada fila en una tabla |
| **FK (Foreign Key)** | Columna que referencia la PK de otra tabla |
| **JOIN** | Operacion que combina filas de dos o mas tablas |
| **Normalizacion** | Tecnica para organizar datos y evitar redundancia |
| **pg** | Libreria de Node.js para conectarse a PostgreSQL |
